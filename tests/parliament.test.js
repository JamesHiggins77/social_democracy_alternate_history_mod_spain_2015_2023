'use strict';
const test = require('node:test');
const assert = require('node:assert');
const P = require('../out/html/spain/parliament.js');

const CONGRESS_2015 = { pp: 123, psoe: 90, up: 69, cs: 40, erc: 9, junts: 8, pnv: 6, iu: 2, bildu: 2, cc: 1 };

test('March 2016: Sánchez with the Ciudadanos pact fails both ballots', () => {
  // Historical result: 130 yes (PSOE 90, Cs 40), 219 no, 1 abstention (CC).
  // The game's CC votes yes under the pact; the outcome is the same.
  const Q = { pact_cs: 1, red_lines: 1, rel_up: 40, rel_pnv: 50, rel_cc: 50 };
  const v = P.investiture(CONGRESS_2015, 'sanchez', Q);
  assert.strictEqual(v.yes, 131);
  assert.strictEqual(v.passes, false);
});

test('A Podemos deal plus abstentions can win the second ballot', () => {
  const Q = { pact_up: 1, rel_pnv: 70, rel_bildu: 45, rel_cc: 70, referendum_offer: 1 };
  const v = P.investiture(CONGRESS_2015, 'sanchez', Q);
  assert.strictEqual(v.firstBallot, false);
  assert.ok(v.secondBallot, `${v.yes} yes vs ${v.no} no`);
});

test('The Federal Committee red lines block independence-party abstentions', () => {
  const Q = { pact_up: 1, rel_pnv: 70, rel_cc: 70, referendum_offer: 1, red_lines: 1 };
  const v = P.investiture(CONGRESS_2015, 'sanchez', Q);
  assert.strictEqual(v.detail.erc, 'no');
  assert.strictEqual(v.passes, false);
});

test('Rajoy wins only if the PSOE abstains (2016 arithmetic)', () => {
  const seats2016 = { pp: 137, psoe: 85, up: 71, cs: 32, erc: 9, junts: 8, pnv: 5, bildu: 2, cc: 1 };
  assert.strictEqual(P.investiture(seats2016, 'pp', { psoe_stance_pp: 'no', pact_pp_cs: 1 }).passes, false);
  assert.strictEqual(P.investiture(seats2016, 'pp', { psoe_stance_pp: 'abstain', pact_pp_cs: 1 }).passes, true);
});

test('June 2018: the motion of no confidence passes with 180 votes after the Gürtel sentence', () => {
  const seats2016 = { pp: 137, psoe: 85, up: 71, cs: 32, erc: 9, junts: 8, pnv: 5, bildu: 2, cc: 1 };
  const v = P.count(seats2016, P.stancesForCensure({ pp_scandal: 3, rel_up: 40, rel_pnv: 45 }));
  assert.strictEqual(v.yes, 180);
  assert.ok(v.yes >= 176);
  const before = P.count(seats2016, P.stancesForCensure({ pp_scandal: 0, rel_up: 40, rel_pnv: 45 }));
  assert.ok(before.yes < 176);
});

test('A PSOE budget without Catalan dialogue fails (February 2019 arithmetic)', () => {
  const seats2016 = { pp: 137, psoe: 85, up: 71, cs: 32, erc: 9, junts: 8, pnv: 5, bildu: 2, cc: 1 };
  const v = P.count(seats2016, P.stancesForBudget({ rel_up: 60, rel_pnv: 60, rel_cc: 50, cat_dialogue: 0 }));
  assert.ok(v.yes <= v.no, `${v.yes} vs ${v.no}`);
});

test('Ciudadanos will not share a majority with independence parties', () => {
  const Q = { rel_cs: 75, referendum_offer: 1, red_lines: 0 };
  const st = P.stancesForSanchez(Q);
  assert.strictEqual(st.erc, 'abstain');
  assert.strictEqual(st.cs, 'no');
});

test('Iglesias can be invested when Podemos leads the left and the PSOE backs him', () => {
  const seats = { up: 95, psoe: 80, pp: 110, cs: 30, erc: 9, junts: 8, pnv: 6, bildu: 2, iu: 0, cc: 1 };
  assert.strictEqual(P.investiture(seats, 'up', {}).passes, false);
  const v = P.investiture(seats, 'up', { psoe_backs_iglesias: 'coalition' });
  assert.ok(v.passes, `${v.yes} yes vs ${v.no} no`);
});

test('Rivera as the right candidate: PP and Cs vote together, the PSOE decides', () => {
  const seats = { cs: 90, pp: 70, psoe: 100, up: 60, erc: 9, junts: 8, pnv: 6, bildu: 4, cc: 2, iu: 1 };
  assert.ok(P.investiture(seats, 'cs', { pact_pp_cs: 1, psoe_stance_pp: 'abstain' }).passes);
  assert.ok(!P.investiture(seats, 'cs', { pact_pp_cs: 1, psoe_stance_pp: 'no' }).passes);
});

test('a PSOE government can depend on the independence parties', () => {
  const seats = { psoe: 120, up: 42, cs: 57, pp: 66, vox: 24, erc: 15, junts: 7, pnv: 6, bildu: 4, cc: 2, upn: 2, mp: 1, prc: 1 };
  const st = P.stancesForSanchez({ pact_up: 1, rel_pnv: 70, rel_bildu: 45, referendum_offer: 1, red_lines: 0, rel_cc: 50 });
  assert.ok(P.dependsOnIndependentists(seats, st));
});

test('January 2020: PSOE–Podemos invested with ERC and Bildu abstaining for a dialogue table', () => {
  const seats = { psoe: 120, pp: 89, vox: 52, up: 35, erc: 13, cs: 10, junts: 8, pnv: 6, bildu: 5, mp: 3,
                  cup: 2, cc: 2, upn: 2, bng: 1, prc: 1, te: 1 };
  const Q = { pact_up: 1, cat_dialogue: 1, rel_erc: 45, rel_pnv: 70, rel_bildu: 35, rel_bng: 60, rel_te: 55,
              rel_mp: 60, rel_cc: 50, rel_prc: 30, red_lines: 0 };
  const v = P.investiture(seats, 'sanchez', Q);
  assert.strictEqual(v.detail.erc, 'abstain');
  assert.strictEqual(v.detail.bildu, 'abstain');
  assert.strictEqual(v.firstBallot, false);
  assert.ok(v.secondBallot, `${v.yes} yes vs ${v.no} no`);
  // with the 2016 red lines still in force, ERC votes no and it fails
  assert.ok(!P.investiture(seats, 'sanchez', Object.assign({}, Q, { red_lines: 1 })).passes);
});
