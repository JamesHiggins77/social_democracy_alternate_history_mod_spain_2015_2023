'use strict';
const test = require('node:test');
const assert = require('node:assert');
const V = require('../out/html/spain/vote_model.js');
const DATA = require('../out/html/spain/election_data.js');

const base = V.buildBaseline(DATA, V.initialState());

test('unchanged state reproduces the December 2015 Congress', () => {
  const r = V.runGeneralElection(V.initialState(), base, DATA, 2015, 12);
  assert.deepStrictEqual(r.totals,
    { pp: 123, psoe: 90, up: 69, cs: 40, erc: 9, junts: 8, pnv: 6, bildu: 2, iu: 2, cc: 1 });
});

test('more PSOE support among workers wins PSOE seats', () => {
  const s = V.initialState();
  s.classSupport.workers.psoe += 10;
  const r = V.runGeneralElection(s, base, DATA, 2016, 6);
  assert.ok(r.totals.psoe > 90, `psoe ${r.totals.psoe}`);
});

test('a party that stops standing disappears and its votes are redistributed', () => {
  const s = V.initialState();
  s.notStanding.iu = true;
  const r = V.runGeneralElection(s, base, DATA, 2016, 6);
  assert.strictEqual(r.totals.iu, undefined);
  assert.strictEqual(r.voteShares.iu, undefined);
  const sum = Object.values(r.totals).reduce((a, b) => a + b, 0);
  assert.strictEqual(sum, 350);
});

test('Vox growth is weak in the Basque Country and strong in Murcia', () => {
  const s = V.initialState();
  for (const c of V.CLASSES) s.classSupport[c].vox += 15;
  const shares = V.regionalShares(s, base);
  assert.ok(shares['Región de Murcia'].vox > 3 * shares['País Vasco'].vox);
});

test('territorial modifier moves a regional party only in its region', () => {
  const s = V.initialState();
  s.territorialMod['Cataluña'] = { erc: 1.6 };
  const r = V.runGeneralElection(s, base, DATA, 2017, 12);
  assert.ok(r.totals.erc > 9);
  assert.strictEqual(r.districts.Madrid.erc, undefined);
});

test('apportionment follows the latest decree before the polling date', () => {
  assert.strictEqual(V.apportionmentFor(DATA, 2016, 1).Madrid, 36);
  assert.strictEqual(V.apportionmentFor(DATA, 2023, 9).Valencia, 16);
});
