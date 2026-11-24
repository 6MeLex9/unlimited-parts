# Панели мониторинга и запросы (аналог Azure Dashboards + Queries)

В Azure DevOps панель мониторинга собирается из виджетов, а запросы (Queries)
строят диаграммы. В GitHub это делается через **сохранённые ссылки-фильтры**
(bookmark), **Insights** в Project v2 и **Milestone/Metrics**.

## 1. Запрос «Веб-задачи»

Аналог Saved Query `Shared Queries → Веб-задачи` (тип = Task, Area = PUL-Web):

```
https://github.com/6MeLex9/unlimited-parts/issues?q=is%3Aissue+label%3A%22type%3A+task%22+label%3A%22area%3A+PUL-Web%22
```

Диаграмма «Веб-задачи — по назначению» = группировка этого запроса по исполнителю
(поле `Assignees` в Project v2, вид `Backlog` → Group by → Assignees):

```
label:"type: task" label:"area: PUL-Web"
```

## 2. Спринтовые виджеты (Sprint Overview / Sprint Capacity)

| Виджет Azure | Аналог в GitHub |
| --- | --- |
| Sprint Overview (Efforts) | Milestone `Sprint 2` → прогресс + поле `Story Points` |
| Sprint Capacity | поле `Remaining Work` в Project v2 + вид по исполнителям |
| Burnup/Burndown | Insights → Burnup в Project v2 |

Ссылки-виджеты «панели Обучение продукту»:

| Плитка | Ссылка |
| --- | --- |
| Sprint Overview | https://github.com/6MeLex9/unlimited-parts/milestone/2 |
| Sprint backlog | https://github.com/6MeLex9/unlimited-parts/issues?q=is%3Aissue+milestone%3A%22Sprint+2%22 |
| Board | https://github.com/users/6MeLex9/projects/2/views/4 (Taskboard) |
| Backlog | https://github.com/users/6MeLex9/projects/2/views/5 (Backlog) |

## 3. Сохранённые фильтры (аналог «Обучение продукту»)

| Имя | Фильтр | Ссылка |
| --- | --- | --- |
| Оставшаяся работа спринта | `milestone:"Sprint 2" label:"type: task"` | Issues |
| Дефекты | `label:"type: bug"` | Issues |
| Approved QA | `label:"type: pbi" -status:done` | Issues |

В Project v2 те же выборки доступны как **представления** (вид `By Sprint`,
`Taskboard`, `Backlog`), а график — через `Insights → Current charts → Create chart`
с группировкой по `Board Column` или `Assignees`.

> Примечание: Insights/графики Project v2 настраиваются интерактивно в браузере —
> у REST/GraphQL API нет мутации для создания диаграмм, поэтому здесь приведены
> точные фильтры и шаги, а не готовое изображение.
