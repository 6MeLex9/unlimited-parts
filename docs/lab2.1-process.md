# Настройка процесса (аналог inherited process «Мой Scrum»)

В Azure DevOps процесс задаёт «строительные блоки»: типы рабочих элементов,
поля, состояния, правила. Системные процессы (Scrum, Agile, CMMI) менять нельзя —
создают **унаследованный** процесс и настраивают его, а затем переключают на него
проекты.

## Что соответствует чему

| Azure | GitHub |
| --- | --- |
| Организация → Процесс → Scrum | нет прямого аналога; роль «процесса» выполняет **проект + манифест** |
| Создать унаследованный процесс «Мой Scrum» | `data/demo-generator/lab2.1-board.json` (раздел `process`) |
| Типы рабочих элементов Scrum | метки `type: epic / feature / pbi / task / bug` |
| Поля процесса (Activity, Remaining Work, Story Points) | поля Project v2 с теми же именами |
| Новое поле «PUL Ticket ID» | поле Project v2 **`PUL Ticket ID`** (текстовое) |
| Группа `PartsUnlimitedGroup`, label `Ticket ID` | раздел «PartsUnlimitedGroup» в манифесте + фильтр вида `Backlog` |
| Переключить проект на процесс | `scripts/provision_github.ps1` создаёт поля в новом проекте по манифесту |

## Аналог на уровне организации (GitHub Enterprise / процесс-репозиторий)

Если нужен действительно общий «процесс» для многих репозиториев, в GitHub
используется **process template repository**: репозиторий с манифестами
(`processes/*.json`), из которого скрипт разворачивает одинаковые метки и поля в
любом новом репозитории. Это ближайший эквивалент «наследования» процесса.

## Выполненные шаги в этом репозитории

1. Создано поле **`PUL Ticket ID`** в проекте `Unlimited Parts Board`.
2. Поле заполнено у первого PBI: **#3 «Как клиент, я хочу просмотреть новые
   учебники»** → `PUL-1042`, **#17** → `PUL-1043`.
3. Поле доступно в:
   - карточке элемента проекта (View → Add field),
   - фильтрах: `PUL Ticket ID:PUL-1042` (Project v2 search),
   - виде `Backlog` (колонка «PUL Ticket ID»).

## Как добавить ещё одно поле процесса

```http
POST https://api.github.com/graphql
mutation {
  createProjectV2Field(input: {
    projectId: "<ID проекта>",
    name: "PUL Ticket ID",
    dataType: TEXT
  }) { projectV2Field { ... on ProjectV2FieldCommon { id name } } }
}
```

Для поля с выбором значения — `dataType: SINGLE_SELECT` и
`singleSelectOptions: [{name:"...", color: GREEN}]`.

> Проверьте: в поле `PUL Ticket ID` у #3 должно стоять `PUL-1042`.
