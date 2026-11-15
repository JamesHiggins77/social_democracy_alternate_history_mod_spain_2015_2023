// Parliamentary arithmetic for investitures (Constitution art. 99) and how
// each group decides its vote. All cards and events use these functions.
(function (root) {
  'use strict';

  var MAJORITY = 176;

  function relation(Q, id, fallback) {
    var v = Q['rel_' + id];
    return v === undefined ? fallback : v;
  }

  // Relations between other parties (0-100), independent of the PSOE.
  // Stored in Q.party_rel under 'a-b' keys (alphabetical); these defaults
  // describe 2014-15. Events move them.
  var PARTY_REL = {
    'cs-erc': 5, 'cs-junts': 8, 'bildu-cs': 0, 'cs-up': 20, 'cs-pnv': 35, 'cs-pp': 55, 'cs-vox': 30,
    'erc-pp': 10, 'junts-pp': 20, 'bildu-pp': 0, 'pp-up': 5, 'pnv-pp': 45, 'pp-vox': 45, 'cc-pp': 60,
    'erc-up': 50, 'junts-up': 30, 'bildu-up': 45, 'pnv-up': 40, 'pnv-vox': 0, 'junts-pnv': 55,
    'erc-junts': 55, 'erc-vox': 0, 'junts-vox': 0, 'up-vox': 0, 'iu-up': 70, 'bildu-pnv': 25
  };

  function pairKey(a, b) {
    return a < b ? a + '-' + b : b + '-' + a;
  }

  function between(Q, a, b) {
    var k = pairKey(a, b);
    if (Q.party_rel && Q.party_rel[k] !== undefined) {
      return Q.party_rel[k];
    }
    return PARTY_REL[k] === undefined ? 40 : PARTY_REL[k];
  }

  // Parties that refuse to share a majority: if `a` votes yes or abstains
  // alongside parties it detests, it votes no instead.
  function vetoes(Q, stances) {
    var helping = function (p) { return stances[p] === 'yes' || stances[p] === 'abstain'; };
    // Ciudadanos will not share a majority with independence parties
    if (helping('cs') && ['erc', 'junts', 'bildu'].some(function (p) {
      return helping(p) && between(Q, 'cs', p) < 30;
    })) {
      stances.cs = 'no';
    }
    // the PNV will not back a government that depends on Vox
    if (helping('pnv') && helping('vox') && between(Q, 'pnv', 'vox') < 20) {
      stances.pnv = 'no';
    }
    // Podemos will not share a majority with Ciudadanos unless relations thaw
    if (stances.up === 'yes' && stances.cs === 'yes' && between(Q, 'cs', 'up') < 40) {
      stances.up = 'abstain';
    }
    return stances;
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
    return vetoes(Q, {
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
    });
  }

  // How each group votes on Mariano Rajoy's (or another PP leader's)
  // investiture. Q.psoe_stance_pp: 'no' or 'abstain', the player's choice.
  function stancesForPP(Q) {
    return vetoes(Q, {
      pp: 'yes', vox: between(Q, 'pp', 'vox') >= 30 ? 'yes' : 'abstain', upn: 'yes',
      psoe: Q.psoe_stance_pp || 'no',
      cs: Q.pact_cs ? 'no' : (Q.pact_pp_cs ? 'yes' : 'abstain'),
      cc: between(Q, 'cc', 'pp') >= 50 ? 'yes' : 'abstain',
      up: 'no', iu: 'no', mp: 'no', erc: 'no', junts: 'no', cup: 'no', bildu: 'no',
      pnv: between(Q, 'pnv', 'pp') >= 65 ? 'yes' : 'no',
      nc: 'no', bng: 'no', prc: 'abstain', te: 'no', geroa: 'no'
    });
  }

  // Albert Rivera (Ciudadanos) as the right's candidate, when Cs leads it.
  function stancesForCs(Q) {
    var st = stancesForPP(Q);
    st.cs = 'yes';
    st.pp = Q.pact_pp_cs || between(Q, 'cs', 'pp') >= 50 ? 'yes' : 'abstain';
    st.psoe = Q.psoe_stance_pp || 'no';
    st.pnv = between(Q, 'cs', 'pnv') >= 50 ? 'abstain' : 'no';
    return vetoes(Q, st);
  }

  // Pablo Iglesias (Podemos) as candidate, with the PSOE's support
  // (Q.psoe_backs_iglesias: 'coalition' or 'external').
  function stancesForUP(Q) {
    var psoeYes = !!Q.psoe_backs_iglesias;
    return vetoes(Q, {
      up: 'yes', iu: 'yes', mp: 'yes', psoe: psoeYes ? 'yes' : 'no',
      pp: 'no', vox: 'no', upn: 'no', cs: 'no',
      erc: between(Q, 'erc', 'up') >= 45 ? 'abstain' : 'no',
      junts: between(Q, 'junts', 'up') >= 45 ? 'abstain' : 'no',
      bildu: between(Q, 'bildu', 'up') >= 40 ? 'yes' : 'abstain',
      pnv: between(Q, 'pnv', 'up') >= 55 ? 'yes' : 'abstain',
      cup: 'abstain', cc: 'no', nc: 'abstain', bng: 'yes', prc: 'no', te: 'abstain', geroa: 'yes'
    });
  }

  // Motion of no confidence (art. 113) with Sánchez as the alternative
  // candidate. Needs an absolute majority of yes votes. Q.pp_scandal
  // (0-5) measures how toxic the PP government has become.
  function stancesForCensure(Q) {
    var scandal = Q.pp_scandal || 0;
    var outWithRajoy = function (id, rel) {
      return (relation(Q, id, 30) >= rel || scandal >= 3) ? 'yes' : 'abstain';
    };
    return {
      psoe: 'yes', pp: 'no', vox: 'no', upn: 'no',
      cs: relation(Q, 'cs', 45) >= 75 ? 'yes' : 'no',
      up: relation(Q, 'up', 35) >= 30 ? 'yes' : 'abstain',
      iu: relation(Q, 'iu', 40) >= 30 ? 'yes' : 'abstain',
      mp: 'yes',
      erc: outWithRajoy('erc', 50),
      junts: outWithRajoy('junts', 55),
      cup: 'abstain',
      pnv: (relation(Q, 'pnv', 45) >= 65 || (scandal >= 3 && relation(Q, 'pnv', 45) >= 40)) ? 'yes' : 'no',
      bildu: scandal >= 2 || relation(Q, 'bildu', 10) >= 30 ? 'yes' : 'abstain',
      cc: relation(Q, 'cc', 45) >= 70 ? 'yes' : 'abstain',
      nc: 'yes', bng: 'yes', geroa: 'yes', prc: 'abstain', te: 'yes', foro: 'no'
    };
  }

  // Budget vote for a PSOE government. Q.cat_dialogue (0-3) measures the
  // dialogue offered to Catalonia, which ERC and Junts demand.
  function stancesForBudget(Q) {
    var dialogue = Q.cat_dialogue || 0;
    return {
      psoe: 'yes', pp: 'no', vox: 'no', upn: 'no',
      cs: relation(Q, 'cs', 45) >= 70 ? 'yes' : 'no',
      up: (Q.pact_up || relation(Q, 'up', 35) >= 50) ? 'yes' : 'no',
      iu: (Q.pact_up || relation(Q, 'iu', 40) >= 50) ? 'yes' : 'no',
      mp: relation(Q, 'up', 35) >= 40 ? 'yes' : 'abstain',
      erc: dialogue >= 2 && relation(Q, 'erc', 25) >= 45 ? 'yes' : 'no',
      junts: dialogue >= 3 && relation(Q, 'junts', 20) >= 50 ? 'yes' : 'no',
      cup: 'no',
      pnv: byRelation(Q, 'pnv', 50, 35),
      bildu: relation(Q, 'bildu', 10) >= 35 ? 'yes' : (relation(Q, 'bildu', 10) >= 20 ? 'abstain' : 'no'),
      cc: byRelation(Q, 'cc', 45, 30),
      nc: 'yes', bng: byRelation(Q, 'bng', 50, 30), geroa: 'yes', prc: byRelation(Q, 'prc', 45, 30),
      te: 'yes', foro: 'no'
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
    var st = candidate === 'sanchez' ? stancesForSanchez(Q)
      : (candidate === 'up' ? stancesForUP(Q) : (candidate === 'cs' ? stancesForCs(Q) : stancesForPP(Q)));
    return count(seats, st);
  }

  // Did a vote depend on the independence parties? True if it passes with
  // their votes or abstentions but would fail if they voted no.
  function dependsOnIndependentists(seats, stances) {
    var with_ = count(seats, stances);
    if (!with_.passes) {
      return false;
    }
    var without = JSON.parse(JSON.stringify(stances));
    ['erc', 'junts', 'bildu', 'cup'].forEach(function (p) { without[p] = 'no'; });
    return !count(seats, without).passes;
  }

  var api = {
    MAJORITY: MAJORITY,
    stancesForSanchez: stancesForSanchez,
    stancesForPP: stancesForPP,
    stancesForCs: stancesForCs,
    stancesForUP: stancesForUP,
    between: between,
    pairKey: pairKey,
    PARTY_REL: PARTY_REL,
    dependsOnIndependentists: dependsOnIndependentists,
    stancesForCensure: stancesForCensure,
    stancesForBudget: stancesForBudget,
    count: count,
    investiture: investiture
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SpainParliament = api;
  }
})(this);
