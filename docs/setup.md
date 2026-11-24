# Быстрый старт

## 1. Данные

```powershell
node tools/generate_seed_data.js   # пересоздать data/*.json и data/sql/*.sql
node tools/validate_data.js        # проверить целостность и количества
```

Ожидаемый вывод валидатора — `OK: seed data is consistent` и таблица:

| набор | записей |
| --- | --- |
| categories | 20 |
| products | 43 |
| customers | 40 |
| orders | 120 |
| orderItems | 301 |
| cartLines | 12 |

## 2. Загрузка данных в SQL Server

```powershell
sqlcmd -S localhost -d PartsUnlimited -i data/sql/01_schema.sql
sqlcmd -S localhost -d PartsUnlimited -i data/sql/02_seed_data.sql
```

Файлы сохранены в UTF-8 без BOM; для `sqlcmd` используйте `-f 65001`.

## 3. Рабочая область в GitHub

Если нужно развернуть доску в другом репозитории:

```powershell
$env:GH_TOKEN = "<fine-grained PAT: contents+issues+administration>"
./scripts/provision_github.ps1 -Repo <owner>/<repo>
```

Скрипт читает `data/demo-generator/parts-unlimited.json` и создаёт метки, вехи,
issues, sub-issues и доску Projects — это и есть аналог `ADOGenerator`.

## 4. Проверка доски вручную

| Шаг | Действие |
| --- | --- |
| 1 | Issues → `[EPIC] Обучение продуктам` → блок Sub-issues: 3 feature |
| 2 | Filter `label:"type: pbi"` → 10 PBI |
| 3 | Filter `milestone:"Sprint 2"` → 5 элементов текущего спринта |
| 4 | Issues → Milestones → Sprint 2 → прогресс-бар |
| 5 | Projects → Unlimited Parts Board → колонки Todo / In Progress / Done |
