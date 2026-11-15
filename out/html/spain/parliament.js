// Parliamentary arithmetic for investitures (Constitution art. 99) and how
// each group decides its vote. All cards and events use these functions.
(function (root) {
  'use strict';

  var MAJORITY = 176;

  function relation(Q, id, fallback) {
    var v = Q['rel_' + id];
    return v === undefined ? fallback : v;
  }

  function byRelation(Q, id, yesAt, abstainAt) {
    var r = relation(Q, id, 35);
    return r >= yesAt ? 'yes' : (r >= abstainAt ? 'abstain' : 'no');
  }

  // How each group votes on Pedro Sánchez's investiture, given the state.
  // Q.pact_cs: signed agreement with Ciudadanos. Q.pact_up: agreement with
  // Podemos. Q.red_lines: the Federal Committee bars deals with parties
  // demanding a self-determination referendum.
  function stancesForSanchez(Q) {
    var cs = Q.pact_cs ? 'yes'
      : (!Q.pact_up && relation(Q, 'cs', 45) >= 70 ? 'abstain' : 'no');
    var up;
    if (Q.pact_up) {
      up = 'yes';
    } else if (Q.pact_cs) {
      // Podemos treats a PSOE–Cs deal as a government of the right
      up = relation(Q, 'up', 35) >= 80 ? 'abstain' : 'no';
    } else {
      up = relation(Q, 'up', 35) >= 60 ? 'abstain' : 'no';
    }
    var independence = (!Q.red_lines && Q.referendum_offer && !Q.pact_cs) ? 'abstain' : 'no';
    return {
      psoe: 'yes',
      pp: 'no', vox: 'no', upn: 'no',
      cs: cs,
      up: up,
      iu: Q.pact_up ? 'yes' : (relation(Q, 'iu', 40) >= 55 && !Q.pact_cs ? 'abstain' : 'no'),
      mp: Q.pact_up ? 'yes' : byRelation(Q, 'mp', 55, 35),
      erc: independence,
      junts: independence,
      cup: 'no',
      pnv: byRelation(Q, 'pnv', 65, 45),
      bildu: (Q.pact_up && !Q.pact_cs && relation(Q, 'bildu', 10) >= 40) ? 'abstain' : 'no',
      cc: Q.pact_cs ? 'yes' : byRelation(Q, 'cc', 65, 45),
      nc: byRelation(Q, 'nc', 55, 35),
      bng: byRelation(Q, 'bng', 60, 40),
      prc: byRelation(Q, 'prc', 50, 30),
      te: byRelation(Q, 'te', 50, 30),
      geroa: byRelation(Q, 'geroa', 50, 30)
    };
  }

  // How each group votes on Mariano Rajoy's (or another PP leader's)
  // investiture. Q.psoe_stance_pp: 'no' or 'abstain', the player's choice.
  function stancesForPP(Q) {
    return {
      pp: 'yes', vox: 'yes', upn: 'yes',
      psoe: Q.psoe_stance_pp || 'no',
      cs: Q.pact_cs ? 'no' : (Q.pact_pp_cs ? 'yes' : 'abstain'),
      cc: 'yes',
      up: 'no', iu: 'no', mp: 'no', erc: 'no', junts: 'no', cup: 'no', bildu: 'no',
      pnv: 'no', nc: 'no', bng: 'no', prc: 'abstain', te: 'no', geroa: 'no'
    };
  }

  // Count a vote. seats: {party: n}. stances: {party: 'yes'|'abstain'|'no'}.
  // Parties without a stance vote no.
  function count(seats, stances) {
    var tally = { yes: 0, no: 0, abstain: 0, detail: {} };
    Object.keys(seats).forEach(function (id) {
      var s = stances[id] || 'no';
      tally[s] += seats[id];
      tally.detail[id] = s;
    });
    tally.firstBallot = tally.yes >= MAJORITY;
    tally.secondBallot = tally.yes > tally.no;
    tally.passes = tally.firstBallot || tally.secondBallot;
    return tally;
  }

  function investiture(seats, candidate, Q) {
    return count(seats, candidate === 'sanchez' ? stancesForSanchez(Q) : stancesForPP(Q));
  }

  var api = {
    MAJORITY: MAJORITY,
    stancesForSanchez: stancesForSanchez,
    stancesForPP: stancesForPP,
    count: count,
    investiture: investiture
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SpainParliament = api;
  }
})(this);
