# ЛР 2.1 — пошаговое соответствие Azure DevOps → GitHub (Задачи 1–3)

Методичка описывает Azure Boards; здесь каждый шаг воспроизведён в GitHub.
Итог: репозиторий [`6MeLex9/unlimited-parts`](https://github.com/6MeLex9/unlimited-parts)
и проект [Unlimited Parts Board](https://github.com/users/6MeLex9/projects/2).

Отчёт: [`lab2.1-report.md`](lab2.1-report.md). Задачи 4–6 — в
[`lab2.2-guide.md`](lab2.2-guide.md).

## Задача 1: команда, области, итерации

| Шаг методички | Где в GitHub | Статус |
| --- | --- | --- |
| 1–7. Проект Parts Unlimited из шаблона | репозиторий + `data/demo-generator/parts-unlimited.json` (ЛР 2.0) | ✅ |
| 3–4. Новая команда `PUL-Web` | метка `area: PUL-Web` | ✅ |
| 6. Members | `Assignees` | ✅ |
| 7. Iterations → Select Iterations | Milestones `Sprint 1..3` | ✅ |
| 8. Выбрать `Unlimited Parts\Sprint 1` | Milestone **Sprint 1** — закрыт («уже пройден») | ✅ |
| 9. Добавить Sprint 2 и Sprint 3 | Milestone **Sprint 2** (текущий), **Sprint 3** (будущий) | ✅ |
| 10–11. Areas → Include Sub Areas | метка области + вложенность Sub-issues | ✅ |

## Задача 2: рабочие элементы

| Шаг | Где в GitHub | Значение |
| --- | --- | --- |
| 3. Epic «Обучение продуктам» | Issue **#1** | метка `type: epic` |
| 4. Area = PUL-Web, Iteration = Sprint 2 | метка + Milestone | — |
| 7–8. Related Work → Feature «Осваиваем дашборды» | Issue **#2**, Sub-issue #1 | — |
| 9. связь с родителем | Sub-issues + `Part of #1` в теле | — |
| 12–14. Backlog items → PBI | Issue **#3** «…просмотреть новые учебники» | — |
| 15. ещё два PBI | **#17** «…недавно просмотренные», **#18** «…запросить материалы» | — |
| 17–21. Approved / Committed / Done | поле `Board Column` | #5 Approved; #3, #15, #16 Committed; #18 Done |
| 23–25. Задачи с Remaining Work и Activity | **#15** (5 ч, Development), **#16** (3 ч, Design) | — |

## Задача 3: спринты и ёмкость

| Шаг | Реализация |
| --- | --- |
| 2. Work details | вид **Taskboard** + поле `Remaining Work` |
| 3. две задачи, 8 ч | #15 (5 ч) + #16 (3 ч) |
| 4. назначить себе | `Assignees = 6MeLex9` у #15 |
| 5. Capacity 1 ч/день | `capacity.perDayHours = 1` |
| 6–7. отпуск 5 рабочих дней | `daysOff = 5` |
| 8. Save | зафиксировано в проекте |
| 11. Remaining 5 → 8 | #15 → `Remaining Work = 8` |
| 12. превышение ёмкости | 11 ч > 8 ч, лишние **3 ч** |
| 15–16. View → People | Taskboard с группировкой по `Assignees` |
| 17–24. Styles → «Разработка» (зелёный) | `Activity = Development` + правило стиля (см. `lab2.2-kanban.md`) |
| 20. Backlog levels (Epic) | Epic → Feature → PBI → Task |
| 21. рабочие дни | `workingDays: [1,2,3,4,5]` |
| 22. Working with bugs | дефект **#6**, метка `type: bug` |

## Проверка

```powershell
./scripts/check_wip.ps1 -StateFile data/lab2.2-board-state-compliant.json
# Ёмкость спринта: 1 ч в день × 8 рабочих дн = 8 ч (из них 5 дн отпуск)
# Оставшаяся работа у назначенных: 8 ч; всего в спринте: 11 ч
# Превышение ёмкости команды (лишние 3 ч).
```

Ссылки:

- доска — https://github.com/users/6MeLex9/projects/2
- Sprint 2 — https://github.com/6MeLex9/unlimited-parts/milestone/2
- задачи — https://github.com/6MeLex9/unlimited-parts/issues?q=is%3Aissue+label%3A%22type%3A+task%22