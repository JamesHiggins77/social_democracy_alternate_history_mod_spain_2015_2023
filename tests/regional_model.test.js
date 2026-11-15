'use strict';
const test = require('node:test');
const assert = require('node:assert');
const V = require('../out/html/spain/vote_model.js');
const DATA = require('../out/html/spain/election_data.js');
const RD = require('../out/html/spain/regional_data.js');
const RM = require('../out/html/spain/regional_model.js');

const base = V.buildBaseline(DATA, V.initialState());
const start = RM.startingParliaments(RD);
// Baselines the swing model cannot rebuild exactly (see regional_rules.test.js).
const EXPECTED_DIFF = {
  'Aragón': 'last seat margin 35-55 votes',
  'Región de Murcia': 'baseline was elected under the old five-district system',
  'País Vasco': 'source merges two IU-family lists in 2012',
};

test('every community has a starting parliament and government', () => {
  assert.strictEqual(Object.keys(start).length, 17);
  for (const [r, s] of Object.entries(start)) {
    assert.ok(s.government && s.government.president, r);
    assert.ok(Object.keys(s.seats).length > 1, r);
  }
  assert.strictEqual(start['Galicia'].lastElection, '2012-10-21');
  assert.strictEqual(start['Cataluña'].lastElection, '2015-09-27');
  assert.strictEqual(start['Madrid'].nextElection, '2019-05-26');
});

for (const region of Object.keys(start)) {
  test(`unchanged vote re-elects the ${region} parliament`, { skip: EXPECTED_DIFF[region] }, () => {
    const r = RM.runRegionalElection(V.initialState(), base, RD, region, start[region].lastElection);
    assert.deepStrictEqual(sortKeys(r.totals), sortKeys(start[region].seats));
  });
}

test('a Vox surge enters the Andalusian parliament', () => {
  const s = V.initialState();
  for (const c of V.CLASSES) s.classSupport[c].vox += 14;
  const r = RM.runRegionalElection(s, base, RD, 'Andalucía', '2018-12-02');
  assert.ok(r.totals.vox >= 5, `vox ${r.totals.vox}`);
});

test('regional-only parties hold their strength unless modified', () => {
  const s = V.initialState();
  const before = RM.runRegionalElection(s, base, RD, 'Aragón', '2019-05-26').totals.par;
  s.territorialMod['Aragón'] = { par: 0.4 };
  const after = RM.runRegionalElection(s, base, RD, 'Aragón', '2019-05-26').totals.par || 0;
  assert.ok(after < before, `${before} -> ${after}`);
});

function sortKeys(o) {
  return Object.fromEntries(Object.entries(o).sort());
}
