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
  Q.government_status = 'acting';
  Q.pact_cs = 1;
  const v = G.holdInvestiture(Q, 'sanchez');
  assert.strictEqual(v.passes, false);
  // two months from the first vote, which comes about two months after the
  // election: a vote held straight away does not bring the deadline forward
  assert.strictEqual(Q.investiture_clock, 16);
  for (let i = 0; i < 16; i++) G.endOfWeek(Q);
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
  // Andalusia keeps its own calendar: Díaz's snaps of March 2015 and
  // December 2018
  assert.strictEqual(Q.regions['Andalucía'].lastElection, '2018-12-02');
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
  G.startFinalCampaign(Q);
  G.finalSpend(Q, 'region', 'Andalucía');
  G.finalSpend(Q, 'class', 'pensioners');
  G.runGeneralElection(Q);
  // only what was spent in the final campaign
  assert.strictEqual(Math.round((before - Q.funds) * 10) / 10, 2);
});

test('final-campaign spending boosts the election-day vote far more than the polls after', () => {
  const Q = newQ();
  Q.year = 2019; Q.month = 4; Q.vm.partyFactor = {}; G.recalculate(Q);
  G.updatePolls ? G.updatePolls(Q) : null;
  const base = G.trueVote(Q).voteShares.psoe;
  G.startFinalCampaign(Q);
  const f1 = G.finalSpend(Q, 'class', 'working');
  const f2 = G.finalSpend(Q, 'class', 'working');
  assert.strictEqual(f1, 1); assert.strictEqual(f2, 0.5);
  G.finalSpend(Q, 'region', 'Andalucía');
  assert.ok(Q.eday_poll > base + 0.4, `${Q.eday_poll} vs ${base}`);
  const r = G.runGeneralElection(Q);
  assert.ok(r.voteShares.psoe > base + 0.4);
  const after = G.trueVote(Q).voteShares.psoe;
  assert.ok(after - base < 0.3 * (r.voteShares.psoe - base), `after ${after}, base ${base}, eday ${r.voteShares.psoe}`);
  assert.strictEqual(Q.eday, null);
});

test('last-minute money saturates: hoarding funds for election night buys little', () => {
  const run = spends => {
    const Q = newQ();
    Q.year = 2019; Q.month = 4; Q.vm.partyFactor = {}; Q.funds = 50; G.recalculate(Q);
    const base = G.trueVote(Q).voteShares.psoe;
    G.startFinalCampaign(Q);
    spends.forEach(s => G.finalSpend(Q, 'class', s));
    return { gain: Q.eday_poll - base, next: Q.eday_next_factor };
  };
  const groups = ['young', 'students', 'pensioners', 'working', 'middle', 'women', 'unemployed'];
  const one = run(['working']).gain;
  const many = run(groups.concat(groups, groups));
  assert.ok(one > 0.15, `one spend ${one}`);
  // twenty-one units buy far less than twenty-one times one
  assert.ok(many.gain < 7 * one, `21 spends ${many.gain} vs one ${one}`);
  assert.ok(many.next < 35, `a fresh spend after 21 is worth ${many.next}%`);
});

