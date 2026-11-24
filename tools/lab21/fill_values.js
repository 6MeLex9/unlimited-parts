// Заполняет поля проекта для ЛР 2.1: Board Column, Activity, Remaining Work, Story Points, Swimlane,
// а также статусы Status для сценария «перетаскивания» карточек.
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/anna3/AppData/Local/Temp/dsh-5Ktose/lbpdf_a68093de621c4105a78cf18bbbb7b5d0';
const REPO = '6MeLex9/unlimited-parts';
const CURL = 'C:/Program Files/Git/mingw64/bin/curl.exe';
const HDR = path.join(DIR, 'hdrs.txt');
const PROJ = JSON.parse(fs.readFileSync(path.join(DIR, 'project.json'), 'utf8'));
const PROJECT_ID = PROJ.id;

function curl(args) {
  return new Promise((resolve) => {
    const id = 'fill' + Date.now() + Math.floor(Math.random() * 1e6);
    const out = path.join(DIR, 'api', id + '.out');
    const full = ['-sS', '-m', '120', '-o', out, '-H', '@' + HDR, '-H', 'Accept: application/vnd.github+json', ...args];
    const p = spawn(CURL, full, { stdio: ['ignore', 'pipe', 'pipe'] });
    p.on('close', () => resolve(fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : ''));
  });
}
function gql(query, variables) {
  const bf = path.join(DIR, 'api', 'fill_' + Date.now() + Math.floor(Math.random() * 1e6) + '.json');
  fs.writeFileSync(bf, JSON.stringify({ query, variables }), 'utf8');
  return curl(['-X', 'POST', '-H', 'Content-Type: application/json; charset=utf-8', '--data-binary', '@' + bf, 'https://api.github.com/graphql'])
    .then((t) => { try { return JSON.parse(t); } catch (e) { return { raw: t }; } });
}

(async () => {
  // 1. Добавить #15..#18 в проект
  const project = await gql(`query { node(id: "${PROJECT_ID}") { ... on ProjectV2 {
      fields(first: 40) { nodes {
        ... on ProjectV2FieldCommon { id name }
        ... on ProjectV2SingleSelectField { id name options { id name } }
      } }
      items(first: 60) { nodes { id content { ... on Issue { number title } } } }
    } } }`);
  const node = project.data.node;
  const fieldByName = {};
  for (const f of node.fields.nodes.filter(Boolean)) fieldByName[f.name] = f;
  const existingItems = node.items.nodes.map((i) => i.content && i.content.number).filter(Boolean);

  const issues = JSON.parse(fs.readFileSync(path.join(DIR, 'lab21_issues.json'), 'utf8'));
  const numbers = Object.values(issues).map((i) => i.number);
  for (const n of numbers) {
    if (existingItems.includes(n)) { console.log('#' + n, 'already in project'); continue; }
    const q = await gql(`query { repository(owner: "6MeLex9", name: "unlimited-parts") { issue(number: ${n}) { id } } }`);
    const contentId = q.data.repository.issue.id;
    const res = await gql('mutation($p: ID!, $c: ID!) { addProjectV2ItemById(input: { projectId: $p, contentId: $c }) { item { id } } }',
      { p: PROJECT_ID, c: contentId });
    console.log('#' + n, res.errors ? 'ERR' : 'added');
  }

  // 2. Перечитать items
  const after = await gql(`query { node(id: "${PROJECT_ID}") { ... on ProjectV2 {
      items(first: 60) { nodes { id content { ... on Issue { number title } } } } } } }`);
  const items = after.data.node.items.nodes.filter((i) => i.content).map((i) => ({ itemId: i.id, number: i.content.number, title: i.content.title }));
  const itemOf = (n) => items.find((i) => i.number === n);

  // 3. Значения полей — как состояния на доске Azure
  const column = fieldByName['Board Column'];
  const activity = fieldByName['Activity'];
  const remaining = fieldByName['Remaining Work'];
  const points = fieldByName['Story Points'];
  const swim = fieldByName['Swimlane'];
  const status = fieldByName['Status'];
  const opt = (field, name) => field.options.find((o) => o.name === name);

  const plans = [
    // задачи: Committed, activity, remaining work
    { n: 15, col: 'Committed', act: 'Development', rem: 8, swim: 'Default', status: 'In Progress' },
    { n: 16, col: 'Committed', act: 'Design', rem: 3, swim: 'Default', status: 'In Progress' },
    { n: 17, col: 'Approved QA', act: null, points: 3, swim: 'Ускоренная', status: 'In Progress' },
    { n: 18, col: 'Done', act: null, points: 2, swim: 'Default', status: 'Done' },
    // исходные элементы: PBI #3, #4, #5, #6 держатся на доске в Sprint 2
    { n: 3, col: 'Committed', status: 'In Progress' },
    { n: 5, col: 'Approved', status: 'In Progress' },
    { n: 4, col: 'New', status: 'Todo' },
    { n: 6, col: 'New', status: 'Todo' },
    { n: 14, col: 'Done', status: 'Done' },
    { n: 13, col: 'Done', status: 'Done' },
    { n: 12, col: 'Done', status: 'Done' },
    { n: 11, col: 'Done', status: 'Done' }
  ];

  async function setSingle(itemId, field, valueName, type) {
    if (!field || !valueName) return;
    const o = opt(field, valueName);
    if (!o) { console.log('  no option', valueName); return; }
    const res = await gql('mutation($p: ID!, $i: ID!, $f: ID!, $o: String!) { updateProjectV2ItemFieldValue(input: { projectId: $p, itemId: $i, fieldId: $f, value: { singleSelectOptionId: $o } }) { clientMutationId } }',
      { p: PROJECT_ID, i: itemId, f: field.id, o: o.id });
    if (res.errors) console.log('  ERR', valueName, JSON.stringify(res.errors).slice(0, 150));
  }
  async function setNumber(itemId, field, value) {
    if (!field || value == null) return;
    const res = await gql('mutation($p: ID!, $i: ID!, $f: ID!, $v: Float!) { updateProjectV2ItemFieldValue(input: { projectId: $p, itemId: $i, fieldId: $f, value: { number: $v } }) { clientMutationId } }',
      { p: PROJECT_ID, i: itemId, f: field.id, v: value });
    if (res.errors) console.log('  ERR number', value, JSON.stringify(res.errors).slice(0, 150));
  }

  for (const p of plans) {
    const it = itemOf(p.n);
    if (!it) { console.log('#' + p.n, 'not in project'); continue; }
    if (p.col) await setSingle(it.itemId, column, p.col);
    if (p.act) await setSingle(it.itemId, activity, p.act);
    if (p.swim) await setSingle(it.itemId, swim, p.swim);
    if (p.status) await setSingle(it.itemId, status, p.status);
    if (p.rem != null) await setNumber(it.itemId, remaining, p.rem);
    if (p.points != null) await setNumber(it.itemId, points, p.points);
    console.log('#' + p.n, 'ok', [p.col, p.act, p.swim, p.status, p.rem, p.points].filter((x) => x != null).join(' / '));
  }
})();
