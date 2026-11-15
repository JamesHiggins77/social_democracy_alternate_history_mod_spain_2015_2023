// The Spanish campaign's state and its monthly routine. Scenes call these
// functions; the rules are in docs/design/00-core-rules.md.
//
// All state lives in Q (the save game). Derived data - the vote model
// baseline - is rebuilt on demand and never saved.
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  function lib(name, file) {
    return isNode ? require('./' + file) : root[name];
  }
  var VoteModel = lib('SpainVoteModel', 'vote_model.js');
  var RegionalModel = lib('SpainRegionalModel', 'regional_model.js');
  var Parliament = lib('SpainParliament', 'parliament.js');
  var UI = lib('SpainUI', 'spain_ui.js');
  var DATA = lib('SPAIN_ELECTION_DATA', 'election_data.js');
  var REGIONAL = lib('SPAIN_REGIONAL_DATA', 'regional_data.js');

  var FACTIONS = ['institutionalists', 'regional_leaders', 'progressives', 'modernisers', 'trade_unionists'];
  var FACTION_NAMES = {
    institutionalists: 'Institutionalists', regional_leaders: 'Regional Leaders',
    progressives: 'Progressives', modernisers: 'Modernisers', trade_unionists: 'Trade Unionists'
  };
  var RELATIONS = ['pp', 'cs', 'up', 'iu', 'erc', 'junts', 'pnv', 'bildu', 'cc'];
  var LEFT_BLOC = ['psoe', 'up', 'iu', 'mp', 'compromis', 'mes', 'mxme', 'cha', 'bng', 'geroa'];
  var RIGHT_BLOC = ['pp', 'cs', 'vox', 'upn', 'par', 'foro', 'elpi'];
  // Territorial parties that lead their own community when largest.
  var TERRITORIAL_LEADERS = ['pnv', 'cc', 'prc', 'jxsi', 'junts', 'erc', 'geroa'];

  var cachedBase = null;
  function base() {
    if (!cachedBase) {
      cachedBase = VoteModel.buildBaseline(DATA, VoteModel.initialState());
    }
    return cachedBase;
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  // ------------------------------------------------------------------
  // New game: 20 November 2015, one month before the general election.
  // Congress and government are those elected in November 2011.
  // ------------------------------------------------------------------
  function officialShares(key) {
    var provs = DATA.elections[key].provinces;
    var ballots = {};
    Object.keys(provs).forEach(function (p) {
      ballots[p] = { lists: provs[p].lists.map(function (l) { return { id: l[0], votes: l[2] }; }) };
    });
    return VoteModel.nationalShares(ballots);
  }

  function newGame(Q, difficulty) {
    Q.started = 1;
    Q.spain = 1;
    Q.difficulty = difficulty || 0;
    Q.time = 1;
    Q.year = 2015;
    Q.month = 11;
    Q.month_actions = 0;
    Q.advisor_action_timer = 0;
    Q.last_advisor_action = 0;
    Q.timers = ['advisor_action', 'negotiations', 'barons', 'media', 'membership', 'rally',
                'debate', 'scandal', 'federal_exec', 'ugt', 'juventudes', 'programme', 'podemos_talks',
                'cs_talks', 'small_parties', 'catalans', 'budget', 'wage', 'memory', 'pensions',
                'labour', 'reshuffle', 'cat_155', 'cat_dialogue', 'cat_psc', 'cat_federal', 'censure',
                'pensions_campaign', 'feminism', 'europe', 'housing'];

    // Congress elected on 20 November 2011
    Q.congress = { pp: 186, psoe: 110, junts: 16, iu: 11, bildu: 7, upyd: 5, pnv: 5, erc: 3,
                   bng: 2, cc: 2, mp: 1, foro: 1, geroa: 1 };
    Q.vote_shares = officialShares('2011');
    Q.prev_congress = null;
    Q.prev_vote_shares = null;
    Q.elections_held = 0;
    Q.election_records = [{ date: '2011-11', seats: Q.congress }];
    Q.vm = VoteModel.initialState();
    Q.regions = RegionalModel.startingParliaments(REGIONAL);

    // Government: Rajoy's majority, with the election called for December
    Q.pm = 'Mariano Rajoy';
    Q.pm_party = 'pp';
    Q.government_status = 'formed';
    Q.government_type = 'PP majority government';
    Q.psoe_in_government = 0;
    Q.legislature_start_year = 2011;
    Q.legislature_start_month = 12;
    Q.investiture_clock = -1;   // months to automatic dissolution; -1 = not started
    Q.investiture_votes = 0;
    Q.election_year = 2015;     // scheduled general election, 0 = none
    Q.election_month = 12;
    Q.sanchez_nominated = 0;
    Q.rajoy_declined = 0;
    Q.psoe_stance_pp = 'no';
    Q.formation_round = 1;
    Q.formation_start_time = 1;
    Q.pp_asked = 0;
    Q.king_asked = 0;

    // Sánchez and the PSOE
    Q.sanchez_leader = 1;
    Q.leadership_exception_open = 0;
    Q.sanchez_authority = 66;
    Q.member_morale = 60;
    Q.federal_committee_balance = 48;
    Q.sanchismo = 30;
    Q.institutionalists_strength = 25; Q.institutionalists_dissent = 20;
    Q.regional_leaders_strength = 30; Q.regional_leaders_dissent = 30;
    Q.progressives_strength = 15; Q.progressives_dissent = 10;
    Q.modernisers_strength = 20; Q.modernisers_dissent = 5;
    Q.trade_unionists_strength = 10; Q.trade_unionists_dissent = 10;

    // Relations with other parties (0-100)
    Q.rel_pp = 20; Q.rel_cs = 45; Q.rel_up = 35; Q.rel_iu = 40; Q.rel_erc = 25;
    Q.rel_junts = 20; Q.rel_pnv = 45; Q.rel_bildu = 10; Q.rel_cc = 45;
    Q.rel_bng = 40; Q.rel_prc = 45; Q.rel_te = 45; Q.rel_geroa = 45; Q.rel_nc = 45; Q.rel_mp = 50;
    Q.up_talks = 0; Q.cs_talks = 0;
    Q.pact_cs = 0; Q.pact_up = 0; Q.red_lines = 0; Q.referendum_offer = 0;
    Q.pp_vox_relation = 50;
    Q.catalan_crisis = 0;
    Q.pp_scandal = 0;

    updatePolls(Q);
    recalculate(Q);
  }

  // ------------------------------------------------------------------
  // Derived quantities, recalculated after every action.
  // ------------------------------------------------------------------
  function recalculate(Q) {
    var total = 0;
    var weighted = 0;
    FACTIONS.forEach(function (f) {
      Q[f + '_strength'] = Math.max(1, Q[f + '_strength']);
      Q[f + '_dissent'] = clamp(Q[f + '_dissent'], 0, 99);
      total += Q[f + '_strength'];
    });
    FACTIONS.forEach(function (f) {
      Q[f + '_strength'] = 100 * Q[f + '_strength'] / total;
      weighted += Q[f + '_strength'] * Q[f + '_dissent'];
    });
    Q.dissent_percent = Math.round(weighted / 100);
    Q.dissent = Q.dissent_percent / 100;
    Q.psoe_unity = 100 - Q.dissent_percent;
    ['sanchez_authority', 'member_morale', 'federal_committee_balance', 'sanchismo',
     'pp_vox_relation'].forEach(function (k) { Q[k] = clamp(Math.round(Q[k]), 0, 100); });
    RELATIONS.forEach(function (p) { Q['rel_' + p] = clamp(Math.round(Q['rel_' + p]), 0, 100); });
    Q.acting = Q.government_status === 'acting' ? 1 : 0;
    Q.pp_governs = (Q.pm_party === 'pp' && !Q.acting) ? 1 : 0;
    Q.pm_is_pp = Q.pm_party === 'pp' ? 1 : 0;
    Q.seeking_government = (Q.acting && !Q.psoe_in_government && Q.elections_held >= 1 &&
      !Q.election_year && Q.sanchez_leader) ? 1 : 0;
    var cat = Q.regions && Q.regions['Cataluña'] && Q.regions['Cataluña'].government;
    Q.catalonia_independentist = (cat && ['jxsi', 'junts', 'erc'].indexOf(cat.party) !== -1) ? 1 : 0;
    Q.authority_word = UI.word('authority', Q.sanchez_authority);
    Q.morale_word = UI.word('morale', Q.member_morale);
    Q.unity_word = UI.word('unity', Q.psoe_unity);
    Q.committee_word = UI.word('committee', Q.federal_committee_balance);
    Q.sanchismo_word = UI.word('sanchismo', Q.sanchismo);
    Q.congress_text = congressText(Q.congress);
  }

  function congressText(seats) {
    return Object.keys(seats).sort(function (a, b) { return seats[b] - seats[a]; })
      .map(function (id) { return UI.partyName(id) + ' ' + seats[id]; }).join(', ');
  }

  // Polls: national vote shares from the vote model.
  function updatePolls(Q) {
    var r = VoteModel.runGeneralElection(Q.vm, base(), DATA, Q.year, Q.month);
    Q.poll = r.voteShares;
    Q.poll_seats = r.totals;
    Q.poll_psoe = Math.round(r.voteShares.psoe || 0);
    Q.poll_pp = Math.round(r.voteShares.pp || 0);
    Q.poll_vox = Math.round(r.voteShares.vox || 0);
    return r;
  }

  // Apply a support change to the PSOE among classes, damped by party
  // dissent as in the original. changes: {class: points}.
  function shiftSupport(Q, party, changes) {
    Object.keys(changes).forEach(function (c) {
      var v = changes[c] > 0 ? changes[c] * (1 - Q.dissent) : changes[c];
      Q.vm.classSupport[c][party] = Math.max(0, Q.vm.classSupport[c][party] + v);
    });
  }

  // Card helpers ------------------------------------------------------
  // Shift a party's support by class and refresh the polls.
  function campaign(Q, party, changes) {
    shiftSupport(Q, party, changes);
    updatePolls(Q);
  }

  // Multiply a statewide party's strength in one region (e.g. Cs in
  // Catalonia during the crisis).
  function regionalMod(Q, region, party, factor) {
    Q.vm.regionalMod[region] = Q.vm.regionalMod[region] || {};
    var cur = Q.vm.regionalMod[region][party] === undefined ? 1 : Q.vm.regionalMod[region][party];
    Q.vm.regionalMod[region][party] = cur * factor;
    updatePolls(Q);
  }

  // Multiply a territorial party's strength in its region.
  function territorial(Q, region, party, factor) {
    Q.vm.territorialMod[region] = Q.vm.territorialMod[region] || {};
    var cur = Q.vm.territorialMod[region][party] === undefined ? 1 : Q.vm.territorialMod[region][party];
    Q.vm.territorialMod[region][party] = cur * factor;
    updatePolls(Q);
  }

  // Motion of no confidence with Sánchez as candidate.
  function holdCensure(Q) {
    var v = Parliament.count(Q.congress, Parliament.stancesForCensure(Q));
    Q.inv_yes = v.yes; Q.inv_no = v.no; Q.inv_abstain = v.abstain;
    Q.censure_passed = v.yes >= Parliament.MAJORITY ? 1 : 0;
    if (Q.censure_passed) {
      formGovernment(Q, 'sanchez');
      Q.government_type = 'PSOE government after a motion of no confidence';
    }
    recalculate(Q);
    return v;
  }

  // Budget vote for a PSOE government.
  function holdBudget(Q) {
    var v = Parliament.count(Q.congress, Parliament.stancesForBudget(Q));
    Q.inv_yes = v.yes; Q.inv_no = v.no; Q.inv_abstain = v.abstain;
    Q.budget_passed = v.yes > v.no ? 1 : 0;
    return v;
  }

  // The Prime Minister calls an early general election (two months on).
  function callElection(Q) {
    var d = addMonths(Q.year, Q.month, 2);
    Q.election_year = d[0];
    Q.election_month = d[1];
    recalculate(Q);
  }

  function dateKey(y, m) {
    return y * 100 + m;
  }

  function addMonths(y, m, n) {
    var t = y * 12 + (m - 1) + n;
    return [Math.floor(t / 12), (t % 12) + 1];
  }

  // ------------------------------------------------------------------
  // The monthly routine (called from post_event once a month has passed).
  // ------------------------------------------------------------------
  function endOfMonth(Q) {
    var next = addMonths(Q.year, Q.month, 1);
    Q.year = next[0];
    Q.month = next[1];
    Q.time += 1;
    Q.month_actions = 0;
    (Q.timers || []).forEach(function (t) {
      if (Q[t + '_timer'] > 0) {
        Q[t + '_timer'] -= 1;
      }
    });

    // investiture clock (art. 99.5)
    if (Q.investiture_clock > 0) {
      Q.investiture_clock -= 1;
      if (Q.investiture_clock === 0) {
        Q.dissolution_due = 1;
      }
    }

    // drift: dissent and morale slowly relax; acting governments wear thin
    FACTIONS.forEach(function (f) {
      if (Q[f + '_dissent'] > 15) {
        Q[f + '_dissent'] -= 1;
      }
    });
    if (Q.government_status === 'acting') {
      Q.member_morale -= 0.5;
    }

    // regional elections due this month
    var due = [];
    Object.keys(Q.regions).forEach(function (r) {
      var d = Q.regions[r].nextElection.split('-');
      if (dateKey(Number(d[0]), Number(d[1])) <= dateKey(Q.year, Q.month)) {
        due.push(r);
      }
    });
    Q.regional_elections_due = due;
    Q.has_regional_elections = due.length > 0 ? 1 : 0;

    // the legislature's four years run out: an election two months later
    if (!Q.election_year && Q.legislature_start_year &&
        dateKey(Q.year, Q.month) >= dateKey(Q.legislature_start_year + 4, Q.legislature_start_month) - 2) {
      var e = addMonths(Q.year, Q.month, 2);
      Q.election_year = e[0];
      Q.election_month = e[1];
      Q.legislature_expired = 1;
    }

    // general election due
    Q.general_election_due = (Q.election_year &&
      dateKey(Q.election_year, Q.election_month) <= dateKey(Q.year, Q.month)) ? 1 : 0;

    updatePolls(Q);
    recalculate(Q);
    checkLeadership(Q);
  }

  // ------------------------------------------------------------------
  // Investiture
  // ------------------------------------------------------------------
  function projectedVote(Q, candidate) {
    var v = Parliament.investiture(Q.congress, candidate, Q);
    Q.inv_yes = v.yes;
    Q.inv_no = v.no;
    Q.inv_abstain = v.abstain;
    Q.inv_first = v.firstBallot ? 1 : 0;
    Q.inv_passes = v.passes ? 1 : 0;
    Q.inv_detail = v.detail;
    return v;
  }

  // Holds the vote. Starts the two-month clock on the first vote of a
  // legislature. Returns the tally.
  function holdInvestiture(Q, candidate) {
    var v = projectedVote(Q, candidate);
    Q.investiture_votes += 1;
    if (Q.investiture_clock < 0) {
      Q.investiture_clock = 2;
    }
    if (v.passes) {
      formGovernment(Q, candidate);
    }
    return v;
  }

  function formGovernment(Q, candidate) {
    Q.government_status = 'formed';
    Q.repeat_elections = 0;
    Q.investiture_clock = -1;
    Q.dissolution_due = 0;
    if (candidate === 'sanchez') {
      Q.pm = 'Pedro Sánchez';
      Q.pm_party = 'psoe';
      Q.psoe_in_government = 1;
      Q.government_type = Q.pact_up ? 'PSOE government with Podemos support'
        : (Q.pact_cs ? 'PSOE government with Ciudadanos support' : 'PSOE minority government');
    } else {
      Q.pm = Q.pp_leader || 'Mariano Rajoy';
      Q.pm_party = 'pp';
      Q.psoe_in_government = 0;
      Q.government_type = 'PP minority government';
    }
    Q.legislature_end_year = Q.legislature_start_year + 4;
  }

  // Automatic dissolution: election 54 days after the decree (two months
  // later in the monthly calendar).
  function dissolve(Q) {
    var d = addMonths(Q.year, Q.month, 2);
    Q.election_year = d[0];
    Q.election_month = d[1];
    Q.dissolution_due = 0;
    Q.investiture_clock = -1;
  }

  // ------------------------------------------------------------------
  // General election
  // ------------------------------------------------------------------
  function runGeneralElection(Q) {
    var r = VoteModel.runGeneralElection(Q.vm, base(), DATA, Q.year, Q.month);
    var old = Q.congress;
    Q.prev_congress = old;
    Q.prev_vote_shares = Q.vote_shares;
    Q.congress = r.totals;
    Q.vote_shares = r.voteShares;
    Q.elections_held = (Q.elections_held || 0) + 1;
    Q.election_records.push({ date: Q.year + '-' + Q.month, seats: r.totals });
    Q.election_year = 0;
    Q.election_month = 0;
    Q.general_election_due = 0;
    Q.legislature_start_year = Q.year;
    Q.legislature_start_month = Q.month;
    // a new legislature: talks and pacts start again
    Q.investiture_clock = -1;
    Q.investiture_votes = 0;
    Q.sanchez_nominated = 0;
    Q.rajoy_declined = 0;
    Q.pact_cs = 0;
    Q.pact_up = 0;
    Q.up_talks = 0;
    Q.cs_talks = 0;
    var statusBefore = Q.government_status;
    Q.government_status = 'acting';
    Q.formation_round = (Q.formation_round || 1) + 1;
    Q.formation_start_time = Q.time;
    Q.psoe_stance_pp = 'no';
    // Repeat elections: the right regroups and the party blames the leader.
    var wasActing = statusBefore === 'acting';
    Q.repeat_elections = wasActing ? (Q.repeat_elections || 0) + 1 : 0;
    var repeat = Q.repeat_elections;
    if (repeat >= 1) {
      Q.pact_pp_cs = 1;
      Q.regional_leaders_dissent += 12 * repeat;
      Q.institutionalists_dissent += 8 * repeat;
      Q.sanchez_authority -= 6 * repeat;
      Q.federal_committee_balance -= 5 * repeat;
    }
    var verdict = UI.noPathToGovernment(r.totals);
    Q.election_verdict = verdict.reason;
    if (verdict.lost) {
      Q.loss_reason = verdict.reason;
    }
    var swing = (r.totals.psoe || 0) - (old.psoe || 0);
    Q.sanchez_authority += swing / 2;
    Q.member_morale += swing / 2;
    recalculate(Q);
    return r;
  }

  // ------------------------------------------------------------------
  // Regional elections
  // ------------------------------------------------------------------
  function regionalGovernment(seats, previous) {
    var total = 0;
    Object.keys(seats).forEach(function (id) { total += seats[id]; });
    var majority = Math.floor(total / 2) + 1;
    var sum = function (list) {
      return list.reduce(function (a, id) { return a + (seats[id] || 0); }, 0);
    };
    var largest = Object.keys(seats).sort(function (a, b) { return seats[b] - seats[a]; })[0];
    var left = sum(LEFT_BLOC);
    var right = sum(RIGHT_BLOC);
    var lead = function (bloc) {
      return bloc.filter(function (id) { return seats[id]; })
        .sort(function (a, b) { return seats[b] - seats[a]; })[0];
    };
    var party;
    if (TERRITORIAL_LEADERS.indexOf(largest) !== -1 && seats[largest] >= total * 0.3) {
      party = largest;
    } else if (right >= majority || (right > left && right >= total * 0.45)) {
      party = lead(RIGHT_BLOC);
    } else if (left >= majority || left > right) {
      party = lead(LEFT_BLOC);
    } else {
      party = largest;
    }
    var cabinet = [party];
    if (party === 'pp' && (seats.pp || 0) < majority && (seats.pp || 0) + (seats.cs || 0) < majority &&
        (seats.vox || 0) > 0) {
      cabinet.push('vox');
    }
    var president = previous && previous.party === party ? previous.president
      : UI.partyName(party) + ' president';
    return { president: president, party: party, cabinet: cabinet, support: [] };
  }

  function runDueRegionalElections(Q) {
    var results = [];
    (Q.regional_elections_due || []).forEach(function (region) {
      var reg = Q.regions[region];
      var date = reg.nextElection;
      var ballots = RegionalModel.regionalBallots(Q.vm, base(), REGIONAL, region);
      var r = lib('SpainRegionalRules', 'regional_rules.js').electRegion(region, ballots, date,
        REGIONAL.regions[region]);
      var flat = {};
      Object.keys(ballots).forEach(function (d) { flat[d] = { lists: ballots[d].lists }; });
      var shares = VoteModel.nationalShares(flat);
      var before = reg.government;
      var gov = regionalGovernment(r.totals, before);
      var psoeLost = before.party === 'psoe' && gov.party !== 'psoe';
      var psoeWon = before.party !== 'psoe' && gov.party === 'psoe';
      if (psoeLost) {
        Q.regional_leaders_strength -= 3;
        Q.sanchez_authority -= 3;
      }
      if (psoeWon) {
        Q.regional_leaders_strength += 3;
        Q.sanchez_authority += 3;
      }
      if (region === 'Cataluña' && Q.cat_crisis_stage === 3) {
        Q.cat_election_held = 1;
      }
      if (gov.cabinet.indexOf('vox') !== -1) {
        Q.pp_vox_regional_coalitions = (Q.pp_vox_regional_coalitions || 0) + 1;
      }
      reg.prevSeats = reg.seats;
      reg.prevShares = reg.voteShares || null;
      reg.seats = r.totals;
      reg.voteShares = shares;
      reg.government = gov;
      reg.lastElection = date;
      reg.lastWasSnap = false;
      reg.nextElection = lib('SpainRegionalRules', 'regional_rules.js')
        .nextRegularElection(region, date, false);
      results.push({ region: region, seats: r.totals, shares: shares, prevSeats: reg.prevSeats,
                     prevShares: reg.prevShares, government: gov, psoeLost: psoeLost, psoeWon: psoeWon });
    });
    Q.regional_elections_due = [];
    Q.has_regional_elections = 0;
    Q.last_regional_results = results;
    recalculate(Q);
    return results;
  }

  // ------------------------------------------------------------------
  // Leadership and defeat
  // ------------------------------------------------------------------
  function checkLeadership(Q) {
    // A revolt becomes possible when the party is divided and Sánchez weak.
    Q.revolt_possible = (Q.dissent_percent >= 40 && Q.sanchez_authority <= 35 &&
      Q.federal_committee_balance < 50) ? 1 : 0;
    // the 2016-17 window in which an ouster can be reversed by a primary
    var k = dateKey(Q.year, Q.month);
    Q.in_leadership_window = (k >= 201606 && k <= 201703) ? 1 : 0;
  }

  function lossReason(Q) {
    if (Q.loss_reason) {
      return Q.loss_reason;
    }
    if (!Q.sanchez_leader && !Q.leadership_exception_open) {
      return 'Pedro Sánchez is no longer Secretary-General of the PSOE.';
    }
    return '';
  }

  // ------------------------------------------------------------------
  // Rendering helpers for scenes (browser only)
  // ------------------------------------------------------------------
  function el(id) {
    return root.document && root.document.getElementById(id);
  }

  function renderVote(Q, id, candidate) {
    var out = el(id);
    if (!out) {
      return;
    }
    var v = candidate === 'censure' ? Parliament.count(Q.congress, Parliament.stancesForCensure(Q))
      : (candidate === 'budget' ? Parliament.count(Q.congress, Parliament.stancesForBudget(Q))
        : Parliament.investiture(Q.congress, candidate, Q));
    var label = { yes: 'Yes', abstain: 'Abstain', no: 'No' };
    var rows = Object.keys(Q.congress).sort(function (a, b) { return Q.congress[b] - Q.congress[a]; })
      .map(function (p) {
        return '<tr><td><span class="sp-swatch" style="background:' + UI.partyColor(p) + '"></span>' +
          UI.shortName(p) + '</td><td class="sp-num">' + Q.congress[p] + '</td><td class="sp-vote-' +
          v.detail[p] + '">' + label[v.detail[p]] + '</td></tr>';
      });
    out.innerHTML = '<table class="sp-results sp-compact"><thead><tr><th>Group</th><th class="sp-num">Seats</th>' +
      '<th>Vote</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>' +
      '<p><strong>Yes ' + v.yes + ' · No ' + v.no + ' · Abstain ' + v.abstain + '</strong></p>';
  }

  // Congress: full table with changes on election pages, compact in the sidebar.
  function renderCongress(Q, id, compact) {
    var out = el(id);
    if (!out || !Q.congress) {
      return;
    }
    out.innerHTML = '<svg id="' + id + '-svg" class="sp-hemicycle"></svg>' +
      UI.resultsTable(Q.congress, compact ? null : Q.vote_shares,
        { prevSeats: Q.prev_congress, prevShares: Q.prev_vote_shares, compact: compact });
    UI.drawHemicycle('#' + id + '-svg', Q.congress);
  }

  // Polls compared with the last election.
  function renderPolls(Q, id) {
    var out = el(id);
    if (!out || !Q.poll) {
      return;
    }
    var rows = Object.keys(Q.poll).filter(function (p) { return Q.poll[p] >= 1; })
      .sort(function (a, b) { return Q.poll[b] - Q.poll[a]; })
      .map(function (p) {
        var change = Q.vote_shares && Q.vote_shares[p] !== undefined
          ? (Q.poll[p] - Q.vote_shares[p]) : null;
        var ch = change === null ? 'new' : (Math.abs(change) < 0.05 ? '=' :
          (change > 0 ? '+' : '\u2212') + Math.abs(change).toFixed(1));
        return '<tr><td><span class="sp-swatch" style="background:' + UI.partyColor(p) + '"></span>' +
          UI.shortName(p) + '</td><td class="sp-num">' + Q.poll[p].toFixed(1) + '%</td><td class="sp-num sp-change">' +
          ch + '</td><td class="sp-num">' + (Q.poll_seats[p] || 0) + '</td></tr>';
      });
    out.innerHTML = '<table class="sp-results sp-compact"><thead><tr><th></th><th class="sp-num">Vote</th>' +
      '<th class="sp-num">\u00b1</th><th class="sp-num">Seats</th></tr></thead><tbody>' + rows.join('') +
      '</tbody></table>';
  }

  var SHORT_SURNAMES = {
    'Guillermo Fernández Vara': 'Fernández Vara', 'Alberto Núñez Feijóo': 'Feijóo',
    'Miguel Ángel Revilla': 'Revilla', 'Emiliano García-Page': 'García-Page',
    'Juan Vicente Herrera': 'Herrera', 'José Ignacio Ceniceros': 'Ceniceros',
    'Pedro Antonio Sánchez': 'P. A. Sánchez'
  };

  function surname(name) {
    var clean = name.replace(/\s*\(.*\)$/, '');
    if (SHORT_SURNAMES[clean]) {
      return SHORT_SURNAMES[clean];
    }
    var parts = clean.split(' ');
    return parts[parts.length - 1];
  }

  var REGION_SHORT = {
    'Castilla-La Mancha': 'C.-La Mancha', 'Castilla y León': 'C. y León',
    'Comunidad Valenciana': 'Valencia', 'Región de Murcia': 'Murcia', 'País Vasco': 'Basque C.'
  };

  function renderRegions(Q, id) {
    var out = el(id);
    if (!out) {
      return;
    }
    var rows = Object.keys(Q.regions).sort().map(function (r) {
      var reg = Q.regions[r];
      var g = reg.government;
      return '<tr><td>' + (REGION_SHORT[r] || r) + '</td><td><span class="sp-swatch" style="background:' +
        UI.partyColor(g.party) + '"></span>' + surname(g.president) + '</td><td class="sp-num">' +
        reg.nextElection.slice(0, 4) + '</td></tr>';
    });
    out.innerHTML = '<table class="sp-results sp-compact"><thead><tr><th>Region</th>' +
      '<th>President</th><th class="sp-num">Vote</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
  }

  function renderRegionalResults(Q, id) {
    var out = el(id);
    if (!out) {
      return;
    }
    out.innerHTML = (Q.last_regional_results || []).map(function (res) {
      var note = res.psoeLost ? ' The PSOE loses the presidency.'
        : (res.psoeWon ? ' The PSOE takes the presidency.' : '');
      return '<h4>' + res.region + '</h4>' +
        UI.resultsTable(res.seats, res.shares, { prevSeats: res.prevSeats, prevShares: res.prevShares }) +
        '<p>Government: ' + res.government.president + ' (' +
        res.government.cabinet.map(UI.partyName).join(' + ') + ').' + note + '</p>';
    }).join('');
  }

  function renderFactions(Q, id) {
    var out = el(id);
    if (!out) {
      return;
    }
    var short = {
      institutionalists: 'Institutionalists', regional_leaders: 'Regional Leaders',
      progressives: 'Progressives', modernisers: 'Modernisers', trade_unionists: 'Unionists'
    };
    var rows = FACTIONS.map(function (f) {
      return '<tr><td>' + short[f] + '</td><td>' + UI.word('strength', Q[f + '_strength']) +
        '</td><td>' + UI.word('dissent', Q[f + '_dissent']) + '</td></tr>';
    });
    out.innerHTML = '<table class="sp-results sp-compact"><thead><tr><th>Faction</th><th>Weight</th>' +
      '<th>Dissent</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
  }

  function renderRelations(Q, id) {
    var out = el(id);
    if (!out) {
      return;
    }
    var rows = RELATIONS.map(function (p) {
      return '<tr><td><span class="sp-swatch" style="background:' + UI.partyColor(p) + '"></span>' +
        UI.shortName(p) + '</td><td>' + UI.word('relation', Q['rel_' + p]) + '</td></tr>';
    });
    out.innerHTML = '<table class="sp-results sp-compact"><tbody>' + rows.join('') + '</tbody></table>';
  }

  var api = {
    FACTIONS: FACTIONS,
    newGame: newGame,
    recalculate: recalculate,
    updatePolls: updatePolls,
    shiftSupport: shiftSupport,
    endOfMonth: endOfMonth,
    projectedVote: projectedVote,
    holdInvestiture: holdInvestiture,
    formGovernment: formGovernment,
    dissolve: dissolve,
    runGeneralElection: runGeneralElection,
    regionalGovernment: regionalGovernment,
    runDueRegionalElections: runDueRegionalElections,
    lossReason: lossReason,
    renderVote: renderVote,
    renderCongress: renderCongress,
    renderPolls: renderPolls,
    renderRegions: renderRegions,
    renderRegionalResults: renderRegionalResults,
    renderFactions: renderFactions,
    campaign: campaign,
    regionalMod: regionalMod,
    territorial: territorial,
    holdCensure: holdCensure,
    holdBudget: holdBudget,
    callElection: callElection,
    renderRelations: renderRelations
  };
  if (isNode) {
    module.exports = api;
  } else {
    root.SpainGame = api;
  }
})(this);
