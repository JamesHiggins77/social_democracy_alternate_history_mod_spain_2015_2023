'use strict';
const test = require('node:test');
const assert = require('node:assert');
const G = require('../out/html/spain/game_state.js');

function newQ() {
  const Q = {};
  G.newGame(Q, 0);
  return Q;
}

test('new game starts in November 2015 with the 2011 Congress and an election due', () => {
  const Q = newQ();
  assert.strictEqual(Q.year, 2015);
  assert.strictEqual(Q.month, 11);
  assert.strictEqual(Q.congress.pp, 186);
  assert.strictEqual(Q.pm, 'Mariano Rajoy');
  assert.strictEqual(Q.acting, 0);
  assert.strictEqual(Object.keys(Q.regions).length, 17);
  // polls forecast the real December 2015 result when nothing changes
  assert.strictEqual(Q.poll_seats.psoe, 90);
});

test('the December 2015 election reproduces the real Congress and records changes', () => {
  const Q = newQ();
  G.endOfMonth(Q);
  assert.strictEqual(Q.general_election_due, 1);
  G.runGeneralElection(Q);
  assert.deepStrictEqual(Q.congress,
    { pp: 123, psoe: 90, up: 69, cs: 40, erc: 9, junts: 8, pnv: 6, bildu: 2, iu: 2, cc: 1 });
  assert.strictEqual(Q.prev_congress.psoe, 110);
  assert.ok(Q.prev_vote_shares.psoe > 28 && Q.vote_shares.psoe < 23);
  assert.strictEqual(Q.acting, 1);
  assert.strictEqual(Q.repeat_elections, 0);
});

test('a failed investiture starts the clock; dissolution leads to a repeat election', () => {
  const Q = newQ();
  Q.pact_cs = 1;
  const v = G.holdInvestiture(Q, 'sanchez');
  assert.strictEqual(v.passes, false);
  assert.strictEqual(Q.investiture_clock, 2);
  G.endOfMonth(Q); G.endOfMonth(Q);
  assert.strictEqual(Q.dissolution_due, 1);
  G.dissolve(Q);
  G.endOfMonth(Q); G.endOfMonth(Q);
  assert.strictEqual(Q.general_election_due, 1);
  G.runGeneralElection(Q);
  const seats = Object.values(Q.congress).reduce((a, b) => a + b, 0);
  assert.strictEqual(seats, 350);
  assert.strictEqual(Q.government_status, 'acting');
});

test('regional elections fall due in May 2019 and change governments', () => {
  const Q = newQ();
  while (!(Q.year === 2019 && Q.month === 5)) G.endOfMonth(Q);
  assert.ok(Q.regional_elections_due.length >= 12, Q.regional_elections_due.join(','));
  const results = G.runDueRegionalElections(Q);
  assert.ok(results.length >= 12);
  assert.strictEqual(Q.regions['Madrid'].nextElection, '2023-05-28');
  // Andalusia (own calendar) voted in March 2019 in this timeline
  assert.ok(Q.regions['Andalucía'].lastElection >= '2019-03');
});

test('a PP leader is invested if the PSOE abstains', () => {
  const Q = newQ();
  Q.psoe_stance_pp = 'abstain';
  Q.pact_pp_cs = 1;
  const v = G.holdInvestiture(Q, 'pp');
  assert.ok(v.passes);
  assert.strictEqual(Q.pm_party, 'pp');
  assert.strictEqual(Q.government_status, 'formed');
});

test('regional government follows the blocs', () => {
  assert.strictEqual(G.regionalGovernment({ pp: 26, psoe: 33, cs: 21, up: 17, vox: 12 }, null).party, 'pp');
  assert.strictEqual(G.regionalGovernment({ pnv: 28, bildu: 18, up: 11, pp: 9, psoe: 9 }, null).party, 'pnv');
  assert.strictEqual(G.regionalGovernment({ psoe: 47, pp: 33, up: 15, cs: 9, iu: 5 }, null).party, 'psoe');
});

test('repeat elections bring PP-Cs cooperation and pressure on Sánchez', () => {
  const Q = newQ();
  G.endOfMonth(Q);
  G.runGeneralElection(Q); // December 2015
  const authority = Q.sanchez_authority;
  G.runGeneralElection(Q); // repeat election with no government formed
  assert.strictEqual(Q.repeat_elections, 1);
  assert.strictEqual(Q.pact_pp_cs, 1);
  assert.ok(Q.sanchez_authority < authority);
});

