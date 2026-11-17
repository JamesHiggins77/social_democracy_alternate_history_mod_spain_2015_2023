// Replays Sánchez's real path with the game's own effects and prints each
// general election against the real result.
const G = require('../out/html/spain/game_state.js');
const REAL = {
  '2015-12': { psoe: 90, pp: 123, up: 69, cs: 40, vox: 0 }, '2016-6': { psoe: 85, pp: 137, up: 71, cs: 32, vox: 0 },
  '2019-4': { psoe: 123, pp: 66, up: 42, cs: 57, vox: 24 }, '2019-11': { psoe: 120, pp: 89, up: 35, cs: 10, vox: 52 },
  '2023-7': { psoe: 121, pp: 137, up: 31, cs: 0, vox: 33 }
};
const Q = {}; G.newGame(Q, 0);
const until = (y, m, fn) => { for (let i = 0; i < 200 && (Q.year * 100 + Q.month) < y * 100 + m; i++) { G.endOfMonth(Q); if (Q.has_regional_elections) G.runDueRegionalElections(Q); if (fn) fn(); } };
const elect = () => {
  const key = Q.year + '-' + Q.month;
  const r = G.runGeneralElection(Q); G.recalculate(Q);
  const real = REAL[key] || {};
  const row = ['psoe', 'pp', 'up', 'cs', 'vox'].map(p => `${p} ${Q.congress[p] || 0}${real[p] !== undefined ? '(' + real[p] + ')' : ''}`).join('  ');
  console.log(key.padEnd(8), row, '| PSOE', (r.voteShares.psoe || 0).toFixed(1) + '%', '| econ_left', (Q.econ_left || 0).toFixed(1), 'social', (Q.social_prog || 0).toFixed(1), '| u', Q.unemployment);
};
const noElection = () => { Q.general_election_due = 0; };
// 2015-16: the deadlock and the repeat election
until(2015, 12); elect();
Q.position && 0; G.position(Q, 0.3, 0.3);
until(2016, 6, () => { Q.election_year = 2016; Q.election_month = 6; }); elect();
// October 2016: the caretaker abstains, Rajoy governs; Sánchez gives up his seat and wins the 2017 primary
until(2016, 10); Q.psoe_stance_pp = 'abstain'; Q.pact_pp_cs = 1; G.formGovernment(Q, 'pp');
G.transfer(Q, 'psoe', { up: 0.85, iu: 0.15 }, { workers: 2.5, students: 2.5, unemployed: 2, professionals: 1.5 });
Q.election_year = 0; Q.legislature_start_year = 2016; Q.legislature_start_month = 6;
until(2017, 2); G.transferRaw(Q, 'up', { psoe: 0.7, iu: 0.1, cs: 0.2 }, { professionals: 1, students: 0.8, workers: 0.6, unemployed: 0.5 }); // Vistalegre II
until(2017, 10); Q.catalan_crisis = 1; Q.cat_crisis_seen = 1; G.position(Q, 0, -0.5); // the crisis; Sánchez backs 155
until(2018, 5); Q.catalan_crisis = 0; Q.cat_tension = 10;
G.transferRaw(Q, 'up', { psoe: 0.6, iu: 0.2, mp: 0.2 }, { workers: 0.8, unemployed: 0.8, students: 0.6, pensioners: 0.3 }); // chalet
Q.pp_scandal = (Q.pp_scandal || 0) + 3; G.campaign(Q, 'pp', { pensioners: -3, professionals: -3, self_employed: -2, workers: -2, homemakers: -2 }); // Gürtel
until(2018, 6);
// June 2018: the motion of no confidence
Q.rel_up = 40; Q.rel_pnv = 50; G.holdCensure(Q); if (!Q.censure_passed) { console.log('censure FAILED', Q.inv_yes); G.formGovernment(Q, 'sanchez'); }
// historical decisions in government
G.position(Q, 0, 1.2); G.target(Q, 'psoe', 'young', 1.5); G.campaign(Q, 'vox', { pensioners: 0.8, self_employed: 0.8, workers: 0.5 }); // Aquarius
until(2018, 10);
G.campaign(Q, 'psoe', { pensioners: 3 }); G.position(Q, 0.3, 0); G.social(Q, 2); // index pensions
until(2018, 12);
Q.vox_breakthrough = 1; G.transferRaw(Q, 'pp', 'vox', { pensioners: 2, self_employed: 3, workers: 1.5, professionals: 1.5, homemakers: 1.5, unemployed: 1 }); G.transferRaw(Q, 'cs', 'vox', { self_employed: 1.5, workers: 1, professionals: 1, students: 0.8 }); G.transferRaw(Q, 'psoe', 'vox', { workers: 0.5, unemployed: 0.5 }); // Andalusia
G.campaign(Q, 'psoe', { workers: 3, unemployed: 1.5, students: 1, self_employed: -1.5 }); G.position(Q, 1, 0); G.econ(Q, -0.1, 0.25); G.social(Q, 3); // minimum wage +22%
until(2019, 2);
// February 2019: the budget falls, an election for April
Q.election_year = 2019; Q.election_month = 4;
until(2019, 4); elect();
Q.government_status = 'acting'; G.dissolve(Q);
until(2019, 10); Q.cat_tension = (Q.cat_tension || 0) + 15; G.transferRaw(Q, 'pp', 'vox', { self_employed: 2, pensioners: 1.5, workers: 1, homemakers: 1, professionals: 1 }); G.transferRaw(Q, 'cs', 'vox', { self_employed: 1.5, workers: 1.5, professionals: 1.2, students: 1, pensioners: 0.8 }); // the sentence and the riots
until(2019, 11, () => { Q.election_year = 2019; Q.election_month = 11; }); elect();
// January 2020: the PSOE–Podemos coalition
Q.pact_up = 1; G.formGovernment(Q, 'sanchez');
G.campaign(Q, 'psoe', { students: 1.5, workers: 1, professionals: 1 }); G.position(Q, 0, 1.5); // Franco exhumed (Oct 2019)
until(2020, 3);
G.econ(Q, -1.5, 1.0); G.social(Q, 1); G.campaign(Q, 'psoe', { pensioners: 2, homemakers: 1 }); G.campaign(Q, 'vox', { self_employed: 2, professionals: 0.5 }); // strict lockdown
until(2020, 7); G.econ(Q, 0.4 * 2, -0.2 * 2); // recovery fund, green
until(2021, 6);
G.transfer(Q, 'psoe', { pp: 0.5, vox: 0.3, cs: 0.2 }, { pensioners: 2, homemakers: 1.5, self_employed: 1.5 }); G.position(Q, 0, 1.5); // pardons
until(2021, 12); G.econ(Q, 0.1, -0.3); G.position(Q, -0.3, 0); // labour reform by agreement
until(2023, 7, () => { Q.election_year = 2023; Q.election_month = 7; }); elect();
