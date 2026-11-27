# ЛР 2.2 — пошаговое соответствие Azure DevOps → GitHub (Задачи 4–6)

Отчёт: [`lab2.2-report.md`](lab2.2-report.md).

## Задача 4: канбан-доска

| Шаг методички | Реализация | Где проверить |
| --- | --- | --- |
| 2. Configure team settings | `data/demo-generator/board-config.json` | файл в репозитории |
| 3. Tag colors → «данные» | метка `данные`, цвет `#FBCA04` | Issues → Labels |
| 4. Аннотации карточек | поле `Sub-issues progress` | карточка #3 |
| 5. Вкладка «Тесты» | `annotations` конфигурации | `board-config.json` |
| 6. Save and close | конфигурация закоммичена | — |
| 7–8. Теги «данные» + «ux» на истории | **#3**: `данные`, `ux` | `issues/3` |
| 9. Тег «данные» жёлтый на карточке | цвет метки | Issues → Labels |
| 11. Колонка «Approved QA», WIP = 1 | `Approved QA`, `wipLimit: 1` | `board-config.json` |
| 13. Новая колонка на доске | поле `Board Column` | Project → Taskboard |
| 14. Перетащить из Committed и Done в QA | #18 `Done → Approved QA` | `data/lab2.2-board-state.json` |
| 15. Превышение WIP → красный | `check_wip.ps1` → `[WIP EXCEEDED]` | вывод скрипта |
| 16. Вернуть историю в Committed | #17: `QA → Committed → QA` | история перемещений |
| 18. Разделение колонки Doing/Done | `split: true` | `board-config.json` |
| 19. Definition of Done | «Проходит **все** тесты и ревью» | `board-config.json` |
| 21. Значок DoD у колонки | описание в конфигурации | — |
| 23. Дорожка «Ускоренная» | поле `Swimlane` | Project → Taskboard |
| 24. История на дорожку «Ускоренная» | #17: `Approved QA` + `Ускоренная` | state-файл |
| 25–26. Доска Unlimited Parts Team | 18 элементов, Bug #6, Sprint 1–3 | Issues |

## Задача 5: панели мониторинга

| Шаг методички | Реализация |
| --- | --- |
| 4. Панель «Обучение продукту» | `docs/lab2.2-dashboard.md` |
| 6–8. Sprint Overview (Efforts) | блок 1 диаграммы (Story Points по колонкам) |
| 9. Sprint Capacity | блок 2 диаграммы (8 ч против 11 ч) |
| 12–16. Запрос «Веб-задачи» | `lab2.2-queries.md`, фильтр `label:"type: task"` |
| 17–19. Диаграмма по Assigned To | блок 3 диаграммы |
| 20–21. Добавить на панель | оба документа ссылаются на один SVG |

## Задача 6: настройка процесса

| Шаг методички | Реализация |
| --- | --- |
| 3. Вкладка «Процесс» | раздел `process` в `board-config.json` |
| 4–5. Процесс «Мой Scrum» | `process.inheritedProcessName` |
| 7–9. Новое поле `PUL Ticket ID` | поле Project v2 `PUL Ticket ID` (TEXT) |
| 10. Группа + label «Ticket ID» | `process.field.group` / `.label` |
| 11–15. Переключить проект на процесс | единый набор полей проекта |
| 19–21. Заполнить у первого PBI | #3 = `PUL-1042` |

Подробно: [`lab2.2-process.md`](lab2.2-process.md),
[`lab2.2-kanban.md`](lab2.2-kanban.md), [`lab2.2-queries.md`](lab2.2-queries.md).

## Проверка

```powershell
./scripts/check_wip.ps1                                                    # 2/1 — превышение (как в шаге 15)
./scripts/check_wip.ps1 -StateFile data/lab2.2-board-state-compliant.json   # 1/1 — ок (шаг 16)
node tools/lab22/generate_dashboard.js                                     # пересобрать панель
```