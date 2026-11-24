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
| `data/demo-generator/` | Аналог манифеста Azure DevOps Demo Generator (`parts-unlimited.json`) |
| `docs/` | Отчёт по работе, карта соответствия Azure → GitHub, скриншоты |
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
| Иерархия | **Sub-issues** эпик → feature → PBI |

## Отчёт

Полный отчёт по лабораторной работе: [`docs/report.md`](docs/report.md).

## Лицензия

Учебный материал, данные сгенерированы программно, товарные данные — демонстрационные.
