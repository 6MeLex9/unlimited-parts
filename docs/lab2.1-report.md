# Отчёт: ЛР 2.1 — Гибкое планирование и управление портфелем

> Тема 2.1 «Планирование в Azure DevOps». По разрешению преподавателя выполнено
> в **GitHub**; соответствие инструментов — в [`azure-vs-github.md`](azure-vs-github.md),
> пошаговый разбор — в [`lab2.1-guide.md`](lab2.1-guide.md).

**Окружение**

| Объект | Ссылка |
| --- | --- |
| Репозиторий (проект `Unlimited Parts`) | https://github.com/6MeLex9/unlimited-parts |
| Доска (`Unlimited Parts Board`) | https://github.com/users/6MeLex9/projects/2 |
| Epic «Обучение продуктам» | https://github.com/6MeLex9/unlimited-parts/issues/1 |
| Feature «Осваиваем дашборды» | https://github.com/6MeLex9/unlimited-parts/issues/2 |
| PBI с учебниками (первый PBI) | https://github.com/6MeLex9/unlimited-parts/issues/3 |
| Задачи спринта | https://github.com/6MeLex9/unlimited-parts/issues/15 · .../16 |
| Sprint 2 | https://github.com/6MeLex9/unlimited-parts/milestone/2 |

## 1. Постановка

Отработать полный цикл гибкого планирования Scrum: команда и её область,
итерации, создание иерархии рабочих элементов (Epic → Feature → PBI → Task),
состояния на доске, планирование спринта и ёмкости (capacity), настройка
канбан-доски (WIP, дорожки, Definition of Done), панели мониторинга и
наследуемый процесс с дополнительным полем.

## 2. Команда, область, итерации (задача 1)

| Azure | GitHub | Итог |
| --- | --- | --- |
| Team `PUL-Web` | метка `area: PUL-Web` | у всех 18 элементов |
| Iterations | Milestones | `Sprint 1` (прошедший, 4/4 закрыто), `Sprint 2` (текущий), `Sprint 3` (будущий) |
| Areas + Include Sub Areas | метка области + вложенность Sub-issues | область видна всем элементам |

## 3. Рабочие элементы (задача 2)

Создана иерархия, эквивалентная Azure:

```
#1 Epic «Обучение продуктам»
├── #2 Feature «Осваиваем дашборды»
│   ├── #3  PBI  Как клиент, я хочу просмотреть новые учебники
│   │   ├── #15 Task Добавить страницу для самых последних учебников  (8 ч, Development)
│   │   └── #16 Task Оптимизация запроса к данным                     (3 ч, Design)
│   ├── #4  PBI  … видеть новинки на главной странице
│   ├── #5  PBI  … добавить товар в корзину
│   ├── #6  Bug  Карточка товара не отображает скидку
│   ├── #17 PBI  … видеть недавно просмотренные учебники (Approved QA, «Ускоренная»)
│   └── #18 PBI  … запросить новые материалы (Done)
├── #7 Feature «Оформление заказа» …
└── #11 Feature «Администрирование каталога» (Sprint 1, закрыт)
```

Всего 18 рабочих элементов; связи — и нативными **Sub-issues**, и упоминанием
`Part of #N` в теле.

### Состояния на доске (эквивалент New/Approved/Committed/Approved QA/Done)

| Элемент | Board Column | Status | Activity | Remaining Work | Swimlane |
| --- | --- | --- | --- | --- | --- |
| #15 задача | Committed | In Progress | Development | **8** | Default |
| #16 задача | Committed | In Progress | Design | 3 | Default |
| #17 PBI | **Approved QA** | In Progress | — | — | **Ускоренная** |
| #18 PBI | Done | Done | — | — | Default |
| #3 PBI | Committed | In Progress | — | — | Default |
| #5 PBI | Approved | In Progress | — | — | Default |
| #4, #6 | New | Todo | — | — | Default |

## 4. Планирование спринта и ёмкость (задача 3)

Емкость: **1 ч в день × 8 рабочих дней = 8 ч**; отпуск 5 рабочих дней
(`daysOff: 5`).

| Шаг методички | Значение |
| --- | --- |
| 3. две задачи, 8 ч | #16 (3 ч) + #15 (5 ч) |
| 4. назначить себе | `Assignees` у #15 |
| 5. capacity 1 ч/день | `capacity.perDayHours = 1` |
| 6–7. отпуск 5 дней | `daysOff = 5` |
| 11. Remaining 5 → 8 | #15 `Remaining Work = 8` |
| 12. превышение | 11 ч > 8 ч ёмкости, лишние **3 ч** |

