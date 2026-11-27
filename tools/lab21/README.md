# Автоматизация ЛР 2.1

Скрипты создают и настраивают рабочую область гибкого планирования в GitHub
(аналог ручных шагов Azure Boards из методички 2.1).

## Предварительно

```powershell
$env:GH_TOKEN = "<classic PAT: repo + project>"
# файл с заголовком авторизации для curl (используется скриптами)
"Authorization: Bearer $env:GH_TOKEN" | Out-File -Encoding ascii -NoNewline auth_header.txt
```

Затем в начале каждого скрипта проверьте константы `DIR` / `HDR` (путь к файлу
авторизации) и `REPO` / `PROJECT_ID`.

## Порядок запуска

| Шаг | Скрипт | Что делает | Аналог в Azure |
| --- | --- | --- | --- |
| 1 | `create_items.js` | метка `type: task`, 2 задачи и 2 PBI, связи Sub-issues | Задача 2 (создание рабочих элементов) |
| 2 | `configure_board.js` | поля `Activity`, `Remaining Work`, `Story Points`, `Board Column`, `Swimlane`; виды `Taskboard`, `Backlog` | Задача 3–4 (capacity, view, columns) |
| 3 | `fill_values.js` | расставляет состояния, активность, остаток работ, дорожку | Задача 2–4 |
| 4 | `set_ticket_id.js` | заполняет поле `PUL Ticket ID` у PBI | Задача 6 (шаги 19–21) |

## Проверка

```powershell
./scripts/check_wip.ps1
```

Скрипт читает `data/demo-generator/board-config.json` и снимок
`data/lab2.2-board-state.json`, проверяет WIP-лимит колонки «Approved QA» и
ёмкость спринта (`1 ч × 8 дн = 8 ч`, отпуск 5 дн), воспроизводя проверку из
шагов 5–12 методички.

## Ограничения API GitHub

- **Диаграммы** (Insights) Project v2 нельзя создать через API — только вручную.
- **WIP-лимиты** колонок в Projects v2 отсутствуют как функция — реализованы
  полем + проверкой.
- **Наследуемые процессы** на уровне организации существуют только в GitHub
  Enterprise; в личном аккаунте «процесс» = набор полей проекта.
