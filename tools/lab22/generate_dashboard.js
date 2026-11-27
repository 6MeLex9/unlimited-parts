// ЛР 2.2, Задача 5: генерирует «панель мониторинга» из состояния доски.
// Аналог Azure Dashboards: Sprint Overview (Efforts), Sprint Capacity, диаграмма по исполнителям.
// Вход: data/lab2.2-board-state.json  →  Выход: docs/img/dashboard-lab2.2.svg + docs/lab2.2-dashboard.md
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const STATE = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'lab2.2-board-state.json'), 'utf8'));
const BOARD = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'demo-generator', 'board-config.json'), 'utf8'));

const sprint = 'Sprint 2';
const items = STATE.items.filter((i) => i.milestone === sprint);
const isAssigned = (i) => (i.assignees && i.assignees.length > 0) || i.assigned === true;
const cap = BOARD.boardRules.capacity;
const available = cap.perDayHours * cap.sprintDays;
const assignedWork = items.filter((i) => isAssigned(i) && i.remainingWork > 0).reduce((s, i) => s + i.remainingWork, 0);
const totalWork = items.reduce((s, i) => s + (i.remainingWork || 0), 0);
const totalPoints = items.reduce((s, i) => s + (i.storyPoints || 0), 0);

const columns = BOARD.boardRules.columns.map((c) => c.name);
const byColumn = columns.map((name) => ({
  name,
  count: items.filter((i) => i.boardColumn === name).length,
  points: items.filter((i) => i.boardColumn === name).reduce((s, i) => s + (i.storyPoints || 0), 0),
  wip: (BOARD.boardRules.columns.find((c) => c.name === name) || {}).wipLimit || 0
}));

const byAssignee = {};
for (const i of items) {
  const who = i.assignees && i.assignees.length ? i.assignees[0] : 'Не назначено';
  byAssignee[who] = (byAssignee[who] || 0) + 1;
}

// ------------------------------- SVG -------------------------------
const W = 1100, H = 660;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const parts = [];
const push = (s) => parts.push(s);

push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Segoe UI, Arial, sans-serif">`);
push(`<rect width="${W}" height="${H}" fill="#f6f8fa"/>`);
push(`<text x="32" y="46" font-size="26" font-weight="600" fill="#24292f">Обучение продукту — панель мониторинга</text>`);
push(`<text x="32" y="72" font-size="14" fill="#57606a">Аналог Azure Dashboards для команды PUL-Web · ${esc(sprint)} · сгенерировано tools/lab22/generate_dashboard.js</text>`);

// --- Виджет 1: Sprint Overview (Efforts)
const wx = 32, wy = 96, ww = 500, wh = 250;
push(`<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="8" fill="#ffffff" stroke="#d0d7de"/>`);
push(`<text x="${wx + 18}" y="${wy + 30}" font-size="16" font-weight="600" fill="#24292f">Обзор спринта — по оценкам (Efforts)</text>`);
push(`<text x="${wx + 18}" y="${wy + 50}" font-size="12" fill="#57606a">Рабочих элементов: ${items.length} · сумма Story Points: ${totalPoints}</text>`);

const maxPts = Math.max(1, ...byColumn.map((c) => c.points));
const barX = wx + 130, barY0 = wy + 70, barH = 20, gap = 12;
byColumn.forEach((c, idx) => {
  const y = barY0 + idx * (barH + gap);
  const w = Math.round((c.points / maxPts) * 250) || 2;
  const over = c.wip && c.count > c.wip;
  push(`<text x="${wx + 18}" y="${y + 14}" font-size="12" fill="#24292f">${esc(c.name)}</text>`);
  push(`<rect x="${barX}" y="${y}" width="${w}" height="${barH}" rx="3" fill="${over ? '#cf222e' : '#2da44e'}"/>`);
  push(`<text x="${barX + w + 8}" y="${y + 14}" font-size="12" fill="#57606a">${c.points} SP · ${c.count} эл.${c.wip ? ' · WIP ' + c.wip : ''}</text>`);
});
push(`<text x="${wx + 18}" y="${wy + wh - 14}" font-size="11" fill="#57606a">Красный — превышен WIP-лимит колонки</text>`);

// --- Виджет 2: Sprint Capacity
const cx = 556, cy = wy, cw = 512, chh = 250;
push(`<rect x="${cx}" y="${cy}" width="${cw}" height="${chh}" rx="8" fill="#ffffff" stroke="#d0d7de"/>`);
push(`<text x="${cx + 18}" y="${cy + 30}" font-size="16" font-weight="600" fill="#24292f">Ёмкость спринта (Capacity)</text>`);
push(`<text x="${cx + 18}" y="${cy + 50}" font-size="12" fill="#57606a">${cap.perDayHours} ч/день × ${cap.sprintDays} раб. дн = ${available} ч · отпуск ${cap.daysOff} дн</text>`);

