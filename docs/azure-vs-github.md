# Соответствие Azure DevOps → GitHub

Методичка описывает работу в Azure DevOps. В задании разрешено выполнять её в
GitHub, поэтому ниже — таблица, как каждый шаг исходной работы переносится.

| Azure DevOps | GitHub (аналог) | В этой работе |
| --- | --- | --- |
| Organization / Project | Репозиторий (можно в Organization) | `6MeLex9/unlimited-parts` |
| Team `PUL-Web` | Репозиторий + набор collaborators | репозиторий в личном аккаунте (`PUL-Web` указан меткой) |
| Area Path | Label | `area: PUL-Web` |
| Iteration (Sprint 1…3) | **Milestone** (или поле `Iteration` в Project) | Milestones `Sprint 1..3` |
| Epic | Issue + label `type: epic` | Issue #1 `[EPIC] Обучение продуктам` |
| Feature | Issue + label `type: feature`, Sub-issue эпика | Issues #2, #7, #11 |
| Product Backlog Item (User Story) | Issue + label `type: pbi`, Sub-issue Feature | Issues #3–#5, #8–#10, #12–#14 |
| Task | Sub-issue PBI или чек-лист `- [ ]` | чек-листы в теле PBIs |
| Bug | Issue + label `type: bug` | Issue #6 |
| Board / Backlog view | Project (layout `Board` / `Table` / `Roadmap`) | `Unlimited Parts Board` |
| «Work items by State» dashboard | Project → встроенные графики, страница Milestone | прогресс Milestone + Sub-issues прогресс |
| Demo Generator (шаблон Parts Unlimited) | манифест + генератор + скрипт provisioning | `data/demo-generator/parts-unlimited.json`, `tools/`, `scripts/` |

## Особенности GitHub

1. **Иерархия** строится не «из коробки», а через *Sub-issues* (нативная функция)
   либо чек-листы в теле родителя. Здесь используются оба способа.
2. **Спринты**: в Project есть поле `Iteration`, но оно не привязано к датам и не
   показывается вне доски; `Milestone` даёт прогресс-бар и «due date», поэтому
   спринты оформлены Milestones.
3. **Фильтры** вместо переключения видов: `label:"type: feature"`,
   `milestone:"Sprint 2"`, `-label:"type: bug"`, `is:open assignee:@me`.
4. **Импорт тестовых данных**: GitHub не создаёт рабочие элементы из файла, поэтому
   используется `scripts/provision_github.ps1` (GitHub CLI) — аналог
   `ADOGenerator`.
