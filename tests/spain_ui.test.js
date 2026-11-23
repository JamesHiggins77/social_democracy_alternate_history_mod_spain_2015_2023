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
  assert.ok(/Regional Barons/.test(E.lookup('Susana Díaz').wing));
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

test('party cards: a full sentence and the current leader with their faction', () => {
  const E = require('../out/html/spain/entities.js');
  assert.ok(/^The Partido Socialista Obrero Español \(en: Spanish Socialist Workers' Party\) is a social-democratic party in Spain, /.test(E.partySentence('psoe')));
  assert.ok(/^Podemos \(en: We Can\) is a left-wing populist party/.test(E.partySentence('up')));
  assert.strictEqual(E.currentLeader('pp', { year: 2019, pp_leader: 'Pablo Casado' }).name, 'Pablo Casado');
  assert.ok(/Regional Barons/.test(E.currentLeader('psoe', { year: 2018, sanchez_leader: 0, psoe_leader: 'Susana Díaz' }).wing));
  assert.strictEqual(E.currentLeader('iu', { year: 2015, month: 3 }).name, 'Cayo Lara');
  for (const id of Object.keys(require('../out/html/spain/spain_ui.js').PARTIES.reduce((a, p) => (a[p[0]] = 1, a), {}))) {
    const sentence = E.partySentence(id);
    if (sentence) assert.ok(!/ \.|,,|The The/.test(sentence), sentence);
  }
});

test('foreign sister parties are told apart from Spanish ones', () => {
  const E = require('../out/html/spain/entities.js');
  const re = E.regex();
  const found = s => { re.lastIndex = 0; const out = []; let m; while ((m = re.exec(s))) out.push(E.lookup(m[1]).party); return out; };
  assert.deepStrictEqual(found('The Portuguese Socialists under António Costa'), ['psportugal', 'psportugal']);
  assert.deepStrictEqual(found('The Danish Social Democrats under Mette Frederiksen'), ['dksd', 'dksd']);
  assert.deepStrictEqual(found('The Swedish Social Democrats under Stefan Löfven'), ['sap', 'sap']);
  assert.deepStrictEqual(found('The US Democrats: Barack Obama'), ['usdem', 'usdem']);
  assert.deepStrictEqual(found('British Labour under Jeremy Corbyn'), ['labour', 'labour']);
});

test('majority arrangements: 2019 left bloc passes on the second ballot; parties without seats are left out', () => {
  const U = require('../out/html/spain/spain_ui.js');
  const nov2019 = { psoe: 120, pp: 89, vox: 52, up: 35, erc: 13, cs: 10, junts: 8, pnv: 6, bildu: 5, mp: 3, cup: 2, cc: 2, upn: 2, bng: 1, prc: 1, te: 1 };
  const left = U.arrangements(nov2019).find(a => a.yesIds[0] === 'psoe' && a.abstIds.includes('erc'));
  assert.strictEqual(left.first, false);
  assert.strictEqual(left.second, true);
  const dec2015 = { pp: 123, psoe: 90, up: 69, cs: 40, erc: 9, junts: 8, pnv: 6, iu: 2, bildu: 2, cc: 1 };
  const all = U.arrangements(dec2015);
  assert.ok(!all.some(a => a.yesIds.includes('vox')), 'no Vox arrangements without Vox seats');
  assert.ok(!all.some(a => a.yesIds.includes('mp') || a.yesIds.includes('upn')));
  assert.ok(/Paths to a majority/.test(U.arrangementsHtml(dec2015)));
});

test('Spanish Wikipedia is the fallback where there is no English page', () => {
  const E = require('../out/html/spain/entities.js');
  assert.ok(/^https:\/\/es\.wikipedia\.org\/wiki\/Pepe_%C3%81lvarez$/.test(E.wikiUrl(E.lookup('Pepe Álvarez').wiki)));
  assert.ok(/^https:\/\/en\.wikipedia\.org\//.test(E.wikiUrl(E.lookup('Susana Díaz').wiki)));
  assert.ok(/Spanish Wikipedia/.test(E.cardHtml('Pepe Álvarez', true)));
  assert.strictEqual(E.lookup('Nadia Calviño').party, 'nonpartisan');
});

test('regional control: a party without seats is shown as absent, not in opposition', () => {
  const U = require('../out/html/spain/spain_ui.js');
  const gal = { party: 'pp', cabinet: ['pp'], support: [] };
  assert.strictEqual(U.regionControl(gal, { pp: 41, psoe: 14, bng: 7, up: 13 }, 'psoe'), 'none');
  assert.strictEqual(U.regionControl(gal, { pp: 41, psoe: 14, bng: 7, up: 13 }, 'vox'), 'absent');
  assert.strictEqual(U.regionControl(gal, { pp: 41, psoe: 14, bng: 7, up: 13 }, 'cs'), 'absent');
});

test('regional affiliates: the PSC in Catalonia, PSOE-A in Andalusia, the Comuns after 2017', () => {
  const U = require('../out/html/spain/spain_ui.js');
  assert.strictEqual(U.regionalShort('psoe', 'Cataluña', 2016), 'PSC');
  assert.strictEqual(U.regionalShort('psoe', 'Andalucía', 2016), 'PSOE-A');
  assert.strictEqual(U.regionalShort('up', 'Cataluña', 2015), 'CSQP');
  assert.strictEqual(U.regionalShort('up', 'Cataluña', 2019), 'Comuns');
  assert.strictEqual(U.regionalShort('vox', 'Madrid', 2019), U.shortName('vox'));
  assert.ok(/PSC/.test(U.resultsTable({ psoe: 17, cs: 36 }, null, { compact: true, region: 'Cataluña', year: 2017 })));
});

test('people cards never mention posts the game has not reached', () => {
  const E = require('../out/html/spain/entities.js');
  const G = require('../out/html/spain/game_state.js');
  const Q = { no_mood: 1 }; G.newGame(Q, 0); Q.year = 2014; Q.month = 7; G.recalculate(Q);
  global.SpainGame = G;
  const yd = E.currentPosts(Q, 'Yolanda Díaz', 'up').role;
  assert.ok(!/Minister|Leader/.test(yd), yd);
  assert.ok(!/Secretary of Organisation/.test(E.currentPosts(Q, 'José Luis Ábalos', 'psoe').role));
  Q.year = 2018; Q.month = 1;
  assert.ok(/Secretary of Organisation/.test(E.currentPosts(Q, 'José Luis Ábalos', 'psoe').role));
  assert.ok(/Former president of Catalonia/.test(E.currentPosts(Q, 'Carles Puigdemont', 'junts').role));
});