test('Andalusia 2018: a PP-Cs coalition with Vox support', () => {
  const g = G.regionalGovernment({ psoe: 33, pp: 26, cs: 21, up: 17, vox: 12 }, null, 50);
  assert.strictEqual(g.party, 'pp');
  assert.deepStrictEqual(g.cabinet, ['pp', 'cs']);
  assert.deepStrictEqual(g.support, ['vox']);
  assert.strictEqual(g.type, 'Minority coalition with external support');
  // with warm PP-Vox relations, Vox enters the cabinet (Castilla y León 2022)
  const cyl = G.regionalGovernment({ pp: 31, psoe: 28, vox: 13, upl: 3, sy: 3, cs: 1, xav: 1, up: 1 }, null, 70);
  assert.deepStrictEqual(cyl.cabinet, ['pp', 'vox']);
  assert.strictEqual(cyl.type, 'Coalition majority');
});

test('party funds grow monthly and campaigns cost money', () => {
  const Q = newQ();
  const start = Q.funds;
  G.endOfMonth(Q);
  assert.ok(Q.funds > start);
  const before = Q.funds;
  G.runGeneralElection(Q);
  assert.strictEqual(Math.round((before - Q.funds) * 10) / 10, 4);
});

test('government deficit follows the year and policy adjustments', () => {
  const Q = newQ();
  Q.year = 2018; G.recalculate(Q);
  assert.strictEqual(Q.deficit, 2.5);
  Q.fiscal_adj = 0.4; G.recalculate(Q);
  assert.strictEqual(Q.deficit, 2.9);
  Q.year = 2020; G.recalculate(Q);
  assert.ok(Q.deficit > 10);
});

test('province winners feed the results map', () => {
  const Q = newQ();
  G.endOfMonth(Q);
  G.runGeneralElection(Q);
  assert.strictEqual(Object.keys(Q.map_winners).length, 52);
  assert.strictEqual(Q.map_winners['Sevilla'], 'psoe');
  assert.strictEqual(Q.map_winners['Barcelona'], 'up');
  assert.strictEqual(Q.map_winners['Madrid'], 'pp');
});

test('abstaining for Rajoy moves left-wing voters to Podemos', () => {
  const Q = newQ();
  G.endOfMonth(Q);
  G.runGeneralElection(Q);
  const before = { psoe: Q.poll.psoe, up: Q.poll.up };
  G.transfer(Q, 'psoe', { up: 0.85, iu: 0.15 }, { workers: 5, students: 5, unemployed: 4, professionals: 3, pensioners: 1 });
  assert.ok(Q.poll.psoe < before.psoe - 2, `${before.psoe} -> ${Q.poll.psoe}`);
  assert.ok(Q.poll.up > before.up + 1.5, `${before.up} -> ${Q.poll.up}`);
});

test('demographic targeting moves the right voters, with diminishing returns', () => {
  const Q = newQ();
  const before = Q.vm.classSupport.students.psoe;
  const first = G.target(Q, 'psoe', 'students', 4);
  const gain1 = Q.vm.classSupport.students.psoe - before;
  G.target(Q, 'psoe', 'students', 4);
  const gain2 = Q.vm.classSupport.students.psoe - before - gain1;
  assert.strictEqual(first, 1);
  assert.ok(gain2 < gain1, `${gain1} then ${gain2}`);
  assert.strictEqual(Q.vm.classSupport.pensioners.psoe, 34);
  // women: homemakers are reached far more than the self-employed
  const h = Q.vm.classSupport.homemakers.psoe, se = Q.vm.classSupport.self_employed.psoe;
  G.target(Q, 'psoe', 'women', 4);
  assert.ok(Q.vm.classSupport.homemakers.psoe - h > 2 * (Q.vm.classSupport.self_employed.psoe - se));
  // rural Spain: PSOE strength rises in Extremadura, not in Madrid
  G.target(Q, 'psoe', 'rural', 4);
  assert.ok(Q.vm.regionalMod['Extremadura'].psoe > 1);
  assert.strictEqual((Q.vm.regionalMod['Madrid'] || {}).psoe, undefined);
});
