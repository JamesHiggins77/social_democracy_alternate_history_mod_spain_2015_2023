// Run with: node --test tests/
// Checks that the electoral engine reproduces every official Congress result
// from 2015 to 2023 when fed the official province-level votes.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const E = require('../out/html/spain/electoral_engine.js');
const DATA = require('../out/html/spain/election_data.js');

// Official seat totals, grouped by game party id.
const OFFICIAL = {
  '2011': { pp: 186, psoe: 110, junts: 16, iu: 11, bildu: 7, upyd: 5, pnv: 5, erc: 3, bng: 2, cc: 2,
            mp: 1, foro: 1, geroa: 1 },
  '2015': { pp: 123, psoe: 90, up: 69, cs: 40, erc: 9, junts: 8, pnv: 6, iu: 2, bildu: 2, cc: 1 },
  '2016': { pp: 137, psoe: 85, up: 71, cs: 32, erc: 9, junts: 8, pnv: 5, bildu: 2, cc: 1 },
  '2019a': { psoe: 123, pp: 66, cs: 57, up: 42, vox: 24, erc: 15, junts: 7, pnv: 6, bildu: 4,
             cc: 2, upn: 2, mp: 1, prc: 1 },
  '2019n': { psoe: 120, pp: 89, vox: 52, up: 35, erc: 13, cs: 10, junts: 8, pnv: 6, bildu: 5,
             mp: 3, cup: 2, cc: 2, upn: 2, bng: 1, prc: 1, te: 1 },
  '2023': { pp: 137, psoe: 121, vox: 33, up: 31, erc: 7, junts: 7, bildu: 6, pnv: 5,
            bng: 1, cc: 1, upn: 1 },
};

// Seats per province fixed by the dissolution decrees (spot checks).
const APPORTIONMENT = {
  '2015': { Madrid: 36, Barcelona: 31, Valencia: 15, Alicante: 12, Sevilla: 12, Soria: 2, Teruel: 3 },
  '2023': { Madrid: 37, Barcelona: 32, Valencia: 16, Alicante: 12, Sevilla: 12, Soria: 2, Teruel: 3 },
};

for (const key of Object.keys(OFFICIAL)) {
  test(`reproduces the official ${key} Congress`, () => {
    const result = E.electCongress(DATA.elections[key].provinces);
    const seatSum = Object.values(result.apportionment).reduce((a, b) => a + b, 0);
    assert.strictEqual(seatSum, 350);
    assert.deepStrictEqual(sortKeys(result.totals), sortKeys(OFFICIAL[key]));
  });
}

for (const key of Object.keys(APPORTIONMENT)) {
  test(`apportions ${key} seats like the decree`, () => {
    const pops = {};
    for (const [p, v] of Object.entries(DATA.elections[key].provinces)) pops[p] = v.population;
    const seats = E.apportionCongress(pops);
    for (const [p, n] of Object.entries(APPORTIONMENT[key])) assert.strictEqual(seats[p], n, p);
    assert.strictEqual(seats.Ceuta, 1);
    assert.strictEqual(seats.Melilla, 1);
  });
}

test('3% threshold counts blank votes', () => {
  // 3.1% of candidacy votes, but under 3% once blank votes are included.
  const lists = [{ id: 'a', votes: 4850 }, { id: 'c', votes: 4840 }, { id: 'b', votes: 310 }];
  assert.strictEqual(E.dhondt(lists, 40, { threshold: 0.03, blank: 0 }).b, 1);
  assert.strictEqual(E.dhondt(lists, 40, { threshold: 0.03, blank: 400 }).b, undefined);
});

test('region-wide threshold excludes a list everywhere', () => {
  const districts = {
    north: { seats: 5, blank: 0, lists: [{ id: 'a', votes: 600 }, { id: 'local', votes: 400 }] },
    south: { seats: 20, blank: 0, lists: [{ id: 'a', votes: 19000 }, { id: 'local', votes: 0 }] },
  };
  const regional = E.allocateChamber(districts, { threshold: 0.05, thresholdScope: 'region' });
  assert.deepStrictEqual(regional.totals, { a: 25 });
  const byDistrict = E.allocateChamber(districts, { threshold: 0.05 });
  assert.strictEqual(byDistrict.totals.local, 2);
});

function sortKeys(o) {
  return Object.fromEntries(Object.entries(o).sort());
}
