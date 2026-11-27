# Автоматизация ЛР 2.2

## Скрипты

| Скрипт | Что делает | Шаги методички |
| --- | --- | --- |
| `apply_kanban.js` | цвета тегов (`данные` жёлтый, `ux` синий), теги на истории #3, Story Points, перемещение карточки в `Approved QA` | Задача 4, шаги 3–19 |
| `generate_dashboard.js` | собирает панель «Обучение продукту» (SVG + markdown) из состояния доски | Задача 5, шаги 4–19 |
| `../lab21/set_ticket_id.js` | заполняет поле `PUL Ticket ID` | Задача 6, шаги 19–21 |
| `../../scripts/check_wip.ps1` | проверяет WIP-лимит колонки и ёмкость | Задача 4, шаги 15–16 |

## Порядок

```powershell
node tools/lab22/apply_kanban.js        # теги, Story Points, перемещение в QA
node tools/lab22/generate_dashboard.js  # панель мониторинга
./scripts/check_wip.ps1                 # WIP: 2 карточки при лимите 1 (как в методичке)
```

## Снимки состояния

| Файл | Состояние |
| --- | --- |
| `data/lab2.2-board-state.json` | после шагов 14–24: в `Approved QA` две карточки (WIP превышен) |
| `data/lab2.2-board-state-compliant.json` | до шагов 14–16: в `Approved QA` одна карточка (WIP соблюдён) |

Переключение проверки между снимками:

```powershell
./scripts/check_wip.ps1                                              # превышение
./scripts/check_wip.ps1 -StateFile data/lab2.2-board-state-compliant.json   # ок
```

## Ограничения API GitHub

- **Диаграммы Insights** в Project v2 нельзя создать через API — панель
  генерируется скриптом из реального состояния доски.
- **WIP-лимиты** и **разделение колонок** не поддерживаются Projects v2 —
  реализованы конфигурацией + проверкой.
- **Унаследованные процессы** организации доступны только в GitHub Enterprise;
  здесь «процесс» = конфигурация + поля проекта.