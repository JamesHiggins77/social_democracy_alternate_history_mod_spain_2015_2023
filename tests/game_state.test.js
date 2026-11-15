'use strict';
const test = require('node:test');
const assert = require('node:assert');
const G = require('../out/html/spain/game_state.js');

function newQ() {
  const Q = {};
  G.newGame(Q, 0);
  return Q;
}

// Advance month by month, holding regional and general elections as they
// fall due, until the given condition holds.
function advanceUntil(Q, done) {
  for (let i = 0; i < 200 && !done(Q); i++) {
    G.endOfMonth(Q);
    if (Q.has_regional_elections) G.runDueRegionalElections(Q);
  }
}

// From July 2014 to the morning after the December 2015 election.
function toDecember2015(Q) {
  advanceUntil(Q, q => q.general_election_due === 1);
  G.runGeneralElection(Q);
  G.recalculate(Q);
}

test('new game starts in July 2014 with the 2011 Congress and the polls of the time', () => {
  const Q = newQ();
  assert.strictEqual(Q.year, 2014);
  assert.strictEqual(Q.month, 7);
  assert.strictEqual(Q.congress.pp, 186);
  assert.strictEqual(Q.pm, 'Mariano Rajoy');
  assert.strictEqual(Q.acting, 0);
  assert.strictEqual(Q.election_year, 0);
  assert.strictEqual(Q.regions['Madrid'].government.president, 'Ignacio González');
  assert.deepStrictEqual(Q.regions['Andalucía'].government.cabinet, ['psoe', 'iu']);
  // the polls the player sees track the real July 2014 polls
  assert.ok(Math.abs(Q.poll.pp - 31.1) < 1.5, `PP ${Q.poll.pp}`);
  assert.ok(Math.abs(Q.poll.up - 18.4) < 1.5, `Podemos ${Q.poll.up}`);
  assert.ok(Q.poll.cs < 5, `Cs ${Q.poll.cs}`);
});

test('the untouched historical path: Podemos peaks, Cs rises, the PP calls the election', () => {
  const Q = newQ();
  advanceUntil(Q, q => q.year === 2014 && q.month === 12);
  assert.ok(Q.poll.up > 24, `Podemos Dec 2014 ${Q.poll.up}`);
  advanceUntil(Q, q => q.year === 2015 && q.month === 10);
  assert.ok(Q.poll.cs > 14, `Cs Oct 2015 ${Q.poll.cs}`);
  assert.strictEqual(Q.election_year, 2015);
  assert.strictEqual(Q.election_month, 12);
  // the May 2015 regional elections reproduced reality
  assert.deepStrictEqual(Q.regions['Madrid'].seats, { pp: 48, psoe: 37, up: 27, cs: 17 });
  assert.strictEqual(Q.regions['Madrid'].government.president, 'Cristina Cifuentes');
  assert.strictEqual(Q.regions['Comunidad Valenciana'].government.president, 'Ximo Puig');
});

test('the December 2015 election reproduces the real Congress and records changes', () => {
  const Q = newQ();
  toDecember2015(Q);
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
  assert.strictEqual(Q.investiture_clock, 8);
  for (let i = 0; i < 8; i++) G.endOfWeek(Q);
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
  advanceUntil(Q, q => q.year === 2019 && q.month === 4);
  G.endOfMonth(Q);
  assert.ok(Q.regional_elections_due.length >= 12, Q.regional_elections_due.join(','));
  const results = G.runDueRegionalElections(Q);
  assert.ok(results.length >= 12);
  assert.strictEqual(Q.regions['Madrid'].nextElection, '2023-05-28');
  // Andalusia keeps its own calendar: without Díaz's snap election it votes
  // at the end of its 2012 term
  assert.strictEqual(Q.regions['Andalucía'].lastElection, '2016-03-25');
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
  toDecember2015(Q);
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
  toDecember2015(Q);
  assert.strictEqual(Object.keys(Q.map_winners).length, 52);
  assert.strictEqual(Q.map_winners['Sevilla'], 'psoe');
  assert.strictEqual(Q.map_winners['Barcelona'], 'up');
  assert.strictEqual(Q.map_winners['Madrid'], 'pp');
});

