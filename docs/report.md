# Отчёт по лабораторной работе

## Гибкое планирование в GitHub Projects (аналог Azure Boards)

> Исходная методичка выполнена в Azure DevOps через *Azure DevOps Services Demo
> Generator* (шаблон `3 | Parts Unlimited`). По разрешению преподавателя работа
> выполнена в **GitHub**: аналоги Tools подобраны по таблице
> [`azure-vs-github.md`](azure-vs-github.md).

**Ссылки на результат**

| Объект | Ссылка |
| --- | --- |
| Репозиторий | https://github.com/6MeLex9/unlimited-parts |
| Доска | https://github.com/users/6MeLex9/projects/2 |
| Эпик | https://github.com/6MeLex9/unlimited-parts/issues/1 |
| Feature «Осваиваем дашборды» | https://github.com/6MeLex9/unlimited-parts/issues/2 |
| PBI «…просмотреть новые учебники» | https://github.com/6MeLex9/unlimited-parts/issues/3 |
| Sprint 2 (milestone) | https://github.com/6MeLex9/unlimited-parts/milestone/2 |
| Метки | https://github.com/6MeLex9/unlimited-parts/labels |

---

## 1. Цель и постановка задачи

**Цель:** наполнить рабочую область тестовыми данными и настроить инструменты
гибкого планирования (Scrum) так, чтобы дальнейшие лабораторные работы
выполнялись на готовом тестовом окружении — без трудоёмкого ручного ввода.

Исходная работа состояла из двух частей:

1. **Подготовка тестовых данных** — генерация проекта `Unlimited Parts` из шаблона
   Azure DevOps Demo Generator (код, рабочие элементы, итерации).
2. **Планирование** — команда `PUL-Web`, итерации (Sprint 1–3), иерархия
   Epic → Feature → PBI → Task, доска и отслеживание прогресса.

Обе части воспроизведены в GitHub.

## 2. Подготовка окружения

