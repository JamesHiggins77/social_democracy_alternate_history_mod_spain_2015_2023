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
    ['psoe', 'PSOE', '#E1001A', 'PSOE'], ['ps', 'Pedro Sánchez List', '#F0648C', 'PSL'], ['pacma', 'PACMA', '#9BC400', 'PACMA'],
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
    style: [[1, 'Establishment'], [3, 'Pragmatic'], [5, 'Insurgent'], [7, 'Anti-establishment'],
            [10, 'Populist']],
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
  var PP_ALONE_LOSS_SEATS = 176;   // a PP absolute majority

  // Minor lists in the regional data keep the source's labels: lowercase
  // slugs ("x:eb_escanos_en_blanco"), uppercase acronyms ("x:PxC") or
  // labels with lost accents. These turn them into readable names.
  var KNOWN_MINOR = {
    pacma: 'PACMA', pacma_partido_animalista_contra_o_maltrato_animal: 'PACMA', otros_partidos: 'Others', otros: 'Others',
    fe_de_las_jons: 'FE de las JONS', 'fe de las jons': 'FE de las JONS', eb: 'Escaños en Blanco', cenb: 'Ciudadanos en Blanco',
    pum_j: 'PUM+J', ecolo: 'Ecolo-Verdes', uleg: 'Unión del Pueblo Leonés', cilus: 'CILUS',
    do_democracia_ourensana: 'Democracia Ourensana', mc_regional_mc_reg: 'MC Regional',
    coalicion_municipalista_mc_ccd_cifa_pitp_uxa_mc_ccd: 'Coalición Municipalista',
    movimiento_ciudadano_campo_de_cartagena_mc_cartagena: 'MC Cartagena',
    en_marea_compromiso_por_galicia_partido_galeguista: 'En Marea–CxG–PG', 'i-e': 'Izquierda-Ezkerra'
  };
  var SMALL_WORDS = { de: 1, del: 1, la: 1, las: 1, los: 1, el: 1, y: 1, e: 1, por: 1, para: 1, o: 1, a: 1, en: 1,
                      contra: 1, i: 1, d: 1, da: 1, do: 1, das: 1, dos: 1, per: 1, amb: 1 };
  var ACCENTS = { region: 'Región', union: 'Unión', coalicion: 'Coalición', escanos: 'Escaños', accion: 'Acción',
                  politica: 'Política', aragon: 'Aragón', leon: 'León', andalucia: 'Andalucía', espana: 'España',
                  democratica: 'Democrática', civica: 'Cívica', publica: 'Pública', ciudadania: 'Ciudadanía',
                  republica: 'República', galeguista: 'Galeguista', asamblea: 'Asamblea', comun: 'Común',
                  extremena: 'Extremeña', riojana: 'Riojana', canaria: 'Canaria', murciana: 'Murciana' };

  function prettyMinor(raw) {
    var key = raw.toLowerCase();
    if (KNOWN_MINOR[key]) {
      return KNOWN_MINOR[key];
    }
    var label = raw.replace(/\?A/g, 'ÑA').replace(/\?/g, 'Ñ');
    if (label.indexOf('_') === -1) {
      return label;  // already a label or acronym from the source
    }
    var t = label.split('_').filter(Boolean);
    if (t.every(function (w) { return w.length === 1; })) {
      return t.join('').toUpperCase();   // p_c_p_e -> PCPE
    }
    // drop a leading acronym ("eb_", "cx_g_", "scd_") when words follow
    while (t.length > 2 && t[0].length <= 3 && !SMALL_WORDS[t[0]]) {
      t.shift();
    }
    // "somos_region_somos_region": drop a repeated second half
    var half = t.length / 2;
    if (t.length % 2 === 0 && t.slice(0, half).join('_') === t.slice(half).join('_')) {
      t = t.slice(0, half);
    }
    var words = t.map(function (w, i) {
      if (ACCENTS[w]) { return ACCENTS[w]; }
      if (i > 0 && SMALL_WORDS[w]) { return w; }
      return w.charAt(0).toUpperCase() + w.slice(1);
    });
    var out = words.join(' ');
    return out.length > 40 ? out.slice(0, 38).replace(/\s+\S*$/, '') + '…' : out;
  }

  function partyName(id) {
    return META[id] ? META[id].name : prettyMinor(id.replace(/^x:/, ''));
  }

  function shortName(id) {
    return META[id] ? META[id].short : prettyMinor(id.replace(/^x:/, ''));
  }

  // Rename a party at runtime (the name Sánchez gives his own party).
  function setPartyName(id, name, short) {
    if (META[id]) {
      META[id].name = name;
      META[id].short = short || name;
    }
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

  // Defeat check from docs/design/00-core-rules.md §2.2: a PP absolute
  // majority ends the game at once. A PP + Vox majority does not, by
  // itself: the game ends only if the two form a coalition government
  // (see formGovernment), which a PSOE offer of a grand coalition can stop.
  function noPathToGovernment(totals) {
    var pp = totals.pp || 0;
    var ppVox = pp + (totals.vox || 0);
    var grand = pp + (totals.psoe || 0);
    if (pp >= PP_ALONE_LOSS_SEATS) {
      return { lost: true, reason: 'The PP has an absolute majority on its own (' + pp + ' seats).' };
    }
    if (ppVox >= MAJORITY) {
      return { lost: false, reason: 'PP and Vox hold ' + ppVox + ' seats between them. If they form a coalition ' +
        'government, the game is over' + (grand >= MAJORITY ? ', unless the PSOE offers the PP a grand coalition (' +
        grand + ' seats) instead.' : '.') };
    }
    return { lost: false, reason: 'No PP majority and no PP–Vox majority (' + ppVox + ' seats together).' };
  }

  // Possible arrangements after an election: who votes yes, who abstains,
  // and whether it reaches 176 (first ballot) or more yes than no (second).
  // Parties without seats are left out; an arrangement needs all its core
  // parties to have seats.
  var ARRANGEMENTS = [
    { core: ['psoe', 'up'], yes: ['iu', 'mp', 'compromis'], abst: [] },
    { core: ['psoe', 'up'], yes: ['iu', 'mp', 'compromis', 'pnv', 'cc', 'bng', 'prc', 'te', 'geroa', 'nc'], abst: ['erc', 'bildu'] },
    { core: ['psoe', 'cs'], yes: ['cc'], abst: [] },
    { core: ['psoe', 'cs'], yes: ['cc'], abst: ['up', 'iu'] },
    { core: ['psoe', 'up', 'cs'], yes: ['iu', 'mp', 'compromis', 'cc'], abst: [] },
    { core: ['ps', 'psoe', 'up'], yes: ['iu', 'mp', 'compromis', 'pnv'], abst: ['erc', 'bildu'] },
    { core: ['pp', 'psoe'], yes: [], abst: [], label: 'Grand coalition' },
    { core: ['pp', 'cs'], yes: ['upn', 'cc', 'foro'], abst: [] },
    { core: ['pp', 'cs'], yes: ['upn', 'cc', 'foro'], abst: ['psoe'] },
    { core: ['pp', 'vox'], yes: ['upn', 'foro'], abst: [] },
    { core: ['pp', 'cs', 'vox'], yes: ['upn', 'foro', 'cc'], abst: [] },
    { core: ['pp'], yes: ['upn', 'foro'], abst: [] }
  ];

  function arrangements(totals) {
    var seats = function (id) { return totals[id] || 0; };
    var out = [];
    var seen = {};
    ARRANGEMENTS.forEach(function (a) {
      if (!a.core.every(function (id) { return seats(id) > 0; })) {
        return;
      }
      var yesIds = a.core.concat(a.yes.filter(function (id) { return seats(id) > 0; }));
      var abstIds = a.abst.filter(function (id) { return seats(id) > 0; });
      var key = yesIds.join('+') + '|' + abstIds.join('+');
      if (seen[key]) {
        return;
      }
      seen[key] = true;
      var yes = yesIds.reduce(function (n, id) { return n + seats(id); }, 0);
      var abst = abstIds.reduce(function (n, id) { return n + seats(id); }, 0);
      var no = 350 - yes - abst;
      out.push({
        label: a.label || '', yesIds: yesIds, abstIds: abstIds, yes: yes, abstain: abst, no: no,
        first: yes >= MAJORITY, second: yes > no
      });
    });
    return out.sort(function (a, b) {
      var sa = a.first ? 2 : (a.second ? 1 : 0), sb = b.first ? 2 : (b.second ? 1 : 0);
      return sb - sa || b.yes - a.yes;
    });
  }

  function arrangementsHtml(totals) {
    var rows = arrangements(totals).map(function (a) {
      var names = a.yesIds.map(function (id) { return shortName(id); }).join(' + ');
      var abst = a.abstIds.length ? ', ' + a.abstIds.map(function (id) { return shortName(id); }).join(' and ') + ' abstaining' : '';
      var verdict = a.first ? '<span class="sp-arr-ok">absolute majority</span>'
        : (a.second ? '<span class="sp-arr-mid">second ballot only (' + a.yes + ' yes vs ' + a.no + ' no)</span>'
          : '<span class="sp-arr-no">short by ' + (MAJORITY - a.yes) + '</span>');
      var swatches = a.yesIds.map(function (id) {
        return '<span class="sp-swatch" style="background:' + partyColor(id) + '"></span>';
      }).join('');
      return '<tr><td>' + swatches + ' ' + (a.label ? a.label + ': ' : '') + escapeHtml(names) + escapeHtml(abst) +
        '</td><td class="sp-num"><b>' + a.yes + '</b> / ' + MAJORITY + '</td><td>' + verdict + '</td></tr>';
    }).join('');
    return '<h4>Paths to a majority</h4><p>An investiture needs <b>' + MAJORITY + '</b> yes votes on the first ballot, ' +
      'or more yes than no votes on the second.</p><table class="sp-results sp-arrangements"><thead><tr><th>Arrangement</th>' +
      '<th class="sp-num">Yes</th><th>Result</th></tr></thead><tbody>' + rows + '</tbody></table>';
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
  //   opts.shares: {province: [[party, %, seats], ...]} shown on hover (seats
  //     optional: results saved before they were recorded have none)
  //   opts.magnitude: {province: seats elected there}
  //   opts.scope: {province: region} when the figures are the whole
  //     regional parliament's rather than the province's
  //   opts.outlines: 'bold' or 'light' outlines around autonomous communities
  // ------------------------------------------------------------------
  // Who controls each autonomous community, and how much a party (or
  // bloc) holds in it: 'majority' (presidency with its own absolute
  // majority), 'president', 'junior' (coalition partner), 'supply'
  // (external support) or 'none' (opposition or absent).
  // ------------------------------------------------------------------
  var STATEWIDE_IDS = ['psoe', 'pp', 'up', 'cs', 'vox', 'iu', 'mp', 'ps', 'upyd', 'pacma'];
  var BLOCS = {
    psoe: ['psoe'], pp: ['pp'], up: ['up'], cs: ['cs'], vox: ['vox'],
    iu: ['iu', 'x:I-E'],
    regionalist: null   // every party that is not statewide
  };
  var CONTROL_RANK = { majority: 4, president: 3, junior: 2, supply: 1, none: 0, absent: -1 };
  var CONTROL_LABEL = { majority: 'Majority government', president: 'Holds the presidency',
                        junior: 'Junior coalition partner', supply: 'Supports the government',
                        none: 'In opposition', absent: 'No seats' };

  function inBloc(bloc, id) {
    if (bloc === 'regionalist') {
      return STATEWIDE_IDS.indexOf(id) === -1 && id !== 'x:I-E';
    }
    return (BLOCS[bloc] || [bloc]).indexOf(id) !== -1;
  }

  function regionControl(gov, seats, bloc) {
    if (!gov) {
      return 'none';
    }
    var total = 0;
    Object.keys(seats || {}).forEach(function (k) { total += seats[k]; });
    var best = 'none';
    var consider = function (id, status) {
      if (inBloc(bloc, id) && CONTROL_RANK[status] > CONTROL_RANK[best]) {
        best = status;
      }
    };
    var ids = gov.party === 'jxsi' ? ['jxsi', 'erc', 'junts'] : [gov.party];
    ids.forEach(function (id) {
      var own = (seats || {})[gov.party] || 0;
      consider(id, own > total / 2 ? 'majority' : 'president');
    });
    (gov.cabinet || []).forEach(function (id) { if (id !== gov.party) { consider(id, 'junior'); } });
    (gov.support || []).forEach(function (id) { consider(id, 'supply'); });
    if (best === 'none') {
      var hasSeats = Object.keys(seats || {}).some(function (id) { return inBloc(bloc, id) && seats[id] > 0; });
      if (!hasSeats) {
        return 'absent';
      }
    }
    return best;
  }

  function mix(hex, other, t) {
    var a = hex.replace('#', ''), b = other.replace('#', '');
    var out = '#';
    for (var i = 0; i < 3; i++) {
      var x = parseInt(a.substr(i * 2, 2), 16), y = parseInt(b.substr(i * 2, 2), 16);
      out += ('0' + Math.round(x + (y - x) * t).toString(16)).slice(-2);
    }
    return out;
  }

  var BLOC_COLOR = { regionalist: '#C9A227', iu: '#A50021' };

  function controlColor(bloc, status) {
    var base = BLOC_COLOR[bloc] || partyColor(bloc);
    return { majority: mix(base, '#000000', 0.35), president: base, junior: mix(base, '#ffffff', 0.45),
             supply: mix(base, '#ffffff', 0.72), none: '#f2f0ec', absent: 'url(#sp-hatch)' }[status];
  }

  // regions: {name: {government, seats}}; mode: 'presidency' or a bloc id.
  function drawRegionMap(container, regions, mode, opts) {
    var map = root.SPAIN_MAP;
    if (!map || !container) {
      return;
    }
    opts = opts || {};
    mode = mode || 'presidency';
    var paths = Object.keys(map.regions).map(function (r) {
      var reg = regions[r];
      var fill = '#e4e1dc';
      if (reg && reg.government) {
        fill = mode === 'presidency' ? partyColor(reg.government.party)
          : controlColor(mode, regionControl(reg.government, reg.seats, mode));
      }
      return '<path class="sp-reg" data-reg="' + escapeHtml(r) + '" d="' + map.regions[r] + '" fill="' + fill +
        '" stroke="#333" stroke-width="1" stroke-linejoin="round"' + (reg ? ' style="cursor:pointer"' : '') + '></path>';
    });
    var box = map.canariesBox.slice();
    box[0] = Math.max(1, box[0]);
    box[1] = Math.max(1, box[1]);
    box[2] = Math.min(box[2], map.width - box[0] - 1);
    box[3] = Math.min(box[3], map.height - box[1] - 1);
    var inset = '<rect x="' + box[0] + '" y="' + box[1] + '" width="' + box[2] + '" height="' + box[3] +
      '" fill="none" stroke="#999" stroke-width="0.8"/>';
    var legend;
    if (mode === 'presidency') {
      var used = {};
      Object.keys(regions).forEach(function (r) { if (regions[r].government) { used[regions[r].government.party] = true; } });
      legend = Object.keys(used).map(function (id) {
        return '<span class="sp-legend"><span class="sp-swatch" style="background:' + partyColor(id) + '"></span>' +
          escapeHtml(shortName(id)) + '</span>';
      }).join(' ');
    } else {
      legend = ['majority', 'president', 'junior', 'supply', 'none', 'absent'].map(function (st) {
        var bg = st === 'absent' ? 'repeating-linear-gradient(45deg, #e9e6e1 0 2px, #a9a49c 2px 4px)' : controlColor(mode, st);
        return '<span class="sp-legend"><span class="sp-swatch" style="background:' + bg +
          ';border:1px solid #bbb"></span>' + CONTROL_LABEL[st] + '</span>';
      }).join(' ');
    }
    container.innerHTML = (opts.title ? '<h4>' + escapeHtml(opts.title) + '</h4>' : '') +
      '<div class="sp-map-wrap"><svg class="sp-map" viewBox="0 0 ' + map.width + ' ' + map.height + '">' +
      '<defs><pattern id="sp-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<rect width="6" height="6" fill="#e9e6e1"></rect><line x1="0" y1="0" x2="0" y2="6" stroke="#a9a49c" stroke-width="2.2"></line>' +
      '</pattern></defs>' +
      paths.join('') + inset + '</svg><div class="sp-map-tip"></div></div>' +
      '<p class="sp-map-legend">' + legend + '</p>';
    var tip = container.querySelector('.sp-map-tip');
    var wrap = container.querySelector('.sp-map-wrap');
    Array.prototype.forEach.call(container.querySelectorAll('.sp-reg'), function (el) {
      var r = el.getAttribute('data-reg');
      var reg = regions[r];
      el.addEventListener('mousemove', function (ev) {
        var g = reg && reg.government;
        var line = '';
        if (g) {
          line = '<div><span class="sp-swatch" style="background:' + partyColor(g.party) + '"></span>' +
            escapeHtml(g.president) + ' (' + escapeHtml(shortName(g.party)) + ')</div><div>' + escapeHtml(g.type || '') + '</div>';
          if (mode !== 'presidency') {
            line += '<div><b>' + escapeHtml(BLOC_NAMES[mode] || shortName(mode)) + ':</b> ' +
              CONTROL_LABEL[regionControl(g, reg.seats, mode)] + '</div>';
          }
        }
        tip.innerHTML = '<strong>' + escapeHtml(r) + '</strong>' + (line || '<div>No regional parliament in the game</div>');
        var b = wrap.getBoundingClientRect();
        var x = ev.clientX - b.left + 12, y = ev.clientY - b.top + 12;
        if (x > b.width - 150) { x -= 170; }
        tip.style.left = x + 'px';
        tip.style.top = y + 'px';
        tip.style.display = 'block';
        el.setAttribute('stroke-width', '2.4');
      });
      el.addEventListener('mouseleave', function () {
        tip.style.display = 'none';
        el.setAttribute('stroke-width', '1');
      });
      if (reg && opts.onSelect) {
        el.addEventListener('click', function () { opts.onSelect(r); });
      }
    });
  }

  var BLOC_NAMES = { presidency: 'Presidency', psoe: 'PSOE', pp: 'PP', up: 'Podemos', cs: 'Ciudadanos',
                     vox: 'Vox', iu: 'IU', regionalist: 'Regionalist parties' };

  function drawMap(container, winners, title, opts) {
    var map = root.SPAIN_MAP;
    if (!map || !container) {
      return;
    }
    opts = opts || {};
    var shares = opts.shares || {};
    var magnitude = opts.magnitude || {};
    var scope = opts.scope || {};
    var prev = opts.prevWinners || null;
    var flips = 0;
    var flipped = function (p) {
      var w = winners && winners[p];
      return !!(prev && w && prev[p] && prev[p] !== w);
    };
    var paths = Object.keys(map.provinces).map(function (p) {
      var w = winners && winners[p];
      var fill = w ? partyColor(w) : '#ddd';
      if (flipped(p)) {
        // a province that changed hands is drawn darker
        fill = mix(fill, '#000000', 0.4);
        flips += 1;
      }
      return '<path class="sp-prov" data-prov="' + escapeHtml(p) + '" d="' + map.provinces[p] + '" fill="' +
        fill + '" stroke="#fff" stroke-width="0.6"></path>';
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
      '<p class="sp-map-legend">' + legend + '</p>' +
      (prev ? '<p class="sp-map-legend">' + (flips ? 'Darker shade: ' + flips + ' province' + (flips === 1 ? '' : 's') +
        ' won by a different party than at the last general election.' : 'No province changed hands.') + '</p>' : '');
    var tip = container.querySelector('.sp-map-tip');
    var wrap = container.querySelector('.sp-map-wrap');
    Array.prototype.forEach.call(container.querySelectorAll('.sp-prov'), function (el) {
      el.addEventListener('mousemove', function (ev) {
        var p = el.getAttribute('data-prov');
        var list = shares[p] || [];
        var withSeats = list.some(function (s) { return s[2] !== undefined; });
        var rows = list.map(function (s) {
          return '<tr><td><span class="sp-swatch" style="background:' + partyColor(s[0]) + '"></span>' +
            escapeHtml(shortName(s[0])) + '</td><td class="sp-num"><b>' + s[1].toFixed(1) + '%</b></td>' +
            (withSeats ? '<td class="sp-num">' + (s[2] || '–') + '</td>' : '') + '</tr>';
        }).join('');
        var mag = magnitude[p];
        var head = '<strong>' + escapeHtml(p) + '</strong>' +
          (mag && !scope[p] ? ' <span class="sp-tip-mag">' + mag + ' seat' + (mag === 1 ? '' : 's') + '</span>' : '');
        var scopeNote = scope[p] ? '<div><em>Whole parliament of ' + escapeHtml(scope[p]) +
          (mag ? ' (' + mag + ' seats)' : '') + '</em></div>' : '';
        var flipNote = flipped(p) ? '<div><em>Gained from ' + escapeHtml(shortName(prev[p])) + '</em></div>' : '';
        var table = rows ? '<table class="sp-tip-table">' +
          (withSeats ? '<thead><tr><th></th><th>Votes</th><th>Seats</th></tr></thead>' : '') +
          '<tbody>' + rows + '</tbody></table>' : '<div>No data</div>';
        tip.innerHTML = head + scopeNote + flipNote + table;
        var r = wrap.getBoundingClientRect();
        var x = ev.clientX - r.left + 12;
        var y = ev.clientY - r.top + 12;
        if (x > r.width - 170) { x -= 190; }
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
    setPartyName: setPartyName,
    prettyMinor: prettyMinor,
    regionControl: regionControl,
    controlColor: controlColor,
    drawRegionMap: drawRegionMap,
    BLOC_NAMES: BLOC_NAMES,
    PP_ALONE_LOSS_SEATS: PP_ALONE_LOSS_SEATS,
    partyName: partyName,
    shortName: shortName,
    word: word,
    SCALES: SCALES,
    partyColor: partyColor,
    noPathToGovernment: noPathToGovernment,
    arrangements: arrangements,
    arrangementsHtml: arrangementsHtml,
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
