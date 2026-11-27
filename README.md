# Unlimited Parts — тестовые данные и гибкое планирование (GitHub-версия)

Репозиторий содержит «тестовое окружение» для лабораторных работ по программной инженерии:
набор данных магазина автозапчастей **Parts Unlimited** (продукты, категории, заказы, корзина)
и рабочую область гибкого планирования в **GitHub** — Issues, Sub-issues, Labels,
Milestones (спринты), доска **Projects** и панель мониторинга.

> Исходные методички предполагают Azure DevOps + *Azure DevOps Services Demo Generator*
> (шаблон `Parts Unlimited`). В этом репозитории Azure заменён на GitHub:
> `Organization/Project` → репозиторий, `Area Path` → Labels, `Iteration` → Milestones,
> `Epic/Feature/PBI/Task` → Issue + Sub-issues, `Boards` → Project v2,
> `Dashboard` → сгенерированная панель, `Process` → конфигурация + поля проекта.

## Лабораторные работы

| ЛР | Тема | Отчёт |
| --- | --- | --- |
| **2.0** | Подготовка тестовых данных (Demo Generator) | [`docs/report.md`](docs/report.md) |
| **2.1** | Планирование: команда, области, итерации, рабочие элементы, спринт и ёмкость (Задачи 1–3) | [`отчёт`](docs/lab2.1-report.md) · [`пошагово`](docs/lab2.1-guide.md) |
| **2.2** | Канбан-доска, панели мониторинга, процесс (Задачи 4–6) | [`отчёт`](docs/lab2.2-report.md) · [`пошагово`](docs/lab2.2-guide.md) · [`канбан`](docs/lab2.2-kanban.md) · [`панель`](docs/lab2.2-dashboard.md) · [`запросы`](docs/lab2.2-queries.md) · [`процесс`](docs/lab2.2-process.md) |

## Что внутри

| Путь | Назначение |
| --- | --- |
| `data/Product.json` | Каталог товаров (как в демо-данных Parts Unlimited) |
| `data/Category.json` | Категории каталога |
| `data/Customer.json` | Клиенты |
| `data/Order*.json`, `data/Cart.json` | Заказы, позиции заказов, корзина |
| `data/sql/*.sql` | Те же данные в виде DDL/INSERT для SQL Server / SQLite |
| `data/workitems/` | Тексты рабочих элементов (Epic → Feature → PBI → Task → Bug) |
| `data/demo-generator/parts-unlimited.json` | Манифест шаблона (аналог Demo Generator) |
| `data/demo-generator/board-config.json` | Конфигурация доски: колонки, WIP, дорожки, стили, теги, ёмкость, процесс |
| `data/lab2.2-board-state*.json` | Снимки доски «до» и «после» перемещений (для проверки WIP) |
| `tools/lab21/` | Автоматизация ЛР 2.1: задачи, поля доски, значения |
| `tools/lab22/generate_dashboard.js` | Генератор панели мониторинга (SVG + markdown) |
| `scripts/check_wip.ps1` | Проверка WIP-лимита «Approved QA» и ёмкости спринта |
| `scripts/provision_github.ps1` | Развёртывание рабочей области в новом репозитории |
| `src/` | Минимальная модель данных (C#), совпадающая со схемой JSON/SQL |

## Быстрый старт

```powershell
# 1. Проверить тестовые данные
node tools/validate_data.js

# 2. Проверить WIP и ёмкость спринта
./scripts/check_wip.ps1

# 3. Пересобрать панель мониторинга
node tools/lab22/generate_dashboard.js
```

## Рабочая область планирования

| Что | Где |
| --- | --- |
| Доска | Tab **Projects** → [`Unlimited Parts Board`](https://github.com/users/6MeLex9/projects/2) |
| Спринты | **Milestones**: `Sprint 1`, `Sprint 2`, `Sprint 3` |
| Область (аналог Area Path) | Label `area: PUL-Web` |
| Типы рабочих элементов | Labels `type: epic`, `type: feature`, `type: pbi`, `type: task`, `type: bug` |
| Теги доски | Labels `данные` (жёлтый), `ux` (синий) |
| Иерархия | **Sub-issues** эпик → feature → PBI → task |
| Поля доски | `Board Column`, `Swimlane`, `Activity`, `Remaining Work`, `Story Points`, `PUL Ticket ID` |

Колонки доски: `New → Approved → Committed → Approved QA (WIP = 1) → Done`.

## Лицензия

Учебный материал, данные сгенерированы программно, товарные данные — демонстрационные.