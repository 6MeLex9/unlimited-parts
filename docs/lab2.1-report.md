# Отчёт: ЛР 2.1 — Планирование в Azure DevOps (Задачи 1–3)

> Темы 2.0–2.2 исходно выполняются в Azure DevOps. По разрешению преподавателя
> работа выполнена в **GitHub**; соответствие инструментов —
> [`azure-vs-github.md`](azure-vs-github.md).
>
> **ЛР 2.0** — подготовка тестовых данных: [`report.md`](report.md).
> **ЛР 2.1** (этот отчёт) — Задачи 1–3: команда, области и итерации, рабочие
> элементы, планирование спринта и ёмкость.
> **ЛР 2.2** — Задачи 4–6: канбан-доска, панели мониторинга, процесс:
> [`lab2.2-report.md`](lab2.2-report.md).

**Окружение**

| Объект | Ссылка |
| --- | --- |
| Репозиторий (проект `Unlimited Parts`) | https://github.com/6MeLex9/unlimited-parts |
| Доска (`Unlimited Parts Board`) | https://github.com/users/6MeLex9/projects/2 |
| Epic «Обучение продуктам» | https://github.com/6MeLex9/unlimited-parts/issues/1 |
| Feature «Осваиваем дашборды» | https://github.com/6MeLex9/unlimited-parts/issues/2 |
| Первый PBI (учебники) | https://github.com/6MeLex9/unlimited-parts/issues/3 |
| Задачи спринта | https://github.com/6MeLex9/unlimited-parts/issues/15 · .../16 |
| Sprint 2 (текущая итерация) | https://github.com/6MeLex9/unlimited-parts/milestone/2 |

## Задача 1: команда `PUL-Web`, области и итерации

| Шаги методички | Реализация в GitHub |
| --- | --- |
| 1–7. Проект Parts Unlimited из шаблона | репозиторий + манифест шаблона `data/demo-generator/parts-unlimited.json` (выполнено в ЛР 2.0) |
| 3–4. Новая команда `PUL-Web` | метка `area: PUL-Web` — фильтр по команде (в GitHub нет сущности «команда» на уровне личного аккаунта) |
| 6. Members | `Assignees` в Issues/Project |
| 7–8. Iterations → `Sprint 1` | Milestone **Sprint 1** — закрыт, «спринт уже пройден» (4/4 элемента) |
| 9. Добавить Sprint 2 и Sprint 3 | Milestone **Sprint 2** — текущий; **Sprint 3** — ближайший будущий |
| 10–11. Areas → Include Sub Areas | метка области у всех элементов + вложенность Sub-issues: команда видит работы всех уровней |

Спринты двухнедельные: `Sprint 1` (завершён), `Sprint 2` (идёт), `Sprint 3`
(запланирован) — см. `Milestones` репозитория.

## Задача 2: рабочие элементы

Создано **18** рабочих элементов; иерархия — нативные **Sub-issues** +
упоминание `Part of #N` в теле:

```
#1 Epic «Обучение продуктам»
├── #2 Feature «Осваиваем дашборды»
│   ├── #3  PBI  Как клиент, я хочу просмотреть новые учебники
│   │   ├── #15 Task Добавить страницу для самых последних учебников
│   │   └── #16 Task Оптимизация запроса к данным для последних учебников
│   ├── #4  PBI  … видеть новинки на главной странице
│   ├── #5  PBI  … добавить товар в корзину
│   ├── #6  Bug  Карточка товара не отображает скидку
│   └── #17 PBI  … видеть недавно просмотренные учебники
├── #7 Feature «Оформление заказа» → #8, #9, #10
└── #11 Feature «Администрирование каталога» → #12, #13, #14 (Sprint 1, закрыты)
```

