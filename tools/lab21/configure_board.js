// Настройка Project v2 под ЛР 2.1: поля (Activity, Remaining Work, Story Points, Tag/данные),
// статусы карточек, представления (Taskboard по людям, Backlog, QA-колонка), capacity.
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/anna3/AppData/Local/Temp/dsh-5Ktose/lbpdf_a68093de621c4105a78cf18bbbb7b5d0';
const CURL = 'C:/Program Files/Git/mingw64/bin/curl.exe';
const HDR = path.join(DIR, 'hdrs.txt');
const PROJ = JSON.parse(fs.readFileSync(path.join(DIR, 'project.json'), 'utf8'));
const PROJECT_ID = PROJ.id;

function curl(args) {
  return new Promise((resolve) => {
    const id = 'cfg' + Date.now() + Math.floor(Math.random() * 1e6);
    const out = path.join(DIR, 'api', id + '.out');
    const full = ['-sS', '-m', '120', '-o', out, '-H', '@' + HDR, '-H', 'Accept: application/vnd.github+json', ...args];
    const p = spawn(CURL, full, { stdio: ['ignore', 'pipe', 'pipe'] });
    p.on('close', () => resolve(fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : ''));
  });
}
function gql(query, variables) {
  const bf = path.join(DIR, 'api', 'cfg_' + Date.now() + Math.floor(Math.random() * 1e6) + '.json');
  fs.writeFileSync(bf, JSON.stringify({ query, variables }), 'utf8');
  return curl(['-X', 'POST', '-H', 'Content-Type: application/json; charset=utf-8', '--data-binary', '@' + bf, 'https://api.github.com/graphql'])
    .then((t) => { try { return JSON.parse(t); } catch (e) { return { raw: t }; } });
}

async function ensureField(name, dataType, singleSelectOptions) {
  const info = await gql(`query { node(id: "${PROJECT_ID}") { ... on ProjectV2 { fields(first: 40) { nodes { ... on ProjectV2FieldCommon { id name dataType } } } } } }`);
  const nodes = info.data.node.fields.nodes.filter(Boolean);
  const found = nodes.find((f) => f.name === name);
  if (found) { console.log('field exists', name, found.id); return found.id; }
  let q, vars;
  if (singleSelectOptions) {
    q = 'mutation($p: ID!, $n: String!, $o: [ProjectV2SingleSelectFieldOptionInput!]) { createProjectV2Field(input: { projectId: $p, name: $n, dataType: SINGLE_SELECT, singleSelectOptions: $o }) { projectV2Field { ... on ProjectV2SingleSelectField { id name } } } }';
    vars = { p: PROJECT_ID, n: name, o: singleSelectOptions };
  } else {
    const dt = dataType === 'NUMBER' ? 'NUMBER' : 'TEXT';
    q = `mutation($p: ID!, $n: String!) { createProjectV2Field(input: { projectId: $p, name: $n, dataType: ${dt} }) { projectV2Field { ... on ProjectV2FieldCommon { id name } } } }`;
    vars = { p: PROJECT_ID, n: name };
  }
  const res = await gql(q, vars);
  if (res.errors) { console.log('field ERR', name, JSON.stringify(res.errors).slice(0, 300)); return null; }
  const id = res.data.createProjectV2Field.projectV2Field.id;
  console.log('field created', name, id);
  return id;
}

(async () => {
  await ensureField('Activity', 'SINGLE_SELECT', [
    { name: 'Development', color: 'GREEN', description: 'Разработка' },
    { name: 'Design', color: 'PURPLE', description: 'Дизайн' },
    { name: 'Testing', color: 'ORANGE', description: 'Тестирование' },
    { name: 'Documentation', color: 'GRAY', description: 'Документация' }
  ]);
  await ensureField('Remaining Work', 'NUMBER');
  await ensureField('Story Points', 'NUMBER');
  await ensureField('Board Column', 'SINGLE_SELECT', [
    { name: 'New', color: 'GRAY', description: 'Новая работа' },
    { name: 'Approved', color: 'BLUE', description: 'Утверждено' },
    { name: 'Committed', color: 'YELLOW', description: 'Кодирование завершено' },
    { name: 'Approved QA', color: 'PURPLE', description: 'Утверждено QA (WIP = 1)' },
    { name: 'Done', color: 'GREEN', description: 'Готово' }
  ]);
  await ensureField('Swimlane', 'SINGLE_SELECT', [
    { name: 'Default', color: 'GRAY', description: 'Обычный поток' },
    { name: 'Ускоренная', color: 'RED', description: 'Приоритетная дорожка' }
  ]);

  const finalInfo = await gql(`query { node(id: "${PROJECT_ID}") { ... on ProjectV2 { fields(first: 40) { nodes { ... on ProjectV2FieldCommon { id name dataType } } } views(first: 20) { nodes { id name layout } } } } }`);
  const fields = finalInfo.data.node.fields.nodes.filter(Boolean);
  const views = finalInfo.data.node.views.nodes;
  console.log('fields:', fields.map((f) => f.name).join(' | '));
  console.log('views:', views.map((v) => v.name + ':' + v.layout).join(' | '));

  for (const [name, layout] of [['Taskboard', 'BOARD_LAYOUT'], ['Backlog', 'TABLE_LAYOUT']]) {
    if (views.find((v) => v.name === name)) { console.log('view exists', name); continue; }
    const res = await gql('mutation($p: ID!, $n: String!, $l: ProjectV2ViewLayout!) { createProjectV2View(input: { projectId: $p, name: $n, layout: $l }) { projectV2View { id name } } }',
      { p: PROJECT_ID, n: name, l: layout });
    console.log('view', name, res.errors ? 'ERR ' + JSON.stringify(res.errors).slice(0, 200) : 'created');
  }
  fs.writeFileSync(path.join(DIR, 'project_fields.json'), JSON.stringify(fields, null, 2));
})();
