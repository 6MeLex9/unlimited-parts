// ЛР 2.2, Задача 4: цвета тегов, теги «данные»/«ux» на истории #3, Story Points,
// и приведение доски к состоянию из шагов 14–24 (две карточки в «Approved QA»).
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/anna3/AppData/Local/Temp/dsh-5Ktose/lbpdf_a68093de621c4105a78cf18bbbb7b5d0';
const REPO = '6MeLex9/unlimited-parts';
const PROJECT_ID = JSON.parse(fs.readFileSync(path.join(DIR, 'project.json'), 'utf8')).id;

function curl(args) {
  return new Promise((resolve) => {
    const id = 'l22' + Date.now() + Math.floor(Math.random() * 1e6);
    const out = path.join(DIR, 'api', id + '.out');
    const full = ['-sS', '-m', '120', '-o', out, '-w', 'STATUS=%{http_code}', '-H', '@' + path.join(DIR, 'hdrs.txt'), '-H', 'Accept: application/vnd.github+json', ...args];
    const p = spawn('C:/Program Files/Git/mingw64/bin/curl.exe', full, { stdio: ['ignore', 'pipe', 'pipe'] });
    let so = '';
    p.stdout.on('data', (d) => (so += d));
    p.on('close', () => resolve({ status: +(so.replace('STATUS=', '').trim()) || 0, body: fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '' }));
  });
}
function withBody(method, apiPath, body) {
  const bf = path.join(DIR, 'api', 'b22_' + Date.now() + Math.floor(Math.random() * 1e6) + '.json');
  fs.writeFileSync(bf, JSON.stringify(body), 'utf8');
  return curl(['-X', method, '-H', 'Content-Type: application/json; charset=utf-8', '--data-binary', '@' + bf, 'https://api.github.com' + apiPath]);
}
function gql(query, variables) {
  const bf = path.join(DIR, 'api', 'g22_' + Date.now() + Math.floor(Math.random() * 1e6) + '.json');
  fs.writeFileSync(bf, JSON.stringify({ query, variables }), 'utf8');
  return curl(['-X', 'POST', '-H', 'Content-Type: application/json; charset=utf-8', '--data-binary', '@' + bf, 'https://api.github.com/graphql'])
    .then((r) => { try { return JSON.parse(r.body); } catch (e) { return {}; } });
}

(async () => {
  // 1. Цвета тегов (Tag colors): «данные» — жёлтый, «ux» — синий
  for (const [name, color, desc] of [
    ['данные', 'FBCA04', 'Тег «данные» (жёлтый, как Tag colors в Azure)'],
    ['ux', '0075CA', 'Тег «ux» — интерфейс/удобство']
  ]) {
    const r = await withBody('PATCH', `/repos/${REPO}/labels/${encodeURIComponent(name)}`, { name, color, description: desc });
    console.log('label', name, r.status);
  }

  // 2. Шаг 8 методички: теги «данные» + «ux» на истории #3
  const cur = JSON.parse((await curl([`https://api.github.com/repos/${REPO}/issues/3`])).body);
  const labels = [...new Set([...(cur.labels || []).map((l) => l.name), 'данные', 'ux'])];
  const upd = await withBody('PATCH', `/repos/${REPO}/issues/3`, { labels });
  console.log('#3 labels ->', labels.join(', '), upd.status);

  // 3. Story Points для Sprint 2 (виджет «Sprint Overview → Efforts»)
  const info = await gql(`query { node(id: "${PROJECT_ID}") { ... on ProjectV2 {
      fields(first: 40) { nodes { ... on ProjectV2FieldCommon { id name } } }
      items(first: 80) { nodes { id content { ... on Issue { number } } } } } } }`);
  const node = info.data.node;
  const items = node.items.nodes.filter((x) => x.content);
  const spField = node.fields.nodes.find((f) => f && f.name === 'Story Points');
  const columnField = node.fields.nodes.find((f) => f && f.name === 'Board Column');
  const columnInfo = await gql(`query { node(id: "${PROJECT_ID}") { ... on ProjectV2 { fields(first: 40) { nodes {
      ... on ProjectV2SingleSelectField { id name options { id name } } } } } } }`);
  const colNode = columnInfo.data.node.fields.nodes.find((f) => f && f.name === 'Board Column');
  const qaOpt = colNode.options.find((o) => o.name === 'Approved QA');

  const setNum = (itemId, fieldId, v) => gql('mutation($p: ID!, $i: ID!, $f: ID!, $v: Float!) { updateProjectV2ItemFieldValue(input: { projectId: $p, itemId: $i, fieldId: $f, value: { number: $v } }) { clientMutationId } }',
    { p: PROJECT_ID, i: itemId, f: fieldId, v });
  const setSel = (itemId, fieldId, optId) => gql('mutation($p: ID!, $i: ID!, $f: ID!, $o: String!) { updateProjectV2ItemFieldValue(input: { projectId: $p, itemId: $i, fieldId: $f, value: { singleSelectOptionId: $o } }) { clientMutationId } }',
    { p: PROJECT_ID, i: itemId, f: fieldId, o: optId });

  const points = { 3: 5, 4: 3, 5: 5, 6: 1, 17: 3, 18: 2 };
  for (const [n, v] of Object.entries(points)) {
    const it = items.find((x) => x.content.number === +n);
    if (!it) continue;
    const r = await setNum(it.id, spField.id, v);
    console.log(`#${n} Story Points = ${v}`, r.errors ? 'ERR' : 'ok');
  }

  // 4. Шаги 14–24: карточка из «Done» переезжает в «Approved QA» (демонстрация WIP)
  const it18 = items.find((x) => x.content.number === 18);
  const r18 = await setSel(it18.id, colNode.id, qaOpt.id);
  console.log('#18 Board Column -> Approved QA', r18.errors ? 'ERR' : 'ok');
})();