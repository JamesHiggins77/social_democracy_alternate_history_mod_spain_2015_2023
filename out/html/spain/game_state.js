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
    institutionalists: 'Institutionalists', regional_leaders: 'Regional Barons',
    progressives: 'Socialist Left', modernisers: 'Modernisers', trade_unionists: 'Trade Unionists'
  };
  var RELATIONS = ['pp', 'cs', 'up', 'iu', 'erc', 'junts', 'pnv', 'bildu', 'cc'];
  var LEFT_BLOC = ['psoe', 'up', 'iu', 'mp', 'compromis', 'mes', 'mxme', 'cha', 'bng', 'geroa'];
  var RIGHT_BLOC = ['pp', 'cs', 'vox', 'upn', 'par', 'foro', 'elpi'];
  // Territorial parties that lead their own community when largest.
  var TERRITORIAL_LEADERS = ['pnv', 'cc', 'prc', 'jxsi', 'junts', 'erc', 'geroa'];

  // General government deficit and debt (% of GDP), Eurostat/Bank of Spain
  // figures by year. The game adds the player's policy adjustments on top.
  // Pedro Sánchez's real time in office: June 2018 to December 2026.
  var REAL_PM_MONTHS = 102;
  var DEFICIT_BY_YEAR = { 2015: 5.2, 2016: 4.3, 2017: 3.0, 2018: 2.5, 2019: 3.1, 2020: 10.1,
                          2021: 6.7, 2022: 4.7, 2023: 3.5, 2024: 3.2, 2025: 2.6, 2026: 2.3 };
  var DEBT_BY_YEAR = { 2015: 103.3, 2016: 102.7, 2017: 101.8, 2018: 100.4, 2019: 98.2, 2020: 120.3,
                       2021: 116.8, 2022: 111.6, 2023: 107.7, 2024: 101.8, 2025: 101.0, 2026: 100.2 };
  function yearValue(table, year) {
    return table[Math.max(2015, Math.min(2026, year))];
  }
  // Unemployment (EPA annual average, %) and real GDP growth (INE, %).
  var UNEMP_BY_YEAR = { 2014: 24.4, 2015: 22.1, 2016: 19.6, 2017: 17.2, 2018: 15.3, 2019: 14.1,
                        2020: 15.5, 2021: 14.8, 2022: 12.9, 2023: 12.2, 2024: 11.3, 2025: 10.5, 2026: 10.0 };
  var GROWTH_BY_YEAR = { 2014: 1.4, 2015: 3.8, 2016: 3.0, 2017: 3.0, 2018: 2.3, 2019: 2.0,
                         2020: -11.2, 2021: 6.4, 2022: 5.8, 2023: 2.5, 2024: 3.5, 2025: 2.9, 2026: 2.2 };
  // Background migration pressure by year (arrivals by sea: 2018 peak on the
  // Strait, 2020-21 Canaries route), on the chaos scale.
  var MIGRATION_BY_YEAR = { 2014: 1, 2015: 2, 2016: 2, 2017: 4, 2018: 8, 2019: 4, 2020: 6, 2021: 8,
                            2022: 3, 2023: 5, 2024: 7, 2025: 4, 2026: 4 };
  function yearOf(table, year) {
    return table[Math.max(2014, Math.min(2026, year))];
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

  // Wipe every value left by a previous game (event flags, pacts, plots,
  // lessons, exile...) and the page-level view settings, so a new
  // campaign starts exactly like the first one.
  function resetGame(Q) {
    Object.keys(Q).forEach(function (k) { delete Q[k]; });
    if (root.document) {
      root.spSelectedRegion = '';
      root.spRegionMapMode = 'presidency';
    }
    UI.setPartyName('ps', 'Pedro Sánchez List', 'PSL');
  }

  function newGame(Q, difficulty) {
    resetGame(Q);
    Q.started = 1;
    Q.spain = 1;
    Q.difficulty = difficulty || 0;
    Q.time = 1;
    Q.year = 2014;
    Q.month = 7;
    Q.month_actions = 0;
    Q.advisor_action_timer = 0;
    Q.last_advisor_action = 0;
    Q.timers = ['advisor_action', 'dark', 'bb_spend', 'law', 'offer', 'terr', 'eurol', 'foreign', 'pes', 'bb_interview', 'bb_team', 'bb_money', 'bb_vote', 'bb_baron', 'bb_programme', 'bb_social', 'bb_debate', 'bb_intl', 'low_profile', 'ex_rally', 'ex_line', 'ex_scandal', 'appoint', 'dues', 'intl_net', 'exile_org', 'exile_tour', 'exile_book', 'exile_bridge', 'exile_funds', 'exile_bid', 'negotiations', 'barons', 'media', 'membership', 'rally',
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
  // ------------------------------------------------------------------
  // Advisers: up to three at a time, hired and dismissed by the player.
  // [name, faction (dissent key), requirement, what they do]
  // ------------------------------------------------------------------
  var ADVISERS = {
    hernando: ['Antonio Hernando', 'institutionalists', function (Q) { return !Q.rebellion_used; }, 'Parliamentary arithmetic, until the 2016 crisis'],
    calvo: ['Carmen Calvo', 'institutionalists', function (Q) { return Q.year >= 2017 && (Q.econ_left || 0) <= 4; }, 'Constitutional law, the institutions and equality'],
    robles: ['Margarita Robles', 'institutionalists', function (Q) { return Q.year >= 2016; }, 'A former judge the institutions trust'],
    simancas: ['Rafael Simancas', 'institutionalists', function (Q) { return true; }, 'Veteran of the parliamentary group'],
    redondo: ['Iván Redondo', 'modernisers', function (Q) { return Q.year >= 2017; }, 'Polling, narrative, the centre'],
    sevilla: ['Jordi Sevilla', 'modernisers', function (Q) { return Q.year <= 2017; }, 'The 2015 economic programme'],
    escudero: ['Manuel Escudero', 'modernisers', function (Q) { return true; }, 'Economist with links to business'],
    madina: ['Eduardo Madina', 'modernisers', function (Q) { return !Q.rebellion_used; }, 'Your 2014 rival, a Basque moderniser'],
    lastra: ['Adriana Lastra', 'progressives', function (Q) { return true; }, 'The members and Podemos'],
    tapias: ['José Antonio Pérez Tapias', 'progressives', function (Q) { return (Q.econ_left || 0) >= 3; }, 'The Socialist Left, on a left-wing line'],
    elorza: ['Odón Elorza', 'progressives', function (Q) { return true; }, 'A free spirit on the left of the party'],
    cantera: ['Zaida Cantera', 'progressives', function (Q) { return Q.year >= 2016; }, 'Army officer turned deputy'],
    luena: ['César Luena', 'sanchistas', function (Q) { return !Q.rebellion_used; }, 'Secretary of Organisation to 2016'],
    cerdan: ['Santos Cerdán', 'sanchistas', function (Q) { return !!Q.rebellion_used; }, 'The organiser of the comeback'],
    puente: ['Óscar Puente', 'sanchistas', function (Q) { return !!Q.rebellion_used; }, 'Mayor of Valladolid, the comeback voice'],
    bolanos: ['Félix Bolaños', 'sanchistas', function (Q) { return Q.year >= 2017; }, 'The fixer'],
    ferrer: ['Toni Ferrer', 'trade_unionists', function (Q) { return Q.year >= 2017; }, 'Former UGT leader in the Executive'],
    mendez: ['Cándido Méndez', 'trade_unionists', function (Q) { return Q.year >= 2016; }, 'Twenty-two years at the head of the UGT'],
    valerio: ['Magdalena Valerio', 'trade_unionists', function (Q) { return true; }, 'Labour lawyer close to the unions'],
    alvarez: ['Pepe Álvarez', 'trade_unionists', function (Q) { return Q.year >= 2016; }, 'The new UGT leader'],
    puig: ['Ximo Puig', 'regional_leaders', function (Q) { return (Q.year > 2015 || (Q.year === 2015 && Q.month >= 7)) && (Q.econ_left || 0) <= 4; }, 'President of Valencia'],
    vara: ['Guillermo Fernández Vara', 'regional_leaders', function (Q) { return (Q.year > 2015 || (Q.year === 2015 && Q.month >= 7)) && (Q.plot || 0) < 50; }, 'President of Extremadura'],
    lamban: ['Javier Lambán', 'regional_leaders', function (Q) { return (Q.year > 2015 || (Q.year === 2015 && Q.month >= 7)) && (Q.econ_left || 0) <= 3 && !Q.pact_up; }, 'President of Aragón'],
    armengol: ['Francina Armengol', 'regional_leaders', function (Q) { return (Q.year > 2015 || (Q.year === 2015 && Q.month >= 7)); }, 'President of the Balearic Islands']
  };

  // Faction moods: each faction warms to Sánchez or turns on him as its
  // dissent crosses a threshold (with hysteresis). Warming brings offers
  // of service; turning cold withdraws them and takes its people away.
  var FACTION_KEYS = ['institutionalists', 'modernisers', 'progressives', 'sanchistas', 'trade_unionists', 'regional_leaders'];
  function factionMoods(Q) {
    if (!Q.sanchez_leader) { return; }
    FACTION_KEYS.forEach(function (f) {
      var m = Q['fmood_' + f] || 0, d = Q[f + '_dissent'] || 0, warm, cold, back;
      if (f === 'sanchistas') { warm = (Q.sanchismo || 0) >= 40; cold = (Q.sanchismo || 0) <= 8; back = (Q.sanchismo || 0) > 15 && (Q.sanchismo || 0) < 35; }
      else {
        warm = d <= 12;
        if (f === 'progressives') { warm = warm && (Q.econ_left || 0) >= 2; }
        if (f === 'modernisers') { warm = warm && (Q.econ_left || 0) <= 4; }
        cold = d >= 45 || (f === 'regional_leaders' && (Q.plot || 0) >= 70);
        back = d > 22 && d < 35;
      }
      var nm = m;
      if (!Q.fmood_init) { Q['fmood_' + f] = warm ? 1 : (cold ? -1 : 0); if (warm) { Object.keys(ADVISERS).forEach(function (a) { if (ADVISERS[a][1] === f && ADVISERS[a][2](Q)) { Q['adv_offer_' + a] = 1; } }); } Q['fmood_' + f + '_word'] = warm ? 'warm to you' : 'wary'; return; }
      if (m !== 1 && warm) { nm = 1; } else if (m !== -1 && cold) { nm = -1; } else if (m !== 0 && back) { nm = 0; }
      if (nm !== m) {
        Q['fmood_' + f] = nm;
        if (nm === 1) {
          var names = [];
          Object.keys(ADVISERS).forEach(function (a) {
            if (ADVISERS[a][1] === f && ADVISERS[a][2](Q) && !Q['adv_' + a]) { Q['adv_offer_' + a] = 1; names.push(ADVISERS[a][0]); }
          });
          Q['fwarm_names_' + f] = names.length ? names.join(', ') : 'nobody new, for now';
          Q['fevent_' + f] = 1;
        } else if (nm === -1) {
          Q['fcold_left_' + f] = 0;
          Object.keys(ADVISERS).forEach(function (a) {
            if (ADVISERS[a][1] === f) { Q['adv_offer_' + a] = 0; if (Q['adv_' + a]) { Q['adv_' + a] = 0; Q['fcold_left_' + f] = 1; } }
          });
          Q['fevent_' + f] = -1;
        }
      }
      Q['fmood_' + f + '_word'] = Q['fmood_' + f] === 1 ? 'warm to you' : (Q['fmood_' + f] === -1 ? 'hostile' : 'wary');
    });
    Q.fmood_init = 1;
  }
  // One adviser at a time may come forward on their own, every few months,
  // if their own conditions hold and their faction is not hostile.
  function individualOffer(Q) {
    if (!Q.sanchez_leader || Q.offer_pending || (Q.offer_timer || 0) > 0) { return; }
    var cands = Object.keys(ADVISERS).filter(function (a) {
      var f = ADVISERS[a][1];
      return !Q['adv_offer_' + a] && !Q['adv_' + a] && ADVISERS[a][2](Q) && (Q['fmood_' + f] || 0) >= 0 &&
        (f === 'sanchistas' ? (Q.sanchismo || 0) >= 25 : (Q[f + '_dissent'] || 0) < 28);
    });
    if (!cands.length) { return; }
    var a = cands[((Q.year || 2015) * 12 + (Q.month || 1)) % cands.length];
    Q['adv_offer_' + a] = 1; Q.offer_id = a; Q.offer_name = ADVISERS[a][0]; Q.offer_pending = 1; Q.offer_timer = 4;
  }
  var ADVISER_MAX = 3;
  function advCount(Q) {
    return Object.keys(ADVISERS).filter(function (a) { return Q['adv_' + a]; }).length;
  }
  function hireAdviser(Q, id) {
    if (Q['adv_' + id] || advCount(Q) >= ADVISER_MAX || !ADVISERS[id][2](Q)) { return false; }
    Q['adv_' + id] = 1;
    if (ADVISERS[id][1] === 'sanchistas') { Q.sanchismo += 2; }
    else { Q[ADVISERS[id][1] + '_dissent'] = (Q[ADVISERS[id][1] + '_dissent'] || 0) - 3; }
    recalculate(Q);
    return true;
  }
  function fireAdviser(Q, id) {
    if (!Q['adv_' + id]) { return false; }
    Q['adv_' + id] = 0;
    if (ADVISERS[id][1] === 'sanchistas') { Q.sanchismo -= 4; Q.member_morale -= 2; }
    else { Q[ADVISERS[id][1] + '_dissent'] = (Q[ADVISERS[id][1] + '_dissent'] || 0) + 6; }
    recalculate(Q);
    return true;
  }
  // Recomputed each turn: who may be hired, and who holds the government
  // posts that come with their own adviser card (not counted in the three).
  function adviserFlags(Q) {
    Q.adv_count = advCount(Q);
    factionMoods(Q);
    Object.keys(ADVISERS).forEach(function (a) {
      if (Q['adv_' + a] && !ADVISERS[a][2](Q)) { Q['adv_' + a] = 0; Q['adv_left_' + a] = 1; }
      // conditions are hidden: an adviser who no longer fits withdraws the offer
      if (!ADVISERS[a][2](Q) || Q['fmood_' + ADVISERS[a][1]] === -1) { Q['adv_offer_' + a] = 0; }
      Q['adv_can_' + a] = !Q['adv_' + a] && Q['adv_offer_' + a] && Q.adv_count < ADVISER_MAX && ADVISERS[a][2](Q) ? 1 : 0;
    });
    FACTION_KEYS.forEach(function (f) {
      Q['fac_offers_' + f] = Object.keys(ADVISERS).some(function (a) { return ADVISERS[a][1] === f && Q['adv_offer_' + a]; }) ? 1 : 0;
    });
    individualOffer(Q);
    Q.in_coalition = (Q.govt_parties || []).filter(function (p) { return p !== Q.player_party; }).length > 0 && Q.player_in_government && !Q.acting ? 1 : 0;
    var inGov = Q.player_in_government && !Q.acting;
    var leads = inGov && Q.pm_party === Q.player_party;
    Q.adv_pm = inGov && !leads ? 1 : 0;
    Q.adv_pm_name = Q.adv_pm ? Q.pm : '';
    Q.adv_deputy = leads ? 1 : 0;
    // the posts follow the coalition agreement (Q.cabinet): a partner may hold them
    var holder = function (m) { return Q.cabinet && Q.cabinet[m] ? Q.cabinet[m].party : Q.player_party; };
    var dep = holder('deputy');
    Q.adv_deputy_partner = dep !== Q.player_party ? 1 : 0;
    Q.adv_deputy_party = dep;
    Q.adv_deputy_name = Q.adv_deputy_partner ? leaderOf(Q, dep) : 'Carmen Calvo';
    var eco = holder('economy');
    Q.adv_econ = leads ? 1 : 0;
    var ECON_FIGURES = { up: 'Nacho Álvarez', cs: 'Luis Garicano', pp: 'Luis de Guindos' };
    Q.adv_econ_name = eco !== Q.player_party ? (ECON_FIGURES[eco] || UI.partyName(eco) + "'s minister") :
      (Q.year >= 2018 ? 'Nadia Calviño' : 'your Minister of Economy');
    var HOMES = { puig: 'Comunidad Valenciana', vara: 'Extremadura', lamban: 'Aragón', armengol: 'Baleares' };
    Q.adv_home_region = 'Extremadura';
    Object.keys(HOMES).forEach(function (a) { if (Q['adv_' + a]) { Q.adv_home_region = HOMES[a]; } });
    Q.adv_loyalist = (Q.sanchez_leader || Q.backbench || Q.leadership_exception_open || Q.exiled) && !Q.abalos_gone ? 1 : 0;
  }

  // ------------------------------------------------------------------
  // Municipal elections (May 2015, 2019, 2023): a heuristic on national
  // polls. Councillors (about 67,000) follow vote shares adjusted for local
  // strength: the old parties' rural networks, independents and local
  // lists, and new parties' thin implantation.
  // ------------------------------------------------------------------
  var LOCAL_COUNCILLORS = 67500;
  var LOCAL_FACTOR = { pp: 1.45, psoe: 1.3, up: 0.45, cs: 0.55, vox: 0.55, iu: 0.9, pnv: 1.6, erc: 1.6, junts: 1.7,
                       bildu: 1.8, cc: 1.6, bng: 1.6, prc: 1.6, compromis: 1.3, mp: 0.5, upn: 1.5, pacma: 0, upyd: 0.4 };
  var LOCAL_INDEPENDENTS = 0.11;
  function localElections(Q) {
    var poll = Q.true_poll || {};
    var raw = {}, sum = 0;
    Object.keys(poll).forEach(function (p) {
      if (/^x:/.test(p) || !(poll[p] > 0.3)) { return; }
      var f = LOCAL_FACTOR[p] === undefined ? 0.8 : LOCAL_FACTOR[p];
      // Vox stood in few towns at first: its local lists grow with time
      if (p === 'vox') { f = Q.year >= 2023 ? 0.15 : 0.05; }
      raw[p] = poll[p] * f;
      sum += raw[p];
    });
    var seats = {};
    Object.keys(raw).forEach(function (p) {
      seats[p] = Math.round(LOCAL_COUNCILLORS * (1 - LOCAL_INDEPENDENTS) * raw[p] / sum);
    });
    seats.ind = Math.round(LOCAL_COUNCILLORS * LOCAL_INDEPENDENTS);
    Q.local_prev_poll = Q.local_final_poll || null;
    Q.local_final_poll = JSON.parse(JSON.stringify(Q.poll || poll));
    Q.local_shares = JSON.parse(JSON.stringify(poll));
    if (Q.local_shares.vox) { Q.local_shares.vox *= (Q.year >= 2023 ? 0.15 : 0.05) / 0.55; }
    var prev = Q.local_seats || null;
    Q.local_prev = prev;
    Q.local_seats = seats;
    Q.local_year = Q.year;
    var top = Object.keys(seats).filter(function (p) { return p !== 'ind'; }).sort(function (a, b) { return seats[b] - seats[a]; })[0];
    Q.local_winner = UI.partyName(top);
    Q.local_psoe = seats.psoe || 0;
    Q.local_psoe_change = prev ? (seats.psoe || 0) - (prev.psoe || 0) : 0;
    // a poor night: the PSOE loses councillors, or the PP beats it clearly
    Q.local_poor = (prev && Q.local_psoe_change < -500) || (seats.pp || 0) > 1.1 * (seats.psoe || 0) ? 1 : 0;
    Q.local_due = 1;
    if (Q.local_poor && !Q.bluff_seen && Q.sanchez_leader && Q.psoe_in_government && !Q.acting && !Q.election_year) {
      Q.bluff_due = 1;
    }
    Q.rep_local = seats[Q.player_party || 'psoe'] || 0;
    Q.rep_local_total = LOCAL_COUNCILLORS;
    return seats;
  }

  // Podemos's names: Podemos; Unidos Podemos with IU (May 2016); Unidas
  // Podemos (2019); Sumar, Yolanda Díaz's platform (2023).
  function podemosBrand(Q) {
    var k = (Q.year || 2014) * 100 + (Q.month || 1);
    return k >= 202306 ? ['Sumar', 'Sumar'] : (k >= 201903 ? ['Unidas Podemos', 'UP'] :
      (k >= 201605 ? ['Unidos Podemos', 'UP'] : ['Podemos', 'Podemos']));
  }

  function recalculate(Q) {
    if (Q.adv_lastra === undefined) { Q.adv_hernando = 1; Q.adv_luena = 1; Q.adv_lastra = 1; Q.adv_offer_hernando = 1; Q.adv_offer_luena = 1; Q.adv_offer_lastra = 1; }
    adviserFlags(Q);
    lawFlags(Q);
    catalanCrisisState(Q, false);
    var brand = podemosBrand(Q);
    if (Q.up_brand !== brand[0]) {
      Q.up_brand = brand[0];
      UI.setPartyName('up', brand[0], brand[1]);
      if (brand[0] === 'Sumar' && Q.vm && !Q.sumar_merged) {
        // Sumar (2023) absorbs Más País, IU and Compromís into one list
        Q.sumar_merged = 1;
        Object.keys(Q.vm.classSupport).forEach(function (c) {
          var cs = Q.vm.classSupport[c];
          // (some of those voters go to the PSOE as the useful vote instead)
          ['mp', 'iu', 'compromis'].forEach(function (p) { cs.up = (cs.up || 0) + 0.7 * (cs[p] || 0); cs.psoe = (cs.psoe || 0) + 0.3 * (cs[p] || 0); cs[p] = 0; });
        });
      }
    }
    Q.up_brand_exists = 1;
    Q.up_leader_is_iglesias = leaderOf(Q, 'up') === 'Pablo Iglesias' || (!Q.iglesias_left && Q.year >= 2021) ? 1 : 0;
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
    Q.right_leader = Q.right_candidate === 'cs' ? leaderOf(Q, 'cs') : ((Q.congress.vox || 0) > (Q.congress.pp || 0) ? 'Santiago Abascal' : (Q.pp_leader || 'Mariano Rajoy'));
    Q.pp_leader_short = surname(Q.pp_leader || 'Mariano Rajoy');
    Q.player_party = Q.player_party || 'psoe';
    Q.my_party = Q.player_party === 'psoe' ? 'the PSOE' : UI.partyName(Q.player_party);
    Q.my_party_cap = Q.my_party.charAt(0).toUpperCase() + Q.my_party.slice(1);
    Q.player_role = Q.player_leads ? '\u00a0(leader),' : ',';
    Q.player_is_cs = Q.player_party === 'cs' ? 1 : 0;
    Q.player_is_up = Q.player_party === 'up' ? 1 : 0;
    Q.player_is_ps = Q.player_party === 'ps' ? 1 : 0;
    Q.sanchez_active = (Q.sanchez_leader || Q.exiled) ? 1 : 0;
    Q.sanchez_pm = Q.pm === 'Pedro Sánchez' && !Q.acting ? 1 : 0;
    Q.pm_years_text = ((Q.pm_months || 0) / 12).toFixed(1);
    Q.beat_history = (Q.pm_months || 0) >= REAL_PM_MONTHS ? 1 : 0;
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
    Q.vox_on = voxOn(Q) ? 1 : 0;
    Q.seeking_government = (Q.acting && Q.elections_held >= 1 &&
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
    Q.econ_word = e <= -3 ? 'Neoliberal' : (e <= -1 ? 'Moderate' : (e <= 1.5 ? 'Social Liberal' : (e <= 6 ? 'Social Democratic' : 'Anti-Capitalist')));
    ideologyLines(Q);
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
    adviserFlags(Q);
    // flags for conditional world events
    var mad = Q.regions && Q.regions['Madrid'];
    Q.madrid_pp = mad && mad.government && mad.government.party === 'pp' ? 1 : 0;
    var csSeats = (Q.congress && Q.congress.cs) || 0;
    Q.cs_peak_seats = Math.max(Q.cs_peak_seats || 0, csSeats);
    var wasCollapsed = Q.cs_collapsed;
    Q.cs_collapsed = Q.cs_peak_seats >= 30 && csSeats < 15 ? 1 : 0;
    if (Q.cs_collapsed && !wasCollapsed && Q.vm) {
      // its centrist, moderate voters split: some come home to the PSOE
      transfer(Q, 'cs', { psoe: 0.35, pp: 0.5, vox: 0.15 }, share(Q, 'cs', 0.3));
    }
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
                       vox: { pp: 0.5, cs: 0.1 }, psoe: { up: 0.3, pp: 0.2 }, iu: { up: 0.4, psoe: 0.3 },
                       erc: { psoe: 0.25, up: 0.2 }, junts: { erc: 0.2, psoe: 0.15, cs: 0.1 }, cup: { erc: 0.3, up: 0.2 },
                       bildu: { pnv: 0.2, psoe: 0.2, up: 0.2 }, pnv: { psoe: 0.3, pp: 0.2 } };
  // groups of parties an attack campaign can target together
  var ATTACK_GROUPS = { catind: ['erc', 'junts', 'cup'], basque: ['bildu', 'pnv'],
                        minor: ['cc', 'bng', 'mes', 'prc', 'foro', 'compromis', 'nc', 'te', 'geroa', 'upn'] };
  var ATTACK_NAMES = { catind: 'the Catalan independence parties', basque: 'the Basque nationalists', minor: 'the regionalist parties' };
  // A party reduced to its hard core: attacks find nothing to bite on.
  function hardcore(Q, key) {
    var poll = (Q.true_poll && Q.true_poll[key]) || 0;
    if (key === 'vox') { return !Q.vox_on || poll < 3; }
    if (key === 'iu') { return true; }
    if (key === 'cs') { return Q.cs_collapsed || (Q.year >= 2019 && poll < 5); }
    return false;
  }
  // What an attack does to relations and the party's factions.
  function attackRelations(Q, key) {
    var r = function (p, d) { Q['rel_' + p] = clamp((Q['rel_' + p] === undefined ? 40 : Q['rel_' + p]) + d, 0, 100); };
    if (key === 'catind') { r('erc', -8); r('junts', -8); r('cs', 4); Q.regional_leaders_dissent -= 4; Q.progressives_dissent += 2; }
    else if (key === 'basque') { r('pnv', -8); r('bildu', -8); r('cs', 2); Q.regional_leaders_dissent -= 2; }
    else if (key === 'minor') { ['cc', 'bng', 'prc', 'nc', 'te', 'geroa'].forEach(function (p) { r(p, -5); }); Q.regional_leaders_dissent += 1; }
    else if (key === 'up') { r('up', -8); r('cs', 3); Q.progressives_dissent += 5; Q.regional_leaders_dissent -= 3; Q.institutionalists_dissent -= 2; Q.modernisers_dissent -= 2; }
    else if (key === 'pp') { r('pp', -6); Q.progressives_dissent -= 2; Q.institutionalists_dissent += 1; }
    else if (key === 'cs') { r('cs', -8); Q.progressives_dissent -= 1; Q.modernisers_dissent += 2; }
    else if (key === 'vox') { r('vox', -5); Q.progressives_dissent -= 2; }
    else if (key === 'iu') { r('iu', -8); Q.progressives_dissent += 3; }
    else if (key === 'psoe') { r('psoe', -8); }
  }

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
    // what a fresh spend (one not yet repeated) is now worth, in % of the first
    Q.eday_next_factor = Math.round(100 / (1 + FINAL_SATURATION * (Q.eday_spent || 0)));
  }

  function startFinalCampaign(Q) {
    Q.eday = { cls: {}, reg: {}, uses: {} };
    Q.eday_spent = 0;
    Q.eday_last = '';
    finalCampaignPoll(Q);
  }

  // kind: 'class' (key: a target group), 'region' (key: a community) or
  // 'attack' (key: a rival party). Costs 1 in funds.
  // Last-minute money buys little: the airtime is booked and the message is
  // set. Each spend is worth FINAL_SCALE of an early one, repeating the same
  // spend halves it again, and every unit already spent in this campaign cuts
  // the next by FINAL_SATURATION, so money is worth more spent during the
  // legislature than hoarded for election night. Returns the repeat factor.
  var FINAL_SCALE = 0.5;
  var FINAL_SATURATION = 0.1;
  function finalSpend(Q, kind, key) {
    if (!Q.eday) {
      startFinalCampaign(Q);
    }
    var e = Q.eday;
    var me = Q.player_party || 'psoe';
    var uk = kind + ':' + key;
    var n = e.uses[uk] || 0;
    e.uses[uk] = n + 1;
    var repeat = 1 / (1 + n);
    var f = FINAL_SCALE * repeat / (1 + FINAL_SATURATION * (Q.eday_spent || 0));
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
    } else if (kind === 'attack' && hardcore(Q, key)) {
      // the remaining supporters are the hard core: nothing to bite on
      var spot = Math.random() < 0.4;
      if (spot) {
        Object.keys(Q.vm.classSupport).forEach(function (c) { addCls(key, c, 0.3 * f); });
      }
      Q.federal_committee_balance -= 3;
      attackRelations(Q, key);
      Q.eday_backfire = spot ? 1 : 0;
      Q.eday_last = 'The remaining supporters of ' + UI.partyName(key) + ' are so committed that your attacks are unlikely to find purchase, and Ferraz asks why the money was spent on them.' +
        (spot ? ' Worse, the ads put ' + UI.partyName(key) + ' back in the spotlight.' : '');
    } else if (kind === 'attack' && ATTACK_GROUPS[key]) {
      var group = ATTACK_GROUPS[key].filter(function (p) { return p !== me; });
      Object.keys(Q.vm.classSupport).forEach(function (c) {
        group.forEach(function (p) {
          var hitg = Math.min(1.2 * f / group.length * 2, (Q.vm.classSupport[c][p] || 0));
          addCls(p, c, -hitg);
          addCls(me, c, hitg * 0.15);
        });
      });
      attackRelations(Q, key);
      Q.eday_backfire = 0;
      Q.eday_last = 'Your adverts go after ' + ATTACK_NAMES[key] + '. ' +
        (key === 'catind' ? 'Ciudadanos and the regional barons approve; ERC and Junts will remember it when the votes are counted in Congress.' :
         (key === 'basque' ? 'The PNV and Bildu take note: their votes in Congress will be harder to win.' :
          'The small parties are offended out of all proportion to the votes at stake.'));
    } else if (kind === 'attack') {
      attackRelations(Q, key);
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
    return repeat;
  }

  // The dark arts: party money used for dirty work. Each carries a risk of
  // exposure, which turns it into a scandal. Returns 1 if exposed.
  function darkArts(Q, act, target) {
    var risk = { rig: 0.35, meddle: 0.3, sabotage: 0.4 }[act];
    var cost = act === 'rig' ? 2 : 1;
    if (!Q.sanchez_leader && !Q.exiled) { Q.war_chest = (Q.war_chest || 0) - cost; } else { Q.funds -= cost; }
    var exposed = Math.random() < risk;
    Q.dark_exposed = exposed ? 1 : 0;
    var all = function (x) { var o = {}; VoteModel.CLASSES.forEach(function (c) { o[c] = x; }); return o; };
    if (act === 'rig') {
      Q.rig_bonus = exposed ? -6 : 4;
      if (exposed) { Q.sanchez_authority -= 15; Q.sanchismo -= 10; Q.member_morale -= 10; Q.federal_committee_balance -= 8; campaign(Q, 'psoe', all(-0.8)); }
    } else if (act === 'meddle') {
      if (target === 'pp') { campaign(Q, 'pp', all(-0.5)); Q.pp_pressure = (Q.pp_pressure || 0) + 1; }
      if (target === 'up') { transfer(Q, 'up', { mp: 0.4, psoe: 0.6 }, all(0.4)); }
      if (target === 'cs') { campaign(Q, 'cs', all(-0.5)); }
      if (exposed) { Q['rel_' + target] = (Q['rel_' + target] || 40) - 20; Q.sanchez_authority -= 10; campaign(Q, 'psoe', all(-0.6)); }
    } else if (act === 'sabotage') {
      if (target === 'diaz') { Q.plot = Math.max(0, (Q.plot || 0) - 15); Q.diaz_relation = (Q.diaz_relation || 50) - 15; }
      else { campaign(Q, target, all(-1)); }
      if (exposed) { Q.sanchez_authority -= 12; Q.institutionalists_dissent += 8; campaign(Q, 'psoe', all(-1)); if (target === 'diaz') { Q.plot += 25; } }
    }
    recalculate(Q);
    return exposed;
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


  // The constitutional and European lines. Each has a base the player moves
  // directly (const_line, eu_line) and an effective value that also reads
  // what the PSOE does: dialogue and pardons move it towards federalism, a
  // hard line towards unionism; warm EU relations towards integration.
  var CONST_WORDS = ['Centralist Unionist', 'Unionist', 'Moderate', 'Federalist', 'Plurinational Federalist'];
  var EU_WORDS = ['Eurosceptic', 'Euro-realist', 'Moderate', 'Pro-EU', 'European Integration'];
  function lineWord(words, v) { return words[v <= -3 ? 0 : (v <= -1 ? 1 : (v < 1 ? 2 : (v < 3 ? 3 : 4)))]; }
  function ideologyLines(Q) {
    if (Q.const_line === undefined) { Q.const_line = 0.6; }
    if (Q.eu_line === undefined) { Q.eu_line = 1.2; }
    Q.const_line_eff = clamp(Q.const_line + 0.4 * Math.min(4, Q.cat_dialogue || 0) - 0.6 * (Q.cat_hard_line || 0) + (Q.pardons_granted ? 0.6 : 0) + (Q.law_amnesty > 0 ? 1 : 0), -5, 5);
    Q.eu_line_eff = clamp(Q.eu_line + ((Q.intl && Q.intl.eu !== undefined ? Q.intl.eu : 55) - 55) / 15, -5, 5);
    Q.const_word = lineWord(CONST_WORDS, Q.const_line_eff);
    Q.eu_word = lineWord(EU_WORDS, Q.eu_line_eff);
    Q.hard_unionist = Q.const_line_eff <= -1.5 ? 1 : 0;
    // the attack lines the other parties use against the PSOE
    var e = Q.econ_left || 0, so = Q.social_prog || 0, c = Q.const_line_eff, u = Q.eu_line_eff;
    var vox = [], up = [], pp = [];
    if (e > 6) { vox.push('"communists in the government"'); pp.push('"they will ruin the economy"'); }
    if (so > 3) { vox.push('"woke ideology in our schools"'); }
    if (u >= 3) { vox.push('"Brussels\'s servants"'); }
    if (c >= 3) { vox.push('"they are breaking Spain"'); pp.push('"hostages of the separatists"'); }
    else if (c >= 1) { pp.push('"soft on the separatists"'); }
    if (e <= -3) { up.push('"the party of the IBEX 35"'); }
    else if (e <= -1) { up.push('"the old party of the regime"'); }
    if (c <= -3) { up.push('"the PP\'s partners on Catalonia"'); }
    if (so <= -1) { up.push('"no different from the right on rights"'); }
    if (u <= -1) { pp.push('"isolated in Europe"'); }
    Q.vox_attack = vox.length ? vox.join(', ') : 'nothing that sticks';
    Q.up_attack = up.length ? up.join(', ') : 'nothing that sticks';
    Q.pp_attack = pp.length ? pp.join(', ') : '"an unreliable partner"';
  }
  // Monthly effects of the lines on voters.
  function lineDrift(Q) {
    var e = Q.econ_left || 0, so = Q.social_prog || 0, c = Q.const_line_eff || 0, u = Q.eu_line_eff || 0;
    var all = function (x) { var o = {}; VoteModel.CLASSES.forEach(function (k) { o[k] = x; }); return o; };
    // Vox gains most from Anti-Capitalist, Progressive, European Integration, Plurinational Federalist
    var v = Math.max(0, e - 6) * 0.04 + Math.max(0, so - 3) * 0.025 + Math.max(0, u - 3) * 0.06 + Math.max(0, c - 3) * 0.09;
    if (v > 0 && voxOn(Q)) { voxFlow(Q, v * voxRoom(Q)); }
    // Podemos gains most from Neoliberal, Centralist Unionist and socially moderate positions
    var p = Math.max(0, -3 - e) * 0.15 + Math.max(0, -3 - c) * 0.15 + Math.max(0, -so) * 0.08;
    if (p > 0) { transfer(Q, 'psoe', { up: 0.85, iu: 0.15 }, { students: p, workers: 0.7 * p, unemployed: 0.7 * p, professionals: 0.4 * p }); }
    // federalism costs unionist voters in the interior; unionism costs the PSC
    if (c >= 2.5) { transfer(Q, 'psoe', { pp: 0.6, cs: 0.4 }, { pensioners: 0.04 * (c - 2), self_employed: 0.03 * (c - 2) }); }
    if (c <= -1 && Q.vm) { Q.vm.regionalMod['Cataluña'] = Q.vm.regionalMod['Cataluña'] || {}; var m = Q.vm.regionalMod['Cataluña'].psoe; Q.vm.regionalMod['Cataluña'].psoe = (m === undefined ? 1 : m) * (1 + 0.003 * c); }
    // pro-European professionals reward integration; Euroscepticism costs them
    if (u >= 3) { campaign(Q, 'psoe', { professionals: 0.05, students: 0.05 }); }
    if (u <= -1) { transfer(Q, 'psoe', { cs: 1 }, { professionals: 0.05 * -u, students: 0.03 * -u }); }
    Q.const_line = (Q.const_line || 0) * 0.995;
    if (Q.catalan_crisis) { Q.cat_crisis_months = (Q.cat_crisis_months || 0) + 1; }
  }
  // Realignment of the right: if Ciudadanos outpolls the PP for two years,
  // PP voters follow it and it becomes the main party of the right; the
  // same can happen to Vox if it grows very large.
  function rightRealignment(Q) {
    if (Q.right_dominant) { return; }
    var t = Q.true_poll || {};
    var pp = t.pp || 0, cs = t.cs || 0, vox = t.vox || 0;
    Q.cs_lead_months = cs > pp ? (Q.cs_lead_months || 0) + 1 : Math.max(0, (Q.cs_lead_months || 0) - 2);
    Q.vox_lead_months = vox > pp + 3 && vox >= 22 ? (Q.vox_lead_months || 0) + 1 : Math.max(0, (Q.vox_lead_months || 0) - 2);
    var who = Q.cs_lead_months >= 24 ? 'cs' : (Q.vox_lead_months >= 24 ? 'vox' : '');
    if (!who) { return; }
    Q.right_dominant = who;
    Q.realign_due = 1;
    Q.realign_name = UI.partyName(who); Q.realign_cs = who === 'cs' ? 1 : 0;
    var all = function (x) { var o = {}; VoteModel.CLASSES.forEach(function (k) { o[k] = x; }); return o; };
    // a third of the PP's remaining voters follow the new leader of the right
    transfer(Q, 'pp', who === 'cs' ? { cs: 0.85, vox: 0.15 } : { vox: 0.8, cs: 0.2 }, share(Q, 'pp', 0.25));
    recalculate(Q);
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
    var defence = coupDefence(Q) + (bonus || 0) + 1.5 * (Q.rig_bonus || 0) + 12 * (Math.random() - 0.5);
    Q.rig_bonus = 0;
    var total = 239;
    Q.fc_for = Math.round(total * defence / (defence + attack));
    Q.fc_against = total - Q.fc_for;
    Q.fc_absent = 253 - total;
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
    grandCoalitionWear(Q);
    if (Q.month === 5 && (Q.year === 2015 || Q.year === 2019 || Q.year === 2023) && Q.local_done !== Q.year) {
      Q.local_done = Q.year;
      localElections(Q);
    }
    membersDrift(Q);
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
    catalanCrisisState(Q, true);
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
    var voxReady = Q.year >= 2018 || Q.vox_breakthrough || Q.cat_crisis_seen ? 1 : 0.3;
    var voxNow = (Q.true_poll && Q.true_poll.vox) || 0;
    // Vox's growth slows as it approaches its ceiling
    var vox = VOX_CHAOS_RATE * c * voxReady * (1 - 0.2 * Math.min(1.5, Q.migration_learned || 0)) * voxRoom(Q);
    voxFlow(Q, vox);
    // ...and, once it has broken through, on the national question, whatever
    // the general mood: what carried it from 0.2% to 15% in 2018-19 under a
    // PSOE government that had calmed most of the rest
    if (voxOn(Q)) {
      voxFlow(Q, VOX_NATIONAL_RATE * nationalQuestion(Q) * voxRoom(Q));
    }
    // above its ceiling, Vox's newest voters drift back to the PP
    if (voxNow > voxCeiling(Q)) {
      var over = (voxNow - voxCeiling(Q)) / voxNow;
      transfer(Q, 'vox', { pp: 0.8, cs: 0.1, psoe: 0.1 }, share(Q, 'vox', Math.min(0.15, 0.3 * over)));
    }
    // Podemos too, to a smaller extent
    // after 2016 Podemos is in decline: chaos feeds it far less
    var up = 0.3 * c * (Q.year >= 2017 ? 0.3 : 1);
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
    } else if (!Q.acting && Q.cs_supports_pp && Q.pm_party === 'pp') {
      transfer(Q, 'cs', { pp: 0.7, vox: 0.3 }, all(0.04));   // propping up the PP costs a little
    }
    // the Catalan crisis: anti-independence voters rally to Ciudadanos
    if (Q.catalan_crisis) {
      transfer(Q, 'pp', 'cs', { professionals: 0.4, self_employed: 0.3, pensioners: 0.2, workers: 0.25, students: 0.3 });
      transfer(Q, 'psoe', 'cs', { professionals: 0.12, workers: 0.08 });
    }
    // after the Catalan crisis, Ciudadanos becomes the anti-independence
    // party of the moment and drains a governing PP for months (late 2017 -
    // mid 2018, Arrimadas's win in Catalonia)
    if (Q.cat_crisis_seen && Q.pm_party === 'pp' && !Q.acting && !Q.cs_collapsed) {
      Q.cs_surge_months = (Q.cs_surge_months || 0) + 1;
      if (Q.cs_surge_months <= 10) {
        transfer(Q, 'pp', { cs: 0.85, vox: 0.15 }, all(0.3));
      }
    }
    // Feijóo (from 2022): a moderate, winning PP leader pulls back Cs's last
    // voters and many who had left for Vox, for over a year
    if (Q.pp_leader === 'Alberto Núñez Feijóo' && Q.pm_party !== 'pp') {
      Q.feijoo_months = (Q.feijoo_months || 0) + 1;
      if (Q.feijoo_months <= 16) {
        transfer(Q, 'vox', 'pp', all(0.35));
        transfer(Q, 'cs', 'pp', all(0.25));
      }
    }
    // a newly re-invested government gets a stability bounce (late 2016)
    if (Q.pm_party === 'pp' && !Q.acting && (Q.govt_months || 0) >= 1 && Q.govt_months <= 6 && Q.year >= 2016) {
      transfer(Q, 'cs', 'pp', all(0.12));
      transfer(Q, 'psoe', 'pp', all(0.05));
    }
    var voxPoll = (Q.true_poll && Q.true_poll.vox) || 0;
    if (Q.year >= 2019 && voxPoll >= 5) {
      transfer(Q, 'cs', { pp: 0.7, vox: 0.3 }, all(0.012 * voxPoll));
    }
    // Podemos's internal strife slowly erodes it from 2017
    if (Q.year >= 2017) {
      transfer(Q, 'up', { psoe: 0.6, iu: 0.15, mp: 0.25 }, share(Q, 'up', 0.011));
    }
    // when things calm down, Vox's protest voters drift back to the PP -
    // but not to a PP that governs with the socialists
    if (Q.chaos < VOX_CALM && voxPoll > 3 && !(Q.grand_coalition && !Q.acting)) {
      transfer(Q, 'vox', 'pp', share(Q, 'vox', VOX_CALM_RATE * (VOX_CALM - Q.chaos) / 10));
    }
    // the economy judges the government: unemployment above its
    // historical level costs the governing party
    var gov = Q.pm_party;
    if (!Q.acting && gov && Q.unemp_adj > 1 && Q.vm.classSupport.workers[gov] !== undefined) {
      var to = gov === 'pp' ? { psoe: 0.5, vox: 0.3, cs: 0.2 } : { pp: 0.5, vox: 0.3, up: 0.2 };
      transfer(Q, gov, to, all(0.025 * (Q.unemp_adj - 1)));
    }
  }

  // ------------------------------------------------------------------
  // Vox. Before its breakthrough it is a fringe party (0.2% in 2015, no
  // seats anywhere) and the game does not treat it as a force: events and
  // choices only name it once `vox_on` is set.
  // ------------------------------------------------------------------
  function voxOn(Q) {
    return !!(Q.vox_breakthrough || ((Q.congress && Q.congress.vox) || 0) > 0 ||
      ((Q.true_poll && Q.true_poll.vox) || 0) >= 3);
  }

  // Vox's growth slows as it nears its ceiling: about a fifth of the vote
  // normally, a third while a grand coalition leaves it as the only
  // opposition on the right.
  var VOX_CEILING = 21;
  var VOX_CHAOS_RATE = 0.5;
  var VOX_CEILING_GRAND = 34;
  // Vox's room grows beyond history under: a hard-left PSOE in power or a
  // grand coalition, years of chaos in Catalonia, an ultraprogressive
  // social course, a PSOE of European integration or plurinational
  // federalism. If it becomes the main party of the right, the sky opens.
  function voxCeiling(Q) {
    if (Q.right_dominant === 'vox') { return 42; }
    var leftGov = Q.psoe_in_government && !Q.acting && !Q.grand_coalition;
    var c = Q.grand_coalition && !Q.acting ? VOX_CEILING_GRAND : VOX_CEILING;
    var extra = (leftGov && (Q.econ_left || 0) > 6 ? 3 : 0) + Math.min(3, Math.max(0, (Q.cat_crisis_months || 0) - 24) / 12) +
      (leftGov && (Q.social_prog || 0) > 5 ? 2 : 0) + ((Q.eu_line_eff || 0) >= 3 ? 1.5 : 0) + ((Q.const_line_eff || 0) >= 3 ? 2 : 0);
    return c + Math.min(8, extra);
  }
  function voxRoom(Q) {
    var now = (Q.true_poll && Q.true_poll.vox) || 0;
    return Math.max(0, 1 - now / voxCeiling(Q));
  }

  // Move `x` (support points in a fully reached class) to Vox: mostly from
  // the PP and Ciudadanos, a little from the PSOE's older and working-class
  // voters.
  function voxFlow(Q, x) {
    if (!(x > 0)) {
      return;
    }
    transfer(Q, 'pp', 'vox', { pensioners: x * 0.45, self_employed: x * 0.6, workers: x * 0.35,
                              professionals: x * 0.35, homemakers: x * 0.4, unemployed: x * 0.3 });
    transfer(Q, 'cs', 'vox', { self_employed: x * 0.45, workers: x * 0.35, professionals: x * 0.3,
                              students: x * 0.25, unemployed: x * 0.3 });
    transfer(Q, 'psoe', 'vox', { workers: x * 0.2, pensioners: x * 0.15, unemployed: x * 0.2 });
  }

  // The national question, in rough monthly units: the Catalan conflict, a
  // left-wing government that relies on the independence parties, dialogue
  // and pardons, a progressive social course in government, and migration.
  var VOX_NATIONAL_RATE = 0.12;
  // Below this level of chaos Vox's protest voters drift back to the PP
  // (VOX_CALM_RATE of its vote a month for every ten points of calm).
  var VOX_CALM = 25;
  var VOX_CALM_RATE = 0.012;
  function nationalQuestion(Q) {
    var leftGov = !Q.acting && !Q.grand_coalition &&
      (Q.psoe_in_government || Q.pm_party === 'up' || Q.pm_party === 'ps');
    var catalan = Math.min(30, Q.cat_tension || 0) / 10 + (Q.catalan_crisis ? 1.5 : 0);
    var separatists = leftGov && Q.depends_on_catalans ? 1.2 : 0;
    var dialogue = leftGov ? 0.35 * Math.min(4, Q.cat_dialogue || 0) + (Q.pardons_granted ? 0.6 : 0) : 0;
    var progressive = leftGov ? 0.15 * Math.max(0, (Q.social_prog || 0) - 1) : 0;
    // the Danish lesson (Frederiksen) takes some of the migration issue from Vox
    var migration = Math.max(0, yearOf(MIGRATION_BY_YEAR, Q.year) + (Q.migration || 0) - 3) / 4 *
      (1 - 0.2 * Math.min(1.5, Q.migration_learned || 0));
    var hardLeft = leftGov && (Q.econ_left || 0) > 6 ? 0.8 : 0;
    var grand = Q.grand_coalition && !Q.acting ? 1 : 0;
    var longCrisis = Math.min(0.8, Math.max(0, (Q.cat_crisis_months || 0) - 24) / 30);
    var lines = ((Q.eu_line_eff || 0) >= 3 ? 0.3 : 0) + ((Q.const_line_eff || 0) >= 3 ? 0.4 : 0);
    return catalan + separatists + dialogue + progressive + migration + 0.6 * (hardLeft + grand) + longCrisis + lines;
  }

  // Vox fills Vistalegre (October 2018). The surge feeds on the Catalan
  // crisis, on dialogue the right calls weakness and on a PP convicted of
  // corruption; a hard line in Catalonia takes some of the wind out of it.
  // Used by the event and by tools/replay_history.js.
  var VOX_RALLY_BASE = 4;
  function voxRally(Q) {
    var push = Math.max(2, VOX_RALLY_BASE + 2 * Math.min(2, Q.cat_dialogue || 0) - (Q.cat_hard_line || 0) +
      ((Q.pp_scandal || 0) >= 3 ? 2 : 0));
    Q.vox_push = push;
    Q.vox_rise_seen = 1;
    partyRel(Q, 'pp', 'vox', 10);
    partyRel(Q, 'cs', 'vox', 5);
    campaign(Q, 'vox', { self_employed: push + 3, pensioners: push - 1, workers: push, homemakers: push - 1,
                         professionals: push - 2, unemployed: push - 1, students: push - 2 });
    campaign(Q, 'pp', { self_employed: -2, pensioners: -1 });
    recalculate(Q);
    return push;
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
  // Public mood: persistent random swings between parties (an AR(1) per
  // party, zero-sum), so polls drift for months the way real ones do,
  // rather than sitting flat between events.
  var MOOD = { persist: 0.9, sigma: 0.35, fadeUp: 0.025, fadeDown: 0.01, baseFollow: 0.04 };
  function moodShocks(Q) {
    // the June 2016 election is calibrated to the real result: moods start after it
    if (Q.no_mood || Q.year < 2016 || (Q.year === 2016 && Q.month < 7)) { return; }
    // (Vox has its own drivers and ceiling: no mood swings for it)
    var parties = ['pp', 'psoe', 'up', 'cs'];
    Q.mood = Q.mood || {};
    // the mood is a level that wanders and returns (AR(1)); each month the
    // change in it moves voters, so swings come and go rather than pile up
    var d = {};
    parties.forEach(function (p) {
      var old = Q.mood[p] || 0;
      Q.mood[p] = MOOD.persist * old + MOOD.sigma * gaussian();
      d[p] = Q.mood[p] - old;
    });
    var mean = parties.reduce(function (a, p) { return a + d[p]; }, 0) / parties.length;
    var pos = {}, posSum = 0;
    parties.forEach(function (p) { d[p] -= mean; if (d[p] > 0) { pos[p] = d[p]; posSum += d[p]; } });
    if (!posSum) { return; }
    var all = function (x) { var o = {}; VoteModel.CLASSES.forEach(function (c) { o[c] = x; }); return o; };
    parties.forEach(function (p) {
      if (d[p] < 0) {
        var to = {};
        Object.keys(pos).forEach(function (q) { to[q] = pos[q] / posSum; });
        transfer(Q, p, to, all(-d[p]));
      }
    });
  }

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
        transfer(Q, 'up', 'psoe', all(0.1));
        transfer(Q, 'cs', 'psoe', all(0.05));
      }
      transfer(Q, 'psoe', { pp: 0.4, up: 0.25, cs: 0.15, vox: 0.2 }, all(0.06));
    } else if (Q.pm_party === 'pp' && !Q.acting) {
      // a governing PP is worn down faster the more its corruption is in the news
      transfer(Q, 'pp', { psoe: 0.35, cs: 0.3, vox: 0.25, up: 0.1 }, all(0.15 + 0.05 * Math.min(4, Q.pp_scandal || 0)));
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
    'germany:nahles': 'Socialist Left reassured; PP relations cool',
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
  // 2014 European election vote shares (Ministry of the Interior)
  var EP_2014_SHARES = { pp: 26.1, psoe: 23.0, iu: 10.0, up: 8.0, upyd: 6.5, junts: 5.4, erc: 4.0, cs: 3.2, bildu: 2.1, compromis: 1.9 };
  var EP_2014 = { pp: 16, psoe: 14, iu: 6, up: 5, upyd: 4, junts: 2, pnv: 1, erc: 2, cs: 2, bildu: 1, compromis: 1 };

  function europeanElection(Q) {
    var shares = JSON.parse(JSON.stringify(Q.true_poll || {}));
    Q.ep_prev_shares = Q.ep_shares || EP_2014_SHARES;
    Q.ep_final_poll = JSON.parse(JSON.stringify(Q.poll || {}));
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
    Q.senate_majority = '';
    Object.keys(senate).forEach(function (k) { if (senate[k] > Q.senate_total / 2) { Q.senate_majority = k; } });
    Q.senate_pp_majority = Q.senate_majority === 'pp' ? 1 : 0;
    Q.senate_psoe = senate.psoe || 0; Q.senate_pp = senate.pp || 0;
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

  // The Catalan crisis ends only when three things hold: direct rule from
  // Madrid has been applied (Article 155), Catalonia has a government that
  // is not hard-line independentist (not led by Junts, without the CUP),
  // and the street protests have died down.
  function catalanCrisisState(Q, monthly) {
    if (!Q.catalan_crisis) { Q.cat_can_end = 0; return; }
    if (Q.cat_protest === undefined || (!Q.cat_protest_init)) { Q.cat_protest = 70; Q.cat_protest_init = 1; }
    if (monthly) {
      Q.cat_protest *= 0.93;
      // the Supreme Court sentence, October 2019: Tsunami Democràtic
      if (Q.year === 2019 && Q.month === 10 && !Q.cat_sentence_seen) { Q.cat_sentence_seen = 1; Q.cat_protest += 35; Q.cat_tension = (Q.cat_tension || 0) + 8; }
      // dialogue and pardons calm the street; a hard line inflames it
      Q.cat_protest += 0.6 * (Q.cat_hard_line || 0) - 0.8 * Math.min(3, Q.cat_dialogue || 0) - (Q.pardons_granted ? 1.5 : 0);
      Q.cat_protest = clamp(Q.cat_protest, 0, 100);
    }
    if ((Q.cat_crisis_stage || 0) >= 3) { Q.direct_rule = 1; }
    var g = Q.regions && Q.regions['Cataluña'] && Q.regions['Cataluña'].government;
    var cab = g ? (g.cabinet || [g.party]) : ['junts'];
    var hard = !g || g.party === 'junts' || g.party === 'jxsi' || cab.indexOf('cup') !== -1;
    Q.cat_gov_moderate = hard ? 0 : 1;
    Q.cat_protest_word = Q.cat_protest >= 50 ? 'mass mobilisation' : (Q.cat_protest >= 25 ? 'regular protests' : (Q.cat_protest >= 12 ? 'occasional protests' : 'quiet'));
    Q.cat_can_end = Q.direct_rule && Q.cat_gov_moderate && Q.cat_protest < 12 && (Q.cat_crisis_stage || 0) >= 4 ? 1 : 0;
  }
  // A Catalan election that produces no government: the first repeat helps
  // Ciudadanos on the unionist side; if it keeps happening, Vox gains.
  function catalanRepeat(Q) {
    Q.cat_repeats = (Q.cat_repeats || 0) + 1; Q.cat_repeat_due = 1;
    Q.cat_protest = (Q.cat_protest || 0) + 10;
    Q.cat_tension = (Q.cat_tension || 0) + 4;
    if (!Q.vm) { return; }
    if (Q.cat_repeats <= 1) {
      regionalMod(Q, 'Cataluña', 'cs', 1.12);
      transfer(Q, 'pp', { cs: 1 }, { professionals: 0.4, self_employed: 0.3 });
    } else {
      regionalMod(Q, 'Cataluña', 'vox', 1.25);
      regionalMod(Q, 'Cataluña', 'cs', 0.95);
      transfer(Q, 'cs', { vox: 0.7, pp: 0.3 }, { pensioners: 0.4, self_employed: 0.4, workers: 0.2 });
      voxFlow(Q, 0.5 * Q.cat_repeats);
    }
  }

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
      Q.censure_time = Q.time;
      Q.censure_budget_seen = 0;
      // a government born of the censure owes its majority to whoever voted
      // for it: in June 2018, ERC, PDeCAT and Bildu
      if (Parliament.dependsOnIndependentists(Q.congress, Parliament.stancesForCensure(Q))) {
        Q.depends_on_catalans = 1;
      }
      // the new Prime Minister's bounce (June 2018): left voters come home
      transfer(Q, 'up', { psoe: 1 }, { workers: 2, students: 2, unemployed: 2, professionals: 1.5, pensioners: 1, homemakers: 1 });
      transfer(Q, 'cs', { psoe: 1 }, { professionals: 0.8, workers: 0.5 });
      if ((Q.pp_scandal || 0) >= 3) {
        // a party thrown out of government for corruption: its voters scatter
        transfer(Q, 'pp', { cs: 0.4, vox: 0.3, psoe: 0.3 },
          { pensioners: 3, professionals: 4, self_employed: 3.5, workers: 2.5, homemakers: 3, students: 2.5, unemployed: 2.5 });
      }
    }
    recalculate(Q);
    return v;
  }

  // Budget vote for a PSOE government.
  function holdBudget(Q) {
    var v = Parliament.count(Q.congress, Parliament.stancesForBudget(Q));
    Q.inv_yes = v.yes; Q.inv_no = v.no; Q.inv_abstain = v.abstain;
    Q.budget_passed = v.yes > v.no ? 1 : 0;
    if (!Q.budget_passed) {
      // losing the budget is a major humiliation for any government
      var all = function (x) { var o = {}; VoteModel.CLASSES.forEach(function (c) { o[c] = x; }); return o; };
      campaign(Q, Q.pm_party || 'psoe', all(-1.2));
      Q.sanchez_authority -= 6;
    }
    Q.budget_deals = {};
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
    // September 2016: once a third election looms because the PSOE keeps
    // saying no, the barons move against its leader
    if (Q.third_election_threat && Q.acting && Q.sanchez_leader && !Q.rebellion_used &&
        Q.formation_weeks >= (Q.threat_week || 10)) {
      // September 2016: Sánchez must choose a road (event three_roads);
      // whichever he takes, the barons now have their case
      Q.three_roads_due = 1;
      Q.third_election_threat = 0;
    }
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
    // The level that campaign effects fade towards is itself carried slowly
    // by lasting shifts (Podemos voters coming home, the PP's collapse), so
    // a quick bounce fades while a sustained change becomes structural.
    if (!Q.vm.baseline) {
      Q.vm.baseline = VoteModel.initialState().classSupport;
    }
    var initial = Q.vm.baseline;
    Object.keys(Q.vm.classSupport).forEach(function (c) {
      ['psoe', 'pp', 'cs'].forEach(function (p) {
        var cur = Q.vm.classSupport[c][p];
        var rate = cur > initial[c][p] ? MOOD.fadeUp : MOOD.fadeDown;
        // Ciudadanos's losses are permanent once its bubble bursts
        if (p === 'cs' && cur < initial[c][p] && Q.year >= 2016) {
          rate = 0;
        }
        Q.vm.classSupport[c][p] = cur + (initial[c][p] - cur) * rate;
        initial[c][p] += (Q.vm.classSupport[c][p] - initial[c][p]) * MOOD.baseFollow;
      });
      // a new party without roots loses support unless it keeps campaigning
      if (Q.vm.classSupport[c].ps) {
        Q.vm.classSupport[c].ps *= 0.985;
      }
    });
    Q.campaign_fatigue = (Q.campaign_fatigue || 0) * 0.75;
    positionDrift(Q);
    lineDrift(Q);
    rightRealignment(Q);
    if (Q.pm === 'Pedro Sánchez') { Q.pm_months = (Q.pm_months || 0) + 1; }
    incumbencyWear(Q);
    moodShocks(Q);
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
    if (((Q.year === 2019 && Q.month === 5) || (Q.year === 2024 && Q.month === 6)) && Q.ep_held !== Q.year) {
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
      Q.investiture_clock = formationClock(Q);
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
      if (Q.up_successor) { return Q.up_successor; }
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
    // a PP government (by majority or with Cs) while Sánchez's leadership
    // has never been confirmed in a primary of his own: the critics move
    if ((candidate === 'pp' || candidate === 'cs') && Q.sanchez_leader && !Q.mandate_renewed && !Q.rebellion_used) {
      Q.plot = Math.max(Q.plot || 0, 82);
      Q.pp_govt_trigger = 1;
    }
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
      var csJoins = (Q.player_party === 'cs' && Q.player_line_right === 'coalition') ||
        (Q.pact_pp_cs && Parliament.between(Q, 'cs', 'pp') >= 65);
      Q.cs_supports_pp = Q.pact_pp_cs && !csJoins ? 1 : 0;
      if (vox > (Q.congress.pp || 0)) {
        // Vox is the larger party of the right: Abascal leads the government
        Q.pm = 'Santiago Abascal';
        Q.pm_party = 'vox';
        Q.govt_parties = (Q.congress.vox || 0) >= 176 ? ['vox'] : ['vox', 'pp'];
        Q.government_type = Q.govt_parties.length > 1 ? 'Vox–PP coalition government' : 'Vox majority government';
        Q.loss_reason = 'Vox leads a government of the right with a majority in Congress. ' +
          'There is no route back to government for the left before the end of the period.';
      } else if (csJoins && cs >= 20) {
        Q.govt_parties = ['pp', 'cs'];
        Q.government_type = 'PP–Ciudadanos coalition government';
      } else if (vox >= 15 && (Q.pp_vox_relation || 50) >= 60 && (Q.congress.pp || 0) + cs < 176) {
        Q.govt_parties = ['pp', 'vox'];
        Q.government_type = 'PP–Vox coalition government';
      } else {
        Q.govt_parties = ['pp'];
        Q.government_type = (Q.congress.pp || 0) >= 176 ? 'PP majority government'
          : (Q.cs_supports_pp && cs >= 20 ? 'PP minority government with Ciudadanos support' : 'PP minority government');
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
  // March-May 2021: Iglesias leaves. Who succeeds him depends on where
  // Podemos stands and how it gets on with the PSOE.
  function iglesiasSuccessor(Q) {
    var inGovt = (Q.govt_parties || []).indexOf('up') !== -1 && !Q.acting;
    var rel = Q.rel_up === undefined ? 40 : Q.rel_up;
    var poll = (Q.true_poll && Q.true_poll.up) || 12;
    if (inGovt && rel >= 45) { return 'Yolanda Díaz'; }
    if (rel < 30 || poll < 8) { return 'Irene Montero'; }
    if (!inGovt && poll >= 12) { return 'Ione Belarra'; }
    return Math.random() < 0.6 ? 'Yolanda Díaz' : 'Ione Belarra';
  }

  // Weeks to automatic dissolution (art. 99.5: two months from the first
  // vote). The first vote rarely comes before the parties have spent about
  // two months negotiating (March 2016, August 2016, July 2019, September
  // 2023), so an early vote does not bring the deadline forward.
  function formationClock(Q) {
    return 8 + Math.max(0, 8 - (Q.formation_weeks || 0));
  }

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
    // Ciudadanos could have let the PSOE govern just by abstaining, and
    // refused (Rivera, 2019): its voters punish it hard, and the blame is its
    var seats = Q.congress;
    var leftYes = ['psoe', 'up', 'iu', 'mp', 'compromis', 'pnv', 'cc', 'prc', 'te', 'bng', 'nc', 'geroa']
      .reduce(function (n, p) { return n + (seats[p] || 0); }, 0);
    var csSeats = seats.cs || 0;
    var restNo = 350 - leftYes - csSeats;
    Q.cs_blocked = (!Q.pact_cs && Q.year >= 2018 && (Q.rel_cs || 45) < 50 && csSeats >= 15 &&
      leftYes > restNo && leftYes <= restNo + csSeats) ? 1 : 0;
    if (Q.cs_blocked) {
      transfer(Q, 'cs', { pp: 0.45, vox: 0.3, psoe: 0.25 }, all(4));
      Q.formation_blame = 'cs';
    }
    if (Q.formation_blame === 'psoe') {
      transfer(Q, 'psoe', { up: 0.4, cs: 0.3, pp: 0.3 }, all(1.8));
      Q.sanchez_authority -= 6;
    } else if (Q.formation_blame !== 'cs') {
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
  // Top vote shares (%) in each ballot district, for the map tooltips:
  // [[party, %, seats], ...]. With `seats` ({district: {party: seats}}),
  // every list that won a seat is included even outside the top five.
  function districtShares(ballots, top, seats) {
    var out = {};
    Object.keys(ballots).forEach(function (d) {
      var total = 0;
      var won = (seats && seats[d]) || null;
      var lists = ballots[d].lists.map(function (l) {
        var id = Array.isArray(l) ? l[0] : l.id;
        var v = Array.isArray(l) ? l[2] : l.votes;
        total += v;
        return [id, v];
      });
      lists.sort(function (a, b) { return b[1] - a[1]; });
      out[d] = lists.filter(function (l, i) { return (i < (top || 5) && l[1] > 0) || (won && won[l[0]] > 0); })
        .map(function (l) {
          var row = [l[0], Math.round(1000 * l[1] / total) / 10];
          if (won) {
            row.push(won[l[0]] || 0);
          }
          return row;
        });
    });
    return out;
  }

  // Seats elected in each district: {district: n}.
  function districtMagnitudes(seats) {
    var out = {};
    Object.keys(seats || {}).forEach(function (d) {
      out[d] = Object.keys(seats[d]).reduce(function (n, id) { return n + seats[d][id]; }, 0);
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
    Q.cortes_history = Q.cortes_history || [];
    // no fixed campaign cost: the party spends what it chooses in the
    // final campaign
    // the previous general election's winners, to mark provinces that flip
    Q.prev_general_winners = Q.general_winners ||
      provinceWinners(DATA.elections['2011'].provinces);
    Q.map_winners = provinceWinners(r.ballots);
    Q.general_winners = Q.map_winners;
    Q.map_prev_winners = Q.prev_general_winners;
    Q.map_shares = districtShares(r.ballots, 5, r.districts);
    Q.map_magnitude = districtMagnitudes(r.districts);
    Q.map_scope = {};
    Q.map_kind = 'general';
    Q.map_title = 'General election, ' + Q.month + '/' + Q.year;
    Q.election_records.push({ date: Q.year + '-' + Q.month, seats: r.totals });
    Q.senate_elected = senateElected(r.ballots);
    Q.prov_base = {};
    Object.keys(r.ballots).forEach(function (pr) {
      var o = {}, sum = 0;
      r.ballots[pr].lists.forEach(function (l) { var id = Array.isArray(l) ? l[0] : l.id, v = Array.isArray(l) ? l[2] : l.votes; if (!/^x:/.test(id)) { o[id] = (o[id] || 0) + v; sum += v; } });
      Object.keys(o).forEach(function (k) { o[k] = Math.round(1000 * o[k] / sum) / 10; });
      Q.prov_base[pr] = o;
    });
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
    Q.third_election_threat = 0;
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
    Q.cortes_history.push({ date: Q.year + '-' + (Q.month < 10 ? '0' : '') + Q.month, seats: JSON.parse(JSON.stringify(r.totals)) });
    var swing = (r.totals.psoe || 0) - (old.psoe || 0);
    // bad results arm the barons
    if (Q.sanchez_leader) {
      if (swing < 0) { Q.plot = (Q.plot || 0) + 1.0 * -swing; }
      var ps = r.totals.psoe || 0;
      Q.plot = (Q.plot || 0) + (ps < 90 ? 20 : (ps < 100 ? 10 : 0));
      if (swing > 0) { Q.plot = Math.max(0, (Q.plot || 0) - swing); }
    }
    Q.sanchez_authority += swing / 2;
    Q.member_morale += swing / 2;
    // three defeats in a short time: even the members lose faith
    if (Q.sanchez_leader) {
      var psoeFirst = (r.totals.psoe || 0) >= Math.max(r.totals.pp || 0, r.totals.up || 0, r.totals.cs || 0);
      Q.loss_times = (Q.loss_times || []).filter(function (t) { return Q.time - t <= 36; });
      if (!psoeFirst) { Q.loss_times.push(Q.time); }
      if (Q.loss_times.length >= 3 && !Q.three_losses) {
        Q.three_losses = 1;
        Q.sanchismo -= 25; Q.member_morale -= 20; Q.sanchez_authority -= 20;
        Q.plot = Math.max(Q.plot || 0, 85);
      }
    }
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
    // Pro-independence parties govern only with each other: no mainstream
    // party (least of all Cs) will prop them up. Without a majority of
    // their own the bloc cannot invest anyone: a repeat election.
    var INDEP = ['jxsi', 'junts', 'erc', 'cup', 'bildu'];
    var catIndep = ['jxsi', 'junts', 'erc', 'cup'];
    if (INDEP.indexOf(party) !== -1) {
      bloc = party === 'bildu' ? ['bildu', 'pnv', 'up', 'iu'] : catIndep;
      if (sum(bloc) < majority) {
        // the unionist side may still find a majority of its own
        // (the Comuns back neither side)
        var others = Object.keys(seats).filter(function (id) { return INDEP.indexOf(id) === -1 && id !== 'up'; });
        var otherLeader = bySize(others)[0];
        if (otherLeader && sum(others) >= majority && party !== 'bildu') {
          party = otherLeader;
          bloc = others;
        } else {
          return { president: previous ? previous.president : UI.partyName(party) + ' president', party: previous ? previous.party : party,
                   cabinet: previous ? previous.cabinet : [party], support: previous ? previous.support : [], type: 'Caretaker: no majority, repeat election',
                   repeat: true };
        }
      }
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
    var indepLed = INDEP.indexOf(party) !== -1;
    bySize(bloc.concat(party === 'pp' ? ['vox'] : [])).forEach(function (id) {
      if (id === party || count >= majority) {
        return;
      }
      // unionist and independence parties do not prop each other up
      if (!indepLed && catIndep.indexOf(id) !== -1 && ['pp', 'cs', 'vox', 'psoe'].indexOf(party) !== -1) {
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
    var cupNeeded = indepLed && support.indexOf('cup') !== -1;
    if (cupNeeded && /Mas/.test(president)) {
      // the CUP will not invest Artur Mas: a unity candidate is found (January 2016)
      president = 'Carles Puigdemont';
    }
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
      if (gov.repeat) {
        // no investiture possible: a repeat election about four months on
        var d4 = addMonths(+date.slice(0, 4), +date.slice(5, 7), 4);
        reg.nextElection = d4[0] + '-' + (d4[1] < 10 ? '0' : '') + d4[1] + '-' + date.slice(8, 10);
        reg.lastWasSnap = true;
        Q.regional_deadlock = region;
        Q.regional_deadlock_due = 1;
        if (region === 'Cataluña' && Q.catalan_crisis) { catalanRepeat(Q); }
      }
      var dw = {};
      var byDistrict = provinceWinners(ballots);
      Object.keys(byDistrict).forEach(function (d) { dw[districtToProvince(d)] = byDistrict[d]; });
      var ds = {};
      var dm = {};
      var sharesByDistrict = districtShares(ballots, 5, r.districts);
      var mags = districtMagnitudes(r.districts);
      Object.keys(sharesByDistrict).forEach(function (d) {
        ds[districtToProvince(d)] = sharesByDistrict[d];
        dm[districtToProvince(d)] = mags[d];
      });
      results.push({ region: region, districtWinners: dw, districtShares: ds, districtSeats: dm, seats: r.totals, shares: shares, prevSeats: reg.prevSeats,
                     prevShares: reg.prevShares, government: gov, psoeLost: psoeLost, psoeWon: psoeWon });
    });
    Q.regional_elections_due = [];
    Q.has_regional_elections = 0;
    // the PP governing with Vox (in cabinet or on its votes) in several regions
    var withVox = Object.keys(Q.regions || {}).filter(function (r) {
      var g = Q.regions[r].government;
      return g && g.party === 'pp' && (g.cabinet.indexOf('vox') !== -1 || g.support.indexOf('vox') !== -1);
    });
    Q.pp_vox_regions = withVox.length;
    Q.pp_vox_region_names = withVox.join(', ');
    // (the snap election itself is offered after a poor municipal night: localElections)
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
      var mapMagnitude = {};
      var mapScope = {};
      results.forEach(function (res) {
        // provinces that are not themselves districts (islands, Asturias's
        // districts) show the whole parliament
        var regionSeats = Object.keys(res.seats).reduce(function (n, id) { return n + res.seats[id]; }, 0);
        var regionTop = Object.keys(res.shares).sort(function (a, b) { return res.shares[b] - res.shares[a]; })
          .filter(function (id, i) { return i < 5 || (res.seats[id] || 0) > 0; })
          .map(function (id) { return [id, Math.round(res.shares[id] * 10) / 10, res.seats[id] || 0]; });
        provs[res.region].forEach(function (p) {
          if (res.districtShares[p]) {
            mapShares[p] = res.districtShares[p];
            mapMagnitude[p] = res.districtSeats[p];
          } else {
            mapShares[p] = regionTop;
            mapMagnitude[p] = regionSeats;
            mapScope[p] = res.region;
          }
        });
      });
      Q.map_shares = mapShares;
      Q.map_magnitude = mapMagnitude;
      Q.map_scope = mapScope;
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
    // while the first attempt to form a government is still open, the barons
    // wait to see how it ends (December 2015 - June 2016): they strike when
    // a repeat election has failed or the formation is over
    // nor do they strike in the middle of an election campaign
    if ((Q.acting && (Q.fatigue || 0) === 0 && !Q.election_year) || Q.election_year) {
      Q.plot = Math.min(Q.plot, 55);
    }
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
    Q.comeback_ready = (Q.backbench && (Q.comeback_forced || (Q.time - (Q.backbench_since || Q.time) >= 12 &&
      Q.time >= (Q.comeback_next || 0) &&
      ((Q.psoe_ai_swing || 0) < 0 || ((Q.true_poll && Q.true_poll.psoe) || 0) < 22)))) ? 1 : 0;
    Q.network = clamp(Q.network || 0, 0, 100);
    Q.war_chest = Math.max(0, Q.war_chest || 0);
    Q.rel_leadership = clamp(Q.rel_leadership === undefined ? 40 : Q.rel_leadership, 0, 100);
    Q.network_word = Q.network < 15 ? 'A handful of loyalists' : (Q.network < 35 ? 'Organising' : (Q.network < 60 ? 'A real network' : 'A movement'));
    Q.leadership_word = UI.word('relation', Q.rel_leadership);
    Q.comeback_bonus = Math.round(comebackBonus(Q));
    // out of the leadership (and not leading a party of his own), Sánchez
    // spends his personal resources, not the party's
    Q.personal_mode = !Q.sanchez_leader && !Q.exiled ? 1 : 0;
    Q.war_chest_display = Math.round((Q.war_chest || 0) * 10) / 10;
    Q.spendable = Q.personal_mode ? (Q.war_chest || 0) : Q.funds;
    Q.spend_name = Q.personal_mode ? 'personal resources' : 'party funds';
    Q.sanchez_moderniser = isModerniser(Q);
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
  // The comeback campaign's resources: the organised network, the barons
  // won over and the war chest; a hostile leadership mobilises against him.
  function comebackBonus(Q) {
    return Math.min(12, (Q.network || 0) / 7) + 2.5 * Math.min(3, Q.baron_allies || 0) + Math.min(4, (Q.war_chest || 0) / 2) -
      Math.max(0, (40 - (Q.rel_leadership === undefined ? 40 : Q.rel_leadership)) / 10);
  }

  // Is Sánchez running as a moderniser? His closest faction is the
  // modernisers and his economic line is centrist.
  function isModerniser(Q) {
    var m = Q.modernisers_dissent === undefined ? 5 : Q.modernisers_dissent;
    return (m <= (Q.progressives_dissent || 0) && m <= (Q.trade_unionists_dissent || 0) &&
      (Q.econ_left || 0) <= 2) ? 1 : 0;
  }

  // The 2017 primary. Historically Díaz, Sánchez and Patxi López. If
  // Sánchez runs as a moderniser, López backs him (Q.lopez_endorses: 1
  // endorsed, 0 stayed out) and a progressive, José Antonio Pérez Tapias,
  // runs on his left instead. Díaz always runs.
  function comebackPrimary(Q) {
    var x = (Q.member_morale || 50) + (Q.sanchismo || 20) / 2;
    // a contest against the whole apparatus: enthusiasm has diminishing
    // returns and the campaign needs money of its own
    var s = clamp(42 + 12 * Math.tanh((x - 75) / 30) + (Q.rig_bonus || 0) + 0.6 * comebackBonus(Q) - ((Q.war_chest || 0) < 2 ? 3 : 0) - (Q.three_losses ? 8 : 0) - ((Q.members_lost || 0) - 6.5) + 5 * gaussian(), 15, 75);
    var lopez = clamp(10 + 4 * (Math.random() - 0.5), 5, 15);
    var tapias = 0;
    Q.primary_moderniser = Q.lopez_decided ? 1 : 0;
    if (Q.primary_moderniser) {
      // López's voters follow his endorsement, or split
      s += lopez * (Q.lopez_endorses ? 0.7 : 0.5);
      tapias = clamp(4 + (Q.progressives_dissent || 20) / 6 + 3 * (Math.random() - 0.5), 4, 16);
      s -= tapias * 0.8;
      lopez = 0;
    }
    Q.primary_sanchez = Math.round(s * 10) / 10;
    Q.primary_lopez = Math.round(lopez * 10) / 10;
    Q.primary_tapias = Math.round(tapias * 10) / 10;
    Q.primary_diaz = Math.round((100 - s - lopez - tapias) * 10) / 10;
    Q.primary_won = Q.primary_sanchez > Q.primary_diaz ? 1 : 0;
    return Q.primary_won;
  }


  // ------------------------------------------------------------------
  // PSOE leadership races (2017): endorsements and the primary, run as
  // elections by province on the party's membership.
  // ------------------------------------------------------------------
  var CANDIDATES = {
    c_sanchez: ['Pedro Sánchez', 'Sánchez', '#E30613'], c_diaz: ['Susana Díaz', 'Díaz', '#F28C00'],
    c_lopez: ['Patxi López', 'López', '#1E8A3E'], c_tapias: ['José Antonio Pérez Tapias', 'Pérez Tapias', '#E2C33C'],
    c_madina: ['Eduardo Madina', 'Madina', '#6A5ACD']
  };
  Object.keys(CANDIDATES).forEach(function (k) { UI.addMeta(k, CANDIDATES[k][0], CANDIDATES[k][1], CANDIDATES[k][2]); });
  // members by federation (2017, about 188,000 in all)
  var MEMBERS = { 'Andalucía': 46500, 'Comunidad Valenciana': 19000, 'Madrid': 16500, 'Castilla-La Mancha': 14000,
    'Cataluña': 11500, 'Castilla y León': 10500, 'Extremadura': 9500, 'Galicia': 9500, 'Canarias': 7500,
    'Asturias': 7000, 'Aragón': 6500, 'País Vasco': 6500, 'Región de Murcia': 6000, 'Baleares': 3500,
    'Cantabria': 2800, 'Navarra': 2300, 'La Rioja': 1900, 'Ceuta': 400, 'Melilla': 400 };
  // how each province leans, as a multiplier on a candidate's national share
  var LEAN = {
    c_diaz: { 'Sevilla': 1.55, 'Jaén': 1.6, 'Córdoba': 1.5, 'Huelva': 1.5, 'Cádiz': 1.35, 'Granada': 1.4, 'Málaga': 1.25, 'Almería': 1.35,
      'Badajoz': 1.3, 'Cáceres': 1.15, 'Ciudad Real': 1.3, 'Toledo': 1.2, 'Cuenca': 1.25, 'Albacete': 1.15, 'Guadalajara': 1.0,
      'Huesca': 1.25, 'Zaragoza': 1.0, 'Teruel': 1.05, 'Asturias': 1.0, 'Murcia': 0.95, 'Madrid': 0.85,
      'Barcelona': 0.55, 'Girona': 0.55, 'Lleida': 0.6, 'Tarragona': 0.6, 'Baleares': 0.7, 'Bizkaia': 0.7, 'Gipuzkoa': 0.7, 'Araba': 0.75,
      _default: 0.85 },
    c_lopez: { 'Bizkaia': 7.5, 'Gipuzkoa': 7, 'Araba': 4.5, 'Navarra': 1.4, 'Cantabria': 1.2, 'La Rioja': 1.1, _default: 0.9 },
    c_tapias: { 'Madrid': 1.3, 'Barcelona': 1.2, 'Granada': 1.3, _default: 1 },
    c_sanchez: { _default: 1 },
    // 2014: Madina carried the north, the Basque Country, Catalonia, Madrid and the west
    c_madina: (function () {
      var o = { _default: 0.8 };
      ['A Coruña', 'Lugo', 'Ourense', 'Asturias', 'León', 'Palencia', 'Burgos', 'Soria', 'Bizkaia', 'Gipuzkoa', 'Araba', 'Navarra',
       'La Rioja', 'Huesca', 'Barcelona', 'Girona', 'Lleida', 'Zamora', 'Salamanca', 'Valladolid', 'Segovia', 'Ávila', 'Madrid',
       'Cáceres', 'Badajoz', 'Ceuta'].forEach(function (p) { o[p] = 1.45; });
      ['Sevilla', 'Jaén', 'Córdoba', 'Huelva', 'Cádiz', 'Granada', 'Málaga', 'Almería'].forEach(function (p) { o[p] = 0.5; });
      return o;
    })()
  };
  function provinceList() {
    var data = lib('SPAIN_ELECTION_DATA', 'election_data.js');
    var out = [];
    Object.keys(MEMBERS).forEach(function (r) {
      var provs = (data && data.regions && data.regions[r]) || [r];
      provs.forEach(function (p) { out.push([p, r, MEMBERS[r] / provs.length]); });
    });
    return out;
  }
  // National target shares {cand: %} -> province results whose
  // member-weighted national total matches the target.
  function raceByProvince(target) {
    var provs = provinceList();
    var cands = Object.keys(target).filter(function (c) { return target[c] > 0; });
    var adj = {};
    cands.forEach(function (c) { adj[c] = 1; });
    var res;
    for (var it = 0; it < 6; it++) {
      res = {};
      var nat = {}, tot = 0;
      cands.forEach(function (c) { nat[c] = 0; });
      provs.forEach(function (pr) {
        var raw = {}, sum = 0;
        cands.forEach(function (c) {
          var l = LEAN[c][pr[0]] !== undefined ? LEAN[c][pr[0]] : LEAN[c]._default;
          raw[c] = target[c] * l * adj[c]; sum += raw[c];
        });
        cands.forEach(function (c) { raw[c] = 100 * raw[c] / sum; nat[c] += raw[c] * pr[2]; });
        tot += pr[2];
        res[pr[0]] = raw;
      });
      cands.forEach(function (c) { adj[c] *= target[c] / (nat[c] / tot); });
    }
    var winners = {}, shares = {};
    Object.keys(res).forEach(function (p) {
      var list = cands.map(function (c) { return [c, res[p][c]]; }).sort(function (a, b) { return b[1] - a[1]; });
      winners[p] = list[0][0];
      shares[p] = list;
    });
    return { winners: winners, shares: shares };
  }
  var MEMBERSHIP = 187949;
  // The endorsements (avales), 20 April - 4 May 2017: each candidate needs
  // 5% of the membership. The apparatus collects them better than it wins votes.
  function primaryEndorsements(Q) {
    var t = primaryTargets(Q);
    var e = {}, sum = 0;
    Object.keys(t).forEach(function (c) {
      // the federations' apparatus collects signatures far better than it
      // wins secret ballots; the stronger the barons, the bigger the gap
      var app = 12 + 0.15 * Math.max(0, (Q.regional_leaders_strength || 30) - 25);
      e[c] = Math.max(0.5, t[c] + (c === 'c_diaz' ? app : (c === 'c_sanchez' ? -0.8 * app : (c === 'c_lopez' ? -0.5 : -1.5))));
      sum += e[c];
    });
    var gathered = Math.round(MEMBERSHIP * (0.62 + 0.06 * Math.random()));
    var valid = Math.round(gathered * 0.93);
    var need = Math.ceil(MEMBERSHIP * 0.05);
    Q.av_rows = Object.keys(e).map(function (c) {
      var share = 100 * e[c] / sum;
      return { id: c, valid: Math.round(valid * share / 100), share: Math.round(share * 10) / 10 };
    }).sort(function (a, b) { return b.valid - a.valid; });
    Q.av_gathered = gathered; Q.av_valid = valid; Q.av_need = need;
    Q.av_out = Q.av_rows.filter(function (r) { return r.valid < need; }).map(function (r) { return r.id; });
    Q.tapias_out = Q.av_out.indexOf('c_tapias') !== -1 ? 1 : 0;
    var map = raceByProvince(e);
    Q.av_winners = map.winners; Q.av_shares = map.shares;
    Q.av_leader = CANDIDATES[Q.av_rows[0].id][0];
    Q.endorsements_done = 1;
  }
  // Published polls of the race: the pollsters sample the apparatus and the
  // older, loyal members, so they overrate the establishment candidate.
  // stage 'signatures' polls the endorsements, 'vote' the ballot.
  function primaryPoll(Q, stage) {
    var t = primaryTargets(Q), est = 'c_diaz';
    var bias = stage === 'signatures' ? 22 : 9;
    var p = {}, sum = 0;
    Object.keys(t).forEach(function (c) {
      var v = t[c] * (1 + 0.08 * gaussian());
      if (c === est) { v += bias; } else if (c === 'c_sanchez') { v -= bias * 0.6; } else { v -= bias * 0.2; }
      p[c] = Math.max(1, v); sum += p[c];
    });
    var rows = Object.keys(p).map(function (c) { return [c, Math.round(1000 * p[c] / sum) / 10]; }).sort(function (a, b) { return b[1] - a[1]; });
    Q['ppoll_raw_' + stage] = {}; rows.forEach(function (r) { Q['ppoll_raw_' + stage][r[0]] = r[1]; });
    Q['ppoll_' + stage] = rows.map(function (r) { return CANDIDATES[r[0]][0] + ' ' + r[1].toFixed(1) + '%'; }).join(', ');
    return rows;
  }
  // National vote targets for the primary, before endorsements.
  function primaryTargets(Q) {
    // one draw of the members' mood per race: the endorsements and the vote share it
    if (!Q.pr_base) {
      comebackPrimary(Q);
      Q.pr_base = [Q.primary_sanchez, Q.primary_diaz, Q.primary_lopez, Q.primary_tapias];
    }
    Q.primary_sanchez = Q.pr_base[0]; Q.primary_diaz = Q.pr_base[1]; Q.primary_lopez = Q.pr_base[2]; Q.primary_tapias = Q.pr_base[3];
    var t = { c_sanchez: Q.primary_sanchez, c_diaz: Q.primary_diaz };
    if (Q.primary_lopez > 0) { t.c_lopez = Q.primary_lopez; }
    if (Q.primary_tapias > 0) { t.c_tapias = Q.primary_tapias; }
    if (Q.sanchez_backs_lopez) {
      // Sánchez stands down for López: most of his members follow
      t = { c_lopez: (Q.primary_lopez || 10) + Q.primary_sanchez * (Q.sanchez_backs_lopez === 2 ? 0.8 : 0.7),
            c_diaz: Q.primary_diaz + Q.primary_sanchez * (Q.sanchez_backs_lopez === 2 ? 0.2 : 0.3) };
    }
    return t;
  }
  // The vote, 21 May 2017. Uses the endorsement round's field.
  function primaryVote(Q) {
    var t = primaryTargets(Q);
    (Q.av_out || []).forEach(function (c) {
      // a candidate without enough endorsements is off the ballot
      var v = t[c] || 0; delete t[c];
      if (t.c_sanchez !== undefined) { t.c_sanchez += v * 0.7; t.c_diaz += v * 0.3; } else { t.c_diaz += v; }
    });
    var sum = 0;
    Object.keys(t).forEach(function (c) { sum += t[c]; });
    Q.pv_rows = Object.keys(t).map(function (c) {
      return { id: c, share: Math.round(1000 * t[c] / sum) / 10, votes: Math.round(MEMBERSHIP * 0.795 * t[c] / sum) };
    }).sort(function (a, b) { return b.share - a.share; });
    var map = raceByProvince(t);
    Q.pv_winners = map.winners; Q.pv_shares = map.shares;
    Q.pv_winner = Q.pv_rows[0].id;
    Q.pv_winner_name = CANDIDATES[Q.pv_winner][0];
    Q.primary_sanchez = t.c_sanchez ? Math.round(1000 * t.c_sanchez / sum) / 10 : 0;
    Q.primary_diaz = Math.round(1000 * t.c_diaz / sum) / 10;
    Q.primary_lopez = t.c_lopez ? Math.round(1000 * t.c_lopez / sum) / 10 : 0;
    Q.primary_tapias = t.c_tapias ? Math.round(1000 * t.c_tapias / sum) / 10 : 0;
    Q.primary_won = Q.pv_winner === 'c_sanchez' ? 1 : 0;
    if (Q.primary_won) { leadershipBounce(Q, Q.primary_sanchez); }
    Q.lopez_won = Q.pv_winner === 'c_lopez' ? 1 : 0;
    return Q.primary_won;
  }
  function raceTable(rows, valueKey, valueLabel) {
    return '<table class="sp-results"><thead><tr><th>Candidate</th><th class="sp-num">' + valueLabel +
      '</th><th class="sp-num">%</th></tr></thead><tbody>' + rows.map(function (r) {
        return '<tr><td><span class="sp-swatch" style="background:' + CANDIDATES[r.id][2] + '"></span>' + CANDIDATES[r.id][0] +
          '</td><td class="sp-num">' + r[valueKey].toLocaleString('en-GB') + '</td><td class="sp-num"><b>' + r.share.toFixed(1) + '%</b></td></tr>';
      }).join('') + '</tbody></table>';
  }
  function renderEndorsements(Q, id) {
    var out = el(id);
    if (!out || !Q.av_rows) { return; }
    out.innerHTML = raceTable(Q.av_rows, 'valid', 'Valid endorsements') +
      '<p class="sp-map-legend">Gathered ' + Q.av_gathered.toLocaleString('en-GB') + ' of ' + MEMBERSHIP.toLocaleString('en-GB') +
      ' members (' + (100 * Q.av_gathered / MEMBERSHIP).toFixed(1) + '%); ' + Q.av_valid.toLocaleString('en-GB') + ' valid. Needed to stand: ' +
      Q.av_need.toLocaleString('en-GB') + ' (5% of the membership).</p><div id="' + id + '-map"></div>';
    UI.drawMap(el(id + '-map'), Q.av_winners, 'Most endorsements by province', { shares: Q.av_shares, outlines: 'light' });
  }
  // July 2014 primary: official results by autonomous community (PSOE, via Wikipedia);
  // province winners from the official province results map.
  var R2014 = {"Andalucía": {"electorate": 48858, "turnout": 70.24, "s": [20843, 61.2], "m": [7846, 23.04], "t": [5366, 15.76]}, "Aragón": {"electorate": 9020, "turnout": 69.43, "s": [3507, 56.46], "m": [1905, 30.67], "t": [800, 12.88]}, "Asturias": {"electorate": 8589, "turnout": 65.08, "s": [1868, 33.76], "m": [2579, 46.61], "t": [1086, 19.63]}, "Baleares": {"electorate": 2734, "turnout": 66.61, "s": [796, 44.25], "m": [763, 42.41], "t": [240, 13.34]}, "País Vasco": {"electorate": 5103, "turnout": 68.82, "s": [1748, 50.19], "m": [1205, 34.6], "t": [530, 15.22]}, "Canarias": {"electorate": 6507, "turnout": 69.13, "s": [2386, 53.59], "m": [1441, 32.37], "t": [625, 14.04]}, "Cantabria": {"electorate": 3251, "turnout": 71.09, "s": [910, 39.72], "m": [1051, 45.88], "t": [330, 14.4]}, "Castilla y León": {"electorate": 10418, "turnout": 72.05, "s": [2912, 39.13], "m": [3437, 46.19], "t": [1092, 14.68]}, "Castilla-La Mancha": {"electorate": 12479, "turnout": 74.68, "s": [4316, 46.62], "m": [3816, 41.22], "t": [1125, 12.15]}, "Cataluña": {"electorate": 20658, "turnout": 47.87, "s": [3648, 37.37], "m": [3946, 40.42], "t": [2168, 22.21]}, "Ceuta": {"electorate": 189, "turnout": 58.2, "s": [35, 32.41], "m": [49, 45.37], "t": [24, 22.22]}, "Extremadura": {"electorate": 10003, "turnout": 75.49, "s": [2885, 38.43], "m": [3829, 51.01], "t": [793, 10.56]}, "Galicia": {"electorate": 11550, "turnout": 69.06, "s": [3946, 50.01], "m": [3059, 38.77], "t": [886, 11.23]}, "La Rioja": {"electorate": 1263, "turnout": 76.56, "s": [443, 46.19], "m": [345, 35.97], "t": [171, 17.83]}, "Madrid": {"electorate": 15883, "turnout": 65.07, "s": [4359, 42.66], "m": [3973, 38.88], "t": [1886, 18.46]}, "Melilla": {"electorate": 285, "turnout": 63.16, "s": [91, 51.12], "m": [66, 37.08], "t": [21, 11.8]}, "Región de Murcia": {"electorate": 6155, "turnout": 72.04, "s": [2048, 46.44], "m": [1780, 40.36], "t": [582, 13.2]}, "Navarra": {"electorate": 1673, "turnout": 73.64, "s": [485, 39.62], "m": [582, 47.55], "t": [157, 12.83]}, "Comunidad Valenciana": {"electorate": 18351, "turnout": 77.44, "s": [6420, 45.42], "m": [5811, 41.11], "t": [1903, 13.46]}};
  var R2014_MADINA = ["Lugo", "Ourense", "Pontevedra", "Asturias", "Cantabria", "León", "Palencia", "Zamora", "Salamanca", "Valladolid", "Ávila", "Segovia", "Burgos", "Navarra", "Gipuzkoa", "Araba", "Barcelona", "Girona", "Lleida", "Cáceres", "Badajoz", "Toledo", "Ceuta"];

  function race2014(Q) {
    var data = lib('SPAIN_ELECTION_DATA', 'election_data.js');
    var winners = {}, shares = {}, regWinners = {}, regShares = {};
    Object.keys(R2014).forEach(function (r) {
      var d = R2014[r];
      var list = [['c_sanchez', d.s[1]], ['c_madina', d.m[1]], ['c_tapias', d.t[1]]].sort(function (a, b) { return b[1] - a[1]; });
      var provs = (data && data.regions && data.regions[r]) || [r];
      provs.forEach(function (p) {
        regWinners[p] = list[0][0];
        regShares[p] = list;
        winners[p] = R2014_MADINA.indexOf(p) !== -1 ? 'c_madina' : 'c_sanchez';
        shares[p] = list;
      });
    });
    Q.r14_winners = winners; Q.r14_shares = shares; Q.r14_reg_winners = regWinners; Q.r14_reg_shares = regShares;
    Q.r14_rows = [{ id: 'c_sanchez', share: 48.3, votes: 64116 }, { id: 'c_madina', share: 36.0, votes: 47750 },
      { id: 'c_tapias', share: 15.0, votes: 19869 }];
  }
  function render2014(Q, id, mode) {
    var out = el(id);
    if (!out) { return; }
    if (!Q.r14_rows) { race2014(Q); }
    mode = mode || 'province';
    // polls of PSOE voters (Wikipedia, "2014 PSOE leadership election"),
    // shares among the three candidates, undecided excluded: the first
    // Metroscopia poll with the final field (16-17 Jun) and the last poll
    // (Sigma Dos, 8-10 Jul)
    var norm = function (m, s, t) { var k = m + s + t; return { c_madina: 100 * m / k, c_sanchez: 100 * s / k, c_tapias: 100 * t / k }; };
    var p0 = norm(43.0, 24.0, 6.0), p1 = norm(34.8, 31.5, 10.6), res = { c_sanchez: 48.3, c_madina: 36.0, c_tapias: 15.0 };
    var pc = pollChangeTable(['c_sanchez', 'c_madina', 'c_tapias'].map(function (c) {
      return { name: CANDIDATES[c][0], colour: CANDIDATES[c][2], start: p0[c], end: p1[c], result: res[c] };
    }), 'Start of the race', 'How the polls moved during the race') +
      '<p class="sp-map-legend">Polls of PSOE voters, not members, as shares of those naming one of the three candidates. Start: Metroscopia/El País, 16–17 June (sample 159). Final: Sigma Dos/El Mundo, 8–10 July (sample 500). Nearly every poll of the campaign had Madina ahead; only one Sigma Dos poll (30 June–3 July) put Sánchez first.</p>';
    out.innerHTML = raceTable(Q.r14_rows, 'votes', 'Votes') +
      '<p class="sp-map-legend">198,123 members registered; 132,850 voted (67.1%). Ratified by the Extraordinary Congress, 26–27 July.</p>' + pc +
      '<p class="sp-map-legend"><label><input type="radio" name="' + id + '-mode" value="province"' + (mode === 'province' ? ' checked' : '') + '> Province results map</label> ' +
      '<label><input type="radio" name="' + id + '-mode" value="region"' + (mode === 'region' ? ' checked' : '') + '> Autonomous community results map</label></p>' +
      '<div id="' + id + '-map"></div>';
    UI.drawMap(el(id + '-map'), mode === 'region' ? Q.r14_reg_winners : Q.r14_winners,
      mode === 'region' ? 'Winner by autonomous community' : 'Winner by province',
      { shares: Q.r14_reg_shares, outlines: mode === 'region' ? 'bold' : 'light' });
    Array.prototype.forEach.call(out.querySelectorAll('input[name="' + id + '-mode"]'), function (inp) {
      inp.addEventListener('change', function () { render2014(Q, id, inp.value); });
    });
  }

  // End of game: every Congress the game produced, side by side.
  function renderCortesHistory(Q, id) {
    var out = el(id);
    var h = Q.cortes_history || [];
    if (!out || !h.length) { return; }
    var parties = {};
    h.forEach(function (e) { Object.keys(e.seats).forEach(function (p) { if (e.seats[p] > 0) { parties[p] = Math.max(parties[p] || 0, e.seats[p]); } }); });
    var ids = Object.keys(parties).sort(function (a, b) { return parties[b] - parties[a]; });
    out.innerHTML = '<table class="sp-results"><thead><tr><th>Party</th>' + h.map(function (e) { return '<th class="sp-num">' + e.date + '</th>'; }).join('') +
      '</tr></thead><tbody>' + ids.map(function (p) {
        return '<tr><td><span class="sp-swatch" style="background:' + UI.partyColor(p) + '"></span>' + UI.shortName(p) + '</td>' +
          h.map(function (e) { return '<td class="sp-num">' + (e.seats[p] || '–') + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
  }
  function renderLocal(Q, id) {
    var out = el(id);
    if (!out || !Q.local_seats) { return; }
    var t = {}; Object.keys(Q.local_seats).forEach(function (p) { if (p !== 'ind') { t[p] = Q.local_seats[p]; } });
    out.innerHTML = UI.resultsTable(t, null, { prevSeats: Q.local_prev ? (function () { var o = {}; Object.keys(Q.local_prev).forEach(function (p) { if (p !== 'ind') { o[p] = Q.local_prev[p]; } }); return o; })() : null, compact: true }) +
      '<p class="sp-map-legend">Independents and local lists: ' + Q.local_seats.ind.toLocaleString('en-GB') + ' councillors. About ' + LOCAL_COUNCILLORS.toLocaleString('en-GB') + ' in all.</p>';
  }

  // Wikipedia-style representation bars, in the party's colour.
  function renderRepresentation(Q, id) {
    var out = el(id);
    if (!out) { return; }
    var colour = UI.partyColor(Q.player_party || 'psoe');
    var rows = [['Congress of Deputies', Q.rep_congress, 350], ['Senate', Q.rep_senate, Q.senate_total],
      ['European Parliament', Q.rep_ep, Q.ep_total], ['Regional parliaments', Q.rep_regional, Q.rep_regional_total],
      ['Regional governments', Q.rep_presidencies, Q.rep_regions], ['Local government', Q.rep_local, Q.rep_local_total]];
    out.innerHTML = '<table class="sp-rep">' + rows.filter(function (r) { return r[2] > 0; }).map(function (r) {
      var v = r[1] || 0, pct = Math.min(100, 100 * v / r[2]);
      return '<tr><th>' + r[0] + '</th><td><div class="sp-rep-num">' + v.toLocaleString('en-GB') + ' / ' + r[2].toLocaleString('en-GB') +
        '</div><div class="sp-rep-bar"><span style="width:' + pct.toFixed(1) + '%;background:' + colour + '"></span></div></td></tr>';
    }).join('') + '</table>' +
      (Q.rep_in_regional_govt ? '<p class="sp-map-legend">In government in ' + Q.rep_in_regional_govt + ' regions.</p>' : '');
  }


  // ------------------------------------------------------------------
  // Legislation. A government bill goes to Congress; ordinary laws need
  // more yes than no, organic laws an absolute majority (176). A passed
  // law can be expanded or repealed, never passed again.
  // stance lists: who votes yes / no regardless; others by relation.
  // ------------------------------------------------------------------
  var LAWS = {
    imv: { name: 'Minimum Living Income', organic: 0, from: 2018, yes: ['up', 'iu', 'mp', 'erc', 'bildu', 'pnv', 'bng', 'cc', 'nc', 'prc', 'te', 'compromis', 'cs'], no: [],
      text: 'A guaranteed income for the poorest households, paid by Social Security.',
      effect: { workers: 1, unemployed: 2.5, homemakers: 1 }, econ: [-0.05, 0], social: 3, line: [0.5, 0], partnerHate: [] },
    euthanasia: { name: 'Euthanasia Law', organic: 1, from: 2018, yes: ['up', 'iu', 'mp', 'erc', 'bildu', 'pnv', 'cs', 'bng', 'compromis', 'nc', 'junts'], no: ['pp', 'vox', 'upn'],
      text: 'The right to a medically assisted death, with safeguards.', effect: { students: 1, professionals: 1, pensioners: -0.5 }, social: 1, line: [0, 1], partnerHate: [] },
    education: { name: 'Education reform (LOMLOE)', organic: 1, from: 2018, yes: ['up', 'iu', 'mp', 'erc', 'bildu', 'pnv', 'compromis', 'nc', 'bng'], no: ['pp', 'vox', 'cs', 'upn'],
      text: 'Reverses the PP\'s education law: less weight for religion and for state-funded private schools.', effect: { professionals: 0.6, students: 0.8, self_employed: -0.6 }, social: 1, line: [0.3, 1], partnerHate: ['cs'] },
    memory: { name: 'Democratic Memory Law', organic: 0, from: 2018, yes: ['up', 'iu', 'mp', 'pnv', 'bildu', 'compromis'], no: ['pp', 'vox', 'cs', 'upn', 'junts', 'cup'],
      text: 'State-led exhumations, a DNA bank, Franco-era sentences annulled.', effect: { students: 0.8, workers: 0.4, pensioners: -0.4 }, social: 0, line: [0, 0.8], partnerHate: ['cs'] },
    consent: { name: 'Only Yes Means Yes', organic: 1, from: 2019, yes: ['up', 'iu', 'mp', 'erc', 'bildu', 'pnv', 'cs', 'compromis', 'bng', 'nc'], no: ['pp', 'vox'],
      text: 'Consent at the centre of sexual offences law.', effect: { students: 1, homemakers: 0.8 }, social: 1, line: [0, 1], partnerHate: [], risk: 'consent' },
    housing: { name: 'Housing Law', organic: 0, from: 2019, yes: ['up', 'iu', 'mp', 'erc', 'bildu', 'compromis', 'bng'], no: ['pp', 'vox', 'cs', 'junts', 'upn'],
      text: 'Rent caps in stressed areas and a public housing stock.', effect: { students: 1.5, workers: 0.8, self_employed: -1 }, econ: [-0.05, 0], social: 2, line: [1, 0], partnerHate: ['cs', 'pnv'] },
    trans: { name: 'Trans and LGBTI Rights Law', organic: 0, from: 2020, yes: ['up', 'iu', 'mp', 'erc', 'bildu', 'compromis', 'bng'], no: ['pp', 'vox'],
      text: 'Legal gender self-determination and a ban on conversion therapy.', effect: { students: 1, pensioners: -0.6, homemakers: -0.4 }, social: 0, line: [0, 1.5], partnerHate: [], split: 'progressives' },
    animal: { name: 'Animal Welfare Law', organic: 0, from: 2020, yes: ['up', 'iu', 'mp', 'erc', 'bildu', 'compromis'], no: ['pp', 'vox', 'upn'],
      text: 'New protections for pets, and a fight over hunting dogs.', effect: { students: 0.6, professionals: 0.3, self_employed: -0.5 }, social: 0, line: [0, 0.5], partnerHate: [], split: 'regional_leaders' },
    wealth: { name: 'Solidarity tax on large fortunes', organic: 0, from: 2019, yes: ['up', 'iu', 'mp', 'erc', 'bildu', 'compromis', 'bng'], no: ['pp', 'vox', 'cs', 'junts', 'upn', 'pnv'],
      text: 'A temporary tax on fortunes above three million euros.', effect: { workers: 1, unemployed: 0.8, self_employed: -1.2, professionals: -0.6 }, fiscal: -0.1, line: [1.2, 0], partnerHate: ['cs'] },
    amnesty: { name: 'Amnesty Law', organic: 1, from: 2023, yes: ['up', 'erc', 'junts', 'bildu', 'pnv', 'bng', 'cup'], no: ['pp', 'vox', 'cs', 'upn', 'cc'],
      text: 'An amnesty for everyone prosecuted over the Catalan independence process.', effect: { pensioners: -1.5, self_employed: -1.2, professionals: -0.6 }, social: 0, line: [0, 0], cat: 2, partnerHate: ['cs'], vox: 3 }
  };
  function lawStances(Q, id, repeal) {
    var L = LAWS[id], st = {};
    Object.keys(Q.congress || {}).forEach(function (p) {
      if (p === 'psoe' || (Q.govt_parties || []).indexOf(p) !== -1) { st[p] = 'yes'; }
      else if (L.yes.indexOf(p) !== -1) { st[p] = 'yes'; }
      else if (L.no.indexOf(p) !== -1) { st[p] = 'no'; }
      else {
        var r = Q['rel_' + p] === undefined ? 40 : Q['rel_' + p];
        st[p] = r >= 60 ? 'yes' : (r >= 40 ? 'abstain' : 'no');
      }
      if (repeal) { st[p] = st[p] === 'yes' ? 'no' : (st[p] === 'no' ? 'yes' : 'abstain'); st.psoe = 'yes'; }
    });
    // a partner that hates the bill votes no, and the coalition creaks
    (L.partnerHate || []).forEach(function (p) { if ((Q.govt_parties || []).indexOf(p) !== -1 && !repeal) { st[p] = 'no'; } });
    return st;
  }
  // kind: 'pass' | 'expand' | 'repeal'. Returns the tally.
  function voteLaw(Q, id, kind) {
    var L = LAWS[id];
    var v = Parliament.count(Q.congress, lawStances(Q, id, kind === 'repeal'));
    var passes = L.organic && kind !== 'repeal' ? v.yes >= 176 : v.yes > v.no;
    Q.law_yes = v.yes; Q.law_no = v.no; Q.law_abstain = v.abstain; Q.law_name = L.name; Q.law_passed_now = passes ? 1 : 0;
    Q.law_partner_split = 0;
    var all = function (x) { var o = {}; VoteModel.CLASSES.forEach(function (c) { o[c] = x; }); return o; };
    var f = kind === 'expand' ? 0.6 : (kind === 'repeal' ? -1 : 1);
    if (passes) {
      Q['law_' + id] = kind === 'repeal' ? -1 : (kind === 'expand' ? 2 : 1);
      var eff = {};
      Object.keys(L.effect).forEach(function (c) { eff[c] = L.effect[c] * f; });
      campaign(Q, 'psoe', eff);
      if (L.social) { social(Q, L.social * f); }
      if (L.econ) { econ(Q, L.econ[0] * f, L.econ[1] * f); }
      if (L.fiscal) { Q.fiscal_adj += L.fiscal * f; }
      if (L.line) { position(Q, L.line[0] * f, L.line[1] * f); }
      if (L.cat) { Q.cat_dialogue = (Q.cat_dialogue || 0) + L.cat * f; }
      if (L.vox && f > 0) { voxFlow(Q, L.vox * 0.3); }
      if (L.split) { Q[L.split + '_dissent'] += 4 * f; }
      Q.laws_passed = (Q.laws_passed || 0) + (kind === 'pass' ? 1 : 0);
    } else {
      // a lost vote: a small embarrassment for the government
      campaign(Q, 'psoe', all(-0.25));
      Q.sanchez_authority -= 2;
    }
    // partners who were overruled or who voted against show the cracks
    (Q.govt_parties || []).forEach(function (p) {
      if (p !== 'psoe' && (L.partnerHate || []).indexOf(p) !== -1 && kind !== 'repeal') {
        Q['rel_' + p] = (Q['rel_' + p] || 40) - 8; Q.coalition_strain = (Q.coalition_strain || 0) + 1; Q.law_partner_split = 1;
      }
    });
    Q.law_timer = 2;
    recalculate(Q);
    return v;
  }
  // In opposition: dare the government to vote down a popular bill.
  function dareBill(Q) {
    var all = function (x) { var o = {}; VoteModel.CLASSES.forEach(function (c) { o[c] = x; }); return o; };
    var govNo = (Q.congress[Q.pm_party] || 0);
    var others = 350 - govNo - (Q.congress.vox || 0);
    Q.dare_passed = others > govNo + (Q.congress.vox || 0) && Math.random() < 0.5 ? 1 : 0;
    if (Q.dare_passed) { campaign(Q, 'psoe', all(0.5)); campaign(Q, Q.pm_party, all(-0.4)); Q.member_morale += 3; }
    else { campaign(Q, 'psoe', all(0.25)); campaign(Q, Q.pm_party, all(-0.2)); }
    recalculate(Q);
  }
  // A concession bought for a party's budget vote. Costs are paid at once.
  function budgetDeal(Q, p) {
    Q.budget_deals = Q.budget_deals || {};
    Q.budget_deals[p] = 1;
    Q['rel_' + p] = (Q['rel_' + p] || 40) + 5;
    recalculate(Q);
  }
  function lawFlags(Q) {
    Q.budget_deals = Q.budget_deals || {};
    Object.keys(Q.congress || {}).forEach(function (p) { Q['seats_' + p] = Q.congress[p]; });
    ['pnv', 'erc', 'junts', 'bildu', 'cc', 'up', 'cs', 'prc', 'te', 'bng', 'compromis'].forEach(function (p) {
      Q['bdeal_' + p] = Q.budget_deals[p] ? 1 : 0;
      if (Q['seats_' + p] === undefined) { Q['seats_' + p] = 0; }
    });
    Object.keys(LAWS).forEach(function (id) {
      var st = Q['law_' + id] || 0;
      Q['law_can_' + id] = st === 0 && Q.year >= LAWS[id].from ? 1 : 0;
      Q['law_canx_' + id] = st === 1 ? 1 : 0;
      Q['law_canr_' + id] = st >= 1 ? 1 : 0;
      if (Q.congress) {
        var v = Parliament.count(Q.congress, lawStances(Q, id, false));
        Q['law_odds_' + id] = v.yes + '–' + v.no + (LAWS[id].organic ? ' (organic: needs 176)' : '');
      }
    });
  }

  function renderPrimary(Q, id) {
    var out = el(id);
    if (!out || !Q.pv_rows) { return; }
    out.innerHTML = raceTable(Q.pv_rows, 'votes', 'Votes') +
      '<p class="sp-map-legend">Turnout about 79.5% of ' + MEMBERSHIP.toLocaleString('en-GB') + ' members.</p><div id="' + id + '-map"></div>';
    UI.drawMap(el(id + '-map'), Q.pv_winners, 'Winner by province (hover for shares)', { shares: Q.pv_shares, outlines: 'light' });
  }

  // A convincing leadership win brings voters back: the bigger the margin
  // over 40%, the bigger the bounce (Sánchez's 50% in 2017 was worth points).
  function leadershipBounce(Q, share) {
    var b = Math.max(0, (share - 40) * 0.06);
    if (!b) { return; }
    var all = function (x) { var o = {}; VoteModel.CLASSES.forEach(function (c) { o[c] = x; }); return o; };
    transfer(Q, 'up', 'psoe', all(b * 0.6));
    campaign(Q, 'psoe', all(b * 0.4));
    Q.leadership_bounce = Math.round(b * 10) / 10;
  }

  function leadershipElection(Q, bonus) {
    var score = 0.45 * Q.member_morale + 0.35 * Q.sanchismo + 0.2 * Math.max(0, Q.sanchez_authority) + (Q.rig_bonus || 0) - (Q.three_losses ? 10 : 0) - 0.8 * ((Q.members_lost || 0) - 6.5) +
      (bonus || 0) + 6 * gaussian() -
      // the apparatus: strong barons and an active plot work for the other candidate
      0.3 * Math.max(0, (Q.regional_leaders_strength || 30) - 15) - 0.08 * (Q.plot || 0);
    Q.primary_score = Math.round(score);
    var won = score >= 50 ? 1 : 0;
    Q.primary_won = won;
    if (won) { Q.mandate_renewed = 1; leadershipBounce(Q, clamp(40 + (score - 50) * 0.8, 40, 75)); }
    if (won) {
      Q.sanchez_leader = 1;
      if (Q.pm_party === 'psoe' && !Q.acting) { Q.pm = 'Pedro Sánchez'; }
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
    // a Prime Minister who loses his party hands the government to its
    // next leader (the PSOE's group backs its new candidate)
    if (Q.pm === 'Pedro Sánchez' && Q.pm_party === 'psoe') {
      Q.pm = Q.psoe_next_leader;
      Q.pm_lost_party = 1;
    }
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
    Q.exiled = 1; Q.ex_scandal_after = Q.time + 6;
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
        if (Q.psoe_stance_pp !== 'abstain') {
          // against his orders: the group has defied its leader
          Q.group_defied = 1; Q.sanchez_authority -= 20; Q.regional_leaders_dissent += 10; Q.sanchismo += 5;
        }
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
    // a caretaker committee does not make Pablo Iglesias Prime Minister
    if (candidate === 'up' && Q.psoe_interim) { st.psoe = 'no'; }
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

  // Left-wing members leave for Podemos when it is strong, leaving a more
  // moderate PSOE membership: Sánchez's members-against-the-apparatus edge
  // in leadership contests shrinks. They drift back slowly as Podemos fades
  // (and faster when it splits: Más País).
  function membersDrift(Q) {
    var up = (Q.true_poll && Q.true_poll.up) || 12;
    var target = clamp((up - 10) * 0.8, 0, 12);
    Q.members_lost = (Q.members_lost || 0) + (target - (Q.members_lost || 0)) * 0.04;
    Q.membership_word = Q.members_lost < 4 ? 'Left-leaning' : (Q.members_lost < 8 ? 'Mixed' : 'Moderate-leaning');
  }

  // A sitting grand coalition keeps bleeding at both ends: the PSOE's left
  // and the unions to Podemos; on the right, once Vox is a force, it is the
  // only opposition left and takes the PP's hard right, Ciudadanos's
  // anti-socialists and some of the PSOE's own older and working-class
  // voters, month after month (Austria's FPÖ under its grand coalitions).
  // Before Vox has broken through, the PP's discontented look to
  // Ciudadanos and a few drift to the fringe.
  var VOX_GRAND_RATE = 0.5;
  function grandCoalitionWear(Q) {
    if (!Q.grand_coalition || Q.acting) { return; }
    var all = function (x) { var o = {}; VoteModel.CLASSES.forEach(function (c) { o[c] = x; }); return o; };
    transfer(Q, 'psoe', { up: 0.85, iu: 0.15 }, all(0.2));
    if (voxOn(Q)) {
      var x = VOX_GRAND_RATE * Math.max(0.35, voxRoom(Q));
      transfer(Q, 'pp', 'vox', all(x));
      transfer(Q, 'cs', 'vox', all(0.3 * x));
      transfer(Q, 'psoe', 'vox', { workers: 0.25 * x, pensioners: 0.2 * x, unemployed: 0.25 * x });
    } else {
      transfer(Q, 'pp', { cs: 0.6, vox: 0.4 }, all(0.12));
    }
    Q.progressives_dissent += 1.5; Q.trade_unionists_dissent += 1.5;
    Q.member_morale -= 0.5;
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
    // whether Vox is already a force decides who the PP's hard right turns to
    Q.grand_vox = voxOn(Q) ? 1 : 0;
    if (Q.grand_accepted) {
      Q.investiture_votes += 1;
      formGovernment(Q, 'grand');
      // the PSOE's left-wing voters and members do not forgive it
      transfer(Q, 'psoe', { up: 0.8, iu: 0.1, mp: 0.1 }, { workers: 4, students: 5, unemployed: 4, professionals: 3, pensioners: 1 });
      // the PP's hard right sees a pact with the socialists as treason
      if (Q.grand_vox) {
        transfer(Q, 'pp', { vox: 0.9, cs: 0.1 }, { self_employed: 8, pensioners: 4.5, homemakers: 5, professionals: 3.5,
                                                 workers: 3, unemployed: 2.5, students: 2 });
        transfer(Q, 'cs', 'vox', { self_employed: 2, workers: 1.5, professionals: 1, students: 1 });
        Q.rel_vox = (Q.rel_vox || 0) - 10;
      } else {
        // no party of the hard right to go to yet: Ciudadanos, or home
        transfer(Q, 'pp', 'cs', { self_employed: 3, pensioners: 1.5, homemakers: 1.5, professionals: 2, workers: 1 });
        shiftSupport(Q, 'pp', { self_employed: -1.5, pensioners: -1, homemakers: -1.5, workers: -0.5 });
      }
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
      Q.investiture_clock = formationClock(Q);
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
        return (list || []).map(function (p) { return UI.regionalShort(p, r, Q.year); }).join(' + ');
      };
      detail.innerHTML = '<p class="sp-gov"><strong>' + g.president + '</strong><br>' +
        (g.type || '') + '<br>Cabinet: ' + names(g.cabinet) +
        (g.support && g.support.length ? '<br>Support: ' + names(g.support) : '') +
        '<br>Next vote: ' + reg.nextElection.slice(0, 7) + '</p>' +
        '<svg id="' + id + '-hemi" class="sp-hemicycle"></svg>' +
        UI.resultsTable(reg.seats, null, { prevSeats: reg.prevSeats, compact: true, region: r, year: Q.year });
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


  // Region vote-share map for national-constituency or local votes:
  // last general election's province results, swung to today's national
  // shares (factor: local implantation), aggregated by autonomous community.
  function regionVoteMap(Q, national, factor) {
    var D = DATA, base = Q.prov_base;
    if (!base) {
      var y = Q.year >= 2019 ? '2016' : '2015';
      base = {};
      Object.keys(D.elections[y].provinces).forEach(function (pr) {
        var b = D.elections[y].provinces[pr], o = {}, sum = 0;
        b.lists.forEach(function (l) { var id = Array.isArray(l) ? l[0] : l.id, v = Array.isArray(l) ? l[2] : l.votes; if (!/^x:/.test(id)) { o[id] = (o[id] || 0) + v; sum += v; } });
        Object.keys(o).forEach(function (k) { o[k] = 100 * o[k] / sum; });
        base[pr] = o;
      });
    }
    // national base average, for the swing ratio
    var natBase = {}, n = 0;
    Object.keys(base).forEach(function (pr) { n += 1; Object.keys(base[pr]).forEach(function (k) { natBase[k] = (natBase[k] || 0) + base[pr][k]; }); });
    Object.keys(natBase).forEach(function (k) { natBase[k] /= n; });
    var winners = {}, shares = {};
    Object.keys(D.regions).forEach(function (r) {
      var agg = {}, provs = D.regions[r], sum = 0;
      provs.forEach(function (pr) {
        var b = base[pr] || {};
        Object.keys(national).forEach(function (k) {
          if (/^x:/.test(k) || !(national[k] > 0.3)) { return; }
          var nb = natBase[k] || 0.5, pb = b[k] !== undefined ? b[k] : (nb > 1 ? 0.3 * nb : 0.5);
          var v = pb * national[k] / Math.max(0.5, nb) * (factor ? (factor[k] === undefined ? 0.8 : factor[k]) : 1);
          agg[k] = (agg[k] || 0) + v / provs.length;
        });
      });
      Object.keys(agg).forEach(function (k) { sum += agg[k]; });
      var list = Object.keys(agg).map(function (k) { return [k, Math.round(1000 * agg[k] / sum) / 10]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 5);
      provs.forEach(function (pr) { winners[pr] = list[0][0]; shares[pr] = list; });
    });
    return { winners: winners, shares: shares };
  }
  function renderSenate(Q, id) {
    var out = el(id);
    if (!out || !Q.senate) { return; }
    var appointed = senateAppointed(Q);
    var rows = Object.keys(Q.senate).filter(function (k) { return Q.senate[k] > 0; }).sort(function (a, b) { return Q.senate[b] - Q.senate[a]; });
    out.innerHTML = '<table class="sp-results"><thead><tr><th>Party</th><th class="sp-num">Elected</th><th class="sp-num">Appointed</th><th class="sp-num">Total</th></tr></thead><tbody>' +
      rows.map(function (k) {
        return '<tr><td><span class="sp-swatch" style="background:' + UI.partyColor(k) + '"></span>' + UI.partyName(k) + '</td><td class="sp-num">' +
          ((Q.senate_elected || {})[k] || 0) + '</td><td class="sp-num">' + (appointed[k] || 0) + '</td><td class="sp-num"><b>' + Q.senate[k] + '</b></td></tr>';
      }).join('') + '</tbody></table><p class="sp-map-legend">' + Q.senate_total + ' senators: 208 elected by limited vote in the provinces, the rest appointed by the regional parliaments. A Senate majority is ' + (Math.floor(Q.senate_total / 2) + 1) + '. ' +
      (Q.senate_majority ? UI.partyName(Q.senate_majority) + ' holds an absolute majority, and can delay every bill by two months.' : 'No party has an absolute majority.') + '</p>';
  }
  function renderEuroMap(Q, id) {
    var out = el(id);
    if (!out || !Q.ep_shares) { return; }
    var m = regionVoteMap(Q, Q.ep_shares, null);
    UI.drawMap(out, m.winners, 'European elections: first party by autonomous community (hover for vote shares)', { shares: m.shares, outlines: 'bold' });
  }
  function renderLocalMap(Q, id) {
    var out = el(id);
    if (!out || !Q.local_shares) { return; }
    var m = regionVoteMap(Q, Q.local_shares, LOCAL_FACTOR);
    UI.drawMap(out, m.winners, 'Municipal elections: first party by autonomous community (hover for vote shares)', { shares: m.shares, outlines: 'bold' });
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
      UI.drawMap(out, Q.map_winners, 'Most-voted party by province (hover for vote shares and seats)',
        { shares: Q.map_shares, magnitude: Q.map_magnitude, scope: Q.map_scope,
          outlines: Q.map_kind === 'regional' ? 'bold' : 'light',
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


  // How the polls moved between two points (the last election, or the start
  // of a race) and the final poll, beside the result.
  // rows: [{ name, colour, start, end, result }]
  function pollChangeTable(rows, startLabel, title) {
    var f = function (x) { return x === undefined || x === null ? '–' : x.toFixed(1) + '%'; };
    var d = function (a, b) {
      if (a === undefined || a === null || b === undefined || b === null) { return '–'; }
      var x = b - a, c = Math.abs(x) < 0.05 ? '' : (x > 0 ? ' style="color:#1a7f37"' : ' style="color:#b42318"');
      return '<span' + c + '>' + (x > 0 ? '+' : '') + x.toFixed(1) + '</span>';
    };
    return '<p><strong>' + title + '</strong></p><table class="sp-results"><thead><tr><th>' + 'Party' + '</th><th class="sp-num">' + startLabel +
      '</th><th class="sp-num">Final poll</th><th class="sp-num">Poll change</th><th class="sp-num">Result</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td><span class="sp-swatch" style="background:' + r.colour + '"></span>' + r.name + '</td><td class="sp-num">' + f(r.start) +
          '</td><td class="sp-num">' + f(r.end) + '</td><td class="sp-num">' + d(r.start, r.end) + '</td><td class="sp-num"><b>' + f(r.result) + '</b></td></tr>';
      }).join('') + '</tbody></table>';
  }
  function partyRows(start, end, result, min) {
    var ids = {};
    [start, end, result].forEach(function (o) { Object.keys(o || {}).forEach(function (k) { if (!/^x:/.test(k)) { ids[k] = 1; } }); });
    return Object.keys(ids).filter(function (k) { return Math.max((start || {})[k] || 0, (end || {})[k] || 0, (result || {})[k] || 0) >= (min || 1); })
      .sort(function (a, b) { return ((result || end)[b] || 0) - ((result || end)[a] || 0); })
      .map(function (k) { return { name: UI.shortName(k), colour: UI.partyColor(k), start: start ? start[k] : null, end: end ? end[k] : null, result: result ? result[k] : null }; });
  }
  function renderPollChange(Q, id, kind) {
    var out = el(id);
    if (!out) { return; }
    if (kind === 'general') {
      var start = Q.prev_vote_shares;
      if (!start) {
        start = {};
        var b = DATA.elections['2011'].provinces, tot = 0;
        Object.keys(b).forEach(function (pr) { b[pr].lists.forEach(function (l) { var id2 = Array.isArray(l) ? l[0] : l.id, v = Array.isArray(l) ? l[2] : l.votes; start[id2] = (start[id2] || 0) + v; tot += v; }); });
        Object.keys(start).forEach(function (k) { start[k] = 100 * start[k] / tot; });
      }
      out.innerHTML = pollChangeTable(partyRows(start, Q.prev_poll, Q.vote_shares, 1), 'Last election', 'How the polls moved since the last general election');
    } else if (kind === 'european') {
      out.innerHTML = pollChangeTable(partyRows(Q.ep_prev_shares || null, Q.ep_final_poll, Q.ep_shares, 1), 'Last European election', 'How the national polls moved since the last European election');
    } else if (kind === 'local') {
      out.innerHTML = pollChangeTable(partyRows(Q.local_prev_poll || null, Q.local_final_poll, null, 1), 'Last municipal election', 'How the national polls moved since the last municipal elections');
    } else if (kind === 'primary' || kind === 'endorsements') {
      var s0 = Q.ppoll_raw_signatures || {}, s1 = kind === 'primary' ? (Q.ppoll_raw_vote || {}) : {};
      var res = {};
      (kind === 'primary' ? Q.pv_rows : Q.av_rows || []).forEach(function (r) { res[r.id] = r.share; });
      var ids = Object.keys(Object.assign({}, s0, s1, res));
      out.innerHTML = pollChangeTable(ids.map(function (c) {
        return { name: CANDIDATES[c][0], colour: CANDIDATES[c][2], start: s0[c], end: s1[c], result: res[c] };
      }).sort(function (a, b) { return (b.result || 0) - (a.result || 0); }), 'Start of the race',
        kind === 'primary' ? 'How the polls moved during the race' : 'The first poll against the endorsements');
    }
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
        UI.resultsTable(res.seats, res.shares, { prevSeats: res.prevSeats, prevShares: res.prevShares, region: res.region, year: Q.year }) +
        '<p>Government: ' + res.government.president + ' (' +
        res.government.cabinet.map(function (p) { return UI.regionalName(p, res.region, Q.year); }).join(' + ') + (res.government.support.length
          ? ', with support from ' + res.government.support.map(function (p) { return UI.regionalName(p, res.region, Q.year); }).join(' and ') : '') +
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
      institutionalists: 'Institutionalists', regional_leaders: 'Regional Barons',
      progressives: 'Socialist Left', modernisers: 'Modernisers', trade_unionists: 'Unionists'
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
    resetGame: resetGame,
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
    comebackBonus: comebackBonus,
    localElections: localElections, renderLocal: renderLocal, renderCortesHistory: renderCortesHistory,
    leadershipBounce: leadershipBounce,
    MOOD: MOOD,
    hireAdviser: hireAdviser, fireAdviser: fireAdviser, advCount: advCount, ADVISERS: ADVISERS,
    regionalGovernment: regionalGovernment,
    hardcore: hardcore, darkArts: darkArts,
    membersDrift: membersDrift,
    iglesiasSuccessor: iglesiasSuccessor, podemosBrand: podemosBrand,
    primaryEndorsements: primaryEndorsements, primaryVote: primaryVote, raceByProvince: raceByProvince,
    renderEndorsements: renderEndorsements, renderRepresentation: renderRepresentation,
    voteLaw: voteLaw, renderPollChange: renderPollChange, ideologyLines: ideologyLines, lineDrift: lineDrift, rightRealignment: rightRealignment, voxCeiling: voxCeiling, catalanCrisisState: catalanCrisisState, catalanRepeat: catalanRepeat, voxFlow: voxFlow, factionMoods: factionMoods, renderSenate: renderSenate, renderEuroMap: renderEuroMap, renderLocalMap: renderLocalMap, regionVoteMap: regionVoteMap, primaryPoll: primaryPoll, budgetDeal: budgetDeal, dareBill: dareBill, LAWS: LAWS, lawStances: lawStances, renderPrimary: renderPrimary, render2014: render2014, race2014: race2014,
    isModerniser: isModerniser,
    formationClock: formationClock,
    grandCoalitionWear: grandCoalitionWear,
    voxRally: voxRally,
    voxOn: voxOn,
    nationalQuestion: nationalQuestion,
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
