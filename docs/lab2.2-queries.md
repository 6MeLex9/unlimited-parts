# ЛР 2.2, Задача 5 — запрос «Веб-задачи» и диаграмма

Аналог Azure: `Boards → Queries → New query` → тип `Task` + область
`Parts Unlimited\PUL-Web` → Save query → вкладка **Charts** → New chart →
группировка по `Assigned To`.

## Запрос «Веб-задачи»

| Параметр Azure | Значение в GitHub |
| --- | --- |
| Тип работ = Task | `label:"type: task"` |
| Область = Parts Unlimited\PUL-Web | `label:"area: PUL-Web"` |
| Папка = Shared Queries | закреплённая ссылка в этом документе |

Готовая ссылка (аналог сохранённого запроса):

```
https://github.com/6MeLex9/unlimited-parts/issues?q=is%3Aissue+label%3A%22type%3A+task%22+label%3A%22area%3A+PUL-Web%22
```

Результат — 2 задачи: #15 «Добавить страницу для самых последних учебников»,
#16 «Оптимизация запроса к данным для последних учебников».

## Диаграмма «Веб-задачи — по назначению»

Аналог: `Charts → New chart`, название «Веб-задачи - по назначению», группировка
по `Assigned To`.

В Project v2 это делается так: вид `Backlog` → **Group by → Assignees**.
Готовая группировка:

| Кому назначено | Задач |
| --- | --- |
| 6MeLex9 | 1 (#15) |
| Не назначено | 1 (#16) |

Диаграмма этого запроса нарисована на сгенерированной панели мониторинга —
нижний блок «Веб-задачи — по назначению» в
[`lab2.2-dashboard.md`](lab2.2-dashboard.md).

## Плитки панели «Обучение продукту»

| Плитка Azure | Где смотреть в GitHub |
| --- | --- |
| Sprint Overview (Efforts) | `docs/img/dashboard-lab2.2.svg`, блок 1; данные — поле `Story Points` |
| Sprint Capacity | тот же SVG, блок 2; данные — `Remaining Work` против ёмкости |
| Диаграмма запроса | тот же SVG, блок 3; данные — `Assignees` у задач |
| Живая доска | https://github.com/users/6MeLex9/projects/2 |
| Спринт | https://github.com/6MeLex9/unlimited-parts/milestone/2 |

## Перегенерация

```powershell
node tools/lab22/generate_dashboard.js
```

Скрипт читает `data/lab2.2-board-state.json`, пересобирает
`docs/img/dashboard-lab2.2.svg` и `docs/lab2.2-dashboard.md`, поэтому панель
всегда синхронна с доской.

> Почему не через API: диаграммы Project v2 (Insights) создаются только в
> интерактивном интерфейсе — мутации `createChart` в GitHub GraphQL нет.
> Генерация из тех же данных даёт тот же результат и воспроизводима.