| Шаги | Реализация |
| --- | --- |
| 3. Epic «Обучение продуктам» | Issue **#1**, метка `type: epic`, автор назначен |
| 4. Area = PUL-Web, Iteration = Sprint 2 | метка `area: PUL-Web` + Milestone Sprint 2 |
| 7–9. Related Work → Feature «Осваиваем дашборды» | Issue **#2** — Sub-issue эпика, наследует область и итерацию |
| 12–14. Feature → Backlog items | **#3** «Как клиент, я хочу просмотреть новые учебники» (исходная user story методички) |
| 15. ещё два PBI | **#17** «…недавно просмотренные учебники», **#18** «…запросить новые материалы» |
| 23–25. Задачи с Remaining Work и Activity | **#15** — 5 ч, Development; **#16** — 3 ч, Design |

Состояния (поле `Board Column` проекта) после шагов 17–21:

| Элемент | Board Column |
| --- | --- |
| #5 | Approved |
| #3, #15, #16 | Committed |
| #18 | Done |
| #4, #6 | New |

## Задача 3: спринты и ёмкость

Емкость: **1 ч в день × 8 рабочих дней = 8 ч**; отпуск 5 рабочих дней.

| Шаг | Реализация |
| --- | --- |
| 2. Work details | вид **Taskboard** + поле `Remaining Work` |
| 3. две задачи, 8 ч | #15 (5 ч) + #16 (3 ч) |
| 4. назначить себе | `Assignees = 6MeLex9` у #15 |
| 5. capacity 1 ч/день | `capacity.perDayHours = 1` в `data/demo-generator/board-config.json` |
| 6–7. отпуск 5 дней | `daysOff = 5` |
| 8. Save | значения зафиксированы в проекте |
| 11. Remaining 5 → 8 | #15 → `Remaining Work = 8` |
| 12. превышение | 8 ч (назначено) + 3 ч (свободная задача) = 11 ч > 8 ч, лишние **3 ч** |
| 13. перенос в др. спринт — не выполнять | элемент оставлен в Sprint 2 (как требует методичка) |
| 15–16. View → People | Taskboard с группировкой по `Assignees` |
| 17–24. Styles → «Разработка», зелёный | `Activity = Development` + правило стиля в `board-config.json` (подробнее — в отчёте 2.2, Задача 4) |
| 20. Backlog levels (Epic) | уровни Epic → Feature → PBI → Task; эпик не скрыт |
| 21. рабочие дни | `workingDays: [1,2,3,4,5]` |
| 22. Working with bugs | дефект **#6** с меткой `type: bug` |

Проверка `scripts/check_wip.ps1` (снимок `data/lab2.2-board-state-compliant.json`):

```
Ёмкость спринта: 1 ч в день × 8 рабочих дн = 8 ч (из них 5 дн отпуск)
Оставшаяся работа у назначенных: 8 ч; всего в спринте: 11 ч
Превышение ёмкости команды (лишние 3 ч).
```

## Воспроизводимость

```powershell
node tools/lab21/create_items.js      # задачи и PBI, связи Sub-issues
node tools/lab21/configure_board.js   # поля проекта и виды
node tools/lab21/fill_values.js       # состояния, activity, remaining work
./scripts/check_wip.ps1 -StateFile data/lab2.2-board-state-compliant.json
```

## Выводы по 2.1

1. Итерации и области Azure в GitHub воспроизводятся парой
   **Milestone + метка области**; иерархия — Sub-issues.
2. `Remaining Work` и `Activity` не существуют в Issues, поэтому заведены как
   поля Project v2 — это ближайший аналог полей процесса Scrum.
3. Планирование по ёмкости воспроизведено точно: 8 ч доступно, 11 ч работы,
   превышение 3 ч — числа совпадают с методичкой.

## Что сдавать по 2.1

- [ ] Доска: колонки `New / Approved / Committed / Approved QA / Done`
- [ ] Issue #1 → Sub-issues #2, #7, #11; Issue #2 → #3, #4, #5, #6, #17, #18
- [ ] Issue #3 → Sub-issues #15, #16
- [ ] Поле `Remaining Work`: #15 = 8, #16 = 3
- [ ] Milestones: Sprint 1 (закрыт), Sprint 2 (текущий), Sprint 3
- [ ] Вывод `check_wip.ps1` с превышением ёмкости на 3 ч