<#
.SYNOPSIS
    Разворачивает рабочую область гибкого планирования в GitHub
    (аналог Azure DevOps Demo Generator для шаблона "Parts Unlimited").

.DESCRIPTION
    Создаёт в текущем репозитории:
      * метки (Labels)        — аналог Area Path и типов рабочих элементов;
      * вехи (Milestones)     — Sprint 1, Sprint 2, Sprint 3;
      * Issue из data/workitems/*.md по манифесту data/demo-generator/parts-unlimited.json;
      * связи родитель → ребёнок через GitHub Sub-issues API;
      * проект (Projects v2) Unlimited Parts Board с колонками Todo / In Progress / Done.

    Требуется GitHub CLI (gh) версии 2.42+ и права administer/contents/issues.

.EXAMPLE
    $env:GH_TOKEN = "github_pat_..."   # fine-grained PAT
    ./scripts/provision_github.ps1 -Repo 6MeLex9/unlimited-parts
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Repo,
    [string]$Manifest = "data/demo-generator/parts-unlimited.json",
    [switch]$SkipProject
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Invoke-Gh {
    param([string[]]$Arguments, [string]$Json)
    if ($Json) {
        $temp = [System.IO.Path]::GetTempFileName()
        [IO.File]::WriteAllText($temp, $Json, (New-Object System.Text.UTF8Encoding($false)))
        try {
            $out = & gh api @Arguments --input $temp
        } finally {
            Remove-Item $temp -Force
        }
    } else {
        $out = & gh api @Arguments
    }
    if ($LASTEXITCODE -ne 0) { throw "gh api $($Arguments -join ' ') failed" }
    return $out | ConvertFrom-Json
}

$spec = Get-Content $Manifest -Raw -Encoding UTF8 | ConvertFrom-Json

Write-Host "== 1. Labels" -ForegroundColor Cyan
$labelSpecs = @(
    @{ name = "area: PUL-Web"; color = "1D76DB"; description = "Area (analog of Area Path) - team PUL-Web" }
)
foreach ($t in $spec.workItemTypes) {
    $labelSpecs += @{ name = $t.label; color = ($t.color -replace '#', ''); description = "Work item type: $($t.type)" }
}
$labelSpecs += @{ name = "priority: 1"; color = "B60205"; description = "Высший приоритет" }
$labelSpecs += @{ name = "severity: 2"; color = "E99695"; description = "Критичный дефект" }

foreach ($l in $labelSpecs) {
    Write-Host "  label: $($l.name)"
    $body = @{ name = $l.name; color = $l.color; description = $l.description } | ConvertTo-Json
    try {
        Invoke-Gh -Arguments @("--method", "POST", "repos/$Repo/labels") -Json $body | Out-Null
    } catch {
        Invoke-Gh -Arguments @("--method", "PATCH", "repos/$Repo/labels/$([uri]::EscapeDataString($l.name))") -Json $body | Out-Null
    }
}

Write-Host "== 2. Milestones (Sprint 1..3)" -ForegroundColor Cyan
$today = Get-Date
$milestoneIds = @{}
foreach ($it in $spec.iterations.items) {
    $start = $today.AddDays(7 * $it.offsetWeeks)
    $due = $start.AddDays($spec.iterations.lengthInDays).ToString("yyyy-MM-ddTHH:mm:ssZ")
    $open = Invoke-Gh -Arguments @("repos/$Repo/milestones?state=all&per_page=100")
    $existing = $open | Where-Object { $_.title -eq $it.name }
    if ($existing) { $milestoneIds[$it.name] = $existing.number; Write-Host "  exists: $($it.name)"; continue }
    $body = @{ title = $it.name; due_on = $due; description = "Sprint $($it.name.Substring(7)) (2 недели)" } | ConvertTo-Json
    $created = Invoke-Gh -Arguments @("--method", "POST", "repos/$Repo/milestones") -Json $body
    $milestoneIds[$it.name] = $created.number
    Write-Host "  created: $($it.name) → #$($created.number), due $due"
}

Write-Host "== 3. Issues from manifest" -ForegroundColor Cyan
$issues = @{}
foreach ($wi in $spec.workItems) {
    $key = [System.IO.Path]::GetFileNameWithoutExtension($wi.file)
    $bodyFile = Join-Path $root $wi.file
    $body = Get-Content $bodyFile -Raw -Encoding UTF8
    $parentLine = if ($wi.parent) { "Part of #$($issues[$wi.parent].number)`n`n" } else { "" }
    $labels = @("area: PUL-Web", ($spec.workItemTypes | Where-Object { $_.type -eq $wi.type }).label)
    if ($wi.type -eq "Bug") { $labels += @("priority: 1", "severity: 2") } elseif ($wi.type -eq "PBI" -and $wi.title -like "*корзину*") { $labels += "priority: 1" }

    $payload = @{ title = $wi.title; body = $parentLine + $body; labels = $labels }
    if ($wi.milestone) { $payload.milestone = $milestoneIds[$wi.milestone] }
    $issue = Invoke-Gh -Arguments @("--method", "POST", "repos/$Repo/issues") -Json ($payload | ConvertTo-Json -Depth 5)
    $issues[$key] = $issue
    Write-Host "  #$($issue.number) [$($wi.type)] $($wi.title)"
}

Write-Host "== 4. Sub-issues" -ForegroundColor Cyan
foreach ($wi in $spec.workItems) {
    if (-not $wi.parent) { continue }
    $parent = $issues[$wi.parent]
    $child = $issues[[System.IO.Path]::GetFileNameWithoutExtension($wi.file)]
    $payload = @{ sub_issue_id = $child.id } | ConvertTo-Json
    Write-Host "  #$($parent.number) <- #$($child.number)"
    Invoke-Gh -Arguments @("--method", "POST", "repos/$Repo/issues/$($parent.number)/sub_issues") -Json $payload | Out-Null
}

if (-not $SkipProject) {
    Write-Host "== 5. Project board" -ForegroundColor Cyan
    $project = & gh project create --owner ($Repo.Split('/')[0]) --title $spec.boards[0].name --format json | ConvertFrom-Json
    Write-Host "  project: $($project.title) ($($project.url))"
    foreach ($wi in $spec.workItems) {
        $key = [System.IO.Path]::GetFileNameWithoutExtension($wi.file)
        & gh project item-add $project.number --owner ($Repo.Split('/')[0]) --url $issues[$key].html_url | Out-Null
    }
}

Write-Host "Готово: рабочая область развёрнута." -ForegroundColor Green
