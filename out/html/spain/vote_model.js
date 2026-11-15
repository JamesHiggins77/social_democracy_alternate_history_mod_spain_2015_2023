// Vote model: social classes, with a regional layer on top, projected onto
// the 52 provinces and fed into the electoral engine.
//
// Layers
//   1. Classes (national): each class has support points for the statewide
//      parties, as in the Weimar original (cards add/subtract points).
//   2. Regions (17 autonomous communities + Ceuta, Melilla): each region has
//      its own class mix, multipliers for statewide parties, and the strength
//      of its territorial parties (ERC, PNV, BNG, CC...).
//   3. Provinces: regional change is applied as a swing to each province's
//      baseline result, so the model reproduces the real December 2015 vote
//      exactly when nothing has changed.
//
// Works in the browser (window.SpainVoteModel) and in Node.
(function (root) {
  'use strict';

  var Electoral = (typeof module !== 'undefined' && module.exports)
    ? require('./electoral_engine.js') : root.SpainElectoral;

  // Statewide parties driven by the class layer.
  var STATEWIDE = ['psoe', 'pp', 'cs', 'up', 'iu', 'vox', 'mp', 'pacma', 'upyd'];
  // Statewide parties large enough in 2015 for their regional pattern to be
  // meaningful. Smaller and new parties grow by class mix x regional affinity
  // instead of amplifying their 2015 micro-vote.
  var ESTABLISHED = { psoe: true, pp: true, cs: true, up: true, iu: true };

  // Classes follow the CIS's socio-economic condition (+ inactive) variable.
  // Shares: CIS study 3126, post-electoral survey of the 2015 general
  // election (Jan-Mar 2016), "Condición socioeconómica del INE (+inactivos)",
  // excluding the 1.6% "no clasificables":
  //   professionals = directors and professionals 4.1 + technicians and
  //                   middle managers 10.9
  //   self_employed = small business owners 3.9 + farmers 0.9
  //   workers       = office and service employees 4.9 + skilled 5.8 +
  //                   unskilled 10.8 manual workers
  //   pensioners 27.4, unemployed 18.2, students 4.5,
  //   homemakers (unpaid domestic work) 7.0
  var CLASSES = ['professionals', 'self_employed', 'workers', 'pensioners',
                 'unemployed', 'students', 'homemakers'];
  var CLASS_SHARE_2015 = {
    professionals: 15.0, self_employed: 4.8, workers: 21.5, pensioners: 27.4,
    unemployed: 18.2, students: 4.5, homemakers: 7.0
  };
  // Support by class (PROVISIONAL until calibrated on CIS microdata - see
  // docs/design/00-core-rules.md §4.1). Patterns follow the CIS reports on
  // the 2015 election: the PSOE strongest among manual workers and
  // pensioners, the PP among the self-employed, pensioners and homemakers,
  // Podemos U-shaped (workers and unemployed, but also professionals and
  // students), Ciudadanos among professionals and the salaried middle class.
  // Values only shape how support moves; the regional layer calibrates the
  // starting result exactly whatever they are.
  var CLASS_SUPPORT_2015 = {
    professionals: { psoe: 16, pp: 22, cs: 24, up: 26, iu: 5, vox: 0.3, mp: 0, pacma: 1.0, upyd: 1.2 },
    self_employed: { psoe: 13, pp: 40, cs: 22, up: 12, iu: 2, vox: 0.6, mp: 0, pacma: 0.6, upyd: 0.8 },
    workers:       { psoe: 28, pp: 20, cs: 12, up: 24, iu: 4, vox: 0.3, mp: 0, pacma: 1.0, upyd: 0.5 },
    pensioners:    { psoe: 34, pp: 46, cs: 7,  up: 6,  iu: 2, vox: 0.2, mp: 0, pacma: 0.2, upyd: 0.4 },
    unemployed:    { psoe: 27, pp: 17, cs: 10, up: 29, iu: 5, vox: 0.3, mp: 0, pacma: 1.0, upyd: 0.4 },
    students:      { psoe: 11, pp: 13, cs: 21, up: 38, iu: 7, vox: 0.3, mp: 0, pacma: 3.0, upyd: 0.6 },
    homemakers:    { psoe: 30, pp: 45, cs: 9,  up: 8,  iu: 2, vox: 0.2, mp: 0, pacma: 0.3, upyd: 0.3 }
  };
  // Regional deviations from the national class mix (multiplier, default 1).
  // PROVISIONAL: to be replaced by the class mix per community in the CIS
  // microdata.
  var CLASS_MIX_FACTORS = {
    'Andalucía': { unemployed: 1.4, homemakers: 1.2, professionals: 0.85, self_employed: 1.1 },
    'Aragón': { pensioners: 1.1, self_employed: 1.15 },
    'Asturias': { pensioners: 1.35, workers: 1.05, students: 0.8 },
    'Baleares': { self_employed: 1.3, pensioners: 0.8, unemployed: 0.9 },
    'Canarias': { unemployed: 1.4, pensioners: 0.8 },
    'Cantabria': { pensioners: 1.1 },
    'Castilla-La Mancha': { self_employed: 1.3, unemployed: 1.15, homemakers: 1.2, professionals: 0.8 },
    'Castilla y León': { pensioners: 1.3, self_employed: 1.3, students: 0.85, professionals: 0.9 },
    'Cataluña': { professionals: 1.2, workers: 1.1, unemployed: 0.85, homemakers: 0.8 },
    'Ceuta': { unemployed: 1.6, students: 1.2, pensioners: 0.7 },
    'Comunidad Valenciana': { self_employed: 1.1, unemployed: 1.05 },
    'Extremadura': { unemployed: 1.4, self_employed: 1.4, homemakers: 1.2, professionals: 0.75 },
    'Galicia': { pensioners: 1.3, self_employed: 1.3, students: 0.85 },
    'La Rioja': { self_employed: 1.2 },
    'Madrid': { professionals: 1.5, students: 1.2, unemployed: 0.8, homemakers: 0.8, self_employed: 0.8 },
    'Melilla': { unemployed: 1.6, students: 1.2, pensioners: 0.7 },
    'Navarra': { workers: 1.1, professionals: 1.1, unemployed: 0.7 },
    'País Vasco': { workers: 1.1, professionals: 1.15, pensioners: 1.1, unemployed: 0.7 },
    'Región de Murcia': { self_employed: 1.2, unemployed: 1.1, students: 1.1 }
  };
  // Latent regional receptiveness for parties without a meaningful 2015
  // base (multiplier on their class-driven growth). Vox's reflects the
  // structural factors - territorial conflict salience, rural and agrarian
  // grievances, the Ceuta/Melilla border - not a fixed result.
  var NEW_PARTY_AFFINITY = {
    vox: {
      'Región de Murcia': 1.6, 'Madrid': 1.3, 'Andalucía': 1.15, 'Ceuta': 1.8, 'Melilla': 1.6,
      'Castilla y León': 1.1, 'Castilla-La Mancha': 1.2, 'Comunidad Valenciana': 1.15,
      'Aragón': 1.05, 'La Rioja': 1.05, 'Asturias': 0.9, 'Galicia': 0.55, 'Canarias': 0.8,
      'Cataluña': 0.5, 'Navarra': 0.6, 'País Vasco': 0.2
    },
    mp: { 'Madrid': 1.6, 'Comunidad Valenciana': 1.4, 'Cataluña': 0.3, 'País Vasco': 0.4 }
  };

  // Provincial swing: increases are spread partly uniformly and partly in
  // proportion to the party's existing strength; decreases are proportional.
  var SWING_SMOOTHING = 0.02;

  function shareTable(lists, blank) {
    var total = 0;
    lists.forEach(function (l) { total += l[2]; });
    var shares = {};
    lists.forEach(function (l) { shares[l[0]] = l[2] / total; });
    return { shares: shares, candidacyVotes: total, blankRatio: blank / total };
  }

  // factor: optional national multiplier per party (the historical path of
  // 2014-15, see history_path_data.js).
  function normalisedSupport(support, factor) {
    factor = factor || {};
    var n = {};
    CLASSES.forEach(function (c) {
      var sum = 0;
      var v = {};
      STATEWIDE.forEach(function (p) {
        v[p] = Math.max(0, support[c][p] || 0) * (factor[p] === undefined ? 1 : factor[p]);
        sum += v[p];
      });
      n[c] = {};
      STATEWIDE.forEach(function (p) {
        n[c][p] = sum > 0 ? v[p] / sum : 0;
      });
    });
    return n;
  }

  function regionClassMix(classShare, region) {
    var f = CLASS_MIX_FACTORS[region] || {};
    var mix = {};
    var sum = 0;
    CLASSES.forEach(function (c) {
      mix[c] = classShare[c] * (f[c] === undefined ? 1 : f[c]);
      sum += mix[c];
    });
    CLASSES.forEach(function (c) { mix[c] /= sum; });
    return mix;
  }

  // Class-weighted support W[region][party] for statewide parties.
  function classWeights(state, regions) {
    var norm = normalisedSupport(state.classSupport, state.partyFactor);
    var W = {};
    regions.forEach(function (r) {
      var mix = regionClassMix(state.classShare, r);
      W[r] = {};
      STATEWIDE.forEach(function (p) {
        var w = 0;
        CLASSES.forEach(function (c) { w += mix[c] * norm[c][p]; });
        W[r][p] = w;
      });
    });
    return W;
  }

  // -------------------------------------------------------------------
  // Baseline: built once from the December 2015 result and the initial
  // class state. Stored outside the save game (it is derived data).
  // -------------------------------------------------------------------
  function buildBaseline(data, initialState) {
    var e = data.elections['2015'];
    var regions = Object.keys(data.regions);
    var provinces = {};
    var regionVotes = {};
    var regionTotal = {};
    regions.forEach(function (r) { regionVotes[r] = {}; regionTotal[r] = 0; });
    Object.keys(e.provinces).forEach(function (p) {
      var prov = e.provinces[p];
      var region = data.provinceRegion[p];
      var t = shareTable(prov.lists, prov.blank);
      provinces[p] = {
        region: region, shares: t.shares, candidacyVotes: t.candidacyVotes,
        blankRatio: t.blankRatio, population: prov.population
      };
      prov.lists.forEach(function (l) {
        regionVotes[region][l[0]] = (regionVotes[region][l[0]] || 0) + l[2];
        regionTotal[region] += l[2];
      });
    });
    var regionShares = {};
    regions.forEach(function (r) {
      regionShares[r] = {};
      Object.keys(regionVotes[r]).forEach(function (id) {
        regionShares[r][id] = regionVotes[r][id] / regionTotal[r];
      });
    });
    var W0 = classWeights(initialState, regions);
    // Multipliers that make established parties match their 2015 regional
    // result exactly; a national factor scales growth of the others.
    var M = {};
    var natA = {};
    var natW = {};
    var grand = 0;
    regions.forEach(function (r) { grand += regionTotal[r]; });
    STATEWIDE.forEach(function (p) { natA[p] = 0; natW[p] = 0; });
    regions.forEach(function (r) {
      M[r] = {};
      var weight = regionTotal[r] / grand;
      STATEWIDE.forEach(function (p) {
        natA[p] += weight * (regionShares[r][p] || 0);
        natW[p] += weight * W0[r][p];
        if (ESTABLISHED[p]) {
          M[r][p] = W0[r][p] > 0 ? (regionShares[r][p] || 0) / W0[r][p] : 0;
        }
      });
    });
    var scaleSum = 0;
    var scaleWeight = 0;
    Object.keys(ESTABLISHED).forEach(function (p) {
      scaleSum += natA[p];
      scaleWeight += natW[p];
    });
    return {
      regions: regions,
      provinces: provinces,
      regionShares: regionShares,
      W0: W0,
      M: M,
      growthScale: scaleSum / scaleWeight
    };
  }

  // -------------------------------------------------------------------
  // Initial game state for the model (lives in the save game, Q.*).
  // -------------------------------------------------------------------
  function initialState() {
    return {
      classShare: clone(CLASS_SHARE_2015),
      classSupport: clone(CLASS_SUPPORT_2015),
      // multiplier per region and statewide party, for regional events
      regionalMod: {},
      // multiplier per region on territorial parties' 2015 strength
      territorialMod: {},
      // lists that did not stand in 2015: {province: {party: share}}
      newLists: {},
      // statewide parties not standing (e.g. IU after joining Unidos Podemos)
      notStanding: {},
      // national multiplier per party for the historical path of 2014-15
      partyFactor: {}
    };
  }

  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  // -------------------------------------------------------------------
  // Regional vote shares (fractions of candidacy votes) for a state.
  // -------------------------------------------------------------------
  function regionalShares(state, base) {
    var W = classWeights(state, base.regions);
    var out = {};
    base.regions.forEach(function (r) {
      var A = base.regionShares[r];
      var raw = {};
      var rMod = (state.regionalMod && state.regionalMod[r]) || {};
      var tMod = (state.territorialMod && state.territorialMod[r]) || {};
      STATEWIDE.forEach(function (p) {
        if (state.notStanding && state.notStanding[p]) {
          return;
        }
        var mod = rMod[p] === undefined ? 1 : rMod[p];
        var v;
        if (ESTABLISHED[p]) {
          v = base.M[r][p] * W[r][p];
        } else {
          var aff = (NEW_PARTY_AFFINITY[p] && NEW_PARTY_AFFINITY[p][r]) || 1;
          v = (A[p] || 0) + base.growthScale * aff * (W[r][p] - base.W0[r][p]);
        }
        raw[p] = Math.max(0, v * mod);
      });
      Object.keys(A).forEach(function (id) {
        if (STATEWIDE.indexOf(id) === -1) {
          var m = tMod[id] === undefined ? 1 : tMod[id];
          raw[id] = A[id] * m;
        }
      });
      out[r] = raw;
    });
    return out;
  }

  // -------------------------------------------------------------------
  // Province ballots for a state: {province: {population, blank, lists}}.
  // -------------------------------------------------------------------
  function provinceBallots(state, base) {
    var regional = regionalShares(state, base);
    var ballots = {};
    Object.keys(base.provinces).forEach(function (pName) {
      var prov = base.provinces[pName];
      var r = prov.region;
      var now = regional[r];
      var then = base.regionShares[r];
      var shares = {};
      var ids = {};
      Object.keys(prov.shares).forEach(function (id) { ids[id] = true; });
      Object.keys(now).forEach(function (id) {
        // statewide parties appear wherever they have regional support
        if (STATEWIDE.indexOf(id) !== -1) {
          ids[id] = true;
        }
      });
      Object.keys(ids).forEach(function (id) {
        if (now[id] === undefined) {
          return; // not standing
        }
        var b = prov.shares[id] || 0;
        var B = then[id] || 0;
        var N = now[id];
        var s;
        if (N <= B) {
          s = B > 0 ? b * N / B : 0;
        } else {
          s = b + (N - B) * (b + SWING_SMOOTHING) / (B + SWING_SMOOTHING);
        }
        shares[id] = Math.max(0, s);
      });
      var extra = (state.newLists && state.newLists[pName]) || {};
      Object.keys(extra).forEach(function (id) { shares[id] = extra[id]; });
      var sum = 0;
      Object.keys(shares).forEach(function (id) { sum += shares[id]; });
      var lists = Object.keys(shares).map(function (id) {
        return { id: id, votes: Math.round(prov.candidacyVotes * shares[id] / sum) };
      });
      ballots[pName] = {
        population: prov.population,
        blank: Math.round(prov.candidacyVotes * prov.blankRatio),
        lists: lists
      };
    });
    return ballots;
  }

  // National vote shares (percent of candidacy votes) - used for polls.
  function nationalShares(ballots) {
    var votes = {};
    var total = 0;
    Object.keys(ballots).forEach(function (p) {
      ballots[p].lists.forEach(function (l) {
        votes[l.id] = (votes[l.id] || 0) + l.votes;
        total += l.votes;
      });
    });
    var shares = {};
    Object.keys(votes).forEach(function (id) { shares[id] = 100 * votes[id] / total; });
    return shares;
  }

  // Seat apportionment in force for an election held on `year`/`month`:
  // the most recent historical decree's population figures.
  function apportionmentFor(data, year, month) {
    var keys = Object.keys(data.elections).sort(function (a, b) {
      return data.elections[a].date < data.elections[b].date ? -1 : 1;
    });
    var chosen = keys[0];
    var stamp = year * 100 + month;
    keys.forEach(function (k) {
      var d = data.elections[k].date.split('-');
      if (Number(d[0]) * 100 + Number(d[1]) <= stamp) {
        chosen = k;
      }
    });
    var pops = {};
    var provs = data.elections[chosen].provinces;
    Object.keys(provs).forEach(function (p) { pops[p] = provs[p].population; });
    return Electoral.apportionCongress(pops);
  }

  // Full general election for a state.
  function runGeneralElection(state, base, data, year, month) {
    var ballots = provinceBallots(state, base);
    var result = Electoral.electCongress(ballots, apportionmentFor(data, year, month));
    result.voteShares = nationalShares(ballots);
    result.ballots = ballots;
    return result;
  }

  var api = {
    STATEWIDE: STATEWIDE,
    CLASSES: CLASSES,
    initialState: initialState,
    buildBaseline: buildBaseline,
    regionalShares: regionalShares,
    provinceBallots: provinceBallots,
    nationalShares: nationalShares,
    apportionmentFor: apportionmentFor,
    runGeneralElection: runGeneralElection
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SpainVoteModel = api;
  }
})(this);