test('abstaining for Rajoy moves left-wing voters to Podemos', () => {
  const Q = newQ();
  toDecember2015(Q);
  const before = { psoe: Q.true_poll.psoe, up: Q.true_poll.up };
  G.transfer(Q, 'psoe', { up: 0.85, iu: 0.15 }, { workers: 5, students: 5, unemployed: 4, professionals: 3, pensioners: 1 });
  assert.ok(Q.true_poll.psoe < before.psoe - 2, `${before.psoe} -> ${Q.true_poll.psoe}`);
  assert.ok(Q.true_poll.up > before.up + 1.5, `${before.up} -> ${Q.true_poll.up}`);
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
  // cross-pressure: courting students costs some pensioners
  assert.ok(Q.vm.classSupport.pensioners.psoe < 34);
  // women: homemakers are reached far more than the self-employed
  const h = Q.vm.classSupport.homemakers.psoe, se = Q.vm.classSupport.self_employed.psoe;
  G.target(Q, 'psoe', 'women', 4);
  assert.ok(Q.vm.classSupport.homemakers.psoe - h > 2 * (Q.vm.classSupport.self_employed.psoe - se));
  // rural Spain: PSOE strength rises in Extremadura, not in Madrid
  G.target(Q, 'psoe', 'rural', 4);
  assert.ok(Q.vm.regionalMod['Extremadura'].psoe > 1);
  assert.strictEqual((Q.vm.regionalMod['Madrid'] || {}).psoe, undefined);
});

test('after an election the polls get a new error drawn from history', () => {
  const Q = newQ();
  toDecember2015(Q);
  assert.ok(Q.last_poll_miss.cs > 3, `Cs miss ${Q.last_poll_miss.cs}`);
  // repeated draws centre on the historical bias: PSOE underestimated
  let sum = 0;
  for (let i = 0; i < 400; i++) { G.drawPollError(Q, null); sum += Q.poll_error.psoe; }
  // relative error: about -1.3 points on a typical 25% share
  assert.ok(sum / 400 < -0.025 && sum / 400 > -0.085, `mean PSOE relative error ${sum / 400}`);
});

test('government formation runs in weeks; four weeks close the month', () => {
  const Q = newQ();
  toDecember2015(Q);
  assert.strictEqual(Q.weekly, 1);
  Q.negotiations_timer = 1; Q.rally_timer = 2;
  G.endOfWeek(Q);
  assert.strictEqual(Q.week, 2);
  assert.strictEqual(Q.month, 12);
  assert.strictEqual(Q.negotiations_timer, 0);  // negotiation cards: weekly
  assert.strictEqual(Q.rally_timer, 1.75);       // others: a quarter per week
  G.endOfWeek(Q); G.endOfWeek(Q); G.endOfWeek(Q);
  assert.strictEqual(Q.month, 1);
  assert.strictEqual(Q.year, 2016);
  assert.strictEqual(Q.week, 1);
  assert.strictEqual(Q.formation_weeks, 4);
  // forming a government ends weekly turns
  Q.psoe_stance_pp = 'abstain'; Q.pact_pp_cs = 1;
  G.holdInvestiture(Q, 'pp');
  G.recalculate(Q);
  assert.strictEqual(Q.weekly, 0);
});

test('campaign fatigue: the same effort gains less the more you campaign', () => {
  const Q = newQ();
  const s0 = Q.vm.classSupport.workers.psoe;
  G.campaign(Q, 'psoe', { workers: 3 });
  const g1 = Q.vm.classSupport.workers.psoe - s0;
  G.campaign(Q, 'psoe', { workers: 3 });
  const g2 = Q.vm.classSupport.workers.psoe - s0 - g1;
  assert.ok(g1 < 3 * 0.65, `first gain ${g1}`);
  assert.ok(g2 < g1, `${g1} then ${g2}`);
});

test('a far-left economic position drives moderates to Cs and the PP', () => {
  const Q = newQ();
  const se = Q.vm.classSupport.self_employed.psoe;
  G.position(Q, 8, 0);
  G.endOfMonth(Q);
  assert.ok(Q.vm.classSupport.self_employed.psoe < se - 1, `${se} -> ${Q.vm.classSupport.self_employed.psoe}`);
  assert.ok(Q.econ_left < 8);
});