const scale = 300 / Math.max(available, totalWork, 1);
const rowsCap = [
  { label: 'Доступно', value: available, color: '#2da44e' },
  { label: 'Назначено', value: assignedWork, color: assignedWork > available ? '#cf222e' : '#0969da' },
  { label: 'Всего в спринте', value: totalWork, color: totalWork > available ? '#cf222e' : '#2da44e' }
];
rowsCap.forEach((r, idx) => {
  const y = cy + 80 + idx * 46;
  const w = Math.max(2, Math.round(r.value * scale));
  push(`<text x="${cx + 18}" y="${y + 16}" font-size="12" fill="#24292f">${r.label}</text>`);
  push(`<rect x="${cx + 150}" y="${y}" width="${w}" height="22" rx="3" fill="${r.color}"/>`);
  push(`<text x="${cx + 150 + w + 8}" y="${y + 16}" font-size="12" font-weight="600" fill="#57606a">${r.value} ч</text>`);
});
const excess = Math.max(0, totalWork - available);
push(`<text x="${cx + 18}" y="${cy + chh - 16}" font-size="12" fill="${excess ? '#cf222e' : '#2da44e'}">${excess ? 'Превышение ёмкости команды: ' + excess + ' ч' : 'Ёмкость соблюдена'}</text>`);

// --- Виджет 3: Веб-задачи по назначению
const dx = 32, dy = 366, dw = 1036, dh = 262;
push(`<rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" rx="8" fill="#ffffff" stroke="#d0d7de"/>`);
push(`<text x="${dx + 18}" y="${dy + 30}" font-size="16" font-weight="600" fill="#24292f">Веб-задачи — по назначению</text>`);
push(`<text x="${dx + 18}" y="${dy + 50}" font-size="12" fill="#57606a">Запрос: label:"type: task" label:"area: PUL-Web" · группировка по Assigned To</text>`);

const entries = Object.entries(byAssignee).filter(([, v]) => v > 0);
const maxA = Math.max(1, ...entries.map(([, v]) => v));
entries.forEach(([who, v], idx) => {
  const y = dy + 76 + idx * 30;
  const w = Math.round((v / maxA) * 420) || 2;
  push(`<text x="${dx + 18}" y="${y + 15}" font-size="12" fill="#24292f">${esc(who)}</text>`);
  push(`<rect x="${dx + 200}" y="${y}" width="${w}" height="20" rx="3" fill="#8250df"/>`);
  push(`<text x="${dx + 200 + w + 8}" y="${y + 15}" font-size="12" fill="#57606a">${v}</text>`);
});
push(`</svg>`);

const outDir = path.join(ROOT, 'docs', 'img');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'dashboard-lab2.2.svg'), parts.join('\n'), 'utf8');

// ------------------------------- Markdown -------------------------------
const md = [];
md.push('# Панель мониторинга «Обучение продукту» (ЛР 2.2, Задача 5)');
md.push('');
md.push('Сгенерирована из текущего состояния доски скриптом `tools/lab22/generate_dashboard.js`.');
md.push('Виджеты повторяют плитки Azure Dashboards: **Sprint Overview** (по оценкам), **Sprint Capacity**');
md.push('и диаграмму запроса «Веб-задачи» по исполнителю.');
md.push('');
md.push('![Панель мониторинга](img/dashboard-lab2.2.svg)');
md.push('');
md.push('## Данные, попавшие на панель');
md.push('');
md.push('| Показатель | Значение |');
md.push('| --- | --- |');
md.push(`| Спринт | ${sprint} |`);
md.push(`| Рабочих элементов в спринте | ${items.length} |`);
md.push(`| Сумма Story Points | ${totalPoints} |`);
md.push(`| Ёмкость (${cap.perDayHours} ч × ${cap.sprintDays} дн) | ${available} ч |`);
md.push(`| Назначенная оставшаяся работа | ${assignedWork} ч |`);
md.push(`| Всего оставшейся работы в спринте | ${totalWork} ч |`);
md.push(`| Превышение ёмкости | ${excess} ч |`);
md.push('');
md.push('## Распределение по колонкам');
md.push('');
md.push('| Колонка | Элементов | Story Points | WIP-лимит | Состояние |');
md.push('| --- | --- | --- | --- | --- |');
for (const c of byColumn) {
  const over = c.wip && c.count > c.wip;
  md.push(`| ${c.name} | ${c.count} | ${c.points} | ${c.wip || '—'} | ${over ? '**превышен**' : 'ок'} |`);
}
md.push('');
md.push('## Распределение по исполнителям');
md.push('');
md.push('| Кому назначено | Задач |');
md.push('| --- | --- |');
for (const [who, v] of entries) md.push(`| ${who} | ${v} |`);
md.push('');
md.push('## Как это соотносится с Azure');
md.push('');
md.push('| Виджет Azure | Реализация |');
md.push('| --- | --- |');
md.push('| Sprint Overview (режим Efforts) | поле `Story Points` + разбивка по `Board Column` |');
md.push('| Sprint Capacity | `Remaining Work` против ёмкости из `lab2.1-board.json` |');
md.push('| Query «Веб-задачи» → Diagram (Assigned To) | фильтр `label:"type: task"` + группировка по `Assignees` |');
md.push('');
md.push('> Диаграммы Project v2 (Insights) создаются только в браузере; здесь панель');
md.push('> сгенерирована из тех же данных, что видны на доске, поэтому её можно');
md.push('> перегенерировать в любой момент одной командой.');
md.push('');

fs.writeFileSync(path.join(ROOT, 'docs', 'lab2.2-dashboard.md'), md.join('\n'), 'utf8');

console.log(JSON.stringify({ items: items.length, totalPoints, available, assignedWork, totalWork, excess, byAssignee }, null, 2));