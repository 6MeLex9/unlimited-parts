// ЛР 2.1, задача 6: заполняет унаследованное поле "PUL Ticket ID" у первого PBI.
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/anna3/AppData/Local/Temp/dsh-5Ktose/lbpdf_a68093de621c4105a78cf18bbbb7b5d0';
const PROJECT_ID = JSON.parse(fs.readFileSync(path.join(DIR, 'project.json'), 'utf8')).id;
const FIELD_ID = 'PVTF_lAHOCZpVsc4BtCNGzhrN-88';

function gql(query, variables) {
  return new Promise((resolve) => {
    const bf = path.join(DIR, 'api', 'tk_' + Date.now() + Math.floor(Math.random() * 1e6) + '.json');
    fs.writeFileSync(bf, JSON.stringify({ query, variables }), 'utf8');
    const out = bf + '.out';
    const p = spawn('C:/Program Files/Git/mingw64/bin/curl.exe',
      ['-sS', '-m', '120', '-o', out, '-H', '@' + path.join(DIR, 'hdrs.txt'),
        '-H', 'Accept: application/vnd.github+json', '-X', 'POST',
        '-H', 'Content-Type: application/json; charset=utf-8', '--data-binary', '@' + bf,
        'https://api.github.com/graphql'], { stdio: ['ignore', 'pipe', 'pipe'] });
    p.on('close', () => { const t = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : ''; try { resolve(JSON.parse(t)); } catch (e) { resolve({ raw: t }); } });
  });
}

(async () => {
  const info = await gql(`query { node(id: "${PROJECT_ID}") { ... on ProjectV2 { items(first: 60) { nodes { id content { ... on Issue { number } } } } } } }`, {});
  const items = info.data.node.items.nodes.filter((x) => x.content);
  const targets = [
    { number: 3, value: 'PUL-1042' },
    { number: 17, value: 'PUL-1043' }
  ];
  for (const t of targets) {
    const it = items.find((x) => x.content.number === t.number);
    if (!it) { console.log('#' + t.number, 'not in project'); continue; }
    const res = await gql('mutation($p: ID!, $i: ID!, $f: ID!, $v: String!) { updateProjectV2ItemFieldValue(input: { projectId: $p, itemId: $i, fieldId: $f, value: { text: $v } }) { clientMutationId } }',
      { p: PROJECT_ID, i: it.id, f: FIELD_ID, v: t.value });
    console.log('#' + t.number, 'Ticket ID =', t.value, res.errors ? 'ERR ' + JSON.stringify(res.errors).slice(0, 200) : 'ok');
  }
})();
