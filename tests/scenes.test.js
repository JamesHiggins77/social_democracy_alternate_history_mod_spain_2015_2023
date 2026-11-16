'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// every "- @option" and "go-to:" must point to a section or scene that exists
test('scene options and go-to targets all exist', () => {
  const files = [];
  const walk = d => fs.readdirSync(d).forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.scene.dry')) files.push(p);
  });
  walk(path.join(__dirname, '..', 'source', 'scenes'));
  const scenes = {};
  files.forEach(f => {
    const s = fs.readFileSync(f, 'utf8');
    scenes[path.basename(f, '.scene.dry')] = { f, s, secs: new Set([...s.matchAll(/^@([a-zA-Z_0-9]+)\s*$/gm)].map(m => m[1])) };
  });
  const bad = [];
  const check = (sc, t) => {
    if (t === 'backSpecialScene') return;
    if (t.includes('.')) { const [a, b] = t.split('.'); if (!(scenes[a] && scenes[a].secs.has(b))) bad.push(sc.f + ': ' + t); }
    else if (!sc.secs.has(t) && !scenes[t]) bad.push(sc.f + ': ' + t);
  };
  Object.values(scenes).forEach(sc => {
    for (const m of sc.s.matchAll(/^- @([^:\s]+)/gm)) check(sc, m[1]);
    for (const m of sc.s.matchAll(/^go-to: (.*)$/gm)) {
      m[1].split(';').map(x => x.trim().split(' if ')[0].trim()).filter(Boolean).forEach(t => check(sc, t));
    }
  });
  assert.deepStrictEqual(bad, []);
});
