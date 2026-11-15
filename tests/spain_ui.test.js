'use strict';
const test = require('node:test');
const assert = require('node:assert');
const U = require('../out/html/spain/spain_ui.js');

test('defeat: a PP absolute majority; a PP + Vox majority alone is not', () => {
  assert.strictEqual(U.noPathToGovernment({ pp: 175 }).lost, false);
  assert.strictEqual(U.noPathToGovernment({ pp: 176 }).lost, true);
  assert.strictEqual(U.noPathToGovernment({ pp: 150, vox: 60 }).lost, false);
  assert.ok(/grand coalition/.test(U.noPathToGovernment({ pp: 150, vox: 60, psoe: 100 }).reason));
  assert.strictEqual(U.noPathToGovernment({ pp: 123 }).lost, false);
});

test('regional control: majority, presidency, junior partner, supply, opposition', () => {
  const UI = require('../out/html/spain/spain_ui.js');
  // Andalucía 2015: PSOE 47 of 109 with Cs supply
  const and = { party: 'psoe', cabinet: ['psoe'], support: ['cs'] };
  const seats = { psoe: 47, pp: 33, up: 15, cs: 9, iu: 5 };
  assert.strictEqual(UI.regionControl(and, seats, 'psoe'), 'president');
  assert.strictEqual(UI.regionControl(and, seats, 'cs'), 'supply');
  assert.strictEqual(UI.regionControl(and, seats, 'pp'), 'none');
  // Galicia: PP absolute majority
  assert.strictEqual(UI.regionControl({ party: 'pp', cabinet: ['pp'], support: [] }, { pp: 41, psoe: 14, bng: 7, up: 13 }, 'pp'), 'majority');
  // Canarias 2015: CC president with the PSOE as junior partner; regionalist bloc holds the presidency
  const can = { party: 'cc', cabinet: ['cc', 'psoe'], support: [] };
  assert.strictEqual(UI.regionControl(can, { cc: 18, psoe: 15, pp: 12 }, 'psoe'), 'junior');
  assert.strictEqual(UI.regionControl(can, { cc: 18, psoe: 15, pp: 12 }, 'regionalist'), 'president');
  // Navarra 2015: IU (I-E) in cabinet counts for IU
  const nav = { party: 'geroa', cabinet: ['geroa', 'up', 'x:I-E'], support: ['bildu'] };
  assert.strictEqual(UI.regionControl(nav, { geroa: 9, upn: 15, bildu: 8, up: 7, psoe: 7, pp: 2, 'x:I-E': 2 }, 'iu'), 'junior');
  assert.strictEqual(UI.regionControl(nav, { geroa: 9, upn: 15, bildu: 8, up: 7, psoe: 7, pp: 2, 'x:I-E': 2 }, 'regionalist'), 'president');
});

test('entities: people and parties are recognised, longest name first', () => {
  const E = require('../out/html/spain/entities.js');
  const re = E.regex();
  const found = s => { re.lastIndex = 0; const out = []; let m; while ((m = re.exec(s))) out.push(m[1]); return out; };
  assert.deepStrictEqual(found('Pedro Sánchez meets Pedro Antonio Sánchez and Rajoy.'), ['Pedro Sánchez', 'Pedro Antonio Sánchez', 'Rajoy']);
  assert.deepStrictEqual(found('The PSOE and the PP; Corbyn\'s Labour.'), ['PSOE', 'PP', 'Corbyn', 'Labour']);
  assert.deepStrictEqual(found('PPE and SPPS are not parties'), []);
  assert.strictEqual(E.lookup('Corbyn').party, 'labour');
  assert.strictEqual(E.lookup('Susana Díaz').party, 'psoe');
  assert.ok(/Regional Leaders/.test(E.lookup('Susana Díaz').wing));
});

test('minor regional lists get readable names', () => {
  const U = require('../out/html/spain/spain_ui.js');
  assert.strictEqual(U.partyName('x:eb_escanos_en_blanco'), 'Escaños en Blanco');
  assert.strictEqual(U.partyName('x:scd_sociedad_civil_y_democracia'), 'Sociedad Civil y Democracia');
  assert.strictEqual(U.partyName('x:cx_g_compromiso_por_galicia'), 'Compromiso por Galicia');
  assert.strictEqual(U.partyName('x:p_c_p_e'), 'PCPE');
  assert.strictEqual(U.shortName('x:I-E'), 'Izquierda-Ezkerra');
  // no raw slugs anywhere in the regional data
  const R = require('../out/html/spain/regional_data.js');
  const bad = new Set();
  for (const r of Object.keys(R.regions)) for (const d of Object.keys(R.regions[r])) for (const dn of Object.keys(R.regions[r][d].districts)) {
    for (const l of R.regions[r][d].districts[dn].lists) { const n = U.partyName(l[0]); if (/_|\?/.test(n)) bad.add(n); }
  }
  assert.deepStrictEqual([...bad], []);
});
