'use strict';
const test = require('node:test');
const assert = require('node:assert');
const R = require('../out/html/spain/regional_rules.js');
const DATA = require('../out/html/spain/regional_data.js');

// Elections the engine cannot reproduce from this source, and why.  Every
// other regional election from 2011 to 2023 must match the official seats.
const SOURCE_LIMITS = {
  'Asturias 2011-05-22': 'municipality figures inconsistent with district totals',
  'Asturias 2012-03-25': 'municipality figures inconsistent with district totals',
  'Asturias 2019-05-26': 'municipality figures scrambled in source',
  'Canarias 2011-05-22': 'source incomplete (58 of 60 seats)',
  'Canarias 2019-05-26': 'regional list has its own ballot, not in source; approximated',
  'Canarias 2023-05-28': 'regional list has its own ballot, not in source; approximated',
  'Cataluña 2021-02-14': 'source merges PDeCAT votes into Junts',
  'País Vasco 2012-10-21': 'source merges EB-B and EA-IU into one list',
  'Región de Murcia 2011-05-22': 'five-district system before 2019 not rebuilt',
  'Región de Murcia 2015-05-24': 'five-district system before 2019 not rebuilt',
  // Last seat decided by fewer than 60 votes: within the gap between the
  // source's counts and the final count including overseas ballots.
  'Aragón 2015-05-24': 'last seat margin 35-55 votes',
  'Cantabria 2019-05-26': 'last seat margin 5 votes',
  'Castilla y León 2019-05-26': 'last seat margin 43 votes',
};

for (const [region, elections] of Object.entries(DATA.regions)) {
  for (const [date, e] of Object.entries(elections)) {
    const key = `${region} ${date}`;
    test(`regional seats: ${key}`, { skip: SOURCE_LIMITS[key] }, () => {
      const r = R.electRegion(region, e.districts, date, elections);
      assert.deepStrictEqual(sortKeys(r.totals), sortKeys(e.seats));
    });
  }
}

test('approximated elections stay within one seat per party', () => {
  for (const key of ['Canarias 2019-05-26', 'Canarias 2023-05-28', 'Aragón 2015-05-24',
                     'Cantabria 2019-05-26', 'Castilla y León 2019-05-26']) {
    const [region, date] = [key.slice(0, -11), key.slice(-10)];
    const e = DATA.regions[region][date];
    const r = R.electRegion(region, e.districts, date, DATA.regions[region]);
    for (const id of new Set([...Object.keys(r.totals), ...Object.keys(e.seats)])) {
      assert.ok(Math.abs((r.totals[id] || 0) - (e.seats[id] || 0)) <= 1, `${key} ${id}`);
    }
  }
});

test('common May cycle and own calendars', () => {
  assert.strictEqual(R.fourthSundayOfMay(2019), '2019-05-26');
  assert.strictEqual(R.fourthSundayOfMay(2023), '2023-05-28');
  assert.strictEqual(R.nextRegularElection('Aragón', '2015-05-24', false), '2019-05-26');
  // Madrid's 2021 snap parliament only served until the common 2023 date
  assert.strictEqual(R.nextRegularElection('Madrid', '2021-05-04', true), '2023-05-28');
  // Castilla y León's 2022 snap election started a new four-year term
  assert.strictEqual(R.nextRegularElection('Castilla y León', '2022-02-13', true), '2026-02-13');
  assert.strictEqual(R.nextRegularElection('Andalucía', '2015-03-22', false), '2019-03-22');
});

function sortKeys(o) {
  return Object.fromEntries(Object.entries(o).sort());
}
