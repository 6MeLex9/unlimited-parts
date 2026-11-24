# Правила доски (аналог Configure team settings → Styles)

В Azure DevOps правила стилей подсвечивают карточки по критерию. В GitHub
эквивалент — **метки** (Labels) + фильтры и группировки в Project v2.

## Стили карточек

| Правило Azure | Критерий | Как в GitHub |
| --- | --- | --- |
| «Разработка» — зелёный | Activity = Development | поле `Activity = Development` (зелёная опция) и метка `type: task` |
| Баг — красный | Work Item Type = Bug | метка `type: bug` (красная `#D73A4A`) |
| Данные — жёлтый | Tag = «данные» | метка `данные` (жёлтая) |
| UX — синий | Tag = «ux» | метка `ux` |

Созданные метки: `type: task` (`#FBCA04`), `данные`, `ux`, `type: bug`,
`type: pbi`, `type: feature`, `type: epic`, `area: PUL-Web`, `priority: 1`,
`severity: 2`.

## Аннотации карточек

| Аннотация Azure | GitHub |
| --- | --- |
| Tasks (3/4) | поле проекта `Sub-issues progress` |
| Tests | метка `tests` (по желанию) |
| Assigned To | `Assignees` (аватар на карточке) |

## Колонки и WIP

| Колонка | Состояние | WIP | Разделение | Definition of Done |
| --- | --- | --- | --- | --- |
| New | Todo | — | нет | — |
| Approved | Todo | — | нет | — |
| Committed | In Progress | — | нет | — |
| Approved QA | In Progress | **1** | **Doing / Done** | Проходит **все** тесты и ревью |
| Done | Done | — | нет | — |

> GitHub Projects не имеет встроенного WIP-лимита колонки. Ограничение
> реализовано полем `Board Column` + правилом проверки
> (`scripts/check_wip.ps1`): если в `Approved QA` больше одной карточки —
> скрипт возвращает ошибку, как красная подсветка в Azure.

## Дорожки (Swimlanes)

| Дорожка | Назначение | Элементы |
| --- | --- | --- |
| Default | обычный поток | #15, #16, #18, #3, #5, #4, #6 |
| Ускоренная | приоритет, нельзя застревать | #17 |

Вид **Taskboard** в проекте группируется по `Swimlane`, поэтому дорожки
отображаются на доске.

## Рабочие дни

`workingDays: 5` (пн–пт) в `data/demo-generator/lab2.1-board.json` —
используется при расчёте ёмкости (`1 ч × 8 рабочих дней = 8 ч`).
