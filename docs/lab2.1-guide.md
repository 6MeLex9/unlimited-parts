# ЛР 2.1 — Гибкое планирование и управление портфелем (GitHub-версия)

Методичка описывает Azure Boards. Здесь каждый шаг воспроизведён в GitHub; в
скобках — куда именно смотреть. Итог: репозиторий
[`6MeLex9/unlimited-parts`](https://github.com/6MeLex9/unlimited-parts) и проект
[Unlimited Parts Board](https://github.com/users/6MeLex9/projects/2).

## Задача 1: команда, области, итерации

| Шаг методички | Где в GitHub | Статус |
| --- | --- | --- |
| 1–7. Проект Parts Unlimited из шаблона | репозиторий + манифест `data/demo-generator/parts-unlimited.json` (сделано в ЛР 2.0) | ✅ |
| 3–4. Новая команда `PUL-Web` | метка `area: PUL-Web` (GitHub не имеет «команд» в смысле Azure) | ✅ |
| 7. Iterations → Select Iterations | Milestones `Sprint 1..3` | ✅ |
| 8. Выбрать `Unlimited Parts\Sprint 1` | Milestone **Sprint 1** (закрыт — «спринт уже пройден») | ✅ |
| 9. Добавить Sprint 2 и Sprint 3 | Milestone **Sprint 2** — текущий, **Sprint 3** — ближайший будущий | ✅ |
| 10–11. Areas → Include Sub Areas | поле `area: PUL-Web` у всех элементов + вложенность через Sub-issues | ✅ |

## Задача 2: рабочие элементы

| Шаг | Где в GitHub | Значение |
| --- | --- | --- |
| 3. Epic «Обучение продуктам» | Issue **#1** `[EPIC] Обучение продуктам` | ✅ |
| 4. Area = PUL-Web, Iteration = Sprint 2 | метка `area: PUL-Web` + Milestone Sprint 2 | ✅ |
| 7–8. Related Work → Feature «Осваиваем дашборды» | Issue **#2**, Sub-issue эпика #1 | ✅ |
| 9. родительская связь | Sub-issues + строка `Part of #1` в теле | ✅ |
| 12–14. Feature → Backlog items, PBI | Issue **#3** «Как клиент, я хочу просмотреть новые учебники» | ✅ |
| 15. ещё два PBI | **#17** «…видеть недавно просмотренные учебники», **#18** «…запросить новые материалы» | ✅ |
| 17–21. Approved → Committed → Done | поле `Board Column` в проекте (см. таблицу ниже) | ✅ |
| 23–25. Задачи с Remaining Work и Activity | **#15** (5→8 ч, Development), **#16** (3 ч, Design) | ✅ |

### Состояния на доске

| Элемент | Board Column | Activity | Remaining Work | Swimlane |
| --- | --- | --- | --- | --- |
| #15 задача | Committed | Development | **8** | Default |
| #16 задача | Committed | Design | 3 | Default |
| #17 PBI | Approved QA | — | — | **Ускоренная** |
| #18 PBI | Done | — | — | Default |
| #3 PBI | Committed | — | — | Default |
| #5 PBI | Approved | — | — | Default |
| #4, #6 | New | — | — | Default |

Колонки: `New → Approved → Committed → Approved QA (WIP = 1) → Done`.

## Задача 3: спринты и ёмкость

| Шаг | Реализация |
| --- | --- |
| 2. Work details | вид **Taskboard** + поле `Remaining Work` |
| 3. 2 задачи, суммарно 8 ч | #15 (5 ч) + #16 (3 ч) |
| 4. назначить задачу себе | `Assignees` у #15 |
| 5. Capacity = 1 ч/день | `capacity.perDayHours = 1` в `data/demo-generator/lab2.1-board.json` |
| 6–7. отпуск 5 рабочих дней | `daysOff = 5`, итого `1 ч × 8 дн = 8 ч` |
| 8. Save | значения зафиксированы в проекте |
| 11. Remaining 5 → 8 | #15 → `Remaining Work = 8` |
| 12. превышение ёмкости | 8 (себе) + 3 (свободная задача) > 8 ч |
| 15. View → People | вид **Taskboard** группируется по `Assignees` |
| 17–19. Styles → правило «Разработка», зелёный | поле `Activity = Development` + правило стилей — см. `docs/lab2.1-board-rules.md` |
| 20. Backlog levels, Epic | иерархия Epic → Feature → PBI → Task через Sub-issues |
| 21. рабочие дни | `workingDays` в манифесте |
| 22. Working with bugs | дефект **#6** с меткой `type: bug` |

## Задача 4: канбан-доска

| Шаг | Реализация |
| --- | --- |
| 3. Tag colors → «данные» | метка `данные` (жёлтая) на #15, #16, #17 |
| 7–8. теги «данные» и «ux/ui» | метки `данные`, `ux` у #3, #16, #17, #18 |
| 11. Колонка «Approved QA» + WIP = 1 | поле `Board Column → Approved QA` с лимитом; при двух карточках — превышение |
| 12–15. перетаскивание, красный лимит | #17 в Approved QA, #18 из Done → превышение → #17 возвращён в Committed |
| 18. разделение колонки (Doing/Done) | `"split": true` у колонки Approved QA |
| 19. Definition of Done | «Проходит **все** тесты и ревью» в `lab2.1-board.json` |
| 23. Swimlane «Ускоренная» | поле `Swimlane → Ускоренная` у #17 |

## Задача 5: панели мониторинга

Подробно — в [`lab2.1-dashboards.md`](lab2.1-dashboards.md).

| Шаг | Реализация |
| --- | --- |
| 4. Панель «Обучение продукту» | набор фильтров-«плиток» (см. документ) |
| 6–8. Sprint Overview → Efforts | Milestone Sprint 2 + `Story Points` |
| 9. Sprint Capacity | `Remaining Work` по исполнителям |
| 13–16. Запрос «Веб-задачи» | фильтр `label:"type: task" label:"area: PUL-Web"` |
| 17–19. Диаграмма по Assigned To | группировка по `Assignees` |

## Задача 6: настройка процесса

Azure: унаследованный процесс «Мой Scrum» + поле `PUL Ticket ID` в группе
`PartsUnlimitedGroup` у Product Backlog Item.

Шаги 4–10 методички = создание унаследованного процесса и поля. Полный аналог в
GitHub (организационный уровень) описан в
[`lab2.1-process.md`](lab2.1-process.md); здесь выполнен облегчённый вариант:

| Шаг | Реализация |
| --- | --- |
| 5. Процесс «Мой Scrum» | поля проекта `Activity`, `Board Column`, `Swimlane` — «строительные блоки» процесса |
| 9. Поле «PUL Ticket ID» | поле **`PUL Ticket ID`** (текстовое) в Project v2 |
| 10. Group `PartsUnlimitedGroup`, label `Ticket ID` | группа полей «PartsUnlimitedGroup» в виде таблицы |
| 15. Переключить проект на процесс | все элементы репозитория используют общий набор полей проекта |
| 19–21. Заполнить Ticket ID у первого PBI | #3 → `PUL-1042`, #17 → `PUL-1043` |

## Проверка результата

```powershell
# состояние доски
https://github.com/users/6MeLex9/projects/2
# текущий спринт
https://github.com/6MeLex9/unlimited-parts/issues?q=is%3Aissue+milestone%3A%22Sprint+2%22
# задачи с остатком работ
https://github.com/6MeLex9/unlimited-parts/issues?q=is%3Aissue+label%3A%22type%3A+task%22
```
