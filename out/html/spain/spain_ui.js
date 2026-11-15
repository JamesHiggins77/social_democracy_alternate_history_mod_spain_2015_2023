// Display helpers for the Spanish game: party metadata, Congress hemicycle,
// results tables and the "no path to government" check.
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var VoteModel = isNode ? require('./vote_model.js') : root.SpainVoteModel;
  var RegionalModel = isNode ? require('./regional_model.js') : root.SpainRegionalModel;
  var DATA = isNode ? require('./election_data.js') : root.SPAIN_ELECTION_DATA;
  var REGIONAL = isNode ? require('./regional_data.js') : root.SPAIN_REGIONAL_DATA;

  // Left-to-right order for the hemicycle: [id, full name, colour, short name].
  var PARTIES = [
    ['cup', 'CUP', '#FFED00', 'CUP'], ['bildu', 'EH Bildu', '#B3A400', 'Bildu'],
    ['erc', 'ERC', '#FFB232', 'ERC'], ['up', 'Podemos / UP / Sumar', '#6B2E68', 'Podemos'],
    ['iu', 'IU', '#A50021', 'IU'], ['mp', 'Más País / Compromís', '#0FDEC4', 'Más País'],
    ['compromis', 'Compromís', '#F39200', 'Compromís'], ['mes', 'Més per Mallorca', '#C4D600', 'Més'],
    ['mxme', 'Més per Menorca', '#9FBF1F', 'MxMe'], ['cha', 'Chunta Aragonesista', '#3A8A3A', 'CHA'],
    ['aa', 'Adelante Andalucía', '#2E8B57', 'AA'],
    ['bng', 'BNG', '#7FB3E0', 'BNG'], ['geroa', 'Geroa Bai', '#F75E42', 'Geroa'],
    ['psoe', 'PSOE', '#E1001A', 'PSOE'], ['pacma', 'PACMA', '#9BC400', 'PACMA'],
    ['te', 'Teruel Existe', '#037252', 'TE'], ['foro', 'Foro Asturias', '#2E73B8', 'Foro'],
    ['prc', 'PRC', '#C2CE0C', 'PRC'], ['nc', 'Nueva Canarias', '#9ACD32', 'NC'],
    ['cc', 'Coalición Canaria', '#FFD700', 'CC'], ['asg', 'Agrupación Socialista Gomera', '#E3242B', 'ASG'],
    ['ahi', 'Agrupación Herreña', '#F2C200', 'AHI'], ['upl', 'Unión del Pueblo Leonés', '#9B1B30', 'UPL'],
    ['xav', 'Por Ávila', '#2B7A9E', 'XAV'], ['x:SY', 'Soria ¡Ya!', '#2F6E3B', 'Soria Ya'],
    ['sy', 'Soria ¡Ya!', '#2F6E3B', 'Soria Ya'], ['par', 'Partido Aragonés', '#E8B500', 'PAR'],
    ['elpi', 'El Pi', '#7A1E3A', 'El Pi'], ['pnv', 'EAJ-PNV', '#008000', 'PNV'],
    ['junts', 'CiU / DL / Junts', '#20C0B2', 'Junts'], ['jxsi', 'Junts pel Sí', '#3AB6A5', 'JxSí'],
    ['cs', 'Ciudadanos', '#EB6109', 'Cs'], ['upyd', 'UPyD', '#E9008C', 'UPyD'],
    ['upn', 'UPN / NA+', '#2A52BE', 'UPN'], ['pp', 'PP', '#1D84CE', 'PP'],
    ['vox', 'Vox', '#5AC035', 'Vox']
  ];
  var META = {};
  PARTIES.forEach(function (p, i) {
    META[p[0]] = { name: p[1], color: p[2], short: p[3], order: i };
  });

  // Word scales for the status display: [upper bound, word], ascending.
  var SCALES = {
    authority: [[0, 'Non-existent'], [9, 'Very low'], [35, 'Low'], [60, 'Middling'], [79, 'Strong'],
                [99, 'Very strong'], [100, 'Absolute']],
    morale: [[0, 'Shattered'], [9, 'Despairing'], [35, 'Low'], [60, 'Steady'], [79, 'High'],
             [99, 'Fervent'], [100, 'Euphoric']],
    unity: [[0, 'Broken'], [9, 'Split'], [35, 'Fractious'], [60, 'Uneasy'], [79, 'United'],
            [99, 'Solid'], [100, 'Monolithic']],
    relation: [[0, 'Enemies'], [19, 'Hostile'], [39, 'Cold'], [59, 'Wary'], [79, 'Cordial'],
               [99, 'Close'], [100, 'Allied']],
    dissent: [[0, 'None'], [9, 'Minimal'], [24, 'Low'], [44, 'Grumbling'], [64, 'Restless'],
              [84, 'Rebellious'], [100, 'Open revolt']],
    committee: [[29, 'Lost'], [44, 'Against him'], [54, 'Divided'], [69, 'Behind him'],
                [100, 'Firmly behind him']],
    sanchismo: [[19, 'Isolated'], [39, 'Small'], [59, 'Solid'], [79, 'Strong'], [100, 'Dominant']],
    strength: [[9, 'Marginal'], [19, 'Minor'], [29, 'Significant'], [39, 'Major'], [100, 'Dominant']]
  };

  function word(scale, value) {
    var v = Math.round(value || 0);
    var steps = SCALES[scale];
    for (var i = 0; i < steps.length; i++) {
      if (v <= steps[i][0]) {
        return steps[i][1];
      }
    }
    return steps[steps.length - 1][1];
  }

  var MAJORITY = 176;
  // Defeat thresholds - see docs/design/00-core-rules.md §2.2.
  var PP_ALONE_LOSS_SEATS = 186;   // a clear PP majority, not a bare one
  var LARGE_MAJORITY_SEATS = 193;  // PP + Vox above 55% of 350

  function partyName(id) {
    return META[id] ? META[id].name : id.replace(/^x:/, '');
  }

  function shortName(id) {
    return META[id] ? META[id].short : id.replace(/^x:/, '');
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

  // Change marker: green up triangle, red down triangle, (-) if unchanged.
  function signed(v, digits) {
    var r = Math.abs(v).toFixed(digits);
    if (Number(r) === 0) {
      return '<span class="sp-same">(-)</span>';
    }
    return v > 0 ? '<span class="sp-up">\u25b2' + r + '</span>'
      : '<span class="sp-down">\u25bc' + r + '</span>';
  }

  // Results table.
  //   totals: {party: seats}; voteShares: {party: %} (optional)
  //   opts.prevSeats / opts.prevShares: the previous election, for changes
  //   opts.compact: narrow version for the sidebar (party, seats, change)
  function resultsTable(totals, voteShares, opts) {
    opts = opts || {};
    var prevSeats = opts.prevSeats || null;
    var prevShares = opts.prevShares || null;
    var size = 0;
    Object.keys(totals).forEach(function (id) { size += totals[id]; });
    var ids = {};
    Object.keys(totals).forEach(function (id) { ids[id] = true; });
    if (prevSeats && !opts.compact) {
      Object.keys(prevSeats).forEach(function (id) { if (prevSeats[id] > 0) { ids[id] = true; } });
    }
    if (voteShares && !opts.compact) {
      Object.keys(voteShares).forEach(function (id) { if (voteShares[id] >= 1) { ids[id] = true; } });
    }
    ids = Object.keys(ids).sort(function (a, b) {
      return ((totals[b] || 0) - (totals[a] || 0)) ||
        (((voteShares || {})[b] || 0) - ((voteShares || {})[a] || 0));
    });
    var seatChange = function (id) {
      if (!prevSeats) { return ''; }
      return signed((totals[id] || 0) - (prevSeats[id] || 0), 0);
    };
    var head;
    var rows;
    if (opts.compact) {
      head = '<tr><th></th><th class="sp-num">Seats</th>' + (prevSeats ? '<th class="sp-num">\u00b1</th>' : '') + '</tr>';
      rows = ids.map(function (id) {
        return '<tr><td><span class="sp-swatch" style="background:' + partyColor(id) + '"></span>' +
          escapeHtml(shortName(id)) + '</td><td class="sp-num">' + (totals[id] || 0) + '</td>' +
          (prevSeats ? '<td class="sp-num sp-change">' + seatChange(id) + '</td>' : '') + '</tr>';
      });
    } else {
      head = '<tr><th>Party</th>' +
        (voteShares ? '<th class="sp-num">Votes</th>' + (prevShares ? '<th class="sp-num">\u00b1</th>' : '') : '') +
        '<th class="sp-num">Seats</th><th class="sp-num">%</th>' +
        (prevSeats ? '<th class="sp-num">\u00b1</th>' : '') + '</tr>';
      rows = ids.map(function (id) {
        var cells = '<td><span class="sp-swatch" style="background:' + partyColor(id) + '"></span>' +
          escapeHtml(partyName(id)) + '</td>';
        if (voteShares) {
          var v = voteShares[id] || 0;
          cells += '<td class="sp-num">' + v.toFixed(1) + '%</td>';
          if (prevShares) {
            cells += '<td class="sp-num sp-change">' +
              (prevShares[id] === undefined && v > 0 ? 'new' : signed(v - (prevShares[id] || 0), 1)) + '</td>';
          }
        }
        cells += '<td class="sp-num">' + (totals[id] || 0) + '</td><td class="sp-num">' +
          (100 * (totals[id] || 0) / size).toFixed(1) + '%</td>';
        if (prevSeats) {
          cells += '<td class="sp-num sp-change">' + seatChange(id) + '</td>';
        }
        return '<tr>' + cells + '</tr>';
      });
    }
    return '<table class="sp-results' + (opts.compact ? ' sp-compact' : '') + '"><thead>' + head +
      '</thead><tbody>' + rows.join('') + '</tbody></table>';
  }

  // Province map coloured by the party with most votes.
  //   winners: {province: party}; provinces not in winners are drawn grey
  //   opts.shares: {province: [[party, %], ...]} shown on hover
  //   opts.outlines: 'bold' or 'light' outlines around autonomous communities
  function drawMap(container, winners, title, opts) {
    var map = root.SPAIN_MAP;
    if (!map || !container) {
      return;
    }
    opts = opts || {};
    var shares = opts.shares || {};
    var paths = Object.keys(map.provinces).map(function (p) {
      var w = winners && winners[p];
      return '<path class="sp-prov" data-prov="' + escapeHtml(p) + '" d="' + map.provinces[p] + '" fill="' +
        (w ? partyColor(w) : '#ddd') + '" stroke="#fff" stroke-width="0.6"></path>';
    });
    var outlineWidth = opts.outlines === 'bold' ? 2.2 : (opts.outlines === 'light' ? 1 : 0);
    var outlines = outlineWidth && map.regions ? Object.keys(map.regions).map(function (r) {
      return '<path d="' + map.regions[r] + '" fill="none" stroke="#222" stroke-width="' + outlineWidth +
        '" stroke-linejoin="round" pointer-events="none"></path>';
    }).join('') : '';
    var box = map.canariesBox.slice();
    box[0] = Math.max(1, box[0]);
    box[1] = Math.max(1, box[1]);
    box[2] = Math.min(box[2], map.width - box[0] - 1);
    box[3] = Math.min(box[3], map.height - box[1] - 1);
    var inset = '<rect x="' + box[0] + '" y="' + box[1] + '" width="' + box[2] + '" height="' + box[3] +
      '" fill="none" stroke="#999" stroke-width="0.8"/>';
    var used = {};
    Object.keys(winners || {}).forEach(function (p) { used[winners[p]] = true; });
    var legend = Object.keys(used).sort(function (a, b) {
      return (META[a] ? META[a].order : 99) - (META[b] ? META[b].order : 99);
    }).map(function (id) {
      return '<span class="sp-legend"><span class="sp-swatch" style="background:' + partyColor(id) +
        '"></span>' + escapeHtml(shortName(id)) + '</span>';
    }).join(' ');
    container.innerHTML = (title ? '<h4>' + escapeHtml(title) + '</h4>' : '') +
      '<div class="sp-map-wrap"><svg class="sp-map" viewBox="0 0 ' + map.width + ' ' + map.height + '">' +
      paths.join('') + outlines + inset + '</svg><div class="sp-map-tip"></div></div>' +
      '<p class="sp-map-legend">' + legend + '</p>';
    var tip = container.querySelector('.sp-map-tip');
    var wrap = container.querySelector('.sp-map-wrap');
    Array.prototype.forEach.call(container.querySelectorAll('.sp-prov'), function (el) {
      el.addEventListener('mousemove', function (ev) {
        var p = el.getAttribute('data-prov');
        var rows = (shares[p] || []).map(function (s) {
          return '<div><span class="sp-swatch" style="background:' + partyColor(s[0]) + '"></span>' +
            escapeHtml(shortName(s[0])) + ' <b>' + s[1].toFixed(1) + '%</b></div>';
        }).join('');
        tip.innerHTML = '<strong>' + escapeHtml(p) + '</strong>' + (rows || '<div>No data</div>');
        var r = wrap.getBoundingClientRect();
        var x = ev.clientX - r.left + 12;
        var y = ev.clientY - r.top + 12;
        if (x > r.width - 130) { x -= 150; }
        tip.style.left = x + 'px';
        tip.style.top = y + 'px';
        tip.style.display = 'block';
        el.setAttribute('stroke', '#000');
        el.setAttribute('stroke-width', '1.4');
      });
      el.addEventListener('mouseleave', function () {
        tip.style.display = 'none';
        el.setAttribute('stroke', '#fff');
        el.setAttribute('stroke-width', '0.6');
      });
    });
  }

  // Poll of polls: one line per party over the last `months` months.
  //   series: [{date: 'YYYY-MM', party: %...}], oldest first
  //   elections: ['YYYY-MM', ...] drawn as dashed markers
  function drawPollChart(container, series, elections, opts) {
    if (!container || !series || !series.length) {
      return;
    }
    opts = opts || {};
    var months = opts.months || 48;
    var data = series.slice(-months);
    var W = opts.width || 560;
    var H = opts.height || 300;
    var compact = W < 350;
    var m = { l: compact ? 22 : 30, r: compact ? 44 : 62, t: 8, b: compact ? 18 : 22 };
    var toIndex = function (d) {
      var p = d.split('-');
      return Number(p[0]) * 12 + Number(p[1]) - 1;
    };
    var x0 = toIndex(data[0].date);
    var x1 = toIndex(data[data.length - 1].date);
    var span = Math.max(1, x1 - x0);
    var parties = {};
    data.forEach(function (row) {
      Object.keys(row).forEach(function (k) {
        if (k !== 'date' && row[k] >= 2) { parties[k] = true; }
      });
    });
    var ids = Object.keys(parties);
    var top = 10;
    data.forEach(function (row) { ids.forEach(function (k) { top = Math.max(top, row[k] || 0); }); });
    top = Math.ceil((top + 2) / 10) * 10;
    var X = function (d) { return m.l + (toIndex(d) - x0) / span * (W - m.l - m.r); };
    var Y = function (v) { return H - m.b - v / top * (H - m.t - m.b); };
    var parts = [];
    var fs = compact ? 8 : 10;
    for (var g = 0; g <= top; g += 10) {
      parts.push('<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(g) + '" y2="' + Y(g) +
        '" stroke="#ccc" stroke-width="0.5"/><text x="' + (m.l - 3) + '" y="' + (Y(g) + 3) +
        '" font-size="' + fs + '" text-anchor="end" fill="#777">' + g + '</text>');
    }
    for (var yr = Math.ceil(x0 / 12); yr * 12 <= x1; yr++) {
      var xx = m.l + (yr * 12 - x0) / span * (W - m.l - m.r);
      parts.push('<text x="' + xx + '" y="' + (H - 4) + '" font-size="' + fs +
        '" text-anchor="middle" fill="#777">' + (compact ? "'" + String(yr).slice(2) : yr) + '</text>');
    }
    (elections || []).forEach(function (d) {
      var k = toIndex(d);
      if (k >= x0 && k <= x1) {
        parts.push('<line x1="' + X(d) + '" x2="' + X(d) + '" y1="' + m.t + '" y2="' + (H - m.b) +
          '" stroke="#999" stroke-width="0.8" stroke-dasharray="3,3"><title>Election ' + d + '</title></line>');
      }
    });
    var labels = [];
    ids.forEach(function (k) {
      var pts = data.filter(function (row) { return row[k] !== undefined && row[k] !== null; });
      if (!pts.length) { return; }
      var d = pts.map(function (row, i) {
        return (i ? 'L' : 'M') + X(row.date).toFixed(1) + ',' + Y(row[k]).toFixed(1);
      }).join('');
      parts.push('<path d="' + d + '" fill="none" stroke="' + partyColor(k) + '" stroke-width="' +
        (compact ? 1.6 : 2.2) + '" stroke-linejoin="round"><title>' + escapeHtml(partyName(k)) + '</title></path>');
      var last = pts[pts.length - 1];
      labels.push({ k: k, y: Y(last[k]), v: last[k], x: X(last.date) });
    });
    // end labels, nudged apart so they do not overlap
    labels.sort(function (a, b) { return a.y - b.y; });
    for (var i = 1; i < labels.length; i++) {
      if (labels[i].y - labels[i - 1].y < fs + 1) { labels[i].y = labels[i - 1].y + fs + 1; }
    }
    labels.forEach(function (l) {
      parts.push('<text x="' + (W - m.r + 3) + '" y="' + (l.y + 3) + '" font-size="' + fs + '" fill="' +
        partyColor(l.k) + '" font-weight="bold">' + escapeHtml(shortName(l.k)) + ' ' + l.v.toFixed(0) + '</text>');
    });
    container.innerHTML = '<svg class="sp-poll-chart" viewBox="0 0 ' + W + ' ' + H + '">' +
      parts.join('') + '</svg>';
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
    shortName: shortName,
    word: word,
    SCALES: SCALES,
    partyColor: partyColor,
    noPathToGovernment: noPathToGovernment,
    resultsTable: resultsTable,
    drawHemicycle: drawHemicycle,
    drawMap: drawMap,
    drawPollChart: drawPollChart,
    signed: signed,
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