test('governing wears the PSOE down and losses hurt more in government', () => {
  const Q = newQ();
  Q.year = 2018;
  Q.psoe_in_government = 1; Q.government_status = 'formed'; Q.pm_party = 'psoe';
  const w = Q.vm.classSupport.workers.psoe;
  G.endOfMonth(Q);
  assert.ok(Q.vm.classSupport.workers.psoe < w);
  const before = Q.vm.classSupport.students.psoe;
  G.campaign(Q, 'psoe', { students: -2 });
  assert.ok(before - Q.vm.classSupport.students.psoe > 2.9);
});

test('party debt damages Sánchez inside the party', () => {
  const Q = newQ();
  Q.funds = -8;
  const a = Q.sanchez_authority, fc = Q.federal_committee_balance;
  G.endOfMonth(Q);
  assert.ok(Q.sanchez_authority < a - 2);
  assert.ok(Q.federal_committee_balance < fc - 1);
  assert.strictEqual(Q.deep_debt, 1);
});

test('who is blamed for a repeat election', () => {
  const Q = newQ();
  toDecember2015(Q);
  // 2015: no PSOE majority within reach without the independentists -> the PP
  assert.strictEqual(G.formationBlame(Q), 'right');
  const pp = Q.vm.classSupport.workers.pp;
  G.dissolve(Q);
  assert.ok(Q.vm.classSupport.workers.pp < pp);
  // a Congress where a PSOE-Podemos deal would have worked -> the PSOE
  const R = newQ();
  R.congress = { psoe: 120, up: 60, pp: 100, cs: 40, pnv: 6, cc: 2, erc: 9, junts: 8, bildu: 2, iu: 3 };
  assert.strictEqual(G.formationBlame(R), 'psoe');
});

test('a PP investiture with Cs ministers forms a PP-Cs coalition', () => {
  const Q = newQ();
  Q.congress = { pp: 137, psoe: 85, up: 71, cs: 32, erc: 9, junts: 8, pnv: 5, bildu: 2, cc: 1 };
  Q.pact_pp_cs = 1; Q.psoe_stance_pp = 'abstain';
  G.holdInvestiture(Q, 'pp');
  assert.strictEqual(Q.government_type, 'PP–Ciudadanos coalition government');
});

test('moving the PSOE to the right sends left voters to Podemos', () => {
  const Q = newQ();
  const up = Q.vm.classSupport.students.up;
  G.position(Q, -6, 0);
  G.endOfMonth(Q);
  assert.ok(Q.vm.classSupport.students.up > up + 1, `${up} -> ${Q.vm.classSupport.students.up}`);
});

test('international relations are clamped, worded, and set Brussels deficit tolerance', () => {
  const Q = newQ();
  G.recalculate(Q);
  assert.strictEqual(Q.deficit_tolerance, 3.5);
  G.intl(Q, 'eu', 30);
  G.recalculate(Q);
  assert.strictEqual(Q.intl_eu, 90);
  assert.strictEqual(Q.deficit_tolerance, 4.2);
  G.intl(Q, 'eu', -200);
  G.recalculate(Q);
  assert.strictEqual(Q.intl_eu, 0);
  assert.strictEqual(Q.deficit_tolerance, 3.0);
  assert.ok(typeof Q.intl_maghreb_word === 'string' && Q.intl_maghreb_word.length > 0);
});

test('world-event flags: Madrid governed by the PP, Cs collapse after a peak', () => {
  const Q = newQ();
  G.recalculate(Q);
  assert.strictEqual(Q.madrid_pp, 1);
  Q.congress = Object.assign({}, Q.congress, { cs: 57 });
  G.recalculate(Q);
  assert.strictEqual(Q.cs_collapsed, 0);
  Q.congress.cs = 10;
  G.recalculate(Q);
  assert.strictEqual(Q.cs_collapsed, 1);
});

test('PP leader falls after losing power and a successor is chosen', () => {
  const Q = newQ();
  Q.year = 2018; Q.month = 6;
  G.formGovernment(Q, 'sanchez');
  assert.strictEqual(Q.pp_leader_falls_due, 1);
  G.choosePPLeader(Q);
  G.recalculate(Q);
  assert.notStrictEqual(Q.pp_leader, 'Mariano Rajoy');
  assert.strictEqual(Q.pp_leader_falls_due, 0);
  assert.strictEqual(Q.right_leader, Q.pp_leader);
});

test('a governing PP leader is not forced out by a setback', () => {
  const Q = newQ();
  G.ppSetback(Q, 2);
  assert.ok(!Q.pp_leader_falls_due);
});

