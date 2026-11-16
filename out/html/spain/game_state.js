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
  // Unemployment (EPA annual average, %) and real GDP growth (INE, %).
  var UNEMP_BY_YEAR = { 2014: 24.4, 2015: 22.1, 2016: 19.6, 2017: 17.2, 2018: 15.3, 2019: 14.1,
                        2020: 15.5, 2021: 14.8, 2022: 12.9, 2023: 12.2 };
  var GROWTH_BY_YEAR = { 2014: 1.4, 2015: 3.8, 2016: 3.0, 2017: 3.0, 2018: 2.3, 2019: 2.0,
                         2020: -11.2, 2021: 6.4, 2022: 5.8, 2023: 2.5 };
  // Background migration pressure by year (arrivals by sea: 2018 peak on the
  // Strait, 2020-21 Canaries route), on the chaos scale.
  var MIGRATION_BY_YEAR = { 2014: 1, 2015: 2, 2016: 2, 2017: 4, 2018: 8, 2019: 4, 2020: 6, 2021: 8,
                            2022: 3, 2023: 5 };
  function yearOf(table, year) {
    return table[Math.max(2014, Math.min(2023, year))];
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
    Q.timers = ['advisor_action', 'foreign', 'pes', 'appoint', 'dues', 'intl_net', 'exile_org', 'exile_tour', 'exile_book', 'exile_bridge', 'exile_funds', 'exile_bid', 'negotiations', 'barons', 'media', 'membership', 'rally',
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
    // PP leadership: Rajoy until defeat forces him out
    Q.pp_leader = 'Mariano Rajoy';
    Q.pp_leader_id = 'rajoy';
    Q.pp_pressure = 0;
    Q.pp_leaders_used = ['rajoy'];
    // who Sánchez is: PSOE leader, or (after an ouster) a backbencher, a
    // member of Ciudadanos or Podemos, or the leader of his own party
    Q.player_party = 'psoe';
    Q.exiled = 0;
    Q.backbench = 0;
    Q.populism = 1;
    Q.lead_stage = 0;
    Q.psoe_leader = 'Pedro Sánchez';
    Q.catalan_crisis = 0;
    Q.pp_scandal = 0;

    // International relations (0-100): Spain's standing with each partner.
    // While the PSOE is in opposition they reflect the government's
    // diplomacy and the party's own contacts (European socialists etc.).
    Q.intl = { eu: 60, south: 60, maghreb: 50, us: 55, nato: 55, un: 55 };

    // Party finances: an abstract fund, earned monthly and spent on campaigns.
    Q.funds = 6;
    Q.dues_level = 0;           // -2..+2: party dues below or above the norm
    Q.final_campaign_round = 0; // last-minute spending done for election n
    Q.campaign_skill = 0;       // learned from sister parties (Labour etc.)
    // Economy and society: historical path plus adjustments by any government
    Q.growth_adj = 0;
    Q.unemp_adj = 0;
    Q.social_policy = 0;        // accumulated social policy (welfare, rights)
    Q.cohesion = 42;            // social cohesion 0-100 (2014: deep crisis)
    Q.migration = 0;            // migration tension from events (decays)
    Q.cat_tension = 0;          // tension after the Catalan crisis (decays)
    Q.chaos = 25;
    // Government finances: policy adjustment to the deficit (points of GDP)
    // and its cumulative effect on debt.
    Q.fiscal_adj = 0;
    Q.debt_adj = 0;

    Q.govt_parties = ['pp'];
    allocateCabinet(Q, 'standard');
    Q.cabinet.deputy.name = 'Soraya Sáenz de Santamaría';
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
    Q.right_candidate = (Q.congress.cs || 0) > (Q.congress.pp || 0) ? 'cs' : 'pp';
    Q.right_is_cs = Q.right_candidate === 'cs' ? 1 : 0;
    Q.right_leader = Q.right_candidate === 'cs' ? leaderOf(Q, 'cs') : (Q.pp_leader || 'Mariano Rajoy');
    Q.pp_leader_short = surname(Q.pp_leader || 'Mariano Rajoy');
    Q.player_party = Q.player_party || 'psoe';
    Q.my_party = Q.player_party === 'psoe' ? 'the PSOE' : UI.partyName(Q.player_party);
    Q.my_party_cap = Q.my_party.charAt(0).toUpperCase() + Q.my_party.slice(1);
    Q.player_is_cs = Q.player_party === 'cs' ? 1 : 0;
    Q.player_is_up = Q.player_party === 'up' ? 1 : 0;
    Q.player_is_ps = Q.player_party === 'ps' ? 1 : 0;
    Q.sanchez_active = (Q.sanchez_leader || Q.exiled) ? 1 : 0;
    Q.sanchez_pm = Q.pm === 'Pedro Sánchez' && !Q.acting ? 1 : 0;
    Q.player_in_government = (!Q.acting && (Q.govt_parties || []).indexOf(Q.player_party) !== -1) ? 1 : 0;
    Q.populism = clamp(Q.populism || 0, 0, 10);
    Q.style_word = UI.word('style', Q.populism);
    Q.player_seats = Q.congress[Q.player_party] || 0;
    Q.player_is_right_cand = (Q.exiled && Q.player_leads && Q.right_candidate === Q.player_party) ? 1 : 0;
    Q.player_poll = Math.round(((Q.true_poll && Q.true_poll[Q.player_party]) || 0) * 10) / 10;
    // Invitations into another party are rare: near-perfect relations and
    // close political alignment. Ciudadanos wants an economic moderate who
    // has been a hardliner against independence; Podemos a social
    // progressive, economic radical and populist.
    var e = Q.econ_left || 0, so = Q.social_prog || 0;
    Q.anti_indep_score = 2 * (Q.cat_hard_line || 0) + (Q.red_lines ? 2 : 0) - 2 * (Q.cat_dialogue || 0) -
      (Q.referendum_offer ? 4 : 0) - (Q.pardons_granted ? 4 : 0);
    Q.is_anti_indep = Q.anti_indep_score >= 4 ? 1 : 0;
    Q.is_moderate = (e >= -3 && e <= 1) ? 1 : 0;
    Q.is_progressive = so >= 3 ? 1 : 0;
    Q.is_radical = e >= 6 ? 1 : 0;
    Q.is_populist = (Q.populism || 0) >= 8 ? 1 : 0;
    Q.can_join_cs = (Q.rel_cs >= 90 && Q.is_moderate && Q.is_anti_indep && Q.true_poll && Q.true_poll.cs >= 3) ? 1 : 0;
    Q.can_join_up = (Q.rel_up >= 90 && Q.is_progressive && Q.is_radical && Q.is_populist &&
      Q.true_poll && Q.true_poll.up >= 3) ? 1 : 0;
    // a party of his own needs a personality cult
    Q.can_found = (Q.sanchismo || 0) >= 80 ? 1 : 0;
    var nps = newPartyStrength(Q);
    // rough vote share a new party would poll (fitted to the vote model)
    Q.new_party_prospect = Math.round(0.6 * nps + 0.035 * nps * nps);
    Q.right_party_name = Q.right_candidate === 'cs' ? 'Ciudadanos' : 'the PP';
    Q.up_rivals_psoe = (Q.congress.up || 0) >= 0.9 * (Q.congress.psoe || 1) ? 1 : 0;
    Q.congress_up_seats = Q.congress.up || 0;
    Q.psoe_largest = (Q.congress.psoe || 0) > Math.max(Q.congress.pp || 0, Q.congress.cs || 0, Q.congress.up || 0) ? 1 : 0;
    Q.congress_psoe_seats = Q.congress.psoe || 0;
    Q.iglesias_round = Q.iglesias_round || 0;
    Q.cs_up_word = UI.word('relation', Parliament.between(Q, 'cs', 'up'));
    Q.cs_indep_word = UI.word('relation', Math.min(Parliament.between(Q, 'cs', 'erc'), Parliament.between(Q, 'cs', 'junts')));
    Q.pp_vox_word = UI.word('relation', Parliament.between(Q, 'pp', 'vox'));
    Q.pp_cs_word = UI.word('relation', Parliament.between(Q, 'cs', 'pp'));
    Q.up_indep_word = UI.word('relation', Parliament.between(Q, 'erc', 'up'));
    Q.pnv_pp_word = UI.word('relation', Parliament.between(Q, 'pnv', 'pp'));
    Q.pp_majority = (Q.congress.pp || 0) >= 176 ? 1 : 0;
    Q.pp_vox_majority = ((Q.congress.pp || 0) + (Q.congress.vox || 0)) >= 176 ? 1 : 0;
    Q.grand_possible = ((Q.congress.pp || 0) + (Q.congress.psoe || 0)) >= 176 ? 1 : 0;
    Q.seeking_government = (Q.acting && !Q.psoe_in_government && Q.elections_held >= 1 &&
      !Q.election_year && Q.sanchez_leader) ? 1 : 0;
    var cat = Q.regions && Q.regions['Cataluña'] && Q.regions['Cataluña'].government;
    Q.catalonia_independentist = (cat && ['jxsi', 'junts', 'erc'].indexOf(cat.party) !== -1) ? 1 : 0;
    var and = Q.regions && Q.regions['Andalucía'] && Q.regions['Andalucía'].government;
    Q.regions_andalucia_psoe = (and && and.party === 'psoe') ? 1 : 0;
    Q.funds_income = Math.round((fundsIncome(Q) - fundsUpkeep(Q)) * 100) / 100;
    Q.funds_income_text = (Q.funds_income >= 0 ? '+' : '') + Q.funds_income.toFixed(2);
    Q.funds_display = Math.floor(Q.funds);
    Q.in_debt = Q.funds < 0 ? 1 : 0;
    Q.deficit = Math.round((yearValue(DEFICIT_BY_YEAR, Q.year) + (Q.fiscal_adj || 0)) * 10) / 10;
    Q.debt = Math.round(yearValue(DEBT_BY_YEAR, Q.year) + (Q.debt_adj || 0));
    Q.deficit_text = Q.deficit.toFixed(1);
    deriveWorld(Q);
    Q.intl = Q.intl || { eu: 60, south: 60, maghreb: 50, us: 55, nato: 55, un: 55 };
    Object.keys(Q.intl).forEach(function (k) {
      Q.intl[k] = clamp(Q.intl[k], 0, 100);
      Q['intl_' + k] = Math.round(Q.intl[k]);
      Q['intl_' + k + '_word'] = UI.word('relation', Q.intl[k]);
    });
    // Brussels tolerates a little more deficit from a trusted government
    Q.deficit_tolerance = Q.intl.eu >= 70 ? 4.2 : (Q.intl.eu >= 50 ? 3.5 : 3.0);
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
    representation(Q);
    cabinetFlags(Q);
    Q.us_left_open = Q.year * 100 + Q.month >= 201702 ? 1 : 0;
    Object.keys(SISTER_LEADERS).forEach(function (p) {
      Q['sister_' + p] = sisterLeader(Q, p).name;
      Q['hint_' + p] = lessonHint(Q, p);
    });
    checkLeadership(Q);
    // flags for conditional world events
    var mad = Q.regions && Q.regions['Madrid'];
    Q.madrid_pp = mad && mad.government && mad.government.party === 'pp' ? 1 : 0;
    var csSeats = (Q.congress && Q.congress.cs) || 0;
    Q.cs_peak_seats = Math.max(Q.cs_peak_seats || 0, csSeats);
    Q.cs_collapsed = Q.cs_peak_seats >= 30 && csSeats < 15 ? 1 : 0;
    Q.up_running = Q.true_poll && Q.true_poll.up >= 4 ? 1 : 0;
    Q.lost_majority = Q.lost_majority || 0;
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
  var POLLED_PARTIES = ['psoe', 'pp', 'cs', 'up', 'vox', 'mp', 'iu', 'ps'];

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

  // ------------------------------------------------------------------
  // The final campaign: last-minute spending just before a general
  // election. Its effects are temporary (election day only); a sixth of
  // them persists afterwards. Repeating the same spend gives diminishing
  // returns within a campaign.
  // ------------------------------------------------------------------
  var EDAY_PERSIST = 0.15;
  var ATTACK_SPLIT = { pp: { cs: 0.3, vox: 0.3, psoe: 0.2 }, cs: { pp: 0.4, psoe: 0.3 }, up: { psoe: 0.4, iu: 0.2 },
                       vox: { pp: 0.5, cs: 0.1 }, psoe: { up: 0.3, pp: 0.2 } };

  function withEday(Q) {
    var vm = JSON.parse(JSON.stringify(Q.vm));
    var e = Q.eday;
    if (!e) {
      return vm;
    }
    Object.keys(e.cls).forEach(function (p) {
      Object.keys(e.cls[p]).forEach(function (c) {
        vm.classSupport[c][p] = Math.max(0, (vm.classSupport[c][p] || 0) + e.cls[p][c]);
      });
    });
    Object.keys(e.reg).forEach(function (r) {
      vm.regionalMod[r] = vm.regionalMod[r] || {};
      Object.keys(e.reg[r]).forEach(function (p) {
        vm.regionalMod[r][p] = (vm.regionalMod[r][p] === undefined ? 1 : vm.regionalMod[r][p]) * e.reg[r][p];
      });
    });
    return vm;
  }

  function finalCampaignPoll(Q) {
    var me = Q.player_party || 'psoe';
    var r = VoteModel.runGeneralElection(withEday(Q), base(), DATA, Q.year, Q.month);
    Q.eday_poll = Math.round((r.voteShares[me] || 0) * 10) / 10;
    Q.eday_seats = r.totals[me] || 0;
    Q.eday_base_poll = Math.round(((Q.true_poll && Q.true_poll[me]) || 0) * 10) / 10;
    Q.funds_display = Math.floor(Q.funds);
  }

  function startFinalCampaign(Q) {
    Q.eday = { cls: {}, reg: {}, uses: {} };
    Q.eday_spent = 0;
    Q.eday_last = '';
    finalCampaignPoll(Q);
  }

  // kind: 'class' (key: a target group), 'region' (key: a community) or
  // 'attack' (key: a rival party). Costs 1 in funds.
  function finalSpend(Q, kind, key) {
    if (!Q.eday) {
      startFinalCampaign(Q);
    }
    var e = Q.eday;
    var me = Q.player_party || 'psoe';
    var uk = kind + ':' + key;
    var n = e.uses[uk] || 0;
    e.uses[uk] = n + 1;
    var f = 1 / (1 + n);
    var addCls = function (p, c, v) {
      e.cls[p] = e.cls[p] || {};
      e.cls[p][c] = (e.cls[p][c] || 0) + v;
    };
    var mulReg = function (r, p, x) {
      e.reg[r] = e.reg[r] || {};
      e.reg[r][p] = (e.reg[r][p] || 1) * x;
    };
    Q.funds -= 1;
    Q.eday_spent = (Q.eday_spent || 0) + 1;
    if (kind === 'class') {
      var t = TARGETS[key];
      if (t.regions) {
        t.regions.forEach(function (r) { mulReg(r, me, 1 + 0.06 * f); });
      } else {
        Object.keys(t.classes).forEach(function (c) { addCls(me, c, 3 * f * t.classes[c]); });
      }
      Q.eday_last = 'A final push aimed at ' + t.name + '.';
    } else if (kind === 'region') {
      mulReg(key, me, 1 + 0.1 * f);
      Q.eday_last = 'Your last week of rallies and adverts is concentrated in ' + key + '.';
    } else if (kind === 'attack') {
      var split = ATTACK_SPLIT[key] || {};
      var mine = me === 'psoe' ? 0.25 : 0.2;
      var backfire = Math.random() < 0.2;
      Object.keys(Q.vm.classSupport).forEach(function (c) {
        var hit = Math.min(1.6 * f, (Q.vm.classSupport[c][key] || 0) + ((e.cls[key] || {})[c] || 0));
        addCls(key, c, -hit);
        addCls(me, c, backfire ? -0.5 * f : hit * mine);
        Object.keys(split).forEach(function (p) {
          if (p !== me) {
            addCls(p, c, hit * split[p]);
          }
        });
      });
      Q.eday_backfire = backfire ? 1 : 0;
      Q.eday_last = backfire ? 'The attack ads against ' + UI.partyName(key) + ' backfire: the press calls them dirty, and some of your own voters agree.'
        : 'The attack ads against ' + UI.partyName(key) + ' land. Some of its voters stay at home or look elsewhere.';
    }
    finalCampaignPoll(Q);
    return f;
  }

  // After the vote: a fraction of the final push persists; the rest fades.
  function settleFinalCampaign(Q) {
    var e = Q.eday;
    if (!e) {
      return;
    }
    Object.keys(e.cls).forEach(function (p) {
      Object.keys(e.cls[p]).forEach(function (c) {
        Q.vm.classSupport[c][p] = Math.max(0, (Q.vm.classSupport[c][p] || 0) + EDAY_PERSIST * e.cls[p][c]);
      });
    });
    Object.keys(e.reg).forEach(function (r) {
      Q.vm.regionalMod[r] = Q.vm.regionalMod[r] || {};
      Object.keys(e.reg[r]).forEach(function (p) {
        var cur = Q.vm.regionalMod[r][p] === undefined ? 1 : Q.vm.regionalMod[r][p];
        Q.vm.regionalMod[r][p] = cur * Math.pow(e.reg[r][p], EDAY_PERSIST);
      });
    });
    Q.eday = null;
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
          v *= GAIN_SCALE * fatigueFactor(Q) * (Q.psoe_in_government ? GOVERNING_GAIN : 1) * (1 + (Q.campaign_skill || 0));
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
    // moving to the centre or right: left-wing voters go to Podemos and IU
    var r = Math.max(0, -1 - (Q.econ_left || 0)) + 0.5 * Math.max(0, -1 - (Q.social_prog || 0));
    if (r > 0) {
      transfer(Q, 'psoe', { up: 0.8, iu: 0.2 },
        { workers: 0.35 * r, students: 0.35 * r, unemployed: 0.3 * r, professionals: 0.1 * r });
    }
    Q.econ_left = (Q.econ_left || 0) * 0.97;
    Q.social_prog = (Q.social_prog || 0) * 0.97;
  }

  // Change Spain's relation with an international partner.
  // Relations improve with diminishing returns: the warmer they already
  // are, the less a gesture adds. Losses apply in full.
  function intl(Q, key, delta) {
    Q.intl = Q.intl || {};
    var cur = Q.intl[key] === undefined ? 50 : Q.intl[key];
    if (delta > 0) {
      delta *= Math.max(0.15, (100 - cur) / 90);
    }
    Q.intl[key] = clamp(cur + delta, 0, 100);
  }

  // Economic effect of a policy or event: growth in points this year,
  // unemployment in points (structural, slow to fade).
  function econ(Q, growth, unemp) {
    Q.growth_adj = (Q.growth_adj || 0) + 1.6 * (growth || 0);
    Q.unemp_adj = (Q.unemp_adj || 0) + 1.8 * (unemp || 0);
  }

  // Social policy: welfare and rights raise cohesion, cuts and conflict lower it.
  function social(Q, delta) {
    Q.social_policy = clamp((Q.social_policy || 0) + delta, -20, 20);
  }

  function migration(Q, delta) {
    Q.migration = clamp((Q.migration || 0) + delta, 0, 40);
  }

  // Monthly economy, society and chaos. Chaos (0-100) gathers economic
  // pain, endless government formation, migration tension, the Catalan
  // conflict, corruption and the pandemic. From 2016 it feeds Vox and, to a
  // lesser extent, Podemos.
  // Monthly drift of the barons' plot: a hostile Federal Committee, a
  // divided party, weak polls and Díaz's enmity feed it; loyalists in
  // the party's posts starve it.
  function plotDrift(Q) {
    if (!Q.sanchez_leader) {
      return;
    }
    var poll = (Q.true_poll && Q.true_poll.psoe) || 22;
    var d = 0.4 * (50 - (Q.federal_committee_balance || 50)) / 10 + ((Q.dissent_percent || 20) - 25) / 8 +
      (poll < 20 ? 1.5 : (poll < 23 ? 0.5 : -0.5)) + ((Q.diaz_relation || 50) < 40 && Q.year <= 2018 ? 1 : 0) -
      0.5 * (Q.loyalist_posts || 0) + leftDrift(Q) +
      // a losing streak: under 100 seats and out of government
      ((Q.congress.psoe || 0) < 100 && !Q.psoe_in_government && Q.elections_held >= 1 ? 1.5 : 0);
    Q.plot = clamp((Q.plot || 0) * 0.98 + d, 0, 100);
  }

  // A left-wing course alarms the Executive and above all the barons:
  // economic radicalism counts most, then deals with Podemos and
  // concessions to the independence parties.
  function leftDrift(Q) {
    var e = Q.econ_left || 0, so = Q.social_prog || 0;
    return Math.max(0, e - 2) * 0.7 + Math.max(0, so - 3) * 0.3 + (Q.pact_up ? 1 : 0) +
      (Q.referendum_offer ? 1.5 : 0) + ((Q.cat_dialogue || 0) >= 2 ? 1 : 0);
  }

  // Sánchez's attempt to put his own people in the party's posts.
  // where: 'executive', 'federations', 'group', 'statutes'
  function placeLoyalists(Q, where) {
    Q.loyalist_uses = Q.loyalist_uses || {};
    var n = Q.loyalist_uses[where] || 0;
    Q.loyalist_uses[where] = n + 1;
    var f = 1 / (1 + n);
    Q.loyalist_ok = 1;
    if (where === 'executive') {
      Q.loyalist_posts = (Q.loyalist_posts || 0) + 2 * f; Q.federal_committee_balance += 5 * f;
      Q.institutionalists_dissent += 5; Q.plot -= 8 * f;
    } else if (where === 'federations') {
      var chance = 0.25 + (Q.sanchismo || 0) / 120 + (Q.member_morale || 0) / 300 - (Q.regional_leaders_strength || 30) / 150;
      Q.loyalist_ok = Math.random() < chance ? 1 : 0;
      if (Q.loyalist_ok) {
        Q.loyalist_posts = (Q.loyalist_posts || 0) + 3 * f; Q.regional_leaders_strength -= 3 * f;
        Q.regional_leaders_dissent += 8; Q.plot -= 12 * f; Q.federal_committee_balance += 6 * f;
      } else {
        Q.regional_leaders_dissent += 10; Q.plot += 10; Q.sanchez_authority -= 4;
      }
    } else if (where === 'group') {
      Q.loyalist_posts = (Q.loyalist_posts || 0) + 1 * f; Q.institutionalists_dissent += 4; Q.plot -= 4 * f;
    } else if (where === 'statutes') {
      Q.loyalist_posts = (Q.loyalist_posts || 0) + 2 * f; Q.member_morale += 3; Q.plot -= 12 * f;
      Q.federal_committee_balance += 6 * f; Q.regional_leaders_dissent += 5; Q.statutes_reformed = 1;
    }
    Q.loyalist_posts = Math.min(10, Q.loyalist_posts || 0);
    recalculate(Q);
    return Q.loyalist_ok;
  }

  // The barons' strength in a showdown: the plot, their own weight, Díaz's
  // enmity, a left-wing course and, in a deadlock with a weak PSOE, the
  // argument that Spain needs a government.
  function coupAttack(Q) {
    return 0.6 * (Q.plot || 0) + 0.5 * (Q.regional_leaders_strength || 30) +
      (Q.year <= 2018 && (Q.diaz_relation || 50) < 50 ? 8 : 0) + 2 * leftDrift(Q) +
      (Q.acting && (Q.congress.psoe || 0) < 100 ? 10 : 0);
  }

  // Sánchez's strength: the Committee's balance, his loyalists in key posts,
  // the members' morale.
  function coupDefence(Q) {
    return 0.8 * (Q.federal_committee_balance || 50) + 4 * (Q.loyalist_posts || 0) + (Q.member_morale || 50) / 5;
  }

  // The extraordinary Federal Committee: about 240 delegates vote on
  // Sánchez's extraordinary congress. bonus: procedural moves (+) or
  // concessions (-). Sets fc_for / fc_against; ousts him if he loses.
  function federalCommitteeVote(Q, bonus) {
    var attack = coupAttack(Q);
    var defence = coupDefence(Q) + (bonus || 0) + 12 * (Math.random() - 0.5);
    var total = 239;
    Q.fc_for = Math.round(total * defence / (defence + attack));
    Q.fc_against = total - Q.fc_for;
    Q.coup_survived = Q.fc_for > Q.fc_against ? 1 : 0;
    Q.coup_cooldown = Q.time + 6;
    if (Q.coup_survived) {
      Q.plot = 10; Q.sanchez_authority += 12; Q.regional_leaders_dissent -= 10; Q.sanchismo += 6;
    } else {
      oust(Q, false);
    }
    recalculate(Q);
    return Q.coup_survived;
  }

  // The barons move: the Federal Executive resigns en masse. defend:
  // 'fight' (in the Federal Committee), 'members' (a snap primary) or
  // 'resign'. Returns 1 if Sánchez survives.
  function baronsCoup(Q, defend) {
    Q.coup_cooldown = Q.time + 6;
    var attack = coupAttack(Q);
    if (defend === 'resign') {
      oust(Q, false);
      Q.coup_survived = 0;
    } else if (defend === 'members') {
      Q.coup_survived = leadershipElection(Q, 3 + 2 * (Q.loyalist_posts || 0) / 2);
    } else {
      var defence = coupDefence(Q) + 16 * (Math.random() - 0.5);
      Q.coup_survived = defence >= attack ? 1 : 0;
      if (!Q.coup_survived) {
        oust(Q, false);
      }
    }
    if (Q.coup_survived) {
      Q.plot = 10; Q.sanchez_authority += 10; Q.regional_leaders_dissent -= 8; Q.sanchismo += 5;
    }
    recalculate(Q);
    return Q.coup_survived;
  }

  function monthlyWorld(Q) {
    var t = Q.year * 12 + Q.month;
    plotDrift(Q);
    // the economy: growth shocks fade within a year; unemployment follows
    // growth (Okun) and its own adjustments fade slowly
    Q.unemp_adj = (Q.unemp_adj || 0) - 0.04 * (Q.growth_adj || 0);
    Q.growth_adj = (Q.growth_adj || 0) * 0.92;
    Q.unemp_adj *= 0.994;
    if (Q.acting && (Q.formation_months || 0) > 6) {
      Q.growth_adj -= 0.03;
    }
    if ((Q.chaos || 0) > 40) {
      Q.growth_adj -= 0.01 * (Q.chaos - 40) / 10;
    }
    // governments of the right govern too: the PP trims the deficit and
    // society notices
    // a governing PSOE's economic line: a more left course costs a little
    // growth and confidence but builds social cohesion; a centrist one helps growth
    if (!Q.acting && Q.psoe_in_government && Q.sanchez_leader && Q.month === 1) {
      var e = Q.econ_left || 0;
      econ(Q, e >= 5 ? -0.25 : (e <= 1 ? 0.2 : 0), e >= 5 ? 0.15 : (e <= 1 ? -0.1 : 0));
      social(Q, e >= 5 ? 2 : (e >= 3 ? 1 : 0));
    }
    if (!Q.acting && Q.pm_party === 'pp' && Q.month === 1) {
      Q.fiscal_adj = (Q.fiscal_adj || 0) - 0.1;
      social(Q, (Q.govt_parties || []).indexOf('vox') !== -1 ? -4 : -2);
    }
    Q.migration = (Q.migration || 0) * 0.96;
    Q.cat_tension = (Q.cat_tension || 0) * 0.95;
    Q.social_policy = (Q.social_policy || 0) * 0.995;
    deriveWorld(Q);
    // social cohesion moves a tenth of the way to its target each month
    var target = 70 - 1.2 * (Q.unemployment - 10) - 0.3 * (Q.chaos || 0) + 1.5 * (Q.social_policy || 0) +
      4 * Math.min(1.5, Q.welfare_learned || 0);
    Q.cohesion = clamp((Q.cohesion || 42) + (target - (Q.cohesion || 42)) * 0.1, 0, 100);
    // chaos
    var pandemic = (t >= 2020 * 12 + 3 && t <= 2021 * 12 + 6) ? 12 : 0;
    var raw = Math.max(0, Q.unemployment - 13) * 1.5 + Math.max(0, -Q.growth) * 2 +
      (Q.acting ? 10 + Math.min(15, 2 * (Q.formation_months || 0)) : 0) + 6 * (Q.repeat_elections || 0) +
      yearOf(MIGRATION_BY_YEAR, Q.year) + (Q.migration || 0) +
      (Q.catalan_crisis ? 15 : 0) + (Q.cat_tension || 0) +
      (Q.pm_party === 'pp' ? 3 * (Q.pp_scandal || 0) : 0) + pandemic +
      Math.max(0, 50 - Q.cohesion) * 0.5;
    Q.chaos = clamp(0.7 * (Q.chaos || 25) + 0.3 * raw, 0, 100);
    if (Q.acting) {
      Q.formation_months = (Q.formation_months || 0) + 1;
    } else {
      Q.formation_months = 0;
    }
    if (Q.year * 100 + Q.month < 201601) {
      return;  // 2014-15 follows the real polls (history_path_data.js)
    }
    var c = Q.chaos / 100;
    // Vox feeds on chaos, fully once it has broken through (from 2018)
    var voxReady = Q.year >= 2018 || Q.vox_breakthrough ? 1 : 0.3;
    var voxNow = (Q.true_poll && Q.true_poll.vox) || 0;
    // Vox's growth slows as it approaches its ceiling
    var vox = 0.45 * c * voxReady * (1 - 0.2 * Math.min(1.5, Q.migration_learned || 0)) * Math.max(0, 1 - voxNow / 16);
    transfer(Q, 'pp', 'vox', { pensioners: vox * 0.45, self_employed: vox * 0.6, workers: vox * 0.35,
                              professionals: vox * 0.35, homemakers: vox * 0.4, unemployed: vox * 0.3 });
    transfer(Q, 'cs', 'vox', { self_employed: vox * 0.45, workers: vox * 0.35, professionals: vox * 0.3,
                              students: vox * 0.25, unemployed: vox * 0.3 });
    transfer(Q, 'psoe', 'vox', { workers: vox * 0.2, pensioners: vox * 0.15, unemployed: vox * 0.2 });
    // Podemos too, to a smaller extent
    var up = 0.3 * c;
    transfer(Q, 'psoe', 'up', { students: up, unemployed: up, workers: up * 0.8, professionals: up * 0.5 });
    transfer(Q, 'cs', 'up', { students: up * 0.4, professionals: up * 0.3 });
    // Ciudadanos: the junior partner of a PP government is absorbed, and
    // once Vox exists the right consolidates at Cs's expense
    var all = function (x) {
      return { workers: x, professionals: x, pensioners: x, self_employed: x,
               unemployed: x, students: x, homemakers: x };
    };
    if (!Q.acting && (Q.govt_parties || []).indexOf('cs') !== -1 && Q.pm_party !== 'cs') {
      transfer(Q, 'cs', { pp: 0.7, vox: 0.15, psoe: 0.15 }, all(0.25));
    }
    var voxPoll = (Q.true_poll && Q.true_poll.vox) || 0;
    if (Q.year >= 2019 && voxPoll >= 5) {
      transfer(Q, 'cs', { pp: 0.7, vox: 0.3 }, all(0.012 * voxPoll));
    }
    // Podemos's internal strife slowly erodes it from 2017
    if (Q.year >= 2017) {
      transfer(Q, 'up', { psoe: 0.6, iu: 0.15, mp: 0.25 }, share(Q, 'up', 0.008));
    }
    // when things calm down, Vox's protest voters drift back to the PP
    if (Q.chaos < 30 && voxPoll > 3) {
      transfer(Q, 'vox', 'pp', share(Q, 'vox', 0.01 * (30 - Q.chaos) / 10));
    }
    // the economy judges the government: unemployment above its
    // historical level costs the governing party
    var gov = Q.pm_party;
    if (!Q.acting && gov && Q.unemp_adj > 1 && Q.vm.classSupport.workers[gov] !== undefined) {
      var to = gov === 'pp' ? { psoe: 0.5, vox: 0.3, cs: 0.2 } : { pp: 0.5, vox: 0.3, up: 0.2 };
      transfer(Q, gov, to, all(0.025 * (Q.unemp_adj - 1)));
    }
  }

  // A fraction of a party's support in every class (for proportional moves).
  function share(Q, party, frac) {
    var out = {};
    Object.keys(Q.vm.classSupport).forEach(function (c) {
      out[c] = (Q.vm.classSupport[c][party] || 0) * frac;
    });
    return out;
  }

  function deriveWorld(Q) {
    Q.unemployment = Math.round((yearOf(UNEMP_BY_YEAR, Q.year) + (Q.unemp_adj || 0)) * 10) / 10;
    Q.growth = Math.round((yearOf(GROWTH_BY_YEAR, Q.year) + (Q.growth_adj || 0)) * 10) / 10;
    Q.unemployment_text = Q.unemployment.toFixed(1);
    Q.growth_text = (Q.growth > 0 ? '+' : '') + Q.growth.toFixed(1);
    var co = Math.round(Q.cohesion || 0);
    Q.cohesion_word = co < 25 ? 'Fractured' : (co < 40 ? 'Tense' : (co < 55 ? 'Strained' : (co < 70 ? 'Stable' : 'Cohesive')));
    var ch = Math.round(Q.chaos || 0);
    Q.chaos_word = ch < 20 ? 'Calm' : (ch < 35 ? 'Restless' : (ch < 50 ? 'Turbulent' : (ch < 65 ? 'Chaotic' : 'In turmoil')));
    Q.economy_word = Q.growth < 0 ? 'Recession' : (Q.unemployment >= 20 ? 'Depressed' : (Q.unemployment >= 15 ? 'Recovering' : (Q.growth >= 2.5 ? 'Booming' : 'Steady')));
  }

  // Change a relation between two other parties (clamped 0-100).
  function partyRel(Q, a, b, delta) {
    Q.party_rel = Q.party_rel || {};
    var k = Parliament.pairKey(a, b);
    Q.party_rel[k] = Math.max(0, Math.min(100, Parliament.between(Q, a, b) + delta));
  }

  // Governing wears a party down: a little support leaves every month for
  // the opposition (from 2016; the PP's 2014-15 erosion is in the path).
  function incumbencyWear(Q) {
    if (Q.year < 2016) {
      return;
    }
    var all = function (x) {
      return { workers: x, professionals: x, pensioners: 0.8 * x, self_employed: x,
               unemployed: 1.2 * x, students: x, homemakers: 0.8 * x };
    };
    Q.govt_months = Q.acting ? 0 : (Q.govt_months || 0) + 1;
    if (Q.psoe_in_government && !Q.acting) {
      // the first year in office gives visibility; wear sets in slowly
      if (Q.govt_months <= 12) {
        shiftSupport(Q, 'psoe', all(0.12));
      }
      transfer(Q, 'psoe', { pp: 0.4, up: 0.25, cs: 0.15, vox: 0.2 }, all(0.1));
    } else if (Q.pm_party === 'pp' && !Q.acting) {
      transfer(Q, 'pp', { psoe: 0.35, cs: 0.3, vox: 0.25, up: 0.1 }, all(0.15));
    }
  }

  // Party money: public subsidy by seats plus members' dues; running costs
  // (staff, offices, debt service on campaigns) rise year by year.
  function fundsIncome(Q) {
    return 0.2 + (Q.congress[Q.player_party || 'psoe'] || 0) / 350 + 0.15 * (Q.dues_level || 0);
  }

  function fundsUpkeep(Q) {
    return 0.03 + 0.03 * Math.max(0, Q.year - 2014);
  }

  // Sister parties: who leads them on a given date, and what the PSOE can
  // learn from each leadership. Lessons can cut both ways, and repeating
  // the same lesson gives diminishing returns (1, 1/2, 1/3...).
  var SISTER_LEADERS = {
    labour: [[201505, 'miliband', 'Ed Miliband'], [201508, 'harman', 'Harriet Harman (interim)'],
             [202003, 'corbyn', 'Jeremy Corbyn'], [999999, 'starmer', 'Keir Starmer']],
    portugal: [[201409, 'seguro', 'António José Seguro'], [201510, 'costa_opp', 'António Costa (in opposition)'],
               [202201, 'costa_gov', 'António Costa (the "contraption")'], [999999, 'costa_maj', 'António Costa (absolute majority)']],
    denmark: [[201505, 'thorning', 'Helle Thorning-Schmidt'], [999999, 'frederiksen', 'Mette Frederiksen']],
    germany: [[201702, 'gabriel', 'Sigmar Gabriel'], [201802, 'schulz', 'Martin Schulz'],
              [202111, 'nahles', 'Andrea Nahles and her successors'], [999999, 'scholz', 'Olaf Scholz']],
    sweden: [[202110, 'lofven', 'Stefan Löfven'], [999999, 'andersson', 'Magdalena Andersson']],
    us: [[201701, 'obama', 'Barack Obama'], [202101, 'pelosi', 'Nancy Pelosi and Chuck Schumer'], [999999, 'biden', 'Joe Biden']],
    us_left: [[201810, 'sanders', 'Bernie Sanders'], [999999, 'sanders_aoc', 'Bernie Sanders and Alexandria Ocasio-Cortez']],
    italy: [[201802, 'renzi', 'Matteo Renzi'], [201902, 'martina', 'Maurizio Martina'], [202102, 'zingaretti', 'Nicola Zingaretti'],
            [202302, 'letta', 'Enrico Letta'], [999999, 'schlein', 'Elly Schlein']],
    greece: [[201505, 'venizelos', 'Evangelos Venizelos'], [202111, 'gennimata', 'Fofi Gennimata'], [999999, 'androulakis', 'Nikos Androulakis']]
  };

  // One-line hints of what each lesson does, shown under the options.
  var LESSON_HINTS = {
    'labour:miliband': 'Working-class appeal, a little campaign skill; nudges you left',
    'labour:harman': 'Working-class appeal, a little campaign skill; nudges you left',
    'labour:corbyn': 'Young voters, members and progressives up; pensioners, middle class and barons put off',
    'labour:starmer': 'Middle class and modernisers up; progressives angry, some young voters lost to Podemos',
    'portugal:seguro': 'Very little to learn',
    'portugal:costa_opp': 'Better relations with Podemos',
    'portugal:costa_gov': 'Much easier talks with Podemos; warmer southern Europe',
    'portugal:costa_maj': 'Win over Podemos voters; relations with Podemos sour',
    'denmark:thorning': 'Warmer Ciudadanos; nudges you to the centre; progressives uneasy',
    'denmark:frederiksen': 'Vox gains less from migration; progressives object; socially more conservative',
    'germany:gabriel': 'Calmer barons, warmer PP; members uneasy',
    'germany:schulz': 'A burst of member enthusiasm and working-class support; authority dips',
    'germany:nahles': 'Progressives reassured; PP relations cool',
    'germany:scholz': 'Authority and middle-class appeal',
    'sweden:lofven': 'Higher social cohesion; union goodwill',
    'sweden:andersson': 'Some cohesion, warmer NATO; progressives uneasy',
    'us:obama': 'Campaign skill; warmer United States',
    'us:pelosi': 'Leading a broad coalition and getting things done: easier partners, calmer barons; angers the left',
    'us:biden': 'Working and middle class, union goodwill; warmer United States',
    'us_left:sanders': 'Energises progressives and the young, more sanchismo; alienates barons and institutionalists',
    'us_left:sanders_aoc': 'Energises progressives and the young even more, more sanchismo; alienates barons and institutionalists',
    'italy:renzi': 'Middle class and modernisers up, a move to the centre; unions and progressives angry',
    'italy:martina': 'A caretaker: very little to learn',
    'italy:zingaretti': 'Governing with populist partners: better relations and talks with Podemos',
    'italy:letta': 'Pro-European seriousness: calmer institutionalists, warmer EU',
    'italy:schlein': 'Young voters and progressives up, a move left; barons uneasy',
    'greece:venizelos': 'The price of austerity and grand coalitions: steels the left, cools the PP',
    'greece:gennimata': 'Holding the centre-left against a radical rival: win back Podemos voters, colder Podemos',
    'greece:androulakis': 'A slow recovery as the radical left fades: working and middle class, a little authority'
  };

  function lessonHint(Q, party) {
    var L = sisterLeader(Q, party);
    var key = party + ':' + L.id;
    var n = (Q.learn_counts || {})[key] || 0;
    return (LESSON_HINTS[key] || '') + (n ? ' (studied ' + n + '×: next lesson ' + Math.round(100 / (1 + n)) + '% as strong)' : '');
  }

  function sisterLeader(Q, party) {
    var k = Q.year * 100 + Q.month;
    var list = SISTER_LEADERS[party];
    for (var i = 0; i < list.length; i++) {
      if (k <= list[i][0]) {
        return { id: list[i][1], name: list[i][2] };
      }
    }
    return { id: list[list.length - 1][1], name: list[list.length - 1][2] };
  }

  function learnFrom(Q, party) {
    var L = sisterLeader(Q, party);
    var key = party + ':' + L.id;
    Q.learn_counts = Q.learn_counts || {};
    var n = Q.learn_counts[key] || 0;
    Q.learn_counts[key] = n + 1;
    var f = 1 / (1 + n);
    var all = function (x) { return x * f; };
    var text = '';
    var skill = function (x) { Q.campaign_skill = Math.min(0.3, (Q.campaign_skill || 0) + x * f); };
    switch (key) {
      case 'labour:miliband': case 'labour:harman':
        target(Q, 'psoe', 'working', 1.2 * f); position(Q, 0.3 * f, 0); skill(0.03);
        text = 'Miliband\'s "cost of living" campaign gives you a sharper message on wages and bills. His 2015 defeat is the other lesson: voters must be able to picture you governing.';
        break;
      case 'labour:corbyn':
        target(Q, 'psoe', 'young', 2.5 * f); skill(0.05);
        Q.progressives_dissent -= 6 * f; Q.member_morale += 6 * f; Q.sanchismo += 3 * f;
        Q.regional_leaders_dissent += 6 * f; Q.institutionalists_dissent += 5 * f;
        transfer(Q, 'psoe', { pp: 0.5, cs: 0.5 }, { pensioners: all(1.2), professionals: all(1), self_employed: all(0.8) });
        position(Q, 1.2 * f, 0.5 * f);
        text = 'Corbyn\'s Labour fills halls with young people and turns members into activists. It also frightens older and middle-class voters, and your barons.';
        break;
      case 'labour:starmer':
        target(Q, 'psoe', 'middle', 1.8 * f);
        Q.modernisers_dissent -= 6 * f; Q.institutionalists_dissent -= 4 * f; Q.progressives_dissent += 6 * f; Q.member_morale -= 3 * f;
        transfer(Q, 'psoe', 'up', { students: all(0.8), workers: all(0.3) });
        position(Q, -0.8 * f, 0);
        text = 'Starmer\'s discipline and caution reassure the middle class. Your left wing calls it a purge of the party\'s soul, and some young voters leave for Podemos.';
        break;
      case 'portugal:seguro':
        Q.rel_up += 1 * f;
        text = 'Seguro is about to lose his own primary to António Costa. There is little to learn except how not to be outflanked.';
        break;
      case 'portugal:costa_opp':
        Q.rel_up += 3 * f; Q.progressives_dissent -= 2 * f;
        text = 'Costa is building a programme the radical left could sign. The idea of a left-wing majority starts to feel possible.';
        break;
      case 'portugal:costa_gov':
        Q.rel_up += 6 * f; Q.up_talks += 1 * f; intl(Q, 'south', 3 * f); Q.learned_portugal = 1;
        text = 'Costa\'s people explain how they wrote a separate written agreement with each partner. Talks with Podemos get easier.';
        break;
      case 'portugal:costa_maj':
        transfer(Q, 'up', 'psoe', { workers: all(1), students: all(0.6), professionals: all(0.6) });
        Q.rel_up -= 5 * f;
        text = 'Costa won an absolute majority by squeezing his former partners: the useful vote. It works on some Podemos voters, and Podemos notices.';
        break;
      case 'denmark:thorning':
        Q.rel_cs += 5 * f; Q.progressives_dissent += 3 * f; position(Q, -0.4 * f, 0);
        text = 'Thorning-Schmidt governs from the centre with liberal partners. Ciudadanos warms to you; your left is unimpressed.';
        break;
      case 'denmark:frederiksen':
        Q.migration_learned = (Q.migration_learned || 0) + f; Q.progressives_dissent += 6 * f;
        position(Q, 0, -0.6 * f); social(Q, -0.5 * f);
        text = 'Frederiksen pairs a hard line on migration with a strong welfare state. Vox gains less from migration from now on; your progressives call it a surrender to the right.';
        break;
      case 'germany:gabriel':
        Q.regional_leaders_dissent -= 5 * f; Q.institutionalists_dissent -= 4 * f; Q.progressives_dissent += 3 * f;
        Q.rel_pp += 4 * f; Q.member_morale -= 2 * f;
        text = 'Gabriel\'s grand coalition keeps the State running and slowly eats the junior partner. Your barons like the first half; your members fear the second.';
        break;
      case 'germany:schulz':
        Q.member_morale += 5 * f; target(Q, 'psoe', 'working', 1.5 * f); Q.sanchez_authority -= 2 * f;
        text = 'The "Schulz effect": a surge of enthusiasm that collapsed within months. Your members are energised; the commentators remember how it ended.';
        break;
      case 'germany:nahles':
        Q.progressives_dissent -= 3 * f; Q.rel_pp -= 3 * f; Q.regional_leaders_dissent += 2 * f;
        text = 'The SPD under Nahles is a party being eaten by its coalition. The lesson your left draws: never prop up the right.';
        break;
      case 'germany:scholz':
        Q.sanchez_authority += 3 * f; target(Q, 'psoe', 'middle', 1.2 * f);
        text = 'Scholz won from behind with calm competence and a promise of respect for working people. It reads well on you.';
        break;
      case 'sweden:lofven':
        Q.welfare_learned = (Q.welfare_learned || 0) + f; Q.trade_unionists_dissent -= 3 * f; Q.rel_up += 2 * f;
        text = 'Löfven\'s welfare model is negotiated with unions and employers. Spain\'s social cohesion rises whenever you can apply it.';
        break;
      case 'sweden:andersson':
        Q.welfare_learned = (Q.welfare_learned || 0) + 0.6 * f; intl(Q, 'nato', 3 * f); Q.progressives_dissent += 2 * f;
        text = 'Andersson\'s Social Democrats have turned towards NATO and a tougher line on crime, keeping the welfare state. A mixed lesson for your party.';
        break;
      case 'us:obama':
        skill(0.06); intl(Q, 'us', 2 * f);
        text = 'Obama\'s campaign veterans teach data-driven targeting and volunteer networks. Your campaigns win a little more.';
        break;
      case 'us:pelosi':
        Q.rel_up += 3 * f; Q.rel_pnv += 3 * f; Q.up_talks += 0.5 * f; Q.sanchez_authority += 2 * f;
        Q.institutionalists_dissent -= 4 * f; Q.regional_leaders_dissent -= 3 * f; Q.progressives_dissent += 5 * f;
        target(Q, 'psoe', 'middle', 0.8 * f);
        text = 'Pelosi and Schumer hold together a party from socialists to conservatives and still pass their bills. Counting votes and keeping partners on side gets easier; your left calls it horse-trading.';
        break;
      case 'us_left:sanders': case 'us_left:sanders_aoc':
        var aoc = L.id === 'sanders_aoc' ? 1.3 : 1;
        target(Q, 'psoe', 'young', 2 * aoc * f); Q.funds += 0.3 * f; position(Q, 0.8 * f, 0.3 * f);
        Q.progressives_dissent -= 5 * aoc * f; Q.sanchismo += 4 * aoc * f; Q.member_morale += 2 * f;
        Q.regional_leaders_dissent += 5 * f; Q.institutionalists_dissent += 4 * f;
        text = aoc > 1 ? 'Sanders and Ocasio-Cortez show how a movement of the young can take on its own party\'s establishment. Your progressives and your followers are thrilled; the barons and the institutionalists are not.'
          : 'The Sanders movement runs on small donors and the young. It energises your progressives and your own followers; the barons and the institutionalists think you are drifting left.';
        break;
      case 'italy:renzi':
        target(Q, 'psoe', 'middle', 1.5 * f); Q.modernisers_dissent -= 6 * f; position(Q, -1 * f, 0);
        Q.trade_unionists_dissent += 6 * f; Q.progressives_dissent += 4 * f;
        text = 'Renzi, the "scrapper", modernised the Italian left and passed a labour reform the unions hated, then staked everything on a referendum and lost. Your modernisers love him; your unionists do not.';
        break;
      case 'italy:martina':
        Q.member_morale += 1 * f;
        text = 'Martina is a caretaker after the PD\'s 2018 defeat. Little to learn but sympathy.';
        break;
      case 'italy:zingaretti':
        Q.rel_up += 4 * f; Q.up_talks += 0.5 * f; Q.progressives_dissent -= 2 * f;
        text = 'Zingaretti took the PD into government with the populist Five Star Movement. The lessons transfer to dealing with Podemos.';
        break;
      case 'italy:letta':
        Q.institutionalists_dissent -= 4 * f; intl(Q, 'eu', 3 * f);
        text = 'Letta, a former prime minister, offers pro-European seriousness. Your institutionalists approve; Brussels notices.';
        break;
      case 'italy:schlein':
        target(Q, 'psoe', 'young', 1.5 * f); Q.progressives_dissent -= 4 * f; Q.regional_leaders_dissent += 3 * f;
        position(Q, 0.7 * f, 0.5 * f);
        text = 'Schlein won the PD from outside its apparatus with a turn to the left. Young voters and progressives respond; the barons worry.';
        break;
      case 'greece:venizelos':
        Q.progressives_dissent -= 4 * f; Q.trade_unionists_dissent -= 3 * f; Q.rel_pp -= 4 * f; Q.regional_leaders_dissent += 2 * f;
        Q.pasok_lesson = (Q.pasok_lesson || 0) + f;
        text = 'PASOK went from 44% to 4.7% after imposing austerity and governing with the right; Syriza took its voters. "Pasokification" is now a word. Your left draws the lesson: never again.';
        break;
      case 'greece:gennimata':
        transfer(Q, 'up', 'psoe', { students: all(0.6), workers: all(0.6), professionals: all(0.4) });
        Q.member_morale += 2 * f; Q.rel_up -= 3 * f; Q.pasok_lesson = (Q.pasok_lesson || 0) + f;
        text = 'Gennimata kept PASOK alive against Syriza by defending the centre-left\'s own space. The PSOE learns to compete for Podemos\'s voters instead of envying them.';
        break;
      case 'greece:androulakis':
        target(Q, 'psoe', 'working', 1 * f); target(Q, 'psoe', 'middle', 0.6 * f); Q.sanchez_authority += 1 * f;
        text = 'Androulakis is rebuilding PASOK as Syriza fades. Patience, and a return to the working and middle class.';
        break;
      case 'us:biden':
        target(Q, 'psoe', 'working', 1.2 * f); target(Q, 'psoe', 'middle', 0.8 * f); Q.trade_unionists_dissent -= 4 * f; intl(Q, 'us', 3 * f);
        text = 'Biden won back working-class voters with a pro-union, middle-class pitch. A lesson your trade unionists like.';
        break;
    }
    Q.learn_text = text;
    Q.learn_leader = L.name;
    Q.learn_times = n + 1;
    Q.learn_factor = Math.round(f * 100);
    recalculate(Q);
    return f;
  }

  // ------------------------------------------------------------------
  // Representation beyond Congress: the Senate, the European Parliament
  // and the regions.
  // ------------------------------------------------------------------
  // Senate: 208 elected by limited vote (4 per mainland province: the
  // first party usually takes 3, the second 1; islands and Ceuta and
  // Melilla by their own rules) plus 58 appointed by the regional
  // parliaments in proportion to their groups.
  var SENATE_ISLANDS = { 'Baleares': [4, 1], 'Las Palmas': [4, 1], 'SC de Tenerife': [5, 1], 'Ceuta': [2, 0], 'Melilla': [2, 0] };
  var SENATE_APPOINTED = { 'Andalucía': 9, 'Aragón': 2, 'Asturias': 2, 'Baleares': 2, 'Canarias': 3, 'Cantabria': 1,
    'Castilla y León': 3, 'Castilla-La Mancha': 3, 'Cataluña': 8, 'Comunidad Valenciana': 6, 'Extremadura': 2,
    'Galicia': 3, 'Madrid': 7, 'Región de Murcia': 2, 'Navarra': 1, 'País Vasco': 3, 'La Rioja': 1 };

  function senateElected(ballots) {
    var out = {};
    Object.keys(ballots).forEach(function (prov) {
      var lists = ballots[prov].lists.map(function (l) {
        return Array.isArray(l) ? { id: l[0], votes: l[2] } : l;
      }).sort(function (a, b) { return b.votes - a.votes; });
      var split = SENATE_ISLANDS[prov] || [3, 1];
      if (lists[0]) { out[lists[0].id] = (out[lists[0].id] || 0) + split[0]; }
      if (lists[1] && split[1]) { out[lists[1].id] = (out[lists[1].id] || 0) + split[1]; }
    });
    return out;
  }

  function dhondtSeats(votes, n) {
    var out = {};
    var ids = Object.keys(votes).filter(function (k) { return votes[k] > 0; });
    for (var i = 0; i < n; i++) {
      var best = null, bestQ = -1;
      ids.forEach(function (id) {
        var q = votes[id] / ((out[id] || 0) + 1);
        if (q > bestQ) { bestQ = q; best = id; }
      });
      if (best) { out[best] = (out[best] || 0) + 1; }
    }
    return out;
  }

  function senateAppointed(Q) {
    var out = {};
    Object.keys(SENATE_APPOINTED).forEach(function (r) {
      var reg = Q.regions && Q.regions[r];
      if (!reg) { return; }
      var seats = {};
      Object.keys(reg.seats).forEach(function (id) {
        // joint lists count for their main party
        var k = id === 'jxsi' ? 'junts' : id;
        seats[k] = (seats[k] || 0) + reg.seats[id];
      });
      var got = dhondtSeats(seats, SENATE_APPOINTED[r]);
      Object.keys(got).forEach(function (id) { out[id] = (out[id] || 0) + got[id]; });
    });
    return out;
  }

  // European Parliament: one national constituency, D'Hondt, no threshold.
  // 54 seats from 2014, 59 after Brexit (February 2020).
  var EP_2014 = { pp: 16, psoe: 14, iu: 6, up: 5, upyd: 4, junts: 2, pnv: 1, erc: 2, cs: 2, bildu: 1, compromis: 1 };

  function europeanElection(Q) {
    var shares = JSON.parse(JSON.stringify(Q.true_poll || {}));
    Q.ep_shares = shares;
    Q.ep_prev = Q.ep_seats;
    Q.ep_seats = dhondtSeats(shares, Q.year * 100 + Q.month >= 202002 ? 59 : 54);
    Q.ep_held = Q.year;
    Q.ep_election_due = 1;
  }

  function representation(Q) {
    var me = Q.player_party || 'psoe';
    if (!Q.senate_elected) {
      Q.senate_elected = senateElected(DATA.elections['2011'].provinces);
    }
    var appointed = senateAppointed(Q);
    var senate = {};
    [Q.senate_elected, appointed].forEach(function (o) {
      Object.keys(o).forEach(function (k) { senate[k] = (senate[k] || 0) + o[k]; });
    });
    Q.senate = senate;
    Q.senate_total = Object.keys(senate).reduce(function (a, k) { return a + senate[k]; }, 0);
    Q.rep_congress = Q.congress[me] || 0;
    Q.rep_senate = senate[me] || 0;
    Q.ep_seats = Q.ep_seats || EP_2014;
    if (Q.year * 100 + Q.month >= 202002 && Q.ep_shares && !Q.ep_brexit) {
      Q.ep_seats = dhondtSeats(Q.ep_shares, 59);
      Q.ep_brexit = 1;
    }
    Q.ep_total = Object.keys(Q.ep_seats).reduce(function (a, k) { return a + Q.ep_seats[k]; }, 0);
    Q.rep_ep = Q.ep_seats[me] || 0;
    var regSeats = 0, regTotal = 0, pres = 0, inGov = 0, nReg = 0;
    Object.keys(Q.regions || {}).forEach(function (r) {
      var reg = Q.regions[r];
      nReg += 1;
      Object.keys(reg.seats).forEach(function (id) {
        regTotal += reg.seats[id];
        if (id === me) { regSeats += reg.seats[id]; }
      });
      var g = reg.government || {};
      if (g.party === me) { pres += 1; }
      if ((g.cabinet || []).indexOf(me) !== -1) { inGov += 1; }
    });
    Q.rep_regional = regSeats;
    Q.rep_regional_total = regTotal;
    Q.rep_presidencies = pres;
    Q.rep_in_regional_govt = inGov;
    Q.rep_regions = nReg;
  }

  // Card helpers ------------------------------------------------------
  // Shift a party's support by class and refresh the polls.
  // Sánchez's own party splits the left rather than growing it: its gains
  // come out of the PSOE and Podemos, and many voters see it as a vanity
  // project, so only part of what it wins over sticks (EGO_FACTOR).
  var EGO_FACTOR = 0.7;
  var PS_SOURCES = { psoe: 0.65, up: 0.3, mp: 0.05 };

  function campaign(Q, party, changes) {
    if (party === 'ps') {
      var losses = {};
      var hasLoss = false;
      Object.keys(changes).forEach(function (c) {
        if (changes[c] > 0) {
          Object.keys(PS_SOURCES).forEach(function (src) {
            var moved = {};
            moved[c] = changes[c] * EGO_FACTOR * PS_SOURCES[src];
            transfer(Q, src, 'ps', moved);
          });
        } else if (changes[c] < 0) {
          losses[c] = changes[c];
          hasLoss = true;
        }
      });
      if (hasLoss) {
        shiftSupport(Q, party, losses);
      }
      updatePolls(Q);
      return;
    }
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
      if (back && party === (Q.player_party || 'psoe')) {
        var lost = {};
        Object.keys(back.classes).forEach(function (c) { lost[c] = strength * factor * back.classes[c]; });
        transfer(Q, party, back.to, lost);
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
    autoFormation(Q);
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
        lastChanceInvestiture(Q);
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
        // Ciudadanos's losses are permanent once its bubble bursts
        if (p === 'cs' && cur < initial[c][p] && Q.year >= 2016) {
          rate = 0;
        }
        Q.vm.classSupport[c][p] = cur + (initial[c][p] - cur) * rate;
      });
      // a new party without roots loses support unless it keeps campaigning
      if (Q.vm.classSupport[c].ps) {
        Q.vm.classSupport[c].ps *= 0.985;
      }
    });
    Q.campaign_fatigue = (Q.campaign_fatigue || 0) * 0.75;
    positionDrift(Q);
    incumbencyWear(Q);
    monthlyWorld(Q);
    // foreign relations drift back towards a neutral 55 without attention
    Object.keys(Q.intl || {}).forEach(function (k) {
      Q.intl[k] += (55 - Q.intl[k]) * 0.02;
    });

    Object.keys(Q.target_uses || {}).forEach(function (k) {
      Q.target_uses[k] = Math.max(0, Q.target_uses[k] - 0.15);
    });

    // party finances: dues and the public subsidy, scaled by seats
    Q.funds += fundsIncome(Q) - fundsUpkeep(Q);
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
    Q.brussels_due = (Q.psoe_in_government && Q.deficit > (Q.deficit_tolerance || 3.5) &&
      (Q.brussels_year || 0) < Q.year) ? 1 : 0;

    // a running investiture clock outside formation mode (should not
    // happen, but never leave it stuck): count the month as four weeks
    if (!fromWeekly && Q.investiture_clock > 0) {
      Q.investiture_clock = Math.max(0, Q.investiture_clock - 4);
      if (Q.investiture_clock === 0) {
        Q.dissolution_due = 1;
        lastChanceInvestiture(Q);
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
    if (Q.year === 2019 && Q.month === 5 && Q.ep_held !== 2019) {
      europeanElection(Q);
    }
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

  var CHART_PARTIES = ['pp', 'psoe', 'up', 'cs', 'iu', 'vox', 'mp', 'upyd', 'ps'];

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
    if (Q.government_status !== 'acting') {
      return v;   // there is a government: no investiture to hold
    }
    Q.investiture_votes += 1;
    if (Q.investiture_clock < 0) {
      Q.investiture_clock = 8;
    }
    if (v.passes) {
      formGovernment(Q, candidate);
    } else {
      Q.right_failed_vote = (candidate === 'pp' || candidate === 'cs') ? 1 : 0;
    }
    return v;
  }

  var LEADERS = { cs: 'Albert Rivera', up: 'Pablo Iglesias' };

  // Who leads a party now: Sánchez himself if he has taken over Cs or
  // Podemos, the historical successors after their leaders' falls.
  function leaderOf(Q, p) {
    if (Q.player_party === p && Q.player_leads) {
      return 'Pedro Sánchez';
    }
    if (p === 'cs') {
      return Q.cs_collapsed || Q.rivera_resigns_seen ? 'Inés Arrimadas' : LEADERS.cs;
    }
    if (p === 'up') {
      return Q.year >= 2021 && Q.month >= 5 || Q.year >= 2022 ? 'Yolanda Díaz' : LEADERS.up;
    }
    if (p === 'psoe') {
      return Q.sanchez_leader ? 'Pedro Sánchez' : (Q.psoe_leader || 'Susana Díaz');
    }
    if (p === 'pp') {
      return Q.pp_leader || 'Mariano Rajoy';
    }
    return 'Pedro Sánchez';
  }

  function surname(name) {
    var special = { 'Soraya Sáenz de Santamaría': 'Sáenz de Santamaría', 'María Dolores de Cospedal': 'Cospedal',
                    'Alberto Núñez Feijóo': 'Feijóo', 'Isabel Díaz Ayuso': 'Ayuso' };
    if (special[name]) {
      return special[name];
    }
    var parts = String(name).split(' ');
    return parts[parts.length - 1];
  }

  function formGovernment(Q, candidate) {
    var ppHadPower = Q.pm_party === 'pp';
    Q.government_status = 'formed';
    Q.sanchez_nominated = 0;
    Q.repeat_elections = 0;
    Q.fatigue = 0;
    Q.investiture_clock = -1;
    Q.dissolution_due = 0;
    Q.depends_on_catalans = 0;
    if (candidate === 'grand') {
      // PP–PSOE grand coalition: the PP's leader is Prime Minister
      Q.pm = Q.pp_leader || 'Mariano Rajoy';
      Q.pm_party = 'pp';
      Q.psoe_in_government = 1;
      Q.govt_parties = ['pp', 'psoe'];
      Q.government_type = 'PP–PSOE grand coalition';
      Q.grand_coalition = 1;
    } else if (candidate === 'ps') {
      Q.pm = 'Pedro Sánchez';
      Q.pm_party = 'ps';
      Q.psoe_in_government = Q.player_line_left === 'coalition' ? 1 : 0;
      Q.govt_parties = Q.psoe_in_government ? ['ps', 'psoe'] : ['ps'];
      Q.government_type = Q.psoe_in_government ? UI.partyName('ps') + '–PSOE coalition government'
        : UI.partyName('ps') + ' minority government';
    } else if (candidate === 'sanchez') {
      Q.pm = leaderOf(Q, 'psoe');
      Q.pm_party = 'psoe';
      Q.psoe_in_government = 1;
      Q.govt_parties = Q.pact_up ? ['psoe', 'up'] : ['psoe'];
      if (Q.exiled && Q.player_line_left === 'coalition' && Q.player_party !== 'psoe') {
        Q.govt_parties = ['psoe', Q.player_party];
      }
      Q.government_type = Q.govt_parties.length > 1 ? 'PSOE–' + UI.shortName(Q.govt_parties[1]) + ' coalition government'
        : (Q.pact_cs ? 'PSOE minority government with a Ciudadanos agreement' : 'PSOE minority government');
      if (Parliament.dependsOnIndependentists(Q.congress, Parliament.stancesForSanchez(Q))) {
        Q.depends_on_catalans = 1;
        Q.government_type += ', relying on the Catalan and Basque nationalists';
      }
    } else if (candidate === 'up') {
      Q.pm = leaderOf(Q, 'up');
      Q.pm_party = 'up';
      Q.psoe_in_government = Q.psoe_backs_iglesias === 'coalition' ? 1 : 0;
      Q.govt_parties = Q.psoe_in_government ? ['up', 'psoe'] : ['up'];
      Q.government_type = Q.psoe_in_government ? 'Podemos–PSOE coalition government'
        : 'Podemos minority government with PSOE support';
      if (Parliament.dependsOnIndependentists(Q.congress, Parliament.stancesForUP(Q))) {
        Q.depends_on_catalans = 1;
      }
    } else if (candidate === 'cs') {
      Q.pm = leaderOf(Q, 'cs');
      Q.pm_party = 'cs';
      Q.psoe_in_government = 0;
      Q.govt_parties = ['cs', 'pp'];
      Q.government_type = 'Ciudadanos–PP coalition government';
    } else {
      Q.pm = Q.pp_leader || 'Mariano Rajoy';
      Q.pm_party = 'pp';
      Q.psoe_in_government = 0;
      var cs = Q.congress.cs || 0;
      var vox = Q.congress.vox || 0;
      if ((Q.pact_pp_cs || (Q.player_party === 'cs' && Q.player_line_right === 'coalition')) && cs >= 20) {
        Q.govt_parties = ['pp', 'cs'];
        Q.government_type = 'PP–Ciudadanos coalition government';
      } else if (vox >= 15 && (Q.pp_vox_relation || 50) >= 60 && (Q.congress.pp || 0) + cs < 176) {
        Q.govt_parties = ['pp', 'vox'];
        Q.government_type = 'PP–Vox coalition government';
      } else {
        Q.govt_parties = ['pp'];
        Q.government_type = (Q.congress.pp || 0) >= 176 ? 'PP majority government' : 'PP minority government';
      }
    }
    Q.legislature_end_year = Q.legislature_start_year + 4;
    allocateCabinet(Q, 'standard');
    // a coalition with the player's party in it: the agreement is negotiated
    Q.cabinet_pending = ((Q.govt_parties || []).length > 1 &&
      (Q.govt_parties || []).indexOf(Q.player_party || 'psoe') !== -1 && (Q.sanchez_leader || Q.exiled)) ? 1 : 0;
    Q.cabinet_partner = Q.cabinet_pending ? (Q.govt_parties[0] === (Q.player_party || 'psoe') ? Q.govt_parties[1] : Q.govt_parties[0]) : '';
    Q.cabinet_partner_name = Q.cabinet_partner ? UI.partyName(Q.cabinet_partner) : '';
    if (candidate !== 'grand') {
      Q.grand_coalition = 0;
    }
    // a PP–Vox coalition government ends the game
    if ((Q.govt_parties || []).indexOf('pp') !== -1 && (Q.govt_parties || []).indexOf('vox') !== -1) {
      Q.loss_reason = 'The PP and Vox form a coalition government with a majority in Congress. ' +
        'There is no route back to government for the left before the end of the period.';
    }
    if (ppHadPower && Q.pm_party !== 'pp') {
      ppSetback(Q, 3);
    }
  }

  // Who is to blame when no government forms? If the PSOE had a workable
  // majority within reach (a deal with Podemos and the nationalists, or with
  // Ciudadanos and Podemos's abstention) it gets the blame; otherwise the
  // largest party of the right does.
  function formationBlame(Q) {
    var tryDeal = function (changes) {
      var h = JSON.parse(JSON.stringify(Q));
      Object.keys(changes).forEach(function (k) { h[k] = changes[k]; });
      return Parliament.investiture(Q.congress, 'sanchez', h).passes;
    };
    var psoeCould = tryDeal({ pact_up: 1, pact_cs: 0, rel_pnv: 70, rel_cc: 70, rel_bildu: 45 }) ||
      tryDeal({ pact_cs: 1, pact_up: 0, rel_up: 85 });
    return psoeCould ? 'psoe' : 'right';
  }

  // Automatic dissolution: election 54 days after the decree (two months
  // later in the monthly calendar).
  function dissolve(Q) {
    var d = addMonths(Q.year, Q.month, 2);
    Q.election_year = d[0];
    Q.election_month = d[1];
    Q.dissolution_due = 0;
    Q.investiture_clock = -1;
    // voters punish whoever they blame for the failure
    var all = function (x) {
      return { workers: x, professionals: x, pensioners: x, self_employed: x,
               unemployed: x, students: x, homemakers: x };
    };
    Q.formation_blame = formationBlame(Q);
    if (Q.formation_blame === 'psoe') {
      transfer(Q, 'psoe', { up: 0.4, cs: 0.3, pp: 0.3 }, all(1.8));
      Q.sanchez_authority -= 6;
    } else {
      var right = Q.right_candidate || 'pp';
      var hasVox = (Q.true_poll && Q.true_poll.vox >= 1) || (Q.congress.vox || 0) > 0;
      var to = right === 'pp' ? (hasVox ? { psoe: 0.45, cs: 0.35, vox: 0.2 } : { psoe: 0.55, cs: 0.45 })
        : (hasVox ? { psoe: 0.45, pp: 0.35, vox: 0.2 } : { psoe: 0.55, pp: 0.45 });
      transfer(Q, right, to, all(1.5));
      if (right === 'pp') {
        ppSetback(Q, 1);
      }
    }
    recalculate(Q);
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
    var r = VoteModel.runGeneralElection(Q.eday ? withEday(Q) : Q.vm, base(), DATA, Q.year, Q.month);
    Q.last_eday_spent = Q.eday ? (Q.eday_spent || 0) : 0;
    settleFinalCampaign(Q);
    Q.final_campaign_round = (Q.elections_held || 0) + 1;
    var old = Q.congress;
    Q.prev_congress = old;
    Q.prev_vote_shares = Q.vote_shares;
    Q.congress = r.totals;
    Q.vote_shares = r.voteShares;
    Q.elections_held = (Q.elections_held || 0) + 1;
    // no fixed campaign cost: the party spends what it chooses in the
    // final campaign
    // the previous general election's winners, to mark provinces that flip
    Q.prev_general_winners = Q.general_winners ||
      provinceWinners(DATA.elections['2011'].provinces);
    Q.map_winners = provinceWinners(r.ballots);
    Q.general_winners = Q.map_winners;
    Q.map_prev_winners = Q.prev_general_winners;
    Q.map_shares = districtShares(r.ballots, 5);
    Q.map_kind = 'general';
    Q.map_title = 'General election, ' + Q.month + '/' + Q.year;
    Q.election_records.push({ date: Q.year + '-' + Q.month, seats: r.totals });
    Q.senate_elected = senateElected(r.ballots);
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
    Q.right_failed_vote = 0;
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
    Q.fatigue = Q.repeat_elections;
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
    // bad results arm the barons
    if (Q.sanchez_leader) {
      if (swing < 0) { Q.plot = (Q.plot || 0) + 1.5 * -swing; }
      var ps = r.totals.psoe || 0;
      Q.plot = (Q.plot || 0) + (ps < 90 ? 25 : (ps < 100 ? 15 : 0));
      if (swing > 0) { Q.plot = Math.max(0, (Q.plot || 0) - swing); }
    }
    Q.sanchez_authority += swing / 2;
    Q.member_morale += swing / 2;
    var ppLoss = (old.pp || 0) - (r.totals.pp || 0);
    var ppLargest = (r.totals.pp || 0) >= Math.max(r.totals.psoe || 0, r.totals.cs || 0, r.totals.up || 0, r.totals.ps || 0);
    if (!ppLargest) {
      ppSetback(Q, 2);
    } else if (ppLoss >= 10) {
      ppSetback(Q, 1);
    } else if (ppLoss <= -10) {
      Q.pp_pressure = 0;
    }
    if (Q.exiled && Q.player_party === 'ps' && (r.totals.ps || 0) === 0) {
      Q.loss_reason = UI.partyName('ps') + ' wins no seats. Pedro Sánchez\'s new party is finished, and so is his career.';
    }
    if (!Q.sanchez_leader && !Q.exiled) {
      Q.psoe_ai_swing = swing;
    }
    Q.player_line_left = '';
    Q.player_line_right = '';
    Q.player_line_set = 0;
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
        Q.plot = (Q.plot || 0) + 8;
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
      if ((r.totals.vox || 0) > 0 && !Q.vox_breakthrough && Q.year >= 2017) {
        Q.vox_breakthrough = 1;
        Q.vox_breakthrough_due = 1;
        Q.vox_breakthrough_region = region;
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
    Q.revolt_possible = !Q.rebellion_used && ((Q.dissent_percent >= 40 && Q.sanchez_authority <= 35 &&
      Q.federal_committee_balance < 50) ||
      (Q.funds <= -5 && Q.sanchez_authority <= 45 && Q.federal_committee_balance < 50)) ? 1 : 0;
    // the 2016-17 window in which an ouster can be reversed by a primary
    var k = dateKey(Q.year, Q.month);
    Q.in_leadership_window = (k >= 201606 && k <= 201703) ? 1 : 0;
    // the barons' plot: pressure to overthrow Sánchez (0-100)
    Q.plot = clamp(Q.plot || 0, 0, 100);
    Q.loyalist_posts_text = (Q.loyalist_posts || 0) < 2 ? 'Few' : ((Q.loyalist_posts || 0) < 5 ? 'Some' : ((Q.loyalist_posts || 0) < 8 ? 'Many' : 'Most posts'));
    Q.plot_word = Q.plot < 20 ? 'Quiet' : (Q.plot < 40 ? 'Murmurs' : (Q.plot < 60 ? 'Organising' : 'Imminent'));
    Q.coup_due = (Q.sanchez_leader && !Q.rebellion_used && Q.plot >= 60 && Q.time >= (Q.coup_cooldown || 0)) ? 1 : 0;
    // a caretaker committee hands over to an elected leader after eight months
    if (!Q.sanchez_leader && Q.psoe_interim && Q.time - (Q.interim_since || Q.time) >= 8) {
      Q.psoe_interim = 0;
      Q.psoe_leader = Q.psoe_next_leader || challengerName(Q);
    }
    // the leadership crisis: rumours, then talk of a leadership election,
    // then a forced one
    if (Q.sanchez_leader) {
      if (Q.sanchez_authority > 40) {
        Q.lead_stage = 0;
      }
      Q.lead_rumours_due = (Q.sanchez_authority <= 30 && Q.lead_stage < 1) ? 1 : 0;
      Q.lead_challenge_due = (Q.sanchez_authority <= 15 && Q.lead_stage < 2) ? 1 : 0;
      Q.lead_forced_due = Q.sanchez_authority <= 0 ? 1 : 0;
      Q.challenger = challengerName(Q);
    } else {
      Q.lead_rumours_due = 0; Q.lead_challenge_due = 0; Q.lead_forced_due = 0;
    }
    if (!Q.sanchez_leader && !Q.psoe_rel) {
      Q.psoe_rel = {};
      RELATIONS.concat(['bng', 'prc', 'te', 'geroa', 'nc', 'mp']).forEach(function (p) {
        Q.psoe_rel[p] = Q['rel_' + p];
      });
      Q.psoe_leader = Q.psoe_leader && Q.psoe_leader !== 'Pedro Sánchez' ? Q.psoe_leader : challengerName(Q);
    }
    if (Q.backbench && Q.backbench_since === undefined) {
      Q.backbench_since = Q.time;
    }
    Q.comeback_ready = (Q.backbench && Q.time - (Q.backbench_since || Q.time) >= 12 &&
      Q.time >= (Q.comeback_next || 0) &&
      ((Q.psoe_ai_swing || 0) < 0 || ((Q.true_poll && Q.true_poll.psoe) || 0) < 22)) ? 1 : 0;
    // out of the leadership with no primary pending: decide what next
    Q.exile_pending = (!Q.sanchez_leader && !Q.leadership_exception_open && !Q.exiled &&
      !Q.backbench && !Q.retired) ? 1 : 0;
    Q.no_way_back = (Q.exile_pending && Q.expelled && !Q.can_join_cs && !Q.can_join_up && !Q.can_found) ? 1 : 0;
  }

  function challengerName(Q) {
    if (Q.year <= 2017 && (Q.diaz_relation || 0) < 55) {
      return 'Susana Díaz';
    }
    if (Q.year <= 2016) {
      return 'Eduardo Madina';
    }
    return 'Emiliano García-Page';
  }

  // A PSOE leadership election (primary). bonus: + for calling it oneself.
  // Returns 1 if Sánchez wins.
  // The comeback primary of May 2017: Sánchez against Susana Díaz (or the
  // barons' candidate) and Patxi López. Returns 1 if Sánchez wins.
  function comebackPrimary(Q) {
    var x = (Q.member_morale || 50) + (Q.sanchismo || 20) / 2;
    var s = clamp(45 + (x - 60) * 0.5 + 6 * (Math.random() - 0.5), 15, 75);
    var lopez = clamp(10 + 4 * (Math.random() - 0.5), 5, 15);
    Q.primary_sanchez = Math.round(s * 10) / 10;
    Q.primary_lopez = Math.round(lopez * 10) / 10;
    Q.primary_diaz = Math.round((100 - s - lopez) * 10) / 10;
    Q.primary_won = Q.primary_sanchez > Q.primary_diaz ? 1 : 0;
    return Q.primary_won;
  }

  function leadershipElection(Q, bonus) {
    var score = 0.45 * Q.member_morale + 0.35 * Q.sanchismo + 0.2 * Math.max(0, Q.sanchez_authority) +
      (bonus || 0) + 6 * gaussian();
    Q.primary_score = Math.round(score);
    var won = score >= 38 ? 1 : 0;
    Q.primary_won = won;
    if (won) {
      Q.sanchez_leader = 1;
      Q.sanchez_authority = Math.max(Q.sanchez_authority, 60);
      Q.sanchismo += 10;
      Q.member_morale += 6;
      Q.federal_committee_balance = Math.max(Q.federal_committee_balance, 58);
      Q.regional_leaders_dissent -= 12;
      Q.institutionalists_dissent -= 8;
      Q.lead_stage = 0;
      Q.backbench = 0;
      Q.red_lines = 0;
      Q.psoe_leader = 'Pedro Sánchez';
    } else {
      oust(Q, false);
    }
    recalculate(Q);
    checkLeadership(Q);
    return won;
  }

  // Sánchez loses the leadership. expelled: thrown out of the party too.
  function oust(Q, expelled) {
    Q.sanchez_leader = 0;
    Q.lead_stage = 0;
    Q.plot = 0;
    Q.psoe_next_leader = Q.challenger || challengerName(Q);
    // a caretaker committee runs the party until a primary; with no
    // government formed, it is likely to let the PP govern
    Q.psoe_interim = 1;
    Q.interim_since = Q.time;
    Q.psoe_leader = Q.year <= 2018 ? 'Javier Fernández' : 'a caretaker committee';
    Q.gestora_abstains = Math.random() < 0.8 ? 1 : 0;
    if (expelled) {
      Q.expelled = 1;
    }
    if (Q.in_leadership_window && !expelled) {
      Q.leadership_exception_open = 1;
    }
    // the PSOE without Sánchez: more centrist, closer to the barons; it
    // keeps his relations with other parties as its own
    Q.psoe_rel = {};
    RELATIONS.concat(['bng', 'prc', 'te', 'geroa', 'nc', 'mp']).forEach(function (p) {
      Q.psoe_rel[p] = Q['rel_' + p];
    });
    Q.psoe_rel.up = Math.max(0, (Q.psoe_rel.up || 35) - 10);
    Q.psoe_rel.cs = Math.min(100, (Q.psoe_rel.cs || 45) + 10);
    transfer(Q, 'psoe', { up: 0.6, cs: 0.4 }, { students: 1, workers: 1, professionals: 1 });
  }

  // Strength (support points per class) a party founded by Sánchez could
  // draw: his personal following and an insurgent, anti-establishment
  // profile matter most.
  function newPartyStrength(Q) {
    return Math.max(0, (Q.sanchismo || 0) / 15 + 0.9 * (Q.populism || 0) - 0.4);
  }

  // Sánchez leaves for another party (or founds one).
  function joinParty(Q, party, name) {
    var old = Q.player_party;
    Q.exiled = 1;
    Q.backbench = 0;
    Q.player_party = party;
    Q.player_leads = party === 'ps' ? 1 : 0;
    Q.leadership_exception_open = 0;
    Q.psoe_leader = Q.psoe_leader || challengerName(Q);
    if (!Q.psoe_rel) {
      oust(Q, true);
    }
    // relations now are the new party's relations with the others
    if (party === 'cs' || party === 'up') {
      RELATIONS.forEach(function (p) {
        if (p !== party) {
          Q['rel_' + p] = Parliament.between(Q, party, p);
        }
      });
      Q.rel_psoe = 30;
      Q.funds = 5;
      // a famous recruit brings some voters with him
      var gain = 1 + (Q.sanchismo || 0) / 25;
      transfer(Q, 'psoe', party, { workers: gain, pensioners: gain * 0.8, professionals: gain,
                                    students: gain * 0.8, unemployed: gain * 0.6, homemakers: gain * 0.5 });
    } else {
      Q.new_party_name = name || 'Pedro Sánchez List';
      UI.setPartyName('ps', Q.new_party_name, 'PSL');
      Q.rel_psoe = 15;
      Q.funds = Math.max(1, (Q.sanchismo || 0) / 12);
      var s = newPartyStrength(Q);
      var pop = (Q.populism || 0) / 10;
      var classes = { workers: s, pensioners: s * 0.8, professionals: s * 0.9, students: s * (0.8 + pop),
                      unemployed: s * (0.8 + pop), homemakers: s * 0.6, self_employed: s * 0.5 };
      // the split: PSOE voters who follow him, and those put off by what
      // looks like a personal vanity project (some to Podemos, some to the
      // right, some stay home with the PSOE's rivals)
      transfer(Q, 'psoe', { ps: EGO_FACTOR, up: 0.15, pp: 0.1, cs: 0.05 }, classes);
      // an insurgent profile also draws Podemos voters; few come from the right
      var fromUp = {};
      Object.keys(classes).forEach(function (c) { fromUp[c] = classes[c] * pop * 0.6 * EGO_FACTOR; });
      transfer(Q, 'up', 'ps', fromUp);
      Q.rel_up -= 10;
      Q.member_morale -= 10;
    }
    Q.joined_from = old;
    recalculate(Q);
  }

  // PP setbacks build pressure on its leader: losing power or a bad
  // election forces him out; a single failure may or may not.
  function ppSetback(Q, weight) {
    if (Q.pp_leader_falls_due) {
      return;
    }
    Q.pp_pressure = (Q.pp_pressure || 0) + weight;
    // a PP leader in office, or acting Prime Minister at the head of the
    // largest party (Rajoy in 2016), is safe
    var ppLargest = (Q.congress.pp || 0) >= Math.max(Q.congress.psoe || 0, Q.congress.cs || 0, Q.congress.up || 0);
    if (Q.pm_party === 'pp' && (Q.government_status === 'formed' || ppLargest)) {
      return;
    }
    var chance = Q.pp_pressure >= 3 ? 1 : (Q.pp_pressure === 2 ? 0.6 : 0.25);
    if (Math.random() < chance) {
      Q.pp_leader_falls_due = 1;
    }
  }

  // The PP chooses a new leader. Candidates by period; the right's mood
  // (a strong Vox pulls it right, a strong Cs to the centre) weights them.
  var PP_CANDIDATES = {
    santamaria: { name: 'Soraya Sáenz de Santamaría', style: 'moderate', from: 2015, to: 2019 },
    casado: { name: 'Pablo Casado', style: 'hard', from: 2015, to: 2023 },
    cospedal: { name: 'María Dolores de Cospedal', style: 'establishment', from: 2015, to: 2018 },
    feijoo: { name: 'Alberto Núñez Feijóo', style: 'moderate', from: 2019, to: 2023 },
    ayuso: { name: 'Isabel Díaz Ayuso', style: 'hard', from: 2021, to: 2023 }
  };

  function choosePPLeader(Q) {
    var vox = (Q.true_poll && Q.true_poll.vox) || 0;
    var cs = (Q.true_poll && Q.true_poll.cs) || 0;
    var used = Q.pp_leaders_used || [];
    var pool = Object.keys(PP_CANDIDATES).filter(function (id) {
      var c = PP_CANDIDATES[id];
      return used.indexOf(id) === -1 && Q.year >= c.from && Q.year <= c.to;
    });
    if (!pool.length) {
      pool = Object.keys(PP_CANDIDATES).filter(function (id) {
        return used.indexOf(id) === -1 && Q.year <= PP_CANDIDATES[id].to;
      });
      if (Q.year < 2019) {
        pool = pool.filter(function (id) { return PP_CANDIDATES[id].from <= 2016; });
      }
    }
    if (!pool.length) {
      pool = ['feijoo'];
    }
    var weights = pool.map(function (id) {
      var st = PP_CANDIDATES[id].style;
      return st === 'hard' ? 1 + vox / 6 : (st === 'moderate' ? 1 + cs / 10 : 0.6);
    });
    var total = weights.reduce(function (a, b) { return a + b; }, 0);
    var r = Math.random() * total;
    var pick = pool[0];
    for (var i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) { pick = pool[i]; break; }
    }
    var c = PP_CANDIDATES[pick];
    Q.pp_old_leader = Q.pp_leader;
    Q.pp_leader = c.name;
    Q.pp_leader_id = pick;
    Q.pp_style = c.style;
    Q.pp_style_hard = c.style === 'hard' ? 1 : 0;
    Q.pp_style_moderate = c.style === 'moderate' ? 1 : 0;
    used.push(pick);
    Q.pp_leaders_used = used;
    Q.pp_pressure = 0;
    Q.pp_leader_falls_due = 0;
    var all = function (x) {
      return { workers: x, professionals: x, pensioners: x, self_employed: x,
               unemployed: x, students: x, homemakers: x };
    };
    if (c.style === 'hard') {
      partyRel(Q, 'pp', 'vox', 20); partyRel(Q, 'pnv', 'pp', -15); partyRel(Q, 'cs', 'pp', -5);
      transfer(Q, 'vox', 'pp', all(1));
      transfer(Q, 'pp', { cs: 0.5, psoe: 0.5 }, { professionals: 1.2, pensioners: 0.6 });
      Q.rel_pp -= 8;
    } else if (c.style === 'moderate') {
      partyRel(Q, 'pp', 'vox', -10); partyRel(Q, 'pnv', 'pp', 10); partyRel(Q, 'cs', 'pp', 8);
      transfer(Q, 'cs', 'pp', { professionals: 1.5, self_employed: 1.5, pensioners: 1 });
      transfer(Q, 'psoe', 'pp', { pensioners: 0.6, professionals: 0.4 });
      transfer(Q, 'pp', 'vox', { self_employed: 0.6, workers: 0.4 });
      Q.rel_pp += 5;
    } else {
      campaign(Q, 'pp', all(0.5));
    }
    recalculate(Q);
  }

  // ------------------------------------------------------------------
  // The cabinet. Ministries in order of weight; coalition partners share
  // them out by agreement. Government cards need the matching ministry.
  // ------------------------------------------------------------------
  var MINISTRIES = [
    ['deputy', 'First Deputy Prime Minister'], ['finance', 'Finance'], ['economy', 'Economic Affairs'],
    ['foreign', 'Foreign Affairs'], ['interior', 'Interior'], ['defence', 'Defence'], ['justice', 'Justice'],
    ['labour', 'Labour'], ['social_rights', 'Social Rights and Pensions'], ['health', 'Health'],
    ['education', 'Education'], ['territorial', 'Territorial Policy'], ['ecology', 'Ecological Transition'],
    ['equality', 'Equality']
  ];
  // what each party asks for first as a coalition partner
  var PARTNER_PREFS = {
    up: ['social_rights', 'labour', 'equality', 'education', 'health', 'ecology'],
    psoe: ['finance', 'labour', 'foreign', 'social_rights', 'health', 'territorial'],
    pp: ['finance', 'interior', 'economy', 'defence', 'justice', 'foreign'],
    cs: ['economy', 'education', 'foreign', 'justice', 'territorial', 'health'],
    vox: ['interior', 'defence', 'justice', 'territorial', 'education', 'equality'],
    ps: ['labour', 'social_rights', 'territorial', 'health', 'education', 'equality']
  };
  // ministers by party (historical where the party held the post)
  var MINISTER_NAMES = {
    psoe: { pm: 'Pedro Sánchez', deputy: 'Carmen Calvo', finance: 'María Jesús Montero', economy: 'Nadia Calviño (independent)',
            foreign: 'Josep Borrell', interior: 'Fernando Grande-Marlaska', defence: 'Margarita Robles',
            justice: 'Dolores Delgado', labour: 'Magdalena Valerio', social_rights: 'José Luis Escrivá',
            health: 'Salvador Illa', education: 'Isabel Celaá', territorial: 'Meritxell Batet', ecology: 'Teresa Ribera',
            equality: 'Carmen Calvo' },
    pp: { deputy: 'Soraya Sáenz de Santamaría', finance: 'Cristóbal Montoro', economy: 'Luis de Guindos',
          foreign: 'José Manuel García-Margallo', interior: 'Jorge Fernández Díaz', defence: 'Pedro Morenés',
          justice: 'Rafael Catalá', labour: 'Fátima Báñez', social_rights: 'Fátima Báñez', health: 'Alfonso Alonso',
          education: 'José Ignacio Wert', territorial: 'Soraya Sáenz de Santamaría', ecology: 'Isabel García Tejerina',
          equality: 'Alfonso Alonso' },
    up: { deputy: 'Pablo Iglesias', social_rights: 'Pablo Iglesias', labour: 'Yolanda Díaz', equality: 'Irene Montero',
          education: 'Manuel Castells', health: 'Pablo Echenique', ecology: 'Alberto Garzón', finance: 'Nacho Álvarez',
          economy: 'Nacho Álvarez', foreign: 'Pablo Bustinduy', territorial: 'Pablo Echenique' },
    cs: { deputy: 'Inés Arrimadas', economy: 'Luis Garicano', finance: 'Toni Roldán', education: 'Marta Rivera de la Cruz',
          foreign: 'Luis Garicano', justice: 'Edmundo Bal', territorial: 'Inés Arrimadas', health: 'Francisco Igea' },
    vox: { deputy: 'Javier Ortega Smith', interior: 'Javier Ortega Smith', defence: 'Agustín Rosety',
           justice: 'Iván Espinosa de los Monteros', territorial: 'Rocío Monasterio', education: 'Rocío Monasterio' }
  };

  function ministerName(party, key, Q) {
    if (key === 'pm') {
      return Q.pm;
    }
    var n = MINISTER_NAMES[party] && MINISTER_NAMES[party][key];
    return n || ('a ' + UI.shortName(party) + ' nominee');
  }

  // plan: 'standard', 'generous' or 'hard' (seen from the senior party when
  // the player leads), or 'economy' / 'social' (the player as junior asks
  // for the economic or the social ministries).
  function allocateCabinet(Q, plan) {
    var parties = (Q.govt_parties || [Q.pm_party]).slice();
    var senior = parties[0];
    var cab = { pm: { party: senior, name: Q.pm } };
    var keys = MINISTRIES.map(function (m) { return m[0]; });
    if (parties.length === 1) {
      keys.forEach(function (k) { cab[k] = { party: senior, name: ministerName(senior, k, Q) }; });
      Q.cabinet = cab;
      cabinetFlags(Q);
      return cab;
    }
    var partner = parties[1];
    var sSeats = Q.congress[senior] || 1, pSeats = Q.congress[partner] || 1;
    var share = Math.max(2, Math.round(keys.length * pSeats / (sSeats + pSeats)));
    var prefs = (PARTNER_PREFS[partner] || []).slice();
    var partnerGets = [];
    if (plan === 'generous') {
      share += 2;
      partnerGets.push('deputy');
    } else if (plan === 'hard') {
      share = Math.max(1, share - 2);
      prefs = prefs.filter(function (k) { return ['finance', 'economy', 'labour', 'interior', 'foreign'].indexOf(k) === -1; });
    } else if (plan === 'economy') {
      prefs = ['finance', 'economy'].concat(prefs.filter(function (k) { return k !== 'finance' && k !== 'economy'; }));
    } else if (plan === 'social') {
      prefs = ['labour', 'social_rights', 'health', 'education', 'equality'].concat(prefs);
    }
    if (plan !== 'hard' && partnerGets.indexOf('deputy') === -1 && pSeats >= 0.25 * sSeats) {
      partnerGets.push('deputy');
    }
    prefs.concat(keys).forEach(function (k) {
      if (partnerGets.length < share && partnerGets.indexOf(k) === -1 && !(plan === 'hard' && k === 'deputy')) {
        partnerGets.push(k);
      }
    });
    keys.forEach(function (k) {
      var party = partnerGets.indexOf(k) !== -1 ? partner : senior;
      cab[k] = { party: party, name: ministerName(party, k, Q) };
    });
    Q.cabinet = cab;
    Q.cabinet_plan = plan;
    cabinetFlags(Q);
    return cab;
  }

  function cabinetFlags(Q) {
    var me = Q.player_party || 'psoe';
    var cab = Q.cabinet || {};
    var count = 0;
    MINISTRIES.forEach(function (m) {
      var mine = !Q.acting && cab[m[0]] && cab[m[0]].party === me ? 1 : 0;
      Q['min_' + m[0]] = mine;
      count += mine;
    });
    Q.min_pm = !Q.acting && cab.pm && cab.pm.party === me ? 1 : 0;
    Q.my_ministries = count;
    Q.player_senior = Q.pm_party === me ? 1 : 0;
  }

  function renderCabinet(Q, id) {
    var out = el(id);
    if (!out) {
      return;
    }
    var cab = Q.cabinet || {};
    var rows = [['pm', 'Prime Minister']].concat(MINISTRIES).map(function (m) {
      var c = cab[m[0]];
      if (!c) { return ''; }
      return '<tr><td>' + m[1] + '</td><td><span class="sp-swatch" style="background:' + UI.partyColor(c.party) +
        '"></span>' + c.name + '</td></tr>';
    }).join('');
    out.innerHTML = (Q.acting ? '<p><em>Acting government.</em></p>' : '') +
      '<table class="sp-results sp-compact sp-cabinet"><tbody>' + rows + '</tbody></table>';
  }

  // After a repeat election, Spain does not vote a third time in a row: on
  // the eve of dissolution the largest party's candidate faces one last
  // vote and the second-largest abstains (as the PSOE did in October 2016).
  function lastChanceInvestiture(Q) {
    if (!Q.acting || (Q.fatigue || 0) < 1) {
      return false;
    }
    var cand = (Q.congress.psoe || 0) > (Q.congress.pp || 0) ? 'sanchez' : (Q.right_candidate || 'pp');
    Q.formation_weeks = Math.max(Q.formation_weeks || 0, 6);
    var st = cand === 'sanchez' ? Parliament.stancesForSanchez(Q)
      : (cand === 'cs' ? Parliament.stancesForCs(Q) : Parliament.stancesForPP(Q));
    if (cand === 'sanchez') {
      // the left will not hand the right a third election
      ['up', 'iu', 'mp', 'erc', 'bildu', 'bng', 'compromis'].forEach(function (p) { if (st[p] === 'no') { st[p] = 'abstain'; } });
    }
    var v = Parliament.count(Q.congress, st);
    if (v.passes) {
      Q.investiture_votes += 1;
      formGovernment(Q, cand);
      Q.dissolution_due = 0;
      Q.deadlock_broken = 1;
      Q.deadlock_by = cand === 'sanchez' ? 'the PP' : 'the PSOE';
      if (cand !== 'sanchez' && Q.sanchez_leader) {
        // the PSOE's deputies abstained: the party pays for it
        transfer(Q, 'psoe', { up: 0.8, iu: 0.2 }, { workers: 2, students: 2, unemployed: 1.5, professionals: 1 });
        Q.member_morale -= 8; Q.progressives_dissent += 10; Q.sanchez_authority -= 6;
      }
      recalculate(Q);
      return true;
    }
    return false;
  }

  // When Sánchez is not leading the PSOE, governments form without him:
  // each week of formation the largest bloc's candidate tries, with the
  // PSOE voting by its new leadership's line and Sánchez's party voting by
  // the line he set (player_line_right / player_line_left).
  function aiStances(Q, candidate) {
    var H = JSON.parse(JSON.stringify(Q));
    if (Q.psoe_rel) {
      Object.keys(Q.psoe_rel).forEach(function (p) { H['rel_' + p] = Q.psoe_rel[p]; });
    }
    var pl = Q.player_party;
    if (Q.exiled && pl === 'up' && Q.player_line_left === 'coalition') { H.pact_up = 1; }
    if (Q.exiled && pl === 'cs' && Q.player_line_right === 'coalition') { H.pact_pp_cs = 1; }
    // without Sánchez the PSOE abstains for the right after a repeat election
    H.psoe_stance_pp = ((Q.psoe_interim && Q.gestora_abstains) || (Q.repeat_elections || 0) >= 1 ||
      (Q.formation_weeks || 0) >= 10) ? 'abstain' : 'no';
    H.red_lines = 1;
    var st = candidate === 'sanchez' ? Parliament.stancesForSanchez(H)
      : (candidate === 'up' ? Parliament.stancesForUP(H)
        : (candidate === 'cs' ? Parliament.stancesForCs(H)
          : (candidate === 'ps' ? Parliament.stancesForUP(H) : Parliament.stancesForPP(H))));
    if (candidate === 'ps') {
      st.ps = 'yes';
      st.up = Q.rel_up >= 50 ? 'yes' : 'abstain';
      st.psoe = (Q.rel_psoe || 0) >= 45 ? 'yes' : 'abstain';
    }
    if (candidate === 'up' && Q.exiled && pl === 'psoe') { st.psoe = 'no'; }
    if (Q.exiled && pl !== 'psoe') {
      var right = candidate === 'pp' || candidate === 'cs';
      var line = right ? Q.player_line_right : Q.player_line_left;
      if (candidate !== pl && line) {
        st[pl] = line === 'coalition' || line === 'support' ? 'yes' : line;
      } else if (candidate !== pl && !line) {
        st[pl] = 'no';
      } else {
        st[pl] = 'yes';
      }
    }
    return st;
  }

  // Will the PP accept a grand coalition with the PSOE instead of Vox?
  // Easier with a moderate PP leader, warm PSOE–PP relations and cold
  // PP–Vox relations; harder with a hard-liner.
  function grandCoalitionOffer(Q) {
    var seats = (Q.congress.pp || 0) + (Q.congress.psoe || 0);
    Q.grand_possible = seats >= Parliament.MAJORITY ? 1 : 0;
    var score = (Q.rel_pp || 20) + (Q.pp_style_moderate ? 20 : 0) - (Q.pp_style_hard ? 20 : 0) +
      (50 - Parliament.between(Q, 'pp', 'vox')) / 2 + (Q.learned_spd ? 8 : 0) + 20 * (Math.random() - 0.5);
    Q.grand_score = Math.round(score);
    Q.grand_accepted = (Q.grand_possible && score >= 40) ? 1 : 0;
    if (Q.grand_accepted) {
      Q.investiture_votes += 1;
      formGovernment(Q, 'grand');
      // the PSOE's left-wing voters and members do not forgive it
      transfer(Q, 'psoe', { up: 0.8, iu: 0.1, mp: 0.1 }, { workers: 4, students: 5, unemployed: 4, professionals: 3, pensioners: 1 });
      Q.progressives_dissent += 25; Q.trade_unionists_dissent += 12; Q.member_morale -= 18; Q.sanchismo -= 8;
      Q.regional_leaders_dissent -= 10; Q.institutionalists_dissent -= 8; Q.rel_pp += 15; Q.rel_up -= 25;
      recalculate(Q);
    } else {
      Q.rel_pp -= 5;
    }
    return Q.grand_accepted;
  }

  function autoFormation(Q) {
    if (Q.sanchez_leader || !Q.acting || Q.election_year || (Q.formation_weeks || 0) < (Q.psoe_interim ? 1 : 3) ||
        Q.elections_held < 1) {
      return null;
    }
    if (Q.exiled && Q.player_party !== 'psoe' && !Q.player_line_set) {
      return null;  // wait for Sánchez to set his party's line
    }
    var seats = Q.congress;
    var right = Q.right_candidate || 'pp';
    var leftCand = 'sanchez';
    if (Q.exiled && Q.player_party === 'ps' && (seats.ps || 0) > (seats.psoe || 0)) {
      leftCand = 'ps';
    } else if ((seats.up || 0) > (seats.psoe || 0)) {
      leftCand = 'up';
    }
    var tried = [right, leftCand];
    for (var i = 0; i < tried.length; i++) {
      var st = aiStances(Q, tried[i]);
      var v = Parliament.count(seats, st);
      if (v.passes) {
        Q.investiture_votes += 1;
        Q.auto_invested = tried[i];
        if (tried[i] === 'up') { Q.psoe_backs_iglesias = 'external'; }
        formGovernment(Q, tried[i]);
        Q.auto_formed = 1;
        if (Q.psoe_interim && (tried[i] === 'pp' || tried[i] === 'cs')) {
          // the caretaker PSOE abstained: the group splits, as in October 2016
          Q.gestora_invested = 1;
          Q.psoe_rebels = Math.max(5, Math.round((Q.congress.psoe || 85) * (0.08 + (Q.sanchismo || 20) / 600)));
          Q.psoe_abstainers = (Q.congress.psoe || 0) - Q.psoe_rebels;
        }
        recalculate(Q);
        return tried[i];
      }
    }
    if (Q.investiture_clock < 0) {
      Q.investiture_clock = 8;
      Q.investiture_votes += 1;
    }
    return null;
  }

  function lossReason(Q) {
    if (Q.loss_reason) {
      return Q.loss_reason;
    }
    if (Q.retired) {
      return 'Pedro Sánchez retires from politics.';
    }
    if (Q.no_way_back) {
      return 'Expelled from the PSOE, with no party willing to take him and no following of his own, Pedro Sánchez\'s political career is over.';
    }
    return '';
  }

  // ------------------------------------------------------------------
  // Rendering helpers for scenes (browser only)
  // ------------------------------------------------------------------
  // Cards and events speak of 'psoe' meaning the player's party; once
  // Sánchez has left it, their effects go to his new party.
  function me(Q, party) {
    return (party === 'psoe' && Q.exiled && Q.player_party && Q.player_party !== 'psoe') ? Q.player_party : party;
  }

  function meTo(Q, to) {
    if (typeof to === 'string') {
      return to === Q.player_party && Q.exiled ? 'psoe' : to;
    }
    if (!Q.exiled || !Q.player_party || Q.player_party === 'psoe' || to[Q.player_party] === undefined) {
      return to;
    }
    var out = {};
    Object.keys(to).forEach(function (k) {
      var key = k === Q.player_party ? 'psoe' : k;
      out[key] = (out[key] || 0) + to[k];
    });
    return out;
  }

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
    // candidates: 'sanchez', 'pp', 'cs', 'up', or 'censure' / 'budget'
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
    var mode = root.spRegionMapMode || 'presidency';
    var voxOn = Q.year >= 2018 || Q.vox_breakthrough;
    var modes = ['presidency', 'psoe', 'pp', 'up', 'cs'].concat(voxOn ? ['vox'] : []).concat(['iu', 'regionalist']);
    if (modes.indexOf(mode) === -1) {
      mode = 'presidency';
    }
    var rows = regions.map(function (r) {
      var reg = Q.regions[r];
      var g = reg.government;
      return '<tr class="sp-reg-row' + (r === selected ? ' sp-reg-selected' : '') + '" data-reg="' + r +
        '" tabindex="0"><td>' + (REGION_SHORT[r] || r) + '</td><td><span class="sp-swatch" style="background:' +
        UI.partyColor(g.party) + '"></span>' + surname(g.president) + '</td><td class="sp-num">' +
        reg.nextElection.slice(0, 4) + '</td></tr>';
    });
    var options = '<option value="">Choose a community…</option>' + regions.map(function (r) {
      return '<option value="' + r + '"' + (r === selected ? ' selected' : '') + '>' + r + '</option>';
    }).join('');
    var modeOptions = modes.map(function (m) {
      return '<option value="' + m + '"' + (m === mode ? ' selected' : '') + '>' +
        (m === 'presidency' ? 'Who holds each presidency' : 'Where the ' + UI.BLOC_NAMES[m] + ' governs') + '</option>';
    }).join('');
    out.innerHTML = '<select id="' + id + '-mode" class="sp-select" aria-label="Map view">' + modeOptions + '</select>' +
      '<div id="' + id + '-map"></div>' +
      '<select id="' + id + '-select" class="sp-select" aria-label="Community">' + options + '</select>' +
      '<div id="' + id + '-detail"></div>' +
      '<table class="sp-results sp-compact"><thead><tr><th>Region</th>' +
      '<th>President</th><th class="sp-num">Vote</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
    var select = el(id + '-select');
    var show = function (r) {
      root.spSelectedRegion = r;
      select.value = r;
      Array.prototype.forEach.call(out.querySelectorAll('.sp-reg-row'), function (tr) {
        tr.className = 'sp-reg-row' + (tr.getAttribute('data-reg') === r ? ' sp-reg-selected' : '');
      });
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
    var drawMap = function () {
      UI.drawRegionMap(el(id + '-map'), Q.regions, mode, { onSelect: function (r) { show(r); } });
    };
    el(id + '-mode').onchange = function () {
      mode = el(id + '-mode').value;
      root.spRegionMapMode = mode;
      drawMap();
    };
    select.onchange = function () { show(select.value); };
    Array.prototype.forEach.call(out.querySelectorAll('.sp-reg-row'), function (tr) {
      var pick = function () {
        show(tr.getAttribute('data-reg'));
        select.scrollIntoView({ block: 'nearest' });
      };
      tr.onclick = pick;
      tr.onkeydown = function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(); } };
    });
    drawMap();
    show(selected);
  }

  function renderEuropean(Q, id) {
    var out = el(id);
    if (out && Q.ep_seats) {
      out.innerHTML = UI.resultsTable(Q.ep_seats, Q.ep_shares, { prevSeats: Q.ep_prev });
    }
  }

  function renderArrangements(Q, id) {
    var out = el(id);
    if (out && Q.congress) {
      out.innerHTML = UI.arrangementsHtml(Q.congress);
    }
  }

  function renderMap(Q, id) {
    var out = el(id);
    if (out && Q.map_winners) {
      UI.drawMap(out, Q.map_winners, 'Most-voted party by province (hover for vote shares)',
        { shares: Q.map_shares, outlines: Q.map_kind === 'regional' ? 'bold' : 'light',
          prevWinners: Q.map_kind === 'general' ? Q.map_prev_winners : null });
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
    var html = (Q.last_regional_results || []).map(function (res) {
      var note = res.psoeLost ? ' The PSOE loses the presidency.'
        : (res.psoeWon ? ' The PSOE takes the presidency.' : '');
      return '<h4>' + res.region + '</h4>' +
        UI.resultsTable(res.seats, res.shares, { prevSeats: res.prevSeats, prevShares: res.prevShares }) +
        '<p>Government: ' + res.government.president + ' (' +
        res.government.cabinet.map(UI.partyName).join(' + ') + (res.government.support.length
          ? ', with support from ' + res.government.support.map(UI.partyName).join(' and ') : '') +
        '). ' + (res.government.type || '') + '.' + note + '</p>';
    }).join('');
    out.innerHTML = html + '<div id="' + id + '-presidencies"></div>';
    UI.drawRegionMap(el(id + '-presidencies'), Q.regions, 'presidency',
      { title: 'Who holds each presidency now' });
  }

  // Who leads each PSOE faction, by date and by the game's situation.
  function factionLeader(Q, f) {
    var k = Q.year * 100 + Q.month;
    var andalucia = Q.regions && Q.regions['Andalucía'] && Q.regions['Andalucía'].government;
    var diazGoverns = andalucia && andalucia.party === 'psoe' && /Díaz/.test(andalucia.president || 'Susana Díaz');
    var diazLeadsParty = !Q.sanchez_leader && Q.psoe_leader === 'Susana Díaz';
    switch (f) {
      case 'regional_leaders':
        return diazGoverns && !diazLeadsParty ? 'Susana Díaz' : 'Emiliano García-Page';
      case 'institutionalists':
        if (k < 201610) { return 'Alfredo Pérez Rubalcaba'; }
        return k < 201907 ? 'Javier Fernández' : 'Carmen Calvo';
      case 'progressives':
        return k < 201706 ? 'José Antonio Pérez Tapias' : 'José Luis Rodríguez Zapatero';
      case 'modernisers':
        if (k < 201709) { return 'Eduardo Madina'; }
        // Calviño, an independent, only once a PSOE government has made her a minister
        var eco = Q.cabinet && Q.cabinet.economy;
        if (k >= 201806 && !Q.acting && eco && /^Nadia Calviño/.test(eco.name || '') && Q.psoe_in_government) {
          return 'Nadia Calviño (independent)';
        }
        return 'Patxi López';
      case 'trade_unionists':
        return k < 201603 ? 'Cándido Méndez' : 'Pepe Álvarez';
    }
    return '';
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
      return '<tr><td>' + short[f] + '<br><span class="sp-faction-leader">' + factionLeader(Q, f) + '</span></td><td>' +
        UI.word('strength', Q[f + '_strength']) +
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
    leadershipElection: leadershipElection,
    oust: oust,
    joinParty: joinParty,
    newPartyStrength: newPartyStrength,
    choosePPLeader: choosePPLeader,
    ppSetback: ppSetback,
    autoFormation: autoFormation,
    transferRaw: transfer,
    campaignRaw: campaign,
    aiStances: aiStances,
    leaderOf: leaderOf,
    lastChanceInvestiture: lastChanceInvestiture,
    factionLeader: factionLeader,
    comebackPrimary: comebackPrimary,
    placeLoyalists: placeLoyalists,
    baronsCoup: baronsCoup,
    federalCommitteeVote: federalCommitteeVote,
    allocateCabinet: allocateCabinet,
    renderCabinet: renderCabinet,
    MINISTRIES: MINISTRIES,
    grandCoalitionOffer: grandCoalitionOffer,
    senateElected: senateElected,
    dhondtSeats: dhondtSeats,
    europeanElection: europeanElection,
    renderEuropean: renderEuropean,
    renderArrangements: renderArrangements,
    renderVote: renderVote,
    renderCongress: renderCongress,
    renderPolls: renderPolls,
    renderRegions: renderRegions,
    renderRegionalResults: renderRegionalResults,
    renderFactions: renderFactions,
    campaign: function (Q, party, changes) { return campaign(Q, me(Q, party), changes); },
    transfer: function (Q, from, to, changes) { return transfer(Q, me(Q, from), meTo(Q, to), changes); },
    partyRel: partyRel,
    intl: intl,
    econ: econ,
    social: social,
    migration: migration,
    monthlyWorld: monthlyWorld,
    learnFrom: learnFrom,
    sisterLeader: sisterLeader,
    fundsIncome: fundsIncome,
    formationBlame: formationBlame,
    position: position,
    trueVote: trueVote,
    startFinalCampaign: startFinalCampaign,
    finalSpend: finalSpend,
    withEday: withEday,
    drawPollError: drawPollError,
    typicalShare: typicalShare,
    target: function (Q, party, key, strength) { return target(Q, me(Q, party), key, strength); },
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
