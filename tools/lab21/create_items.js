// ЛР 2.1: создаёт задачи, два PBI, применяет теги/состояния, добавляет их в проект.
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/anna3/AppData/Local/Temp/dsh-5Ktose/lbpdf_a68093de621c4105a78cf18bbbb7b5d0';
const REPO = '6MeLex9/unlimited-parts';
const SRC = path.join(DIR, 'unlimited-parts');
const CURL = 'C:/Program Files/Git/mingw64/bin/curl.exe';
const HDR = path.join(DIR, 'hdrs.txt');

function curl(args) {
  return new Promise((resolve) => {
    const id = 'l21_' + Date.now() + Math.floor(Math.random() * 1e6);
    const out = path.join(DIR, 'api', id + '.out');
    const full = ['-sS', '-m', '120', '-o', out, '-w', 'STATUS=%{http_code}', '-H', '@' + HDR,
      '-H', 'Accept: application/vnd.github+json', ...args];
    const p = spawn(CURL, full, { stdio: ['ignore', 'pipe', 'pipe'] });
    let so = '';
    p.stdout.on('data', (d) => (so += d));
    p.on('close', () => resolve({ status: +(so.replace('STATUS=', '').trim()) || 0, body: fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '' }));
  });
}
function withBody(method, apiPath, body) {
  const bf = path.join(DIR, 'api', 'lb21_' + Date.now() + Math.floor(Math.random() * 1e6) + '.json');
  fs.writeFileSync(bf, JSON.stringify(body), 'utf8');
  return curl(['-X', method, '-H', 'Content-Type: application/json; charset=utf-8', '--data-binary', '@' + bf, 'https://api.github.com' + apiPath]);
}
const j = (r) => { try { return JSON.parse(r.body); } catch (e) { return null; } };

async function main() {
  const existing = j(await curl([`https://api.github.com/repos/${REPO}/issues?state=all&per_page=100`])) || [];
  const byTitle = new Map(existing.map((i) => [i.title, i]));
  const ms = j(await curl([`https://api.github.com/repos/${REPO}/milestones?state=all`])) || [];
  const sprint2 = ms.find((m) => m.title === 'Sprint 2');

  // 1. Метка для задач
  let r = await withBody('POST', `/repos/${REPO}/labels`, { name: 'type: task', color: 'FBCA04', description: 'Задача (Task) — Sub-issue PBI' });
  console.log('label type: task', r.status);

  const workitems = [
    { title: 'Добавить страницу для самых последних учебников', file: 'data/workitems/lab2.1/task-page-latest-books.md', type: 'Task', milestone: true, extra: ['type: task', 'данные'] },
    { title: 'Оптимизация запроса к данным для последних учебников', file: 'data/workitems/lab2.1/task-optimize-query.md', type: 'Task', milestone: true, extra: ['type: task', 'данные', 'ux'] },
    { title: 'Как клиент, я хочу видеть недавно просмотренные учебники', file: 'data/workitems/lab2.1/pbi-recently-viewed.md', type: 'PBI', milestone: true, extra: ['данные'] },
    { title: 'Как клиент, я хочу запросить новые материалы', file: 'data/workitems/lab2.1/pbi-request-materials.md', type: 'PBI', milestone: true, extra: ['ux'] }
  ];

  const created = {};
  for (const wi of workitems) {
    const found = byTitle.get(wi.title);
    if (found) { created[wi.title] = found; console.log('exists #' + found.number, wi.title); continue; }
    const body = fs.readFileSync(path.join(SRC, wi.file), 'utf8');
    const labels = ['area: PUL-Web', wi.type === 'Task' ? 'type: task' : 'type: pbi', ...wi.extra.filter((l) => l !== 'type: task')];
    const payload = { title: wi.title, body, labels };
    if (wi.milestone && sprint2) payload.milestone = sprint2.number;
    const res = withBody('POST', `/repos/${REPO}/issues`, payload);
    const issue = j(await res);
    created[wi.title] = issue;
    console.log(res.status, '#' + (issue && issue.number), wi.title);
  }

  // 2. Sub-issues: задачи → PBI #3, новые PBI → Feature #2
  const pbi3 = existing.find((i) => i.number === 3);
  const feat2 = existing.find((i) => i.number === 2);
  const links = [
    [pbi3, created['Добавить страницу для самых последних учебников']],
    [pbi3, created['Оптимизация запроса к данным для последних учебников']],
    [feat2, created['Как клиент, я хочу видеть недавно просмотренные учебники']],
    [feat2, created['Как клиент, я хочу запросить новые материалы']]
  ];
  for (const [parent, child] of links) {
    if (!parent || !child) { console.log('skip link', parent && parent.number, child && child.number); continue; }
    const res = await withBody('POST', `/repos/${REPO}/issues/${parent.number}/sub_issues`, { sub_issue_id: child.id });
    console.log('sub-issue #' + parent.number, '<-', '#' + child.number, res.status, res.status >= 400 ? res.body.slice(0, 160) : 'ok');
  }

  fs.writeFileSync(path.join(DIR, 'lab21_issues.json'), JSON.stringify(
    Object.fromEntries(Object.entries(created).filter(([, v]) => v).map(([k, v]) => [k, { number: v.number, id: v.id }])), null, 2));
}

main().then(() => process.exit(0)).catch((e) => { console.log('ERR', e.message); process.exit(1); });