| Шаг методички | Что сделано |
| --- | --- |
| Шаг 1. .NET 8 SDK | Не требуется: генератор данных написан на Node.js, а модель данных — `src/PartsUnlimited.Models/Models.cs` (C#) |
| Шаг 2. Клонирование `microsoft/AzDevOpsDemoGenerator` | Заменено собственным генератором `tools/generate_seed_data.js` |
| Шаг 3. `dotnet build` / `publish` | Заменено на `node tools/generate_seed_data.js` + `node tools/validate_data.js` |
| Шаг 4. PAT в Azure DevOps | Fine-grained / classic PAT GitHub (права `contents`, `issues`, `project`) |
| Шаг 5–6. `ADOGenerator` → проект из шаблона `Parts Unlimited` | `scripts/provision_github.ps1` (GitHub CLI) + манифест `data/demo-generator/parts-unlimited.json` |

GitHub-репозиторий: **`6MeLex9/unlimited-parts`**, вкладки Issues и Projects включены.

## 3. Тестовые данные (аналог Demo Generator)

Сохранённая выборка из шаблона Parts Unlimited: каталог автозапчастей,
клиенты, заказы и корзина.

| Сущность | Записей | Файл |
| --- | --- | --- |
| Category | 20 (6 корневых + 14 дочерних) | `data/Category.json` |
| Product | 43 (SKU, цена, скидка, остаток) | `data/Product.json` |
| Customer | 40 | `data/Customer.json` |
| Orders | 120 (4 статуса) | `data/Order.json` |
| OrderItem | 301 | `data/OrderItem.json` |
| Cart | 12 | `data/Cart.json` |

Дополнительно: `data/sql/01_schema.sql` (DDL) и `data/sql/02_seed_data.sql`
(INSERT-ы, 526 строк) — тестовое окружение можно поднять в SQL Server.

Валидатор `tools/validate_data.js` проверяет:

- уникальность ключей (`Id`, `Sku`);
- ссылочную целостность (`Product.CategoryId`, `OrderItem.OrderId/ProductId`, `Cart`);
- `Price = ListPrice × (1 − Discount)`, `LineTotal = UnitPrice × Quantity`;
- `Orders.TotalAmount` = сумма позиций;
- глубину иерархии категорий (не больше 2 уровней);
- совпадение количеств с манифестом.

Результат запуска:

```
OK: seed data is consistent
categories 20 | products 43 | customers 40 | orders 120 | orderItems 301 | cartLines 12
```

Генерация детерминирована (seed `20240517`), поэтому данные воспроизводимы.

## 4. Команда и работами (задача 1)

В GitHub «команд» в Azure-смысле нет, роли разделены:

| Аналог в Azure | Реализация в GitHub |
| --- | --- |
| Team `PUL-Web` | репозиторий + метка `area: PUL-Web` (фильтр по команде) |
| Area Path | Label `area: PUL-Web` |
| Iterations (спринты) | **Milestones**: `Sprint 1`, `Sprint 2`, `Sprint 3` (2 недели) |
| Boards | **Projects v2**: `Unlimited Parts Board` |

Вехи созданы с датами: Sprint 1 — завершён, **Sprint 2 — текущий**,
Sprint 3 — запланирован. В Projects v2 доступны поля `Milestone`,
`Sub-issues progress`, `Labels` и поле `Status` (Todo / In Progress / Done).

Метки (аналог типов и областей):

| Метка | Назначение |
| --- | --- |
| `area: PUL-Web` | область / команда |
| `type: epic`, `type: feature`, `type: pbi`, `type: bug` | тип рабочего элемента |
| `priority: 1`, `severity: 2` | приоритет и критичность |

## 5. Рабочие элементы (задача 2)

Создано **14 Issues** с иерархией Epic → Feature → PBI/Bug. Связи оформлены
**двумя способами**: нативная функция *Sub-issues* и упоминание `Part of #N`
в теле.

| # | Тип | Заголовок | Milestone | Состояние |
| --- | --- | --- | --- | --- |
| 1 | Epic | `[EPIC] Обучение продуктам` | — | open |
| 2 | Feature | Осваиваем дашборды | Sprint 2 | open |
| 3 | PBI | Как клиент, я хочу просмотреть новые учебники | Sprint 2 | open |
| 4 | PBI | Как клиент, я хочу видеть новинки на главной странице | Sprint 2 | open |
| 5 | PBI | Как клиент, я хочу добавить товар в корзину | Sprint 2 | open |
| 6 | Bug | Карточка товара не отображает скидку | Sprint 2 | open |
| 7 | Feature | Оформление заказа | Sprint 3 | open |
| 8 | PBI | Как клиент, я хочу оформить заказ | Sprint 3 | open |
| 9 | PBI | Как клиент, я хочу оплатить заказ картой | Sprint 3 | open |
| 10 | PBI | Как клиент, я хочу отслеживать статус заказа | Sprint 3 | open |
| 11 | Feature | Администрирование каталога | Sprint 1 | closed |
| 12 | PBI | Как администратор, я хочу добавить товар в каталог | Sprint 1 | closed |
| 13 | PBI | Как администратор, я хочу скрыть снятый с продажи товар | Sprint 1 | closed |
| 14 | PBI | Как администратор, я хочу управлять категориями каталога | Sprint 1 | closed |

Исходная user story из методички — **#3 «Как клиент, я хочу просмотреть новые
учебники»** — создана и входит в текущий Sprint 2.

Проверка иерархии (GitHub API `GET /repos/6MeLex9/unlimited-parts/issues/1/sub_issues`):

```
SUB-ISSUES of #1: #2 Осваиваем дашборды, #7 Оформление заказа, #11 Администрирование каталога
SUB-ISSUES of #2: #3, #4, #5, #6
```

Тела Issues содержат: user story, условия приёмки (чек-листы), задачи,
порядок проверки на тестовых данных с конкретными SKU и SQL-запросами.

## 6. Доска и отслеживание потока (задача 3)

**Projects v2 → Unlimited Parts Board** (https://github.com/users/6MeLex9/projects/2):

- в проект добавлены все 14 элементов;
- колонки по полю `Status`: **Todo / In Progress / Done**;
- представления: `Board` (по умолчанию — Table), `By Sprint` (Table),
  `Roadmap`;
- проект связан с репозиторием `unlimited-parts`, поэтому карточки issue
  синхронизируются автоматически.

Текущее распределение: Done — 4 (Sprint 1), In Progress — 3 (Epic #1, PBI #5,
Bug #6), Todo — 7.

Аналог переключения видов и фильтров Azure:

| Что хотели увидеть | Фильтр GitHub |
| --- | --- |
| только Features | `label:"type: feature"` |
| только Epics | `label:"type: epic"` |
| задачи текущего спринта | `milestone:"Sprint 2"` |
| только дефекты | `label:"type: bug"` |
| всё по команде | `label:"area: PUL-Web"` |

## 7. Отслеживание прогресса (задача 4)

Вместо дашбордов Azure используются встроенные механизмы GitHub:

1. **Milestones** дают прогресс-бар и дату окончания спринта:

   | Milestone | Открыто | Закрыто | Due |
   | --- | --- | --- | --- |
   | Sprint 1 | 0 | 4 | завершён |
   | Sprint 2 | 5 | 0 | текущий |
   | Sprint 3 | 4 | 0 | запланирован |

2. **Sub-issues прогресс** эпика: в Project v2 поле `Sub-issues progress`
   показывает «N из M» (эпик #1 → 3 feature, feature #2 → 4 элемента).
3. **Charts/Insights** в Projects: группировка по `Status`, `Labels`, `Milestone`.

## 8. Воспроизводимость

```powershell
# 1. данные
node tools/generate_seed_data.js
node tools/validate_data.js

# 2. рабочая область в новом репозитории
$env:GH_TOKEN = "<PAT: contents + issues + administration + project>"
./scripts/provision_github.ps1 -Repo <owner>/<repo>
```

Скрипт `provision_github.ps1` читает манифест `data/demo-generator/parts-unlimited.json`
и создаёт метки, вехи, Issues, Sub-issues и доску — полный аналог шага
«Create a new project using the demo generator project template → 3 | Parts Unlimited»
из исходной методички.

## 9. Выводы

1. Иерархия Azure Boards воспроизводится в GitHub через **Sub-issues** и
   Labels: Epic, Feature, PBI и Bug отличаются метками `type:*`, а
   принадлежность — вложенностью Sub-issues.
2. **Milestones** — практичная замена итерациям Azure: дают даты, прогресс-бар
   и фильтр `milestone:"Sprint 2"`. В Projects v2 поле `Iteration` доступно, но
   не содержит дат, поэтому спринты ведём вехами.
3. Тестовые данные можно полностью воспроизвести из репозитория
   (`tools/` + `data/`), без зависимости от Azure и Demo Generator.
4. Ограничения GitHub, замеченные на практике: нет встроенного импорта рабочих
   элементов из файла (потребовался скрипт provisioning), а права на Projects
   выдаются отдельно от прав на репозиторий.

## 10. Скриншоты для сдачи

Скриншоты не приложены к отчёту (автоматический браузер в среде выполнения
недоступен). Для сдачи достаточно открыть и сфотографировать:

- [ ] `Projects → Unlimited Parts Board` — колонки Todo / In Progress / Done
- [ ] Issue #1 — блок Sub-issues с тремя Feature
- [ ] Issues с фильтром `label:"type: pbi"` — 10 PBI
- [ ] `Issues → Milestones → Sprint 2` — прогресс-бар
- [ ] Issue #3 — тело со user story и условиями приёмки

---

### Приложение: соответствие исходной методичке

| Пункт методички | Выполнено в GitHub |
| --- | --- |
| .NET 8 SDK | не требуется (замена: Node.js для генератора) |
| Клонирование AzDevOpsDemoGenerator | собственный генератор в `tools/` |
| PAT авторизация | PAT GitHub с правами contents/issues/project |
| Шаблон `3 | Parts Unlimited` | манифест `parts-unlimited.json` + `provision_github.ps1` |
| Проект `Unlimited Parts` | репозиторий `unlimited-parts` |
| Epic → Feature → PBI | Issues #1–#14 с Sub-issues |
| Итерации Sprint 1–3 | Milestones с датами |
| Доска и фильтры | Projects v2 + поисковые фильтры |
| Дашборд прогресса | Milestones + Sub-issues progress + GraphQL API |
