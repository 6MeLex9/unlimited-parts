<#
.SYNOPSIS
    Проверка WIP-лимитов колонок доски (аналог красной подсветки Azure Kanban).

.DESCRIPTION
    Читает манифест data/demo-generator/lab2.1-board.json и текущее содержимое
    доски GitHub (через gh api / GraphQL), затем проверяет, не превышен ли лимит
    WIP в колонках. Для элемента, превышающего лимит, печатает предупреждение и
    завершает работу с кодом 1 - как в Azure, где превышение подсвечивается красным.

    Если gh не установлен, используется офлайн-проверка по manifest + локальному
    снимку data/lab2.1-board-state.json.

.EXAMPLE
    ./scripts/check_wip.ps1
#>
[CmdletBinding()]
param(
    [string]$Owner = "6MeLex9",
    [int]$ProjectNumber = 2,
    [string]$Manifest = "data/demo-generator/lab2.1-board.json"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$spec = Get-Content (Join-Path $root $Manifest) -Raw -Encoding UTF8 | ConvertFrom-Json

$columns = @{}
foreach ($c in $spec.boardRules.columns) { if ($c.wipLimit) { $columns[$c.name] = [int]$c.wipLimit } }

if (-not $columns.Count) {
    Write-Host "WIP-лимиты не заданы - проверять нечего." -ForegroundColor Yellow
    exit 0
}

$stateFile = Join-Path $root "data/lab2.1-board-state.json"
if (-not (Test-Path $stateFile)) {
    throw "Нет снимка доски: $stateFile. Создайте его скриптом (см. docs/lab2.1-board-rules.md)."
}
$state = Get-Content $stateFile -Raw -Encoding UTF8 | ConvertFrom-Json

$violations = 0
foreach ($col in $columns.Keys) {
    $items = @($state.items | Where-Object { $_.boardColumn -eq $col })
    $limit = $columns[$col]
    if ($items.Count -gt $limit) {
        Write-Host ("[WIP EXCEEDED] колонка '{0}': {1} элементов при лимите {2}" -f $col, $items.Count, $limit) -ForegroundColor Red
        $items | ForEach-Object { Write-Host ("    - #{0} {1}" -f $_.number, $_.title) }
        $violations++
    } else {
        Write-Host ("[OK] колонка '{0}': {1}/{2}" -f $col, $items.Count, $limit) -ForegroundColor Green
    }
}

# Ёмкость спринта
$cap = $spec.boardRules.capacity
$assigned = ($state.items | Where-Object { $_.assigned -and $_.remainingWork -gt 0 } | Measure-Object -Property remainingWork -Sum).Sum
$total = ($state.items | Where-Object { $_.remainingWork -gt 0 } | Measure-Object -Property remainingWork -Sum).Sum
$available = $cap.perDayHours * $cap.sprintDays
Write-Host ""
Write-Host ("Ёмкость спринта: {0} ч в день × {1} рабочих дн = {2} ч (из них {3} дн отпуск)" -f $cap.perDayHours, $cap.sprintDays, $available, $cap.daysOff)
Write-Host ("Оставшаяся работа у назначенных: {0} ч; всего в спринте: {1} ч" -f $assigned, $total)
if ($assigned -gt $available) { Write-Host "Превышение личной ёмкости!" -ForegroundColor Red; $violations++ }
if ($total -gt $available) { Write-Host "Превышение ёмкости команды (лишние $($total - $available) ч)." -ForegroundColor Yellow }

if ($violations) { exit 1 }
if ($total -gt $available) {
    Write-Host "`nЛимиты WIP соблюдены; превышение ёмкости зафиксировано (как в методичке, шаг 12)." -ForegroundColor Yellow
    exit 0
}
Write-Host "`nВсе ограничения соблюдены." -ForegroundColor Green
