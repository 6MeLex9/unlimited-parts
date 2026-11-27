# ЛР 2.2, Задача 6 — настройка процесса и поле `PUL Ticket ID`

## Что делает Azure

1. Организация → **Process** → Scrum → *Create inherited process*.
2. Имя процесса — **«Мой Scrum»**.
3. Product Backlog Item → *New field* → **`PUL Ticket ID`**.
4. Layout: label **«Ticket ID»**, группа **«PartsUnlimitedGroup»** → *Add field*.
5. Проект `Unlimited Parts` переключить с Scrum на «Мой Scrum»
   (Process → Projects → Change process).
6. Открыть первый PBI — появилось поле `Ticket ID`, заполнить.

Смысл: базовые процессы (Scrum/Agile/CMMI) менять нельзя; унаследованный процесс
настраивается, и все проекты, ссылающиеся на него, получают изменения
автоматически.

## Как это выражено в GitHub

| Azure | GitHub | Файл/объект |
| --- | --- | --- |
| Процесс (набор полей и типов) | манифест конфигурации + поля проекта | `data/demo-generator/board-config.json`, раздел `process` |
| Типы рабочих элементов Scrum | метки `type: epic/feature/pbi/task/bug` | Labels репозитория |
| Поля процесса (Activity, Remaining Work, Story Points) | одноимённые поля Project v2 | Project → Settings → Fields |
| Новое поле `PUL Ticket ID` | поле Project v2 **`PUL Ticket ID`** (TEXT) | создано скриптом |
| Группа `PartsUnlimitedGroup`, label `Ticket ID` | `process.field.group` / `process.field.label` | `board-config.json` |
| Переключение проекта на процесс | применение конфигурации к проекту | `tools/lab21/configure_board.js` |
| Заполнение Ticket ID у первого PBI | #3 → `PUL-1042` | Project → элемент #3 |

## Как создано поле (фактический вызов)

```http
POST https://api.github.com/graphql

mutation {
  createProjectV2Field(input: {
    projectId: "<ID проекта>",
    name: "PUL Ticket ID",
    dataType: TEXT
  }) {
    projectV2Field { ... on ProjectV2FieldCommon { id name } }
  }
}
```

Результат: поле `PVTF_lAHOCZpVsc4BtCNGzhrN-88` в проекте
[`Unlimited Parts Board`](https://github.com/users/6MeLex9/projects/2).

## Заполнение (шаги 19–21 методички)

| Элемент | `PUL Ticket ID` |
| --- | --- |
| **#3** «Как клиент, я хочу просмотреть новые учебники» (первый PBI) | **`PUL-1042`** |
| #17 «…недавно просмотренные учебники» | `PUL-1043` |

Значение доступно везде, где используется поле проекта:

- карточка элемента в Project v2 (колонка «PUL Ticket ID»),
- фильтры проекта и поиск,
- вид `Backlog` (табличное представление),
- выгрузка через GraphQL `updateProjectV2ItemFieldValue` / чтение `fieldValues`.

## Отличие от Azure (честно)

В Azure унаследованный **процесс** — сущность уровня организации: одно изменение
поля меняет все проекты, ссылающиеся на процесс. В GitHub аналогичная
«наследуемость» есть только в **GitHub Enterprise** (custom fields организации);
в личном аккаунте роль процесса выполняет конфигурация + набор полей проекта,
которые создаются скриптом в каждом новом проекте. Поэтому схема «поменяли
процесс → обновились все проекты» воспроизводится не автоматически, а через
повторное применение конфигурации.

## Проверка

```powershell
gh project field-list 2 --owner 6MeLex9
# ожидаем в списке: PUL Ticket ID (Text)
```

Или через GraphQL:

```http
query { node(id: "<ID проекта>") { ... on ProjectV2 {
  fields(first: 40) { nodes { ... on ProjectV2FieldCommon { name } } } } } }
```