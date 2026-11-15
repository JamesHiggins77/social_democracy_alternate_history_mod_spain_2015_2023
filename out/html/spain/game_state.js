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
  var POLL_HISTORY = lib('SPAIN_POLL_HISTORY', 'poll_history_data.js');
  var POLL_ERRORS = lib('SPAIN_POLL_ERRORS', 'poll_error_data.js');
  var HISTORY_PATH = lib('SPAIN_HISTORY_PATH', 'history_path_data.js');
  var GAME_START = '2014-07';

  // The historical currents of July 2014 - November 2015 (rise and fall of
  // Podemos and Ciudadanos, the PP's erosion): national factors per party.
  function applyHistoryPath(Q) {
    var key = Q.year + '-' + (Q.month < 10 ? '0' : '') + Q.month;
    Q.vm.partyFactor = (HISTORY_PATH && HISTORY_PATH[key]) ? JSON.parse(JSON.stringify(HISTORY_PATH[key])) : {};
  }
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

  // General government deficit and debt (% of GDP), Eurostat/Bank of Spain
  // figures by year. The game adds the player's policy adjustments on top.
  var DEFICIT_BY_YEAR = { 2015: 5.2, 2016: 4.3, 2017: 3.0, 2018: 2.5, 2019: 3.1, 2020: 10.1,
                          2021: 6.7, 2022: 4.7, 2023: 3.5 };
  var DEBT_BY_YEAR = { 2015: 103.3, 2016: 102.7, 2017: 101.8, 2018: 100.4, 2019: 98.2, 2020: 120.3,
                       2021: 116.8, 2022: 111.6, 2023: 107.7 };
  function yearValue(table, year) {
    return table[Math.max(2015, Math.min(2023, year))];
  }

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
  // New game: 13 July 2014, the day Pedro Sánchez wins the PSOE primary.
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
    Q.year = 2014;
    Q.month = 7;
    Q.month_actions = 0;
    Q.advisor_action_timer = 0;
    Q.last_advisor_action = 0;
    Q.timers = ['advisor_action', 'negotiations', 'barons', 'media', 'membership', 'rally',
                'debate', 'scandal', 'federal_exec', 'ugt', 'juventudes', 'programme', 'podemos_talks',
                'cs_talks', 'small_parties', 'catalans', 'budget', 'wage', 'memory', 'pensions',
                'labour', 'reshuffle', 'cat_155', 'cat_dialogue', 'cat_psc', 'cat_federal', 'censure',
                'pensions_campaign', 'feminism', 'europe', 'housing', 'ads', 'appearance', 'tour', 'fundraising', 'tax'];

    // Congress elected on 20 November 2011
    Q.congress = { pp: 186, psoe: 110, junts: 16, iu: 11, bildu: 7, upyd: 5, pnv: 5, erc: 3,
                   bng: 2, cc: 2, mp: 1, foro: 1, geroa: 1 };
    Q.vote_shares = officialShares('2011');
    Q.prev_congress = null;
    Q.prev_vote_shares = null;
    Q.elections_held = 0;
    Q.election_records = [{ date: '2011-11', seats: Q.congress }];
    // monthly poll of polls recorded during the game (history before
    // December 2015 comes from real polling, poll_history_data.js)
    Q.poll_history = [];
    Q.game_start = GAME_START;
    Q.vm = VoteModel.initialState();
    applyHistoryPath(Q);
    drawPollError(Q, '2015');
    Q.poll_noise = {};
    Q.regions = RegionalModel.startingParliaments(REGIONAL, '2014-07-13');

    // Government: Rajoy's majority, with the election called for December
    Q.pm = 'Mariano Rajoy';
    Q.pm_party = 'pp';
    Q.government_status = 'formed';
    Q.government_type = 'PP majority government';
    Q.psoe_in_government = 0;
    Q.legislature_start_year = 2011;
    Q.legislature_start_month = 12;
    Q.investiture_clock = -1;   // weeks to automatic dissolution; -1 = not started
    Q.week = 1;                 // week of the month during government formation
    Q.formation_weeks = 0;      // weeks since the last general election
    Q.investiture_votes = 0;
    Q.election_year = 0;        // scheduled general election, 0 = none
    Q.election_month = 0;       // (the 2011 legislature expires in late 2015)
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
    // won the primary with 48.7%, carried by Susana Díaz and the federations
    Q.sanchez_authority = 62;
    Q.member_morale = 62;
    Q.federal_committee_balance = 62;
    Q.sanchismo = 22;
    Q.diaz_relation = 70;
    Q.institutionalists_strength = 25; Q.institutionalists_dissent = 15;
    Q.regional_leaders_strength = 32; Q.regional_leaders_dissent = 8;
    Q.progressives_strength = 15; Q.progressives_dissent = 18;
    Q.modernisers_strength = 18; Q.modernisers_dissent = 5;
    Q.trade_unionists_strength = 10; Q.trade_unionists_dissent = 12;

    // Relations with other parties (0-100)
    Q.rel_pp = 20; Q.rel_cs = 45; Q.rel_up = 35; Q.rel_iu = 40; Q.rel_erc = 25;
    Q.rel_junts = 20; Q.rel_pnv = 45; Q.rel_bildu = 10; Q.rel_cc = 45;
    Q.rel_bng = 40; Q.rel_prc = 45; Q.rel_te = 45; Q.rel_geroa = 45; Q.rel_nc = 45; Q.rel_mp = 50;
    Q.up_talks = 0; Q.cs_talks = 0;
    Q.pact_cs = 0; Q.pact_up = 0; Q.red_lines = 0; Q.referendum_offer = 0;
    Q.pp_vox_relation = 50;
    Q.catalan_crisis = 0;
    Q.pp_scandal = 0;

    // Party finances: an abstract fund, earned monthly and spent on campaigns.
    Q.funds = 6;
    // Government finances: policy adjustment to the deficit (points of GDP)
    // and its cumulative effect on debt.
    Q.fiscal_adj = 0;
    Q.debt_adj = 0;

    updatePolls(Q);
    recordPoll(Q);
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
    Q.weekly = formationMode(Q);
    Q.pp_governs = (Q.pm_party === 'pp' && !Q.acting) ? 1 : 0;
    Q.pm_is_pp = Q.pm_party === 'pp' ? 1 : 0;
    Q.pp_majority = (Q.congress.pp || 0) >= 176 ? 1 : 0;
    Q.seeking_government = (Q.acting && !Q.psoe_in_government && Q.elections_held >= 1 &&
      !Q.election_year && Q.sanchez_leader) ? 1 : 0;
    var cat = Q.regions && Q.regions['Cataluña'] && Q.regions['Cataluña'].government;
    Q.catalonia_independentist = (cat && ['jxsi', 'junts', 'erc'].indexOf(cat.party) !== -1) ? 1 : 0;
    var and = Q.regions && Q.regions['Andalucía'] && Q.regions['Andalucía'].government;
    Q.regions_andalucia_psoe = (and && and.party === 'psoe') ? 1 : 0;
    Q.funds_income = Math.round((0.5 + (Q.congress.psoe || 0) / 200) * 10) / 10;
    Q.funds_display = Math.floor(Q.funds);
    Q.in_debt = Q.funds < 0 ? 1 : 0;
    Q.deficit = Math.round((yearValue(DEFICIT_BY_YEAR, Q.year) + (Q.fiscal_adj || 0)) * 10) / 10;
    Q.debt = Math.round(yearValue(DEBT_BY_YEAR, Q.year) + (Q.debt_adj || 0));
    Q.deficit_text = Q.deficit.toFixed(1);
    Q.authority_word = UI.word('authority', Q.sanchez_authority);
    Q.morale_word = UI.word('morale', Q.member_morale);
    Q.unity_word = UI.word('unity', Q.psoe_unity);
    Q.committee_word = UI.word('committee', Q.federal_committee_balance);
    Q.sanchismo_word = UI.word('sanchismo', Q.sanchismo);
    var e = Q.econ_left || 0, so = Q.social_prog || 0;
    Q.econ_word = e <= -1 ? 'Centrist' : (e <= 2 ? 'Centre-left' : (e <= 5 ? 'Left' : (e <= 8 ? 'Hard left' : 'Socialist')));
    Q.social_word = so <= -1 ? 'Traditional' : (so <= 2 ? 'Moderate' : (so <= 5 ? 'Progressive' : 'Radical'));
    Q.finance_crisis_year = Q.finance_crisis_year || 0;
    Q.congress_text = congressText(Q.congress);
  }

  function congressText(seats) {
    return Object.keys(seats).sort(function (a, b) { return seats[b] - seats[a]; })
      .map(function (id) { return UI.partyName(id) + ' ' + seats[id]; }).join(', ');
  }

  // ------------------------------------------------------------------
  // Polling error. Polls show the model's true vote plus an error for each
  // party: for the first campaign, the real final-poll errors of December
  // 2015; afterwards, a fresh draw per election cycle from each party's
  // historical bias and spread (tools/build_poll_errors.py), plus a small
  // monthly variation between pollsters. Elections use the true vote.
  // ------------------------------------------------------------------
  var POLLED_PARTIES = ['psoe', 'pp', 'cs', 'up', 'vox', 'mp', 'iu'];

  function gaussian() {
    var u = 1 - Math.random();
    var v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // Typical vote share of each party across the measured elections, used to
  // turn an error in points into a relative error.
  function typicalShare(p) {
    var vals = [];
    Object.keys((POLL_ERRORS && POLL_ERRORS.elections) || {}).forEach(function (k) {
      var r = POLL_ERRORS.elections[k].result[p];
      if (r) { vals.push(r); }
    });
    return vals.length ? vals.reduce(function (a, b) { return a + b; }, 0) / vals.length : 10;
  }

  // Errors are relative (a party polled 30% above its true vote stays 30%
  // above it whatever its size).
  function drawPollError(Q, historicalKey) {
    var rel = {};
    var hist = historicalKey && POLL_ERRORS && POLL_ERRORS.elections[historicalKey];
    POLLED_PARTIES.forEach(function (p) {
      if (hist) {
        var res = hist.result[p];
        rel[p] = res && hist.errors[p] !== undefined ? hist.errors[p] / res : 0;
      } else {
        var stats = (POLL_ERRORS && POLL_ERRORS.parties[p]) || { bias: 0, sd: 1 };
        rel[p] = (stats.bias + stats.sd * gaussian()) / typicalShare(p);
      }
      rel[p] = Math.max(-0.6, Math.min(0.6, Math.round(rel[p] * 1000) / 1000));
    });
    Q.poll_error = rel;
  }

  function drawPollNoise(Q) {
    var noise = {};
    POLLED_PARTIES.forEach(function (p) { noise[p] = Math.round(0.5 * gaussian() * 10) / 10; });
    Q.poll_noise = noise;
  }

  // The vote model's true national result (not shown to the player).
  function trueVote(Q) {
    return VoteModel.runGeneralElection(Q.vm, base(), DATA, Q.year, Q.month);
  }

  // Polls: what the pollsters report, error included.
  function updatePolls(Q) {
    var truth = trueVote(Q);
    Q.true_poll = truth.voteShares;
    var err = Q.poll_error || {};
    var noise = Q.poll_noise || {};
    // the error scales each polled party's national support (the same
    // mechanism as the historical path, so the two compose cleanly)
    var polled = JSON.parse(JSON.stringify(Q.vm));
    polled.partyFactor = polled.partyFactor || {};
    POLLED_PARTIES.forEach(function (p) {
      var share = truth.voteShares[p] || 0;
      if (share > 0.5) {
        var f = Math.max(0.2, 1 + (err[p] || 0) + (noise[p] || 0) / share);
        polled.partyFactor[p] = (polled.partyFactor[p] === undefined ? 1 : polled.partyFactor[p]) * f;
      }
    });
    var r = VoteModel.runGeneralElection(polled, base(), DATA, Q.year, Q.month);
    Q.poll = r.voteShares;
    Q.poll_seats = r.totals;
    Q.poll_psoe = Math.round(r.voteShares.psoe || 0);
    Q.poll_pp = Math.round(r.voteShares.pp || 0);
    Q.poll_vox = Math.round(r.voteShares.vox || 0);
    return r;
  }

  // Apply a support change to the PSOE among classes, damped by party
  // dissent as in the original. changes: {class: points}.
  // Balance constants for the PSOE's own campaigning.
  var GAIN_SCALE = 0.6;            // all PSOE gains are scaled down
  var FATIGUE_PER_POINT = 0.08;    // each point gained adds campaign fatigue
  var GOVERNING_GAIN = 0.7;        // in government, gains count for less...
  var GOVERNING_LOSS = 1.5;        // ...and losses for more

  // Campaign fatigue: the more the PSOE has campaigned recently, the less
  // each new effort moves. Fades by a quarter each month.
  function fatigueFactor(Q) {
    return 1 / (1 + (Q.campaign_fatigue || 0));
  }

  function shiftSupport(Q, party, changes) {
    var isPsoe = party === 'psoe';
    var gained = 0;
    Object.keys(changes).forEach(function (c) {
      var v = changes[c];
      if (v > 0) {
        v *= (1 - Q.dissent);
        if (isPsoe) {
          v *= GAIN_SCALE * fatigueFactor(Q) * (Q.psoe_in_government ? GOVERNING_GAIN : 1);
          gained += v;
        }
      } else if (isPsoe && Q.psoe_in_government) {
        v *= GOVERNING_LOSS;
      }
      Q.vm.classSupport[c][party] = Math.max(0, Q.vm.classSupport[c][party] + v);
    });
    if (isPsoe) {
      Q.campaign_fatigue = (Q.campaign_fatigue || 0) + gained * FATIGUE_PER_POINT;
    }
  }

  // The PSOE's ideological position, built up by its promises and policies.
  //   econ: economic left (public ownership, taxes on wealth, repealing the
  //         labour reform) - scares liberals and the moderate middle class
  //   social: social progressivism (feminism, memory, abortion rights,
  //         territorial concessions) - scares older and traditional voters
  // Moderating choices pass negative values. Both fade slowly.
  function position(Q, econ, social) {
    Q.econ_left = Math.max(-5, Math.min(12, (Q.econ_left || 0) + (econ || 0)));
    Q.social_prog = Math.max(-5, Math.min(12, (Q.social_prog || 0) + (social || 0)));
  }

  // Monthly cost of the PSOE's position: beyond a threshold, moderates leave.
  var POSITION_THRESHOLD = 3;
  function positionDrift(Q) {
    var e = Math.max(0, (Q.econ_left || 0) - POSITION_THRESHOLD);
    var so = Math.max(0, (Q.social_prog || 0) - POSITION_THRESHOLD);
    if (e > 0) {
      transfer(Q, 'psoe', { cs: 0.6, pp: 0.4 },
        { self_employed: 0.35 * e, professionals: 0.3 * e, pensioners: 0.1 * e });
    }
    if (so > 0) {
      transfer(Q, 'psoe', { pp: 0.7, vox: 0.3 },
        { pensioners: 0.25 * so, homemakers: 0.25 * so, self_employed: 0.1 * so });
    }
    Q.econ_left = (Q.econ_left || 0) * 0.97;
    Q.social_prog = (Q.social_prog || 0) * 0.97;
  }

  // Governing wears a party down: a little support leaves every month for
  // the opposition (from 2016; the PP's 2014-15 erosion is in the path).
  function incumbencyWear(Q) {
    if (Q.year < 2016) {
      return;
    }
    var all = { workers: 0.25, professionals: 0.25, pensioners: 0.2, self_employed: 0.25,
                unemployed: 0.3, students: 0.25, homemakers: 0.2 };
    if (Q.psoe_in_government && !Q.acting) {
      transfer(Q, 'psoe', { pp: 0.4, up: 0.25, cs: 0.15, vox: 0.2 }, all);
    } else if (Q.pm_party === 'pp' && !Q.acting) {
      transfer(Q, 'pp', { psoe: 0.35, cs: 0.3, vox: 0.25, up: 0.1 }, all);
    }
  }

  // Card helpers ------------------------------------------------------
  // Shift a party's support by class and refresh the polls.
  function campaign(Q, party, changes) {
    shiftSupport(Q, party, changes);
    updatePolls(Q);
  }

  // Demographic targeting for campaigns and media. Each target spreads a
  // campaign effect over the classes it reaches. Women: each class weighted
  // by its approximate share of women (INE labour force survey, rounded;
  // to be replaced by CIS microdata).
  var FEMALE_SHARE = { professionals: 0.48, self_employed: 0.33, workers: 0.42, pensioners: 0.55,
                       unemployed: 0.50, students: 0.53, homemakers: 0.90 };
  var TARGETS = {
    students: { name: 'students', classes: { students: 1 } },
    young: { name: 'young people', classes: { students: 1, workers: 0.3, unemployed: 0.3 } },
    pensioners: { name: 'pensioners', classes: { pensioners: 1 } },
    working: { name: 'the working class', classes: { workers: 1, unemployed: 0.6 } },
    middle: { name: 'the middle class', classes: { professionals: 1, self_employed: 0.8 } },
    women: { name: 'women', classes: FEMALE_SHARE },
    unemployed: { name: 'the unemployed', classes: { unemployed: 1 } },
    rural: { name: 'rural Spain', regions: ['Castilla y León', 'Castilla-La Mancha', 'Extremadura',
                                             'Aragón', 'Galicia', 'La Rioja'] }
  };

  // Who is put off when the PSOE courts a group, and where they go.
  var BACKLASH = {
    students: { classes: { pensioners: 0.3 }, to: { pp: 1 } },
    young: { classes: { pensioners: 0.3, homemakers: 0.1 }, to: { pp: 1 } },
    pensioners: { classes: { students: 0.25 }, to: { up: 1 } },
    working: { classes: { professionals: 0.2, self_employed: 0.25 }, to: { cs: 0.6, pp: 0.4 } },
    middle: { classes: { workers: 0.2, unemployed: 0.15 }, to: { up: 1 } },
    unemployed: { classes: { self_employed: 0.15 }, to: { pp: 1 } },
    women: { classes: { self_employed: 0.1 }, to: { vox: 0.5, pp: 0.5 } }
  };

  // Campaign aimed at a demographic. `strength` is in support points for a
  // fully reached class; repeated use of the same target gives diminishing
  // returns (each earlier use cuts the effect by a quarter, recovering
  // slowly as campaign effects fade).
  function target(Q, party, key, strength) {
    var t = TARGETS[key];
    Q.target_uses = Q.target_uses || {};
    var uses = Q.target_uses[key] || 0;
    var factor = 1 / (1 + 1.0 * uses);
    Q.target_uses[key] = uses + 1;
    if (t.regions) {
      t.regions.forEach(function (r) {
        Q.vm.regionalMod[r] = Q.vm.regionalMod[r] || {};
        var cur = Q.vm.regionalMod[r][party] === undefined ? 1 : Q.vm.regionalMod[r][party];
        Q.vm.regionalMod[r][party] = cur * (1 + 0.012 * strength * factor * (1 - Q.dissent));
      });
      updatePolls(Q);
    } else {
      var changes = {};
      Object.keys(t.classes).forEach(function (c) { changes[c] = strength * factor * t.classes[c]; });
      campaign(Q, party, changes);
      // cross-pressure: appealing to one group costs support in another
      var back = BACKLASH[key];
      if (back && party === 'psoe') {
        var lost = {};
        Object.keys(back.classes).forEach(function (c) { lost[c] = strength * factor * back.classes[c]; });
        transfer(Q, 'psoe', back.to, lost);
      }
    }
    Q.last_target = t.name;
    Q.last_target_factor = Math.round(factor * 100);
    return factor;
  }

  // Move support from one party to others, class by class. `to` is a party
  // id or {party: share} splitting the moved points. Unlike campaign gains,
  // losses are not damped by party unity: voters leave whatever the mood.
  function transfer(Q, from, to, changes) {
    var split = typeof to === 'string' ? (function () { var o = {}; o[to] = 1; return o; })() : to;
    Object.keys(changes).forEach(function (c) {
      var cur = Q.vm.classSupport[c][from] || 0;
      var moved = Math.min(cur, changes[c]);
      Q.vm.classSupport[c][from] = cur - moved;
      Object.keys(split).forEach(function (p) {
        Q.vm.classSupport[c][p] = (Q.vm.classSupport[c][p] || 0) + moved * split[p];
      });
    });
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
  // ------------------------------------------------------------------
  // Weekly turns during government formation: from an election until a
  // government is invested or the Cortes are dissolved.
  // ------------------------------------------------------------------
  var WEEKLY_TIMERS = ['negotiations', 'podemos_talks', 'cs_talks', 'small_parties', 'programme', 'catalans'];

  function formationMode(Q) {
    return (Q.government_status === 'acting' && Q.elections_held >= 1 && !Q.election_year) ? 1 : 0;
  }

  function endOfWeek(Q) {
    Q.month_actions = 0;
    Q.formation_weeks = (Q.formation_weeks || 0) + 1;
    (Q.timers || []).forEach(function (t) {
      if (Q[t + '_timer'] > 0) {
        var step = WEEKLY_TIMERS.indexOf(t) !== -1 ? 1 : 0.25;
        Q[t + '_timer'] = Math.max(0, Q[t + '_timer'] - step);
      }
    });
    // investiture clock (art. 99.5), in weeks
    if (Q.investiture_clock > 0) {
      Q.investiture_clock -= 1;
      if (Q.investiture_clock === 0) {
        Q.dissolution_due = 1;
      }
    }
    if (Q.week >= 4) {
      endOfMonth(Q, true);
    } else {
      Q.week += 1;
      updatePolls(Q);
      recalculate(Q);
      checkLeadership(Q);
    }
  }

  function endOfMonth(Q, fromWeekly) {
    var next = addMonths(Q.year, Q.month, 1);
    Q.year = next[0];
    Q.month = next[1];
    Q.time += 1;
    Q.week = 1;
    Q.month_actions = 0;
    applyHistoryPath(Q);
    if (!fromWeekly) {
      (Q.timers || []).forEach(function (t) {
        if (Q[t + '_timer'] > 0) {
          Q[t + '_timer'] = Math.max(0, Q[t + '_timer'] - 1);
        }
      });
    }

    // campaign effects fade towards the underlying level: gains fade at 3%
    // of the gap a month, losses recover at only 1% - voters remember
    // grievances longer than favours
    var initial = VoteModel.initialState().classSupport;
    Object.keys(Q.vm.classSupport).forEach(function (c) {
      ['psoe', 'pp', 'cs'].forEach(function (p) {
        var cur = Q.vm.classSupport[c][p];
        var rate = cur > initial[c][p] ? 0.03 : 0.01;
        Q.vm.classSupport[c][p] = cur + (initial[c][p] - cur) * rate;
      });
    });
    Q.campaign_fatigue = (Q.campaign_fatigue || 0) * 0.75;
    positionDrift(Q);
    incumbencyWear(Q);

    Object.keys(Q.target_uses || {}).forEach(function (k) {
      Q.target_uses[k] = Math.max(0, Q.target_uses[k] - 0.15);
    });

    // party finances: dues and the public subsidy, scaled by seats
    Q.funds += 0.5 + (Q.congress.psoe || 0) / 200;
    if (Q.loan_months > 0) {
      Q.funds -= 0.4;
      Q.loan_months -= 1;
    }
    // party debt: mismanagement costs Sánchez inside the party
    if (Q.funds < 0) {
      var depth = Math.min(10, -Q.funds);
      Q.member_morale -= 1;
      Q.sanchez_authority -= 1.5 + 0.25 * depth;
      Q.federal_committee_balance -= 1 + 0.25 * depth;
      Q.institutionalists_dissent += 1 + 0.3 * depth;
      Q.regional_leaders_dissent += 0.5 + 0.2 * depth;
    }
    Q.deep_debt = Q.funds <= -5 ? 1 : 0;
    Q.ruinous_debt = Q.funds <= -10 ? 1 : 0;
    // government finances: policy adjustments accumulate into debt
    Q.debt_adj = (Q.debt_adj || 0) + (Q.fiscal_adj || 0) / 12;
    Q.brussels_due = (Q.psoe_in_government && Q.deficit > 3.5 &&
      (Q.brussels_year || 0) < Q.year) ? 1 : 0;

    // a running investiture clock outside formation mode (should not
    // happen, but never leave it stuck): count the month as four weeks
    if (!fromWeekly && Q.investiture_clock > 0) {
      Q.investiture_clock = Math.max(0, Q.investiture_clock - 4);
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

    drawPollNoise(Q);
    updatePolls(Q);
    recordPoll(Q);
    recalculate(Q);
    checkLeadership(Q);
  }

  var CHART_PARTIES = ['pp', 'psoe', 'up', 'cs', 'iu', 'vox', 'mp', 'upyd'];

  function recordPoll(Q) {
    var row = { date: Q.year + '-' + (Q.month < 10 ? '0' : '') + Q.month };
    CHART_PARTIES.forEach(function (p) {
      if (Q.poll[p] !== undefined && !(Q.vm.notStanding && Q.vm.notStanding[p])) {
        row[p] = Math.round(Q.poll[p] * 10) / 10;
      }
    });
    Q.poll_history = Q.poll_history || [];
    if (Q.poll_history.length && Q.poll_history[Q.poll_history.length - 1].date === row.date) {
      Q.poll_history[Q.poll_history.length - 1] = row;
    } else {
      Q.poll_history.push(row);
    }
  }

  // Real history up to November 2015, then the game's own record.
  function pollSeries(Q) {
    var start = Q.game_start || GAME_START;
    return (POLL_HISTORY || []).filter(function (r) { return r.date < start; })
      .concat(Q.poll_history || []);
  }

  function electionDates(Q) {
    var dates = ['2011-11'];
    (Q.election_records || []).forEach(function (r) {
      var p = String(r.date).split('-');
      dates.push(p[0] + '-' + (Number(p[1]) < 10 ? '0' : '') + Number(p[1]));
    });
    return dates;
  }

  function renderPollChart(Q, id, compact) {
    var out = el(id);
    if (!out) {
      return;
    }
    var w = compact ? Math.max(200, (out.parentElement || out).offsetWidth - 4) : 560;
    UI.drawPollChart(out, pollSeries(Q), electionDates(Q),
      { width: w, height: compact ? 170 : 300, months: 48 });
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
      Q.investiture_clock = 8;
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
  // Top vote shares (%) in each ballot district, for the map tooltips.
  function districtShares(ballots, top) {
    var out = {};
    Object.keys(ballots).forEach(function (d) {
      var total = 0;
      var lists = ballots[d].lists.map(function (l) {
        var id = Array.isArray(l) ? l[0] : l.id;
        var v = Array.isArray(l) ? l[2] : l.votes;
        total += v;
        return [id, v];
      });
      lists.sort(function (a, b) { return b[1] - a[1]; });
      out[d] = lists.slice(0, top || 5).filter(function (l) { return l[1] > 0; })
        .map(function (l) { return [l[0], Math.round(1000 * l[1] / total) / 10]; });
    });
    return out;
  }

  // Party with most votes in each ballot district.
  function provinceWinners(ballots) {
    var out = {};
    Object.keys(ballots).forEach(function (p) {
      var best = null;
      ballots[p].lists.forEach(function (l) {
        var id = Array.isArray(l) ? l[0] : l.id;
        var v = Array.isArray(l) ? l[2] : l.votes;
        if (!best || v > best.v) { best = { id: id, v: v }; }
      });
      if (best) { out[p] = best.id; }
    });
    return out;
  }

  // Regional districts mostly are provinces, with local spellings
  // ("Alicante/Alacant", "Santa Cruz de Tenerife"); islands and Asturias's
  // districts take the regional winner.
  function districtToProvince(name) {
    var n = name.split('/')[0].trim();
    var alias = { 'Santa Cruz de Tenerife': 'SC de Tenerife', 'Región de Murcia': 'Murcia',
                  'Álava': 'Araba' };
    return alias[n] || n;
  }

  function runGeneralElection(Q) {
    Q.prev_poll = Q.poll ? JSON.parse(JSON.stringify(Q.poll)) : null;
    var r = VoteModel.runGeneralElection(Q.vm, base(), DATA, Q.year, Q.month);
    var old = Q.congress;
    Q.prev_congress = old;
    Q.prev_vote_shares = Q.vote_shares;
    Q.congress = r.totals;
    Q.vote_shares = r.voteShares;
    Q.elections_held = (Q.elections_held || 0) + 1;
    Q.funds -= 4;
    Q.map_winners = provinceWinners(r.ballots);
    Q.map_shares = districtShares(r.ballots, 5);
    Q.map_kind = 'general';
    Q.map_title = 'General election, ' + Q.month + '/' + Q.year;
    Q.election_records.push({ date: Q.year + '-' + Q.month, seats: r.totals });
    // the result itself replaces that month's poll; then a new polling
    // error for the next cycle
    Q.poll = r.voteShares;
    recordPoll(Q);
    Q.last_poll_miss = {};
    POLLED_PARTIES.forEach(function (p) {
      if (Q.prev_poll && Q.prev_poll[p] !== undefined && r.voteShares[p] !== undefined) {
        Q.last_poll_miss[p] = Math.round((Q.prev_poll[p] - r.voteShares[p]) * 10) / 10;
      }
    });
    drawPollError(Q, null);
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
    Q.formation_weeks = 0;
    Q.week = 1;
    Q.psoe_stance_pp = 'no';
    // Repeat elections: the right regroups and the party blames the leader.
    var wasActing = statusBefore === 'acting';
    Q.repeat_elections = wasActing ? (Q.repeat_elections || 0) + 1 : 0;
    var repeat = Q.repeat_elections;
    if (repeat >= 1) {
      Q.pact_pp_cs = 1;
      // voters punish the parties they blame for the deadlock, the PSOE included
      transfer(Q, 'psoe', { pp: 0.5, cs: 0.2, up: 0.3 },
        { workers: repeat, pensioners: repeat, professionals: repeat, homemakers: repeat });
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
  // Parties willing to sit in a cabinet with the bloc leader (the others
  // give external support at most).
  var COALITION_PARTNERS = {
    psoe: ['up', 'iu', 'mp', 'compromis', 'mes', 'cha', 'prc', 'cc', 'geroa', 'nc', 'x:I-E'],
    pp: ['cs', 'upn', 'par', 'foro', 'cc', 'prc'],
    pnv: ['psoe'], cc: ['psoe', 'pp', 'nc', 'asg'], prc: ['psoe', 'pp'],
    geroa: ['psoe', 'up', 'iu'], jxsi: [], junts: ['erc'], erc: ['junts', 'up']
  };

  // Forms a regional government: the leading party, cabinet partners and
  // supporting parties needed to reach a majority, and the type of
  // government. `ppVoxRelation` decides whether Vox enters PP cabinets.
  function regionalGovernment(seats, previous, ppVoxRelation, year) {
    var total = 0;
    Object.keys(seats).forEach(function (id) { total += seats[id]; });
    var majority = Math.floor(total / 2) + 1;
    var sum = function (list) {
      return list.reduce(function (a, id) { return a + (seats[id] || 0); }, 0);
    };
    var bySize = function (list) {
      return list.filter(function (id) { return seats[id]; })
        .sort(function (a, b) { return seats[b] - seats[a]; });
    };
    var largest = bySize(Object.keys(seats))[0];
    var leftPlus = LEFT_BLOC.concat(['erc', 'bildu', 'cup', 'pnv', 'cc', 'prc', 'nc', 'te']);
    var rightPlus = RIGHT_BLOC.concat(['cc', 'prc', 'upn']);
    var left = sum(LEFT_BLOC);
    var right = sum(RIGHT_BLOC);
    var party;
    var bloc;
    if (TERRITORIAL_LEADERS.indexOf(largest) !== -1 && seats[largest] >= total * 0.3) {
      party = largest;
      bloc = Object.keys(seats);
    } else if (right >= majority || (right > left && right >= total * 0.45)) {
      party = bySize(RIGHT_BLOC)[0];
      bloc = rightPlus;
    } else if (left >= majority || left > right) {
      party = bySize(LEFT_BLOC)[0];
      bloc = leftPlus;
    } else {
      party = largest;
      bloc = Object.keys(seats);
    }
    var cabinet = [party];
    var support = [];
    var count = seats[party] || 0;
    // Ciudadanos stayed out of regional cabinets until 2019, Podemos until 2017
    var willing = (COALITION_PARTNERS[party] || []).filter(function (id) {
      if (id === 'cs' && year && year < 2019) { return false; }
      if (id === 'up' && year && year < 2017) { return false; }
      return true;
    });
    if (party === 'pp' && (ppVoxRelation || 50) >= 60) {
      willing.push('vox');
    }
    // add partners, largest first, until a majority is reached
    bySize(bloc.concat(party === 'pp' ? ['vox'] : [])).forEach(function (id) {
      if (id === party || count >= majority) {
        return;
      }
      if (willing.indexOf(id) !== -1 && cabinet.length < 3) {
        cabinet.push(id);
      } else {
        support.push(id);
      }
      count += seats[id];
    });
    var type;
    if (cabinet.length === 1 && seats[party] >= majority) {
      type = 'Majority';
    } else if (cabinet.length > 1 && sum(cabinet) >= majority) {
      type = 'Coalition majority';
    } else if (cabinet.length > 1) {
      type = 'Minority coalition' + (support.length ? ' with external support' : '');
    } else if (support.length && count >= majority) {
      type = 'Minority with external support';
    } else {
      type = 'Minority';
    }
    var president = previous && previous.party === party ? previous.president
      : UI.partyName(party) + ' president';
    return { president: president, party: party, cabinet: cabinet, support: support, type: type };
  }

  function runDueRegionalElections(Q) {
    var results = [];
    (Q.regional_elections_due || []).forEach(function (region) {
      var reg = Q.regions[region];
      var date = reg.nextElection;
      var ballots = RegionalModel.regionalBallots(Q.vm, base(), REGIONAL, region, date);
      var r = lib('SpainRegionalRules', 'regional_rules.js').electRegion(region, ballots, date,
        REGIONAL.regions[region]);
      var flat = {};
      Object.keys(ballots).forEach(function (d) { flat[d] = { lists: ballots[d].lists }; });
      var shares = VoteModel.nationalShares(flat);
      var before = reg.government;
      var gov = regionalGovernment(r.totals, before, Q.pp_vox_relation, Q.year);
      var real = RegionalModel.GOVERNMENTS_2015[region];
      if (date <= RegionalModel.HISTORY_END && real && real.party === gov.party) {
        gov = JSON.parse(JSON.stringify(real));
      }
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
      var dw = {};
      var byDistrict = provinceWinners(ballots);
      Object.keys(byDistrict).forEach(function (d) { dw[districtToProvince(d)] = byDistrict[d]; });
      var ds = {};
      var sharesByDistrict = districtShares(ballots, 5);
      Object.keys(sharesByDistrict).forEach(function (d) { ds[districtToProvince(d)] = sharesByDistrict[d]; });
      results.push({ region: region, districtWinners: dw, districtShares: ds, seats: r.totals, shares: shares, prevSeats: reg.prevSeats,
                     prevShares: reg.prevShares, government: gov, psoeLost: psoeLost, psoeWon: psoeWon });
    });
    Q.regional_elections_due = [];
    Q.has_regional_elections = 0;
    Q.last_regional_results = results;
    if (results.length) {
      Q.funds -= 1;
      var winners = {};
      var provs = DATA.regions;
      results.forEach(function (res) {
        var overall = Object.keys(res.shares).sort(function (a, b) { return res.shares[b] - res.shares[a]; })[0];
        provs[res.region].forEach(function (p) { winners[p] = res.districtWinners[p] || overall; });
      });
      Q.map_winners = winners;
      var mapShares = {};
      results.forEach(function (res) {
        var regionTop = Object.keys(res.shares).sort(function (a, b) { return res.shares[b] - res.shares[a]; })
          .slice(0, 5).map(function (id) { return [id, Math.round(res.shares[id] * 10) / 10]; });
        provs[res.region].forEach(function (p) { mapShares[p] = res.districtShares[p] || regionTop; });
      });
      Q.map_shares = mapShares;
      Q.map_kind = 'regional';
      Q.map_title = 'Regional elections, ' + Q.month + '/' + Q.year;
    }
    recalculate(Q);
    return results;
  }

  // ------------------------------------------------------------------
  // Leadership and defeat
  // ------------------------------------------------------------------
  function checkLeadership(Q) {
    // A revolt becomes possible when the party is divided and Sánchez weak.
    Q.revolt_possible = ((Q.dissent_percent >= 40 && Q.sanchez_authority <= 35 &&
      Q.federal_committee_balance < 50) ||
      (Q.funds <= -5 && Q.sanchez_authority <= 45 && Q.federal_committee_balance < 50)) ? 1 : 0;
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
        var ch = change === null ? 'new' : UI.signed(change, 1);
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
    var regions = Object.keys(Q.regions).sort();
    var selected = root.spSelectedRegion && Q.regions[root.spSelectedRegion] ? root.spSelectedRegion : '';
    var rows = regions.map(function (r) {
      var reg = Q.regions[r];
      var g = reg.government;
      return '<tr><td>' + (REGION_SHORT[r] || r) + '</td><td><span class="sp-swatch" style="background:' +
        UI.partyColor(g.party) + '"></span>' + surname(g.president) + '</td><td class="sp-num">' +
        reg.nextElection.slice(0, 4) + '</td></tr>';
    });
    var options = '<option value="">Choose a community…</option>' + regions.map(function (r) {
      return '<option value="' + r + '"' + (r === selected ? ' selected' : '') + '>' + r + '</option>';
    }).join('');
    out.innerHTML = '<select id="' + id + '-select" class="sp-select">' + options + '</select>' +
      '<div id="' + id + '-detail"></div>' +
      '<table class="sp-results sp-compact"><thead><tr><th>Region</th>' +
      '<th>President</th><th class="sp-num">Vote</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
    var select = el(id + '-select');
    var show = function (r) {
      root.spSelectedRegion = r;
      var detail = el(id + '-detail');
      if (!r) {
        detail.innerHTML = '';
        return;
      }
      var reg = Q.regions[r];
      var g = reg.government;
      var names = function (list) {
        return (list || []).map(function (p) { return UI.shortName(p); }).join(' + ');
      };
      detail.innerHTML = '<p class="sp-gov"><strong>' + g.president + '</strong><br>' +
        (g.type || '') + '<br>Cabinet: ' + names(g.cabinet) +
        (g.support && g.support.length ? '<br>Support: ' + names(g.support) : '') +
        '<br>Next vote: ' + reg.nextElection.slice(0, 7) + '</p>' +
        '<svg id="' + id + '-hemi" class="sp-hemicycle"></svg>' +
        UI.resultsTable(reg.seats, null, { prevSeats: reg.prevSeats, compact: true });
      UI.drawHemicycle('#' + id + '-hemi', reg.seats);
    };
    select.onchange = function () { show(select.value); };
    show(selected);
  }

  function renderMap(Q, id) {
    var out = el(id);
    if (out && Q.map_winners) {
      UI.drawMap(out, Q.map_winners, 'Most-voted party by province (hover for vote shares)',
        { shares: Q.map_shares, outlines: Q.map_kind === 'regional' ? 'bold' : 'light' });
    }
  }

  // How far the final polls were from the result.
  function renderPollMiss(Q, id) {
    var out = el(id);
    if (!out || !Q.last_poll_miss) {
      return;
    }
    var parts = Object.keys(Q.last_poll_miss)
      .filter(function (p) { return Math.abs(Q.last_poll_miss[p]) >= 0.5; })
      .sort(function (a, b) { return Math.abs(Q.last_poll_miss[b]) - Math.abs(Q.last_poll_miss[a]); })
      .map(function (p) {
        var m = Q.last_poll_miss[p];
        return UI.shortName(p) + (m > 0 ? ' overestimated by ' : ' underestimated by ') + Math.abs(m).toFixed(1);
      });
    out.innerHTML = parts.length ? '<p><strong>The polls:</strong> ' + parts.join('; ') + ' points.</p>'
      : '<p><strong>The polls</strong> were close this time.</p>';
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
        res.government.cabinet.map(UI.partyName).join(' + ') + (res.government.support.length
          ? ', with support from ' + res.government.support.map(UI.partyName).join(' and ') : '') +
        '). ' + (res.government.type || '') + '.' + note + '</p>';
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
    endOfWeek: endOfWeek,
    projectedVote: projectedVote,
    holdInvestiture: holdInvestiture,
    formGovernment: formGovernment,
    dissolve: dissolve,
    runGeneralElection: runGeneralElection,
    regionalGovernment: regionalGovernment,
    provinceWinners: provinceWinners,
    runDueRegionalElections: runDueRegionalElections,
    lossReason: lossReason,
    renderVote: renderVote,
    renderCongress: renderCongress,
    renderPolls: renderPolls,
    renderRegions: renderRegions,
    renderRegionalResults: renderRegionalResults,
    renderFactions: renderFactions,
    campaign: campaign,
    transfer: transfer,
    position: position,
    trueVote: trueVote,
    drawPollError: drawPollError,
    typicalShare: typicalShare,
    target: target,
    TARGETS: TARGETS,
    regionalMod: regionalMod,
    territorial: territorial,
    holdCensure: holdCensure,
    holdBudget: holdBudget,
    callElection: callElection,
    renderRelations: renderRelations,
    renderMap: renderMap,
    renderPollChart: renderPollChart,
    renderPollMiss: renderPollMiss,
    pollSeries: pollSeries
  };
  if (isNode) {
    module.exports = api;
  } else {
    root.SpainGame = api;
  }
})(this);