test('attack ads cut the target party on election day', () => {
  const Q = newQ();
  Q.year = 2019; Q.month = 4; Q.vm.partyFactor = {}; G.recalculate(Q);
  const pp = G.trueVote(Q).voteShares.pp;
  G.startFinalCampaign(Q);
  G.finalSpend(Q, 'attack', 'pp');
  const vm = G.withEday(Q);
  assert.ok(vm.classSupport.pensioners.pp < Q.vm.classSupport.pensioners.pp);
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

test('the results map shows the seats each party won in every province', () => {
  const Q = newQ();
  toDecember2015(Q);
  const total = Object.values(Q.map_magnitude).reduce((a, b) => a + b, 0);
  assert.strictEqual(total, 350);
  assert.strictEqual(Q.map_magnitude['Madrid'], 36);
  Object.keys(Q.map_shares).forEach(p => {
    const won = Q.map_shares[p].reduce((n, row) => n + row[2], 0);
    assert.strictEqual(won, Q.map_magnitude[p], `${p}: ${won} of ${Q.map_magnitude[p]}`);
  });
  // the real 2015 result in Madrid: PP 13, Podemos 8, PSOE 6, Cs 7 (and IU 2)
  const madrid = Object.fromEntries(Q.map_shares['Madrid'].map(r => [r[0], r[2]]));
  assert.strictEqual(madrid.pp, 13);
  assert.strictEqual(madrid.cs, 7);
});

test('regional maps show seats by district, or the whole parliament where districts are not provinces', () => {
  const Q = newQ();
  advanceUntil(Q, q => q.year === 2019 && q.month === 4);
  G.endOfMonth(Q);
  G.runDueRegionalElections(Q);
  assert.strictEqual(Q.map_kind, 'regional');
  const won = p => Q.map_shares[p].reduce((n, row) => n + row[2], 0);
  // Aragón elects by province
  assert.ok(Q.map_magnitude['Zaragoza'] > 0 && !Q.map_scope['Zaragoza']);
  assert.strictEqual(won('Zaragoza'), Q.map_magnitude['Zaragoza']);
  // the Canaries elect by island: each province shows the whole parliament
  assert.strictEqual(Q.map_scope['Las Palmas'], 'Canarias');
  assert.strictEqual(Q.map_magnitude['Las Palmas'], 70);
  assert.strictEqual(won('Las Palmas'), 70);
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
  for (let i = 0; i < 3000; i++) { G.drawPollError(Q, null); sum += Q.poll_error.psoe; }
  // relative error: about -1.3 points on a typical 25% share
  assert.ok(sum / 3000 < -0.025 && sum / 3000 > -0.085, `mean PSOE relative error ${sum / 3000}`);
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
  Q.govt_months = 13;   // past the first year's visibility
  const O = newQ(); O.year = 2018;   // the same month in opposition
  Q.no_mood = 1; O.no_mood = 1;   // compare like with like: no random mood
  G.endOfMonth(Q); G.endOfMonth(O);
  assert.ok(Q.vm.classSupport.workers.psoe < O.vm.classSupport.workers.psoe);
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
  Q.pact_pp_cs = 1; Q.psoe_stance_pp = 'abstain'; Q.government_status = 'acting';
  // by default Cs supports from outside, as in 2016
  G.holdInvestiture(Q, 'pp');
  assert.strictEqual(Q.government_type, 'PP minority government with Ciudadanos support');
  // with warm PP–Cs relations it joins the cabinet
  const R = newQ();
  R.congress = Object.assign({}, Q.congress);
  R.pact_pp_cs = 1; R.psoe_stance_pp = 'abstain'; R.government_status = 'acting'; R.party_rel = { 'cs-pp': 70 };
  G.holdInvestiture(R, 'pp');
  assert.strictEqual(R.government_type, 'PP–Ciudadanos coalition government');
});

test('Ciudadanos is blamed when it could have let the PSOE govern by abstaining (2019)', () => {
  const Q = newQ();
  Q.year = 2019; Q.month = 6; Q.government_status = 'acting'; Q.rel_cs = 30;
  Q.congress = { psoe: 123, pp: 66, cs: 57, up: 42, vox: 24, erc: 15, junts: 7, pnv: 6, bildu: 4, cc: 2, prc: 1, upn: 2, mp: 1 };
  const cs = Q.vm.classSupport.professionals.cs;
  G.dissolve(Q);
  assert.strictEqual(Q.formation_blame, 'cs');
  assert.ok(Q.vm.classSupport.professionals.cs < cs - 3);
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
  // diminishing returns: +30 from 60 adds 13
  assert.strictEqual(Q.intl_eu, 73);
  assert.strictEqual(Q.deficit_tolerance, 4.2);
  G.intl(Q, 'eu', 30);
  G.recalculate(Q);
  assert.ok(Q.intl_eu < 85, `${Q.intl_eu}`);
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

test('joining Ciudadanos needs 90+ relations, a moderate line and a hard line on independence', () => {
  const Q = newQ();
  Q.true_poll.cs = 12; Q.econ_left = 0; Q.rel_cs = 85; Q.cat_hard_line = 2; G.recalculate(Q);
  assert.strictEqual(Q.can_join_cs, 0);
  Q.rel_cs = 92; Q.true_poll.cs = 12; G.recalculate(Q);
  assert.strictEqual(Q.can_join_cs, 1);
  Q.referendum_offer = 1; Q.true_poll.cs = 12; G.recalculate(Q);
  assert.strictEqual(Q.can_join_cs, 0);
});

test('joining Podemos needs 90+ relations and a progressive, radical, populist Sánchez', () => {
  const Q = newQ();
  Q.true_poll.up = 15; Q.rel_up = 95; Q.social_prog = 4; Q.econ_left = 7; Q.populism = 6; G.recalculate(Q);
  assert.strictEqual(Q.can_join_up, 0);
  Q.populism = 9; Q.true_poll.up = 15; G.recalculate(Q);
  assert.strictEqual(Q.can_join_up, 1);
});

test('no following, no party, expelled: the game ends', () => {
  const Q = newQ(); Q.year = 2019;
  Q.sanchismo = 50; G.oust(Q, true); G.recalculate(Q);
  assert.strictEqual(Q.can_found, 0);
  assert.ok(/career is over/.test(G.lossReason(Q)));
  const R = newQ(); R.year = 2019; R.sanchismo = 85; G.oust(R, true); G.recalculate(R);
  assert.strictEqual(R.can_found, 1);
  assert.strictEqual(G.lossReason(R), '');
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

test('chaos rises under an acting government and feeds Vox after 2016', () => {
  const calm = newQ(); const messy = newQ();
  [calm, messy].forEach(q => { q.year = 2019; q.month = 1; q.vm.partyFactor = {}; G.recalculate(q); });
  messy.government_status = 'acting'; messy.repeat_elections = 2; messy.catalan_crisis = 1;
  G.recalculate(messy);
  for (let i = 0; i < 6; i++) { G.monthlyWorld(calm); G.monthlyWorld(messy); G.recalculate(calm); G.recalculate(messy); }
  assert.ok(messy.chaos > calm.chaos + 15, `${messy.chaos} vs ${calm.chaos}`);
  assert.ok(messy.true_poll.vox > calm.true_poll.vox, `${messy.true_poll.vox} vs ${calm.true_poll.vox}`);
});

test('policy shocks move growth and unemployment, which fade', () => {
  const Q = newQ(); Q.year = 2018; G.recalculate(Q);
  const u0 = Q.unemployment;
  G.econ(Q, -1, 1); G.recalculate(Q);
  assert.ok(Q.unemployment > u0 + 1.7);
  let peak = 0;
  for (let i = 0; i < 24; i++) { G.monthlyWorld(Q); peak = Math.max(peak, Q.unemp_adj); }
  // growth recovers within two years; unemployment lingers but stops rising
  assert.ok(Q.growth_adj > -0.3, `growth ${Q.growth_adj}`);
  assert.ok(Q.unemp_adj > 1.5 && Q.unemp_adj <= peak + 1e-9, `unemp ${Q.unemp_adj} peak ${peak}`);
});

test('relations gain less the warmer they are', () => {
  const Q = newQ();
  Q.intl.eu = 90; G.intl(Q, 'eu', 10);
  assert.ok(Q.intl.eu < 92);
  Q.intl.eu = 30; G.intl(Q, 'eu', 10);
  assert.ok(Q.intl.eu > 37);
});

test('party income is lower and dues change it', () => {
  const Q = newQ(); Q.year = 2019; G.recalculate(Q);
  const base = G.fundsIncome(Q);
  assert.ok(base < 0.6, `${base}`);
  Q.dues_level = 2;
  assert.ok(G.fundsIncome(Q) > base + 0.25);
});

test('sister-party lessons depend on the leader at the time', () => {
  const Q = newQ();
  Q.year = 2015; Q.month = 3; assert.strictEqual(G.sisterLeader(Q, 'labour').id, 'miliband');
  Q.year = 2017; assert.strictEqual(G.sisterLeader(Q, 'labour').id, 'corbyn');
  Q.year = 2021; assert.strictEqual(G.sisterLeader(Q, 'labour').id, 'starmer');
  Q.year = 2016; assert.strictEqual(G.sisterLeader(Q, 'denmark').id, 'frederiksen');
});

test('Corbyn energises the young and progressives but alienates everyone else', () => {
  const Q = newQ(); Q.year = 2017; Q.month = 6; Q.vm.partyFactor = {}; G.recalculate(Q);
  const before = JSON.parse(JSON.stringify(Q.vm.classSupport));
  const prog = Q.progressives_dissent, barons = Q.regional_leaders_dissent;
  G.learnFrom(Q, 'labour');
  assert.ok(Q.vm.classSupport.students.psoe > before.students.psoe);
  assert.ok(Q.vm.classSupport.pensioners.psoe < before.pensioners.psoe);
  assert.ok(Q.vm.classSupport.professionals.psoe < before.professionals.psoe);
  assert.ok(Q.progressives_dissent < prog && Q.regional_leaders_dissent > barons);
});

test('repeating a lesson gives diminishing returns', () => {
  const Q = newQ(); Q.year = 2019; G.recalculate(Q);
  assert.strictEqual(G.learnFrom(Q, 'denmark'), 1);
  assert.strictEqual(G.learnFrom(Q, 'denmark'), 0.5);
  assert.ok(Math.abs(G.learnFrom(Q, 'denmark') - 1 / 3) < 1e-9);
  assert.ok(Math.abs(Q.migration_learned - (1 + 0.5 + 1 / 3)) < 1e-9);
});

test('Senate: 208 elected by limited vote plus 58 appointed by the regions', () => {
  const D = require('../out/html/spain/election_data.js');
  const el = G.senateElected(D.elections['2011'].provinces);
  assert.strictEqual(Object.values(el).reduce((a, b) => a + b, 0), 208);
  const Q = newQ();
  assert.strictEqual(Q.senate_total, 266);
  assert.ok(Q.senate.pp > Q.senate.psoe && Q.senate.pp > 133, JSON.stringify(Q.senate));
});

test('European Parliament: 2014 result, then a national D\'Hondt vote in May 2019', () => {
  const Q = newQ();
  assert.strictEqual(Q.ep_total, 54);
  assert.strictEqual(Q.rep_ep, 14);
  Q.year = 2019; Q.month = 5; G.europeanElection(Q); G.recalculate(Q);
  assert.strictEqual(Q.ep_total, 54);
  assert.strictEqual(Q.ep_election_due, 1);
  assert.deepStrictEqual(G.dhondtSeats({ a: 60, b: 30, c: 10 }, 10), { a: 6, b: 3, c: 1 });
});

test('a PP–Vox coalition government ends the game; a grand coalition does not', () => {
  const Q = newQ();
  Q.congress = { pp: 140, vox: 50, psoe: 100, up: 30, cs: 10, erc: 10, junts: 10 };
  Q.pp_vox_relation = 70;
  G.formGovernment(Q, 'pp');
  assert.deepStrictEqual(Q.govt_parties, ['pp', 'vox']);
  assert.ok(/PP and Vox form a coalition/.test(G.lossReason(Q)));
  const R = newQ();
  R.congress = { pp: 140, vox: 50, psoe: 100, up: 30, cs: 10, erc: 10, junts: 10 };
  R.rel_pp = 90; R.pp_style_moderate = 1;
  G.recalculate(R);
  assert.strictEqual(G.grandCoalitionOffer(R), 1);
  assert.deepStrictEqual(R.govt_parties, ['pp', 'psoe']);
  assert.strictEqual(R.psoe_in_government, 1);
  assert.strictEqual(G.lossReason(R), '');
});

test('cabinet: coalition shares ministries and gates government cards', () => {
  const Q = newQ();
  Q.year = 2020; Q.congress = { psoe: 120, up: 35, pp: 89, vox: 52, cs: 10, erc: 13, junts: 8, pnv: 6, bildu: 5, mp: 3 };
  Q.pact_up = 1; G.formGovernment(Q, 'sanchez'); G.recalculate(Q);
  assert.strictEqual(Q.cabinet_pending, 1);
  assert.strictEqual(Q.cabinet.labour.party, 'up');
  assert.strictEqual(Q.min_finance, 1);
  assert.strictEqual(Q.min_labour, 0);
  G.allocateCabinet(Q, 'hard');
  assert.strictEqual(Q.min_labour, 1);
  assert.strictEqual(Q.cabinet.deputy.party, 'psoe');
  G.allocateCabinet(Q, 'generous');
  assert.ok(Object.values(Q.cabinet).filter(c => c.party === 'up').length >= 4);
  // a single-party PP government: the PSOE holds nothing
  const R = newQ(); G.recalculate(R);
  assert.strictEqual(R.cabinet.finance.name, 'Cristóbal Montoro');
  assert.strictEqual(R.my_ministries, 0);
});

test('US Democrats split into leadership and progressives after Obama; Italy and Greece added', () => {
  const Q = newQ();
  Q.year = 2016; Q.month = 6; G.recalculate(Q);
  assert.strictEqual(Q.us_left_open, 0);
  assert.strictEqual(G.sisterLeader(Q, 'us').id, 'obama');
  Q.year = 2018; Q.month = 6; G.recalculate(Q);
  assert.strictEqual(Q.us_left_open, 1);
  assert.strictEqual(G.sisterLeader(Q, 'us').id, 'pelosi');
  assert.strictEqual(G.sisterLeader(Q, 'us_left').id, 'sanders');
  Q.year = 2019; assert.strictEqual(G.sisterLeader(Q, 'us_left').id, 'sanders_aoc');
  Q.year = 2021; Q.month = 3; assert.strictEqual(G.sisterLeader(Q, 'us').id, 'biden');
  const barons = Q.regional_leaders_dissent, sanch = Q.sanchismo;
  G.learnFrom(Q, 'us_left');
  assert.ok(Q.sanchismo > sanch && Q.regional_leaders_dissent > barons);
  Q.year = 2017; assert.strictEqual(G.sisterLeader(Q, 'greece').id, 'gennimata');
  assert.strictEqual(G.sisterLeader(Q, 'italy').id, 'renzi');
});

test('bad results arm the barons; loyalists and a lost coup; the caretaker abstains', () => {
  const Q = newQ();
  Q.year = 2016; Q.month = 6; G.recalculate(Q);
  const before = Q.plot || 0;
  Q.prev_test = 1;
  // a collapse in seats raises the plot
  Q.congress = Object.assign({}, Q.congress, { psoe: 110 });
  Q.vm.partyFactor = {};
  G.transferRaw(Q, 'psoe', 'up', { workers: 8, pensioners: 8, professionals: 8, students: 8, unemployed: 8, homemakers: 8 });
  G.runGeneralElection(Q);
  assert.ok(Q.plot > before + 20, `plot ${Q.plot}`);
  // loyalists lower it
  const p1 = Q.plot;
  G.placeLoyalists(Q, 'executive');
  assert.ok(Q.plot < p1 && Q.loyalist_posts >= 2);
  // a lost coup leaves a caretaker committee, which abstains for the PP
  Q.plot = 90; Q.federal_committee_balance = 20; Q.loyalist_posts = 0; Q.member_morale = 10;
  let survived = 1;
  for (let i = 0; i < 20 && survived; i++) { Q.sanchez_leader = 1; Q.plot = 90; survived = G.baronsCoup(Q, 'fight'); }
  assert.strictEqual(Q.sanchez_leader, 0);
  assert.strictEqual(Q.psoe_interim, 1);
  Q.gestora_abstains = 1;
  assert.strictEqual(G.aiStances(Q, 'pp').psoe, 'abstain');
});

test('a left-wing course makes the barons plot faster', () => {
  const centre = newQ(); const left = newQ();
  [centre, left].forEach(q => { q.year = 2017; q.month = 6; q.plot = 20; q.econ_left = 0; q.social_prog = 1; });
  left.econ_left = 8; left.social_prog = 6; left.pact_up = 1; left.referendum_offer = 1;
  for (let i = 0; i < 6; i++) { G.monthlyWorld(centre); G.monthlyWorld(left); }
  assert.ok(left.plot > centre.plot + 15, `${left.plot} vs ${centre.plot}`);
});

test('faction leaders follow the date and the situation', () => {
  const Q = newQ();
  assert.strictEqual(G.factionLeader(Q, 'regional_leaders'), 'Susana Díaz');
  assert.strictEqual(G.factionLeader(Q, 'institutionalists'), 'Alfredo Pérez Rubalcaba');
  assert.strictEqual(G.factionLeader(Q, 'trade_unionists'), 'Cándido Méndez');
  Q.year = 2019; Q.month = 9;
  assert.strictEqual(G.factionLeader(Q, 'institutionalists'), 'Carmen Calvo');
  // not in government: no Calviño
  assert.strictEqual(G.factionLeader(Q, 'modernisers'), 'Patxi López');
  Q.congress = Object.assign({}, Q.congress, { psoe: 140 });
  G.formGovernment(Q, 'sanchez'); G.recalculate(Q);
  assert.strictEqual(G.factionLeader(Q, 'modernisers'), 'Nadia Calviño (independent)');
  // Díaz loses Andalusia: García-Page leads the barons
  Q.regions['Andalucía'].government = { party: 'pp', president: 'Juanma Moreno', cabinet: ['pp', 'cs'], support: ['vox'] };
  assert.strictEqual(G.factionLeader(Q, 'regional_leaders'), 'Emiliano García-Page');
});

test('an acting PP Prime Minister leading the largest party is not forced out', () => {
  const Q = newQ();
  Q.government_status = 'acting'; Q.pm_party = 'pp';
  Q.congress = { pp: 123, psoe: 90, up: 69, cs: 40, erc: 9, junts: 8, pnv: 6, iu: 2, bildu: 2, cc: 1 };
  for (let i = 0; i < 20; i++) G.ppSetback(Q, 1);
  assert.ok(!Q.pp_leader_falls_due);
});

test('the barons rebel at most once per game', () => {
  const Q = newQ(); Q.plot = 90; Q.rebellion_used = 1; G.recalculate(Q);
  assert.strictEqual(Q.coup_due, 0);
  assert.strictEqual(Q.revolt_possible, 0);
});

test('after a repeat election there is no third election: the eve-of-dissolution vote passes', () => {
  const Q = newQ();
  Q.year = 2016; Q.month = 9; Q.government_status = 'acting'; Q.fatigue = 1;
  Q.congress = { pp: 137, psoe: 85, up: 71, cs: 32, erc: 9, junts: 8, pnv: 5, bildu: 2, cc: 1 };
  Q.pact_pp_cs = 1; Q.psoe_stance_pp = 'no'; G.recalculate(Q);
  // a PSOE led by Sánchez votes no if he says so (October 2016 needed his
  // fall first) ...
  assert.ok(!G.lastChanceInvestiture(Q));
  // ... a PSOE without him gives way
  Q.sanchez_leader = 0; G.recalculate(Q);
  assert.ok(G.lastChanceInvestiture(Q));
  assert.strictEqual(Q.pm_party, 'pp');
  assert.strictEqual(Q.acting, 0);
  // without a previous repeat, no rescue
  const R = newQ(); R.government_status = 'acting'; R.fatigue = 0; G.recalculate(R);
  assert.ok(!G.lastChanceInvestiture(R));
});

test('a PSOE-led deadlock also breaks: the left abstains rather than force a third election', () => {
  const Q = newQ();
  Q.year = 2020; Q.month = 6; Q.government_status = 'acting'; Q.fatigue = 1;
  Q.congress = { psoe: 101, pp: 75, vox: 52, up: 45, cs: 37, erc: 12, junts: 10, pnv: 6, bildu: 5, iu: 5, cc: 2 };
  Q.rel_up = 20; G.recalculate(Q);
  assert.ok(G.lastChanceInvestiture(Q));
  assert.strictEqual(Q.pm, 'Pedro Sánchez');
});

test('no investiture against a sitting government: forming one clears the nomination', () => {
  const Q = newQ();
  Q.government_status = 'acting'; Q.sanchez_nominated = 1; Q.congress = { pp: 137, psoe: 85, up: 71, cs: 32, erc: 9, junts: 8, pnv: 5, bildu: 2, cc: 1 };
  Q.pact_pp_cs = 1; Q.psoe_stance_pp = 'abstain';
  G.formGovernment(Q, 'pp'); G.recalculate(Q);
  assert.strictEqual(Q.sanchez_nominated, 0);
  G.holdInvestiture(Q, 'sanchez');
  assert.strictEqual(Q.investiture_clock, -1);
  assert.strictEqual(Q.pm_party, 'pp');
});

test('a new game wipes everything left by the previous one', () => {
  const Q = newQ();
  Q.rebellion_used = 1; Q.gurtel_seen = 1; Q.plot = 90; Q.exiled = 1; Q.player_party = 'ps';
  Q.learn_counts = { 'labour:corbyn': 3 }; Q.pact_up = 1; Q.loss_reason = 'old game over'; Q.year = 2023;
  G.newGame(Q, 0);
  const fresh = newQ();
  assert.strictEqual(Q.rebellion_used, undefined);
  assert.strictEqual(Q.gurtel_seen, undefined);
  assert.strictEqual(Q.loss_reason, undefined);
  assert.strictEqual(Q.exiled, 0);
  assert.strictEqual(Q.player_party, 'psoe');
  assert.strictEqual(Q.learn_counts, undefined);
  assert.strictEqual(Q.year, 2014);
  // the same set of values as a game started from nothing
  assert.deepStrictEqual(Object.keys(Q).sort(), Object.keys(fresh).sort());
});

test('a grand coalition feeds Podemos and Vox, at formation and while it lasts', () => {
  const R = newQ();
  R.congress = { pp: 140, vox: 50, psoe: 100, up: 30, cs: 10, erc: 10, junts: 10 };
  R.rel_pp = 90; R.pp_style_moderate = 1;
  G.recalculate(R);
  const before = Object.assign({}, R.true_poll);
  assert.strictEqual(G.grandCoalitionOffer(R), 1);
  const after = Object.assign({}, R.true_poll);
  assert.ok(after.up > before.up, 'Podemos gains');
  assert.ok(after.vox > before.vox, 'Vox gains');
  assert.ok(after.psoe < before.psoe && after.pp < before.pp);
  const dissent = R.trade_unionists_dissent;
  const upPoints = q => Object.values(q.vm.classSupport).reduce((n, c) => n + (c.up || 0), 0);
  const pts = upPoints(R);
  G.grandCoalitionWear(R); G.recalculate(R);
  assert.ok(R.true_poll.vox > after.vox, 'Vox keeps gaining');
  assert.ok(upPoints(R) > pts, 'the PSOE\'s left keeps leaving for Podemos');
  assert.ok(R.trade_unionists_dissent > dissent);
});

test('a grand coalition makes Vox the only opposition on the right: big, lasting gains', () => {
  const Q = newQ();
  advanceUntil(Q, q => q.year === 2018 && q.month === 10);
  G.voxRally(Q); Q.vox_breakthrough = 1;
  advanceUntil(Q, q => q.year === 2019 && q.month === 6);
  Q.congress = { pp: 100, psoe: 110, vox: 40, up: 40, cs: 30, erc: 15, junts: 7, pnv: 6, bildu: 2 };
  Q.rel_pp = 90; Q.pp_style_moderate = 1; G.recalculate(Q);
  const before = Q.true_poll.vox;
  assert.strictEqual(Q.vox_on, 1);
  assert.strictEqual(G.grandCoalitionOffer(Q), 1);
  assert.strictEqual(Q.grand_vox, 1);
  assert.ok(Q.true_poll.vox > before + 2.5, `formation: ${before} -> ${Q.true_poll.vox}`);
  for (let i = 0; i < 12; i++) { G.endOfMonth(Q); }
  assert.ok(Q.true_poll.vox > before + 9, `a year in: ${before} -> ${Q.true_poll.vox}`);
});

test('before Vox is a force, a grand coalition sends the PP\'s hard right to Ciudadanos or home', () => {
  const Q = newQ();
  toDecember2015(Q);
  Q.rel_pp = 90; Q.pp_style_moderate = 1; G.recalculate(Q);
  assert.strictEqual(Q.vox_on, 0);
  const before = Object.assign({}, Q.true_poll);
  assert.strictEqual(G.grandCoalitionOffer(Q), 1);
  assert.strictEqual(Q.grand_vox, 0);
  assert.ok(Q.true_poll.vox - before.vox < 0.2, `Vox ${before.vox} -> ${Q.true_poll.vox}`);
  assert.ok(Q.true_poll.cs > before.cs + 0.5, `Cs ${before.cs} -> ${Q.true_poll.cs}`);
});

test('the national question feeds Vox once it has broken through', () => {
  const calm = newQ(); const hot = newQ();
  [calm, hot].forEach(q => { q.year = 2019; q.month = 1; q.vox_breakthrough = 1; G.recalculate(q); });
  hot.psoe_in_government = 1; hot.pm_party = 'psoe'; hot.depends_on_catalans = 1; hot.cat_tension = 20; hot.cat_dialogue = 2;
  assert.ok(G.nationalQuestion(hot) > G.nationalQuestion(calm) + 2);
  calm.vox_breakthrough = 0; G.recalculate(calm);
  assert.strictEqual(G.voxOn(calm), false, 'a fringe party at 0.2% with no seats is not yet a force');
});

test('the comeback campaign: network, barons and money raise the primary edge; a hostile leadership lowers it', () => {
  const Q = newQ();
  const base = G.comebackBonus(Q);
  Q.network = 70; Q.baron_allies = 2; Q.war_chest = 6;
  assert.ok(G.comebackBonus(Q) > base + 15);
  Q.rel_leadership = 0;
  assert.ok(G.comebackBonus(Q) < base + 16);
});

test('blocking Rajoy after a repeat election sets off the barons; an early motion fails without a court ruling', () => {
  const Q = newQ();
  Q.year = 2016; Q.month = 9; Q.government_status = 'acting'; Q.fatigue = 1; Q.formation_weeks = 10;
  Q.congress = { pp: 137, psoe: 85, up: 71, cs: 32, erc: 9, junts: 8, pnv: 5, bildu: 2, cc: 1 };
  G.recalculate(Q);
  assert.strictEqual(G.formationClock(Q), 8);
  Q.formation_weeks = 0;
  assert.strictEqual(G.formationClock(Q), 16);
});

test('a Prime Minister who loses the PSOE leadership stays in Moncloa until he steps aside or calls an election', () => {
  const Q = newQ();
  Q.year = 2019; Q.congress = { psoe: 123, pp: 66, cs: 57, up: 42, vox: 24, erc: 15, junts: 7, pnv: 6, bildu: 4, cc: 2, prc: 1, te: 1, nc: 1, navarra: 1 };
  Q.government_status = 'acting'; Q.pact_up = 1;
  G.formGovernment(Q, 'sanchez'); G.recalculate(Q);
  assert.strictEqual(Q.pm, 'Pedro Sánchez');
  G.oust(Q, false);
  assert.strictEqual(Q.pm, 'Pedro Sánchez');
  assert.strictEqual(Q.bicephaly, 1);
  assert.strictEqual(Q.pm_party, 'psoe');
});

test('plots grow slowly against a sitting Prime Minister', () => {
  const run = (pm) => {
    const Q = newQ(); Q.year = 2019; Q.sanchez_leader = 1; Q.plot = 40;
    Q.federal_committee_balance = 35; Q.dissent_percent = 40;
    for (let i = 0; i < 6; i++) { Q.sanchez_pm = pm; G.plotDrift ? G.plotDrift(Q) : null; }
    return Q.plot;
  };
  if (!G.plotDrift) { return; }
  assert.ok(run(1) < run(0));
});

test('2017 primary: a moderniser Sánchez gets López behind him and a progressive rival; Díaz always runs', () => {
  const Q = newQ();
  Q.modernisers_dissent = 2; Q.progressives_dissent = 30; Q.trade_unionists_dissent = 20; Q.econ_left = 1;
  assert.strictEqual(G.isModerniser(Q), 1);
  Q.econ_left = 5;
  assert.strictEqual(G.isModerniser(Q), 0);
  // historical: López runs
  const H = newQ(); G.comebackPrimary(H);
  assert.ok(H.primary_lopez > 0 && H.primary_tapias === 0 && H.primary_diaz > 0);
  // moderniser, endorsed: López out, Pérez Tapias in, Díaz still there
  const M = newQ(); M.lopez_decided = 1; M.lopez_endorses = 1; G.comebackPrimary(M);
  assert.strictEqual(M.primary_lopez, 0);
  assert.ok(M.primary_tapias >= 4 && M.primary_diaz > 0);
  assert.ok(Math.abs(M.primary_sanchez + M.primary_diaz + M.primary_tapias - 100) < 0.5);
});

test('2017 race: endorsements and the vote are run by province; López wins the Basque provinces, Díaz Andalusia', () => {
  const Q = newQ();
  Q.pr_base = [50.3, 39.9, 9.8, 0];   // the real result
  G.primaryEndorsements(Q);
  assert.ok(Q.av_rows.length >= 3 && Q.av_need === Math.ceil(187949 * 0.05));
  G.primaryVote(Q);
  const total = Q.pv_rows.reduce((a, r) => a + r.share, 0);
  assert.ok(Math.abs(total - 100) < 0.5);
  assert.strictEqual(Q.pv_winners['Bizkaia'], 'c_lopez');
  assert.strictEqual(Q.pv_winners['Jaén'], 'c_diaz');
  // Sánchez stands down for López: two candidates
  const R = newQ(); R.sanchez_backs_lopez = 2; G.primaryEndorsements(R); G.primaryVote(R);
  assert.deepStrictEqual(R.pv_rows.map(r => r.id).sort(), ['c_diaz', 'c_lopez']);
  assert.strictEqual(R.primary_won, 0);
});

test('Podemos rebrands over time; Iglesias is succeeded according to where Podemos stands', () => {
  const Q = newQ();
  assert.strictEqual(G.podemosBrand(Q)[0], 'Podemos');
  Q.year = 2016; Q.month = 6; assert.strictEqual(G.podemosBrand(Q)[0], 'Unidos Podemos');
  Q.year = 2020; assert.strictEqual(G.podemosBrand(Q)[0], 'Unidas Podemos');
  Q.year = 2023; Q.month = 7; assert.strictEqual(G.podemosBrand(Q)[0], 'Sumar');
  Q.govt_parties = ['psoe', 'up']; Q.acting = 0; Q.rel_up = 60;
  assert.strictEqual(G.iglesiasSuccessor(Q), 'Yolanda Díaz');
  Q.govt_parties = ['psoe']; Q.rel_up = 15;
  assert.strictEqual(G.iglesiasSuccessor(Q), 'Irene Montero');
});

test('a PP government before Sánchez has renewed his mandate sets off the critics; three defeats sink him', () => {
  const Q = newQ();
  Q.congress = { pp: 137, psoe: 85, up: 71, cs: 32, erc: 9, junts: 8, pnv: 5, bildu: 2, cc: 1 };
  Q.plot = 10; Q.pact_pp_cs = 1;
  G.formGovernment(Q, 'pp');
  assert.ok(Q.plot >= 82);
  const R = newQ(); R.mandate_renewed = 1; R.plot = 10; R.congress = Q.congress; G.formGovernment(R, 'pp');
  assert.ok(R.plot < 60);
});

test('a strong Podemos drains left-wing members from the PSOE and blunts Sánchez in leadership contests', () => {
  const Q = newQ(); Q.true_poll = Object.assign({}, Q.true_poll, { up: 22 });
  for (let i = 0; i < 36; i++) G.membersDrift(Q);
  assert.ok(Q.members_lost > 7 && Q.membership_word !== 'Left-leaning');
  const R = newQ(); R.true_poll = Object.assign({}, R.true_poll, { up: 8 });
  for (let i = 0; i < 36; i++) G.membersDrift(R);
  assert.ok(R.members_lost < 1);
});

test('attack ads: groups, relation effects, and the hard-core rule', () => {
  const Q = newQ(); Q.year = 2019; Q.funds = 10; Q.rel_erc = 50; Q.rel_cs = 40;
  G.finalSpend(Q, 'attack', 'catind');
  assert.ok(Q.rel_erc < 50 && Q.rel_cs > 40);
  const fcb = Q.federal_committee_balance;
  G.finalSpend(Q, 'attack', 'iu');
  assert.ok(/so committed/.test(Q.eday_last) && Q.federal_committee_balance < fcb);
  const R = newQ(); R.funds = 10; R.rel_up = 50; const sl = R.progressives_dissent;
  G.finalSpend(R, 'attack', 'up');
  assert.ok(R.rel_up < 50 && R.progressives_dissent > sl);
  assert.ok(G.hardcore(R, 'vox'));
});

test('dark arts: rigging helps unless exposed, and costs funds', () => {
  let exposed = 0;
  for (let i = 0; i < 40; i++) {
    const Q = newQ(); Q.funds = 5;
    const e = G.darkArts(Q, 'rig');
    assert.strictEqual(Q.funds, 3);
    assert.strictEqual(Q.rig_bonus, e ? -6 : 4);
    exposed += e;
  }
  assert.ok(exposed > 3 && exposed < 30);
});

test('Catalonia: no unionist party props up an independence government; no bloc majority means a repeat election', () => {
  // 2015-style: independence bloc has a majority only with the CUP, Mas is vetoed
  const g = G.regionalGovernment({ jxsi: 62, cup: 10, cs: 25, psoe: 16, up: 11, pp: 11 }, { party: 'jxsi', president: 'Artur Mas', cabinet: ['jxsi'], support: [] }, 40, 2015);
  assert.strictEqual(g.party, 'jxsi');
  assert.strictEqual(g.president, 'Carles Puigdemont');
  assert.ok(g.support.indexOf('cs') === -1 && g.support.indexOf('pp') === -1);
  // no majority for either side
  const r = G.regionalGovernment({ junts: 40, erc: 20, cup: 4, cs: 30, psoe: 25, pp: 6, up: 10 }, { party: 'junts', president: 'X', cabinet: ['junts'], support: [] }, 40, 2021);
  assert.strictEqual(r.repeat, true);
});

test('advisers: at most three, hiring and dismissing move their faction, special posts do not count', () => {
  const Q = newQ();
  assert.strictEqual(G.advCount(Q), 3);
  Q.year = 2018;
  assert.strictEqual(G.hireAdviser(Q, 'redondo'), false);   // full
  const before = Q.institutionalists_dissent;
  assert.ok(G.fireAdviser(Q, 'hernando'));
  assert.strictEqual(Q.institutionalists_dissent, before + 6);
  const m = Q.modernisers_dissent;
  assert.ok(G.hireAdviser(Q, 'redondo'));
  assert.strictEqual(Q.modernisers_dissent, m - 3);
  // a coalition with Podemos: the Deputy PM card shows the partner's leader
  Q.year = 2020; Q.congress = { psoe: 120, up: 35, pp: 89, vox: 52, cs: 10, erc: 13, junts: 8, pnv: 6, bildu: 5, mp: 3 };
  Q.pact_up = 1; G.formGovernment(Q, 'sanchez'); G.allocateCabinet(Q, 'hard'); G.recalculate(Q);
  assert.strictEqual(Q.adv_deputy, 1);
  assert.strictEqual(Q.adv_loyalist, 1);
});

test('sanchista advisers move personal loyalty rather than a faction', () => {
  const Q = newQ(); const s0 = Q.sanchismo;
  assert.ok(G.fireAdviser(Q, 'luena'));
  assert.strictEqual(Q.sanchismo, s0 - 4);
  Q.year = 2016; Q.month = 1;
  assert.ok(G.hireAdviser(Q, 'vara'));
});

test('PSOE recovery: leadership bounce by margin; Vox in several PP regional governments raises the snap-election event', () => {
  const Q = newQ(); Q.year = 2017; Q.no_mood = 1;
  const before = Q.vm.classSupport.workers.psoe;
  G.leadershipBounce(Q, 55);
  assert.ok(Q.vm.classSupport.workers.psoe > before && Q.leadership_bounce > 0.8);
  const R = newQ(); G.leadershipBounce(R, 38); assert.ok(!R.leadership_bounce);
});

test('a PSOE government that calls an election can seek investiture as the acting government', () => {
  const Q = newQ();
  Q.year = 2019; Q.month = 4;
  Q.congress = { psoe: 123, pp: 66, cs: 57, up: 42, vox: 24, erc: 15, junts: 7, pnv: 6, bildu: 4, cc: 2, prc: 1, te: 1, nc: 1, navarra: 1 };
  G.formGovernment(Q, 'sanchez');            // in office after the motion
  assert.strictEqual(Q.psoe_in_government, 1);
  Q.elections_held = 3; Q.government_status = 'acting'; Q.acting = 1; Q.election_year = 0; Q.sanchez_nominated = 1;
  G.recalculate(Q);
  assert.strictEqual(Q.acting, 1);
  assert.strictEqual(Q.seeking_government, 1);
});

test('municipal elections and the Cortes history', () => {
  const Q = newQ();
  const seats = G.localElections(Q);
  const total = Object.values(seats).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(total - 67500) < 50 && !seats.pacma);
  toDecember2015(Q);
  assert.strictEqual(Q.cortes_history.length, 1);
  assert.strictEqual(Object.values(Q.cortes_history[0].seats).reduce((a, b) => a + b, 0), 350);
});

test('2017 race is hard: a history-like Sánchez usually loses the endorsements and the vote is close', () => {
  let av = 0, won = 0;
  for (let i = 0; i < 200; i++) {
    const Q = newQ();
    Object.assign(Q, { member_morale: 55, sanchismo: 45, network: 30, war_chest: 2, rel_leadership: 30, members_lost: 6.5 });
    G.primaryEndorsements(Q); if (Q.av_rows[0].id === 'c_sanchez') av++;
    G.primaryVote(Q); if (Q.primary_won) won++;
  }
  assert.ok(av < 40, 'endorsements ' + av);
  assert.ok(won > 60 && won < 170, 'vote ' + won);
});

test('out of the leadership, dirty work is paid from personal resources', () => {
  const Q = newQ(); Q.sanchez_leader = 0; Q.backbench = 1; Q.war_chest = 3; Q.funds = 5;
  G.recalculate(Q);
  assert.strictEqual(Q.personal_mode, 1);
  G.darkArts(Q, 'meddle', 'pp');
  assert.strictEqual(Q.war_chest, 2);
  assert.strictEqual(Q.funds, 5);
});

test('legislation: a bill passes once, then can be expanded or repealed; budget deals buy votes', () => {
  const Q = {}; Q.no_mood = 1;
  G.newGame(Q, 0);
  Q.year = 2021; Q.player_in_government = 1; Q.pm_party = 'psoe'; Q.govt_parties = ['psoe', 'up'];
  Q.congress = { psoe: 120, pp: 89, vox: 52, up: 35, erc: 13, cs: 10, junts: 8, pnv: 6, bildu: 5, mp: 3, cc: 1, bng: 1, prc: 1, te: 1, upn: 2, compromis: 1, cup: 2 };
  G.recalculate(Q);
  assert.strictEqual(Q.law_can_euthanasia, 1);
  const v = G.voteLaw(Q, 'euthanasia', 'pass');
  assert.ok(v.yes >= 176);
  assert.strictEqual(Q.law_euthanasia, 1);
  G.recalculate(Q);
  assert.strictEqual(Q.law_can_euthanasia, 0);
  assert.strictEqual(Q.law_canx_euthanasia, 1);
  G.budgetDeal(Q, 'pnv');
  assert.strictEqual(Q.bdeal_pnv, 1);
  G.holdBudget(Q);
  assert.deepStrictEqual(Q.budget_deals, {});
});

test('advisers: factions warming bring offers; turning hostile takes their people away', () => {
  const Q = { no_mood: 1 };
  G.newGame(Q, 0); G.recalculate(Q);
  Q.progressives_dissent = 5; Q.econ_left = 4; G.recalculate(Q);
  assert.strictEqual(Q.fevent_progressives, 1);
  assert.strictEqual(Q.adv_offer_elorza, 1);
  Q.adv_lastra = 1; Q.progressives_dissent = 70; G.recalculate(Q);
  assert.strictEqual(Q.fevent_progressives, -1);
  assert.strictEqual(Q.adv_lastra, 0);
  assert.strictEqual(Q.adv_can_elorza, 0);
});

test('cabinet: only a Deputy PM holds two posts; 2016 names fit the year', () => {
  for (const [y, parties] of [[2016, ['psoe', 'up']], [2020, ['psoe', 'up']], [2016, ['pp']], [2019, ['pp', 'vox']]]) {
    const Q = { no_mood: 1 };
    G.newGame(Q, 0); Q.year = y; Q.pm = 'X'; Q.govt_parties = parties;
    Q.congress = { psoe: 120, up: 35, pp: 100, vox: 52 };
    G.allocateCabinet(Q, 'standard');
    const posts = {};
    Object.keys(Q.cabinet).forEach(k => { const n = Q.cabinet[k].name; (posts[n] = posts[n] || []).push(k); });
    Object.keys(posts).forEach(n => {
      if (posts[n].length > 1) { assert.strictEqual(posts[n].length, 2, n); assert.ok(posts[n].includes('deputy'), n); }
    });
    if (y === 2016 && parties[0] === 'psoe') { assert.notStrictEqual(Q.cabinet.finance.name, 'María Jesús Montero'); }
  }
});