Проверка скриптом `scripts/check_wip.ps1`:

```
[OK] колонка 'Approved QA': 1/1
Ёмкость спринта: 1 ч в день × 8 рабочих дн = 8 ч (из них 5 дн отпуск)
Оставшаяся работа у назначенных: 8 ч; всего в спринте: 11 ч
Превышение ёмкости команды (лишние 3 ч).
Лимиты WIP соблюдены; превышение ёмкости зафиксировано (как в методичке, шаг 12).
```

## 5. Канбан-доска (задача 4)

| Настройка Azure | Реализация в GitHub |
| --- | --- |
| Tag colors → «данные» (жёлтый) | метка `данные` на #15, #16, #17 |
| Теги «данные» + «ux/ui» | `данные`, `ux` у #3, #16, #17, #18 |
| Колонка «Approved QA» + WIP = 1 | `Board Column → Approved QA` с лимитом 1 |
| Превышение WIP (красный) | проверка `scripts/check_wip.ps1` → exit 1 |
| Разделение колонки (Doing/Done) | `"split": true` |
| Definition of Done | «Проходит **все** тесты и ревью» |
| Swimlane «Ускоренная» | поле `Swimlane → Ускоренная` у #17 |

Подробности — [`lab2.1-board-rules.md`](lab2.1-board-rules.md).

## 6. Панели мониторинга и запросы (задача 5)

| Azure | GitHub |
| --- | --- |
| Панель «Обучение продукту» | набор сохранённых фильтров-плиток |
| Виджет Sprint Overview (Efforts) | Milestone Sprint 2 + поле `Story Points` |
| Виджет Sprint Capacity | поле `Remaining Work` по исполнителям |
| Термины запроса (Task, Area PUL-Web) | `label:"type: task" label:"area: PUL-Web"` |
| Диаграмма по «Assigned To» | группировка по `Assignees` |

Ссылки и фильтры — в [`lab2.1-dashboards.md`](lab2.1-dashboards.md).

> Ограничение: диаграммы Project v2 (Insights) создаются только интерактивно —
> у GitHub API нет мутации для графиков. Поэтому в отчёте приведены точные
> фильтры и шаги, а не сгенерированное изображение.

## 7. Процесс и поле PUL Ticket ID (задача 6)

Создано поле проекта **`PUL Ticket ID`** (аналог поля в унаследованном процессе
«Мой Scrum»), заполнено:

| Элемент | Ticket ID |
| --- | --- |
| #3 «…просмотреть новые учебники» (первый PBI) | `PUL-1042` |
| #17 «…недавно просмотренные учебники» | `PUL-1043` |

Поля процесса (`Activity`, `Board Column`, `Swimlane`, `Remaining Work`,
`Story Points`) заданы в манифесте `data/demo-generator/lab2.1-board.json` и
создаются в проекте скриптами provisioning. Детали — [`lab2.1-process.md`](lab2.1-process.md).

## 8. Воспроизводимость

```powershell
# 1. рабочие элементы 2.1 (задачи, PBI, связи)
node tools/create_lab2_1_items.js

# 2. поля и значения доски
node tools/configure_lab2_1_board.js

# 3. проверка WIP и ёмкости
./scripts/check_wip.ps1
```

## 9. Выводы

1. В GitHub роль доски Azure выполняет Projects v2: **колонки** моделируются
   полем `Board Column`, **дорожки** — полем `Swimlane`, **activity / Remaining
   Work / Story Points** — отдельными полями проекта.
2. Состояния `New → Approved → Committed → Approved QA → Done` воспроизводятся
   один в один; WIP-лимит не встроен, поэтому реализован проверкой
   (`check_wip.ps1`) с тем же смыслом, что красная подсветка в Azure.
3. Планирование спринта по ёмкости (1 ч × 8 дн, отпуск 5 дн) воспроизведено
   полностью и проверяемо: превышение на 3 ч видно и в отчёте, и в скрипте.
4. Поле «PUL Ticket ID» показало, как в GitHub расширять «процесс»: аналог
   унаследованного процесса — манифест + поля проекта, создаваемые API.

## 10. Что сдавать

- [ ] Доска https://github.com/users/6MeLex9/projects/2 — колонки и дорожки
- [ ] Issue #3 — тело с двумя Sub-issues (задачи #15, #16)
- [ ] Поле `Remaining Work` = 8 у #15, `Activity` = Development/Design
- [ ] Метка `данные` на карточках #15, #16, #17
- [ ] Поле `PUL Ticket ID` = `PUL-1042` у #3
- [ ] Вывод `./scripts/check_wip.ps1`
