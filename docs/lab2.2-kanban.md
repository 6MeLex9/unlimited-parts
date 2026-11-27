# ЛР 2.2, Задача 4 — канбан-доска: колонки, WIP, дорожки, стили

Конфигурация: `data/demo-generator/board-config.json`.

## Колонки и WIP

| Колонка | Состояние (`Status`) | WIP | Разделение | Definition of Done |
| --- | --- | --- | --- | --- |
| New | Todo | — | нет | — |
| Approved | Todo | — | нет | — |
| Committed | In Progress | — | нет | — |
| **Approved QA** | In Progress | **1** | **Doing / Done** | «Проходит **все** тесты и ревью» |
| Done | Done | — | нет | — |

Проверка лимита — `scripts/check_wip.ps1`:

```powershell
./scripts/check_wip.ps1                                   # текущее состояние (2/1 — превышение)
./scripts/check_wip.ps1 -StateFile data/lab2.2-board-state-compliant.json   # до перемещений (1/1 — ок)
```

Скрипт печатает `[WIP EXCEEDED]` и возвращает код 1 — как красная подсветка
колонки в Azure DevOps.

## Дорожки (Swimlanes)

| Дорожка | Назначение | Элементы |
| --- | --- | --- |
| Default | обычный поток | #18 в `Approved QA`, #3/#15/#16 в `Committed`, #4/#6 в `New` |
| **Ускоренная** | приоритетная работа | **#17** в `Approved QA` |

## Стили карточек (Styles)

| Правило Azure | Критерий | Цвет | Реализация |
| --- | --- | --- | --- |
| Разработка | Activity = Development | зелёный | поле `Activity = Development` (#15) + метка `type: task` |
| Дефект | Type = Bug | красный | метка `type: bug` (#6) |

## Цвета тегов (Tag colors)

| Тег | Цвет | Элементы |
| --- | --- | --- |
| `данные` | жёлтый (`#FBCA04`) | #3, #15, #16, #17 |
| `ux` | синий (`#0075CA`) | #3, #16, #18 |

Настройка цвета — обычный PATCH метки:

```powershell
gh api --method PATCH repos/6MeLex9/unlimited-parts/labels/%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5 `
  -f color=FBCA04 -f description="Тег «данные»"
```

## Аннотации карточек и «Тесты»

- задачи на карточке — поле проекта `Sub-issues progress` (например, у #3 — 0/2);
- тесты — метка `tests` при необходимости; поведение описано в `annotations`;
- исполнитель — `Assignees` (аватар на карточке).

## Рабочие дни и работа с ошибками

- рабочие дни: пн–пт (`workingDays: [1,2,3,4,5]`), влияет на ёмкость;
- дефекты показываются на доске карточками с меткой `type: bug` (аналог
  вкладки «Working with bugs»).

## Уровни бэклога

`backlogLevels: ["Epic", "Feature", "PBI", "Task"]` — «Эпик» включён, поэтому
иерархия на доске раскрывается до задач (аналог настройки Backlog levels).

## Ограничения GitHub

| Функция Azure | Ограничение GitHub | Обход |
| --- | --- | --- |
| WIP-лимит колонки | нет в Projects v2 | поле `Board Column` + `check_wip.ps1` |
| Разделение колонки Doing/Done | нет | атрибуты конфигурации + фиксация стадии в теле карточки |
| Definition of Done у колонки | нет | `definitionOfDone` в конфигурации |
| Дорожки | нет как отдельной сущности | поле `Swimlane` |
| Цвета тегов | нет на уровне доски | цвет метки (Labels) |
| Стили карточек | нет правил стилей | метки + поле `Activity` |