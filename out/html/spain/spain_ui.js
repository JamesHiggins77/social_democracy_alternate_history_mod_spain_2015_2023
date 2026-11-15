// Display helpers for the Spanish game: party metadata, Congress hemicycle,
// results tables and the "no path to government" check.
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var VoteModel = isNode ? require('./vote_model.js') : root.SpainVoteModel;
  var RegionalModel = isNode ? require('./regional_model.js') : root.SpainRegionalModel;
  var DATA = isNode ? require('./election_data.js') : root.SPAIN_ELECTION_DATA;
  var REGIONAL = isNode ? require('./regional_data.js') : root.SPAIN_REGIONAL_DATA;

  // Left-to-right order for the hemicycle.
  var PARTIES = [
    ['cup', 'CUP', '#FFED00'], ['bildu', 'EH Bildu', '#B3A400'], ['erc', 'ERC', '#FFB232'],
    ['up', 'Podemos / UP / Sumar', '#6B2E68'], ['iu', 'IU', '#A50021'],
    ['mp', 'Más País / Compromís', '#0FDEC4'], ['bng', 'BNG', '#7FB3E0'],
    ['geroa', 'Geroa Bai', '#F75E42'], ['psoe', 'PSOE', '#E1001A'], ['pacma', 'PACMA', '#9BC400'],
    ['te', 'Teruel Existe', '#037252'], ['prc', 'PRC', '#C2CE0C'], ['nc', 'Nueva Canarias', '#9ACD32'],
    ['cc', 'Coalición Canaria', '#FFD700'], ['pnv', 'EAJ-PNV', '#008000'],
    ['junts', 'DL / CDC / Junts', '#20C0B2'], ['cs', 'Ciudadanos', '#EB6109'], ['upyd', 'UPyD', '#E9008C'],
    ['upn', 'UPN / NA+', '#2A52BE'], ['pp', 'PP', '#1D84CE'], ['vox', 'Vox', '#5AC035']
  ];
  var META = {};
  PARTIES.forEach(function (p, i) { META[p[0]] = { name: p[1], color: p[2], order: i }; });

  var MAJORITY = 176;
  // Defeat thresholds - see docs/design/00-core-rules.md §2.2.
  var PP_ALONE_LOSS_SEATS = 186;   // a clear PP majority, not a bare one
  var LARGE_MAJORITY_SEATS = 193;  // PP + Vox above 55% of 350

  function partyName(id) {
    return META[id] ? META[id].name : id.replace(/^x:/, '');
  }

  function partyColor(id) {
    return META[id] ? META[id].color : '#A0A0A0';
  }

  function sortedIds(totals) {
    return Object.keys(totals).sort(function (a, b) {
      var oa = META[a] ? META[a].order : 99;
      var ob = META[b] ? META[b].order : 99;
      return oa - ob || totals[b] - totals[a];
    });
  }

  // Defeat check from docs/design/00-core-rules.md §2.2.
  function noPathToGovernment(totals) {
    var pp = totals.pp || 0;
    var ppVox = pp + (totals.vox || 0);
    if (pp >= PP_ALONE_LOSS_SEATS) {
      return { lost: true, reason: 'The PP has a clear majority on its own (' + pp + ' seats).' };
    }
    if (pp >= MAJORITY) {
      return { lost: false, reason: 'The PP has a bare majority on its own (' + pp +
        ' seats). A few defections or a by-election could still bring it down.' };
    }
    if (ppVox >= LARGE_MAJORITY_SEATS) {
      return { lost: true, reason: 'PP and Vox hold ' + ppVox + ' seats, a majority of more than 55%.' };
    }
    if (ppVox >= MAJORITY) {
      return { lost: false, reason: 'PP and Vox hold a narrow majority (' + ppVox +
        ' seats). Their arrangement is fragile; a motion of no confidence remains possible.' };
    }
    return { lost: false, reason: 'No PP or PP–Vox majority (' + ppVox + ' seats together).' };
  }

  function resultsTable(totals, voteShares) {
    var ids = Object.keys(totals).sort(function (a, b) { return totals[b] - totals[a]; });
    var rows = ids.map(function (id) {
      var share = voteShares ? '<td class="sp-num">' +
        (voteShares[id] !== undefined ? voteShares[id].toFixed(1) + '%' : '') + '</td>' : '';
      return '<tr><td><span class="sp-swatch" style="background:' + partyColor(id) + '"></span>' +
        escapeHtml(partyName(id)) + '</td>' + share + '<td class="sp-num">' + totals[id] + '</td></tr>';
    });
    return '<table class="sp-results"><thead><tr><th>Party</th>' +
      (voteShares ? '<th class="sp-num">Votes</th>' : '') +
      '<th class="sp-num">Seats</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
  }

  function drawHemicycle(selector, totals) {
    if (!root.d3 || !root.d3.parliament) {
      return;
    }
    var el = root.document.querySelector(selector);
    if (!el) {
      return;
    }
    var container = el.parentElement || el;
    var width = Math.max(150, Math.min(500, container.offsetWidth - 10));
    el.style.height = (width / 2 + 10) + 'px';
    var data = sortedIds(totals).map(function (id) {
      return { id: id, legend: partyName(id), name: partyName(id), seats: totals[id], color: partyColor(id) };
    });
    var parliament = root.d3.parliament();
    parliament.width(width).height(width).innerRadiusCoef(0.4);
    // no grow-in animation: the sidebar redraws on every update
    parliament.enter.fromCenter(false).smallToBig(false);
    root.d3.select(selector).datum(data).call(parliament);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ---------------------------------------------------------------------
  // Election lab scenarios: demonstrations of the vote model, not history.
  // ---------------------------------------------------------------------
  var SCENARIOS = {
    'baseline': {
      title: 'December 2015, no change',
      date: [2015, 12],
      apply: function () {}
    },
    'up_merger': {
      title: 'Unidos Podemos and a PP recovery',
      date: [2016, 6],
      apply: function (s) {
        VoteModel.CLASSES.forEach(function (c) {
          s.classSupport[c].up += s.classSupport[c].iu * 0.7; // the merger loses some IU voters
          s.classSupport[c].iu = 0;
          s.classSupport[c].cs *= 0.9;
        });
        s.notStanding.iu = true;
        s.classSupport.pensioners.pp += 6;
        s.classSupport.self_employed.pp += 5;
        s.classSupport.homemakers.pp += 4;
      }
    },
    'vox_breakthrough': {
      title: 'Vox breaks through as Ciudadanos collapses',
      date: [2019, 11],
      apply: function (s) {
        VoteModel.CLASSES.forEach(function (c) {
          s.classSupport[c].vox += ({ self_employed: 22, homemakers: 12, pensioners: 10 })[c] || 14;
          s.classSupport[c].cs *= 0.45;
          s.classSupport[c].up += s.classSupport[c].iu * 0.6;
          s.classSupport[c].iu = 0;
          s.classSupport[c].psoe += 5;
        });
        s.notStanding.iu = true;
      }
    },
    'right_landslide': {
      title: 'A PP–Vox landslide',
      date: [2019, 4],
      apply: function (s) {
        VoteModel.CLASSES.forEach(function (c) {
          s.classSupport[c].vox += 16;
          s.classSupport[c].pp += 12;
          s.classSupport[c].cs *= 0.4;
          s.classSupport[c].psoe *= 0.7;
          s.classSupport[c].up *= 0.6;
        });
      }
    }
  };

  var cachedBase = null;
  function baseline() {
    if (!cachedBase) {
      cachedBase = VoteModel.buildBaseline(DATA, VoteModel.initialState());
    }
    return cachedBase;
  }

  function runScenario(key) {
    var sc = SCENARIOS[key] || SCENARIOS.baseline;
    var state = VoteModel.initialState();
    sc.apply(state);
    var base = baseline();
    var congress = VoteModel.runGeneralElection(state, base, DATA, sc.date[0], sc.date[1]);
    var regional = {};
    [['Andalucía', '2018-12-02'], ['Madrid', '2019-05-26']].forEach(function (r) {
      regional[r[0]] = RegionalModel.runRegionalElection(state, base, REGIONAL, r[0], r[1]).totals;
    });
    return { scenario: sc, congress: congress, regional: regional, verdict: noPathToGovernment(congress.totals) };
  }

  // Fills the election lab page.
  function renderLab(key) {
    var doc = root.document;
    var out = doc.getElementById('sp-lab');
    if (!out) {
      return;
    }
    var r = runScenario(key);
    var html = '<h3>' + escapeHtml(r.scenario.title) + '</h3>' +
      '<svg id="sp-congress" class="sp-hemicycle"></svg>' +
      resultsTable(r.congress.totals, r.congress.voteShares) +
      '<p class="sp-verdict' + (r.verdict.lost ? ' sp-lost' : '') + '">' +
      (r.verdict.lost ? '<strong>Game over:</strong> ' : '') + escapeHtml(r.verdict.reason) + '</p>';
    Object.keys(r.regional).forEach(function (region) {
      html += '<h4>Same vote in a regional election: ' + escapeHtml(region) + '</h4>' +
        resultsTable(r.regional[region]);
    });
    out.innerHTML = html;
    drawHemicycle('#sp-congress', r.congress.totals);
  }

  var api = {
    PARTIES: PARTIES,
    PP_ALONE_LOSS_SEATS: PP_ALONE_LOSS_SEATS,
    LARGE_MAJORITY_SEATS: LARGE_MAJORITY_SEATS,
    partyName: partyName,
    partyColor: partyColor,
    noPathToGovernment: noPathToGovernment,
    resultsTable: resultsTable,
    drawHemicycle: drawHemicycle,
    SCENARIOS: SCENARIOS,
    runScenario: runScenario,
    renderLab: renderLab
  };
  if (isNode) {
    module.exports = api;
  } else {
    root.SpainUI = api;
  }
})(this);
