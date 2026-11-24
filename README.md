# Unlimited Parts — тестовые данные и гибкое планирование (GitHub-версия)

Репозиторий содержит «тестовое окружение» для лабораторных работ по программной инженерии:
набор данных магазина автозапчастей **Parts Unlimited** (продукты, категории, заказы, корзина)
и рабочую область гибкого планирования в **GitHub** — Issues, Sub-issues, Labels,
Milestones (спринты) и доска **Projects**.

> Исходная методичка предполагает Azure DevOps + *Azure DevOps Services Demo Generator*
> (шаблон `Parts Unlimited`). В этом репозитории Azure заменён на GitHub:
> `Organization/Project` → репозиторий, `Area Path` → Labels, `Iteration` → Milestones,
> `Epic/Feature/PBI/Task` → Issue + Sub-issues.

## Что внутри

| Путь | Назначение |
| --- | --- |
| `data/Product.json` | Каталог товаров (как в демо-данных Parts Unlimited) |
| `data/Category.json` | Категории каталога |
| `data/Customer.json` | Клиенты |
| `data/Order*.json`, `data/Cart.json` | Заказы, позиции заказов, корзина |
| `data/sql/*.sql` | Те же данные в виде DDL/INSERT для SQL Server / SQLite |
| `data/workitems/*.md` | Готовые тексты рабочих элементов (Epic → Feature → PBI → Bug) |
| `data/demo-generator/` | Аналог манифеста Azure DevOps Demo Generator (`parts-unlimited.json`), правила доски ЛР 2.1 (`lab2.1-board.json`) |
| `tools/lab21/` | Автоматизация ЛР 2.1: задачи, поля доски, состояние, поле `PUL Ticket ID` |
| `scripts/check_wip.ps1` | Проверка WIP-лимита «Approved QA» и ёмкости спринта |
| `docs/` | Отчёты по работам, карта соответствия Azure → GitHub |
| `src/` | Минимальная модель данных (C#), совпадающая со схемой JSON/SQL |

## Быстрый старт (как в демо-генераторе, только без Azure)

```powershell
# 1. Проверить, что данные валидны
python tools/validate_data.py

# 2. Посмотреть доску и спринты
#    Projects → Unlimited Parts Board
#    Issues → Milestones → Sprint 2
```

## Рабочая область планирования

| Что | Где |
| --- | --- |
| Доска (Эпики / Features / PBIs) | Tab **Projects** → `Unlimited Parts Board` |
| Спринты | **Milestones**: `Sprint 1`, `Sprint 2`, `Sprint 3` |
| Область (аналог Area Path) | Label `area: PUL-Web` |
| Типы рабочих элементов | Labels `type: epic`, `type: feature`, `type: pbi`, `type: bug` |
| Иерархия | **Sub-issues** эпик → feature → PBI → task |
| Поля доски ЛР 2.1 | `Board Column`, `Swimlane`, `Activity`, `Remaining Work`, `Story Points`, `PUL Ticket ID` |

## Лабораторные работы

| ЛР | Тема | Отчёт |
| --- | --- | --- |
| 2.0 | Подготовка тестовых данных | [`docs/report.md`](docs/report.md) |
| 2.1 | Гибкое планирование и управление портфелем | [`docs/lab2.1-report.md`](docs/lab2.1-report.md) · [`guide`](docs/lab2.1-guide.md) · [`board rules`](docs/lab2.1-board-rules.md) · [`dashboards`](docs/lab2.1-dashboards.md) · [`process`](docs/lab2.1-process.md) |

## Отчёт

Полный отчёт по лабораторной работе: [`docs/report.md`](docs/report.md).

## Лицензия

Учебный материал, данные сгенерированы программно, товарные данные — демонстрационные.