test('leadership crisis stages follow authority', () => {
  const Q = newQ();
  Q.sanchez_authority = 28; G.endOfMonth(Q);
  assert.strictEqual(Q.lead_rumours_due, 1);
  assert.strictEqual(Q.lead_challenge_due, 0);
  Q.lead_stage = 1; Q.sanchez_authority = 12; G.endOfMonth(Q);
  assert.strictEqual(Q.lead_rumours_due, 0);
  assert.strictEqual(Q.lead_challenge_due, 1);
  Q.sanchez_authority = 0; G.endOfMonth(Q);
  assert.strictEqual(Q.lead_forced_due, 1);
});

test('losing a primary ousts Sánchez and opens the exile choice', () => {
  const Q = newQ();
  Q.year = 2019; Q.month = 3;
  Q.member_morale = 0; Q.sanchismo = 0; Q.sanchez_authority = 0;
  G.leadershipElection(Q, -100);
  assert.strictEqual(Q.sanchez_leader, 0);
  assert.strictEqual(Q.exile_pending, 1);
  assert.ok(Q.psoe_leader && Q.psoe_leader !== 'Pedro Sánchez');
  assert.strictEqual(G.lossReason(Q), '');
});

test('a new party takes votes in proportion to following and populism', () => {
  const weak = newQ(); weak.year = 2019; weak.sanchismo = 20; weak.populism = 1;
  const strong = newQ(); strong.year = 2019; strong.sanchismo = 70; strong.populism = 8;
  [weak, strong].forEach(q => { G.oust(q, true); G.joinParty(q, 'ps', 'Pedro Sánchez List'); });
  assert.ok(strong.true_poll.ps > weak.true_poll.ps + 3, `${strong.true_poll.ps} vs ${weak.true_poll.ps}`);
  assert.strictEqual(strong.exiled, 1);
  assert.strictEqual(strong.player_party, 'ps');
  // card effects aimed at 'psoe' now go to the new party
  const before = strong.true_poll.ps;
  G.campaign(strong, 'psoe', { workers: 3, pensioners: 3 });
  assert.ok(strong.true_poll.ps > before);
});

test('joining Ciudadanos needs a moderate line and good relations', () => {
  const Q = newQ();
  Q.econ_left = 3; Q.rel_cs = 70; Q.true_poll.cs = 12; G.recalculate(Q);
  assert.strictEqual(Q.can_join_cs, 0);
  Q.econ_left = 0; Q.true_poll.cs = 12; G.recalculate(Q);
  assert.strictEqual(Q.can_join_cs, 1);
});

test('without Sánchez, formation runs automatically with his party\'s line', () => {
  const Q = newQ();
  Q.congress = { pp: 137, psoe: 85, up: 71, cs: 32, erc: 9, junts: 8, pnv: 5, bildu: 2, cc: 1 };
  Q.elections_held = 2; Q.government_status = 'acting'; Q.formation_weeks = 3; Q.repeat_elections = 1;
  G.oust(Q, true);
  G.joinParty(Q, 'cs');
  Q.player_line_right = 'coalition'; Q.player_line_left = 'no'; Q.player_line_set = 1;
  G.recalculate(Q);
  const r = G.autoFormation(Q);
  assert.strictEqual(r, 'pp');
  assert.deepStrictEqual(Q.govt_parties, ['pp', 'cs']);
  assert.strictEqual(Q.player_in_government, 1);
});

test('a Sánchez party splits the left vote rather than adding to it', () => {
  const left = q => ['psoe', 'up', 'ps', 'mp', 'iu'].reduce((a, p) => a + (q.true_poll[p] || 0), 0);
  const Q = newQ(); Q.year = 2019; Q.sanchismo = 60; Q.populism = 6;
  const before = left(Q);
  G.oust(Q, true);
  const afterOust = left(Q);
  G.joinParty(Q, 'ps', 'Pedro Sánchez List');
  assert.ok(left(Q) <= afterOust + 0.01, `founding: ${afterOust} -> ${left(Q)}`);
  const mid = left(Q);
  const ps = Q.true_poll.ps;
  G.campaign(Q, 'psoe', { workers: 3, pensioners: 3, students: 3 });
  assert.ok(Q.true_poll.ps > ps);
  assert.ok(left(Q) <= mid + 0.01, `campaign: ${mid} -> ${left(Q)}`);
  assert.ok(before >= left(Q));
});
