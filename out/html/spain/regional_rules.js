// Electoral rules and calendars of the seventeen regional parliaments.
//
// Seat magnitudes per district come from the official results for
// province-based chambers (see regional_data.js); island and sub-provincial
// districts are listed here.  A future election uses the magnitudes of the
// most recent historical election on or before its date.
(function (root) {
  'use strict';

  var Electoral = (typeof module !== 'undefined' && module.exports)
    ? require('./electoral_engine.js') : root.SpainElectoral;

  // Calendar types:
  //   'may'  - the common cycle with municipal elections on the fourth Sunday
  //            of May every four years (2015, 2019, 2023). Early dissolution
  //            is allowed only where noted; `snapKeepsCycle` means a snap
  //            parliament only serves until the next common date.
  //   'own'  - the region's own four-year calendar, set by its last election;
  //            the regional president can dissolve early.
  var RULES = {
    'Andalucía': { chamber: 'Parlamento de Andalucía', seats: 109, calendar: 'own',
      threshold: { pct: 0.03, scope: 'district' } },
    'Aragón': { chamber: 'Cortes de Aragón', seats: 67, calendar: 'may', canDissolve: true,
      snapKeepsCycle: false, threshold: { pct: 0.03, scope: 'district' } },
    'Asturias': { chamber: 'Junta General', seats: 45, calendar: 'may', canDissolve: true,
      snapKeepsCycle: true, threshold: { pct: 0.03, scope: 'district' },
      magnitudes: { '2011-01-01': { Central: 34, Occidental: 6, Oriental: 5 } } },
    'Baleares': { chamber: 'Parlament de les Illes Balears', seats: 59, calendar: 'may',
      canDissolve: true, snapKeepsCycle: false, threshold: { pct: 0.05, scope: 'district' },
      magnitudes: { '2011-01-01': { Mallorca: 33, Menorca: 13, Eivissa: 12, Formentera: 1 } } },
    'Canarias': { chamber: 'Parlamento de Canarias', seats: 70, calendar: 'may',
      canDissolve: true, snapKeepsCycle: false,
      // 2018 reform: 9-seat regional list; island lists need 15% on the
      // island or 4% across the region. Before: 30% insular or 6% regional.
      threshold: { canarias: true },
      magnitudes: {
        '2011-01-01': { 'Gran Canaria': 15, 'Tenerife': 15, 'Lanzarote': 8, 'Fuerteventura': 7,
                        'La Palma': 8, 'La Gomera': 4, 'El Hierro': 3 },
        '2018-01-01': { 'Gran Canaria': 15, 'Tenerife': 15, 'Lanzarote': 8, 'Fuerteventura': 8,
                        'La Palma': 8, 'La Gomera': 4, 'El Hierro': 3, 'Regional': 9 }
      } },
    'Cantabria': { chamber: 'Parlamento de Cantabria', seats: 35, calendar: 'may',
      canDissolve: true, snapKeepsCycle: true, threshold: { pct: 0.05, scope: 'district' } },
    'Castilla-La Mancha': { chamber: 'Cortes de Castilla-La Mancha', seats: 33, calendar: 'may',
      canDissolve: true, snapKeepsCycle: true, threshold: { pct: 0.03, scope: 'district' } },
    'Castilla y León': { chamber: 'Cortes de Castilla y León', seats: 81, calendar: 'may',
      canDissolve: true, snapKeepsCycle: false, threshold: { pct: 0.03, scope: 'district' } },
    'Cataluña': { chamber: 'Parlament de Catalunya', seats: 135, calendar: 'own',
      threshold: { pct: 0.03, scope: 'district' } },
    'Comunidad Valenciana': { chamber: 'Corts Valencianes', seats: 99, calendar: 'may',
      canDissolve: true, snapKeepsCycle: false, threshold: { pct: 0.05, scope: 'region' } },
    'Extremadura': { chamber: 'Asamblea de Extremadura', seats: 65, calendar: 'may',
      canDissolve: true, snapKeepsCycle: false,
      threshold: { pct: 0.05, scope: 'district-or-region' } },
    'Galicia': { chamber: 'Parlamento de Galicia', seats: 75, calendar: 'own',
      threshold: { pct: 0.05, scope: 'district' } },
    'La Rioja': { chamber: 'Parlamento de La Rioja', seats: 33, calendar: 'may',
      canDissolve: true, snapKeepsCycle: true, threshold: { pct: 0.05, scope: 'district' } },
    'Madrid': { chamber: 'Asamblea de Madrid', seats: 'varies', calendar: 'may',
      canDissolve: true, snapKeepsCycle: true, threshold: { pct: 0.05, scope: 'district' } },
    'Región de Murcia': { chamber: 'Asamblea Regional de Murcia', seats: 45, calendar: 'may',
      canDissolve: true, snapKeepsCycle: true,
      // 2015 reform, first applied in 2019: single district (was five) and a
      // 3% regional threshold (was 5%).
      threshold: { pct: 0.03, scope: 'region' },
      thresholdBefore: { '2019-01-01': { pct: 0.05, scope: 'region' } } },
    'Navarra': { chamber: 'Parlamento de Navarra', seats: 50, calendar: 'may',
      canDissolve: true, snapKeepsCycle: false, threshold: { pct: 0.03, scope: 'district' } },
    'País Vasco': { chamber: 'Parlamento Vasco', seats: 75, calendar: 'own',
      threshold: { pct: 0.03, scope: 'district' } }
  };

  function magnitudesFor(region, date, historical) {
    var r = RULES[region];
    if (r.magnitudes) {
      var chosen = null;
      Object.keys(r.magnitudes).sort().forEach(function (d) {
        if (d <= date) {
          chosen = r.magnitudes[d];
        }
      });
      return chosen;
    }
    // province-based: magnitudes of the latest historical election <= date
    var dates = Object.keys(historical).sort();
    var pick = dates[0];
    dates.forEach(function (d) {
      if (d <= date) {
        pick = d;
      }
    });
    var m = {};
    var ds = historical[pick].districts;
    Object.keys(ds).forEach(function (n) { m[n] = ds[n].seats; });
    return m;
  }

  function sumVotes(lists, blank) {
    var t = blank || 0;
    lists.forEach(function (l) { t += l.votes; });
    return t;
  }

  // ballots: {district: {blank, lists: [{id, votes}] or [[id, label, votes]]}}
  function electRegion(region, ballots, date, historical) {
    var rules = RULES[region];
    var mags = magnitudesFor(region, date, historical);
    var districts = {};
    Object.keys(mags).forEach(function (d) {
      var b = ballots[d];
      if (!b && d === 'Regional') {
        b = mergeBallots(ballots);
      }
      if (!b && Object.keys(ballots).length === 1 && Object.keys(mags).length === 1) {
        // single-district chamber whose district was renamed in the source
        b = ballots[Object.keys(ballots)[0]];
      }
      if (!b) {
        throw new Error(region + ': no ballots for district ' + d);
      }
      districts[d] = {
        seats: mags[d], blank: b.blank,
        lists: b.lists.map(function (l) { return Array.isArray(l) ? { id: l[0], votes: l[2] } : l; })
      };
    });
    var t = rules.threshold;
    if (rules.thresholdBefore) {
      Object.keys(rules.thresholdBefore).sort().reverse().forEach(function (until) {
        if (date < until) {
          t = rules.thresholdBefore[until];
        }
      });
    }
    var chamberRules;
    if (t.canarias) {
      var reformed = date >= '2018-01-01';
      var islandPct = reformed ? 0.15 : 0.30;
      var regionPct = reformed ? 0.04 : 0.06;
      // regional share is measured over the island districts only
      var islands = {};
      Object.keys(districts).forEach(function (d) {
        if (d !== 'Regional') { islands[d] = districts[d]; }
      });
      var regionVotes = {};
      var regionValid = 0;
      Object.keys(islands).forEach(function (d) {
        regionValid += islands[d].blank;
        islands[d].lists.forEach(function (l) {
          regionVotes[l.id] = (regionVotes[l.id] || 0) + l.votes;
          regionValid += l.votes;
        });
      });
      chamberRules = {
        passThreshold: function (id, ctx) {
          var regional = regionVotes[id] >= regionPct * regionValid;
          if (ctx.district === 'Regional') {
            return regional;
          }
          return regional || ctx.votes >= islandPct * ctx.districtValid;
        }
      };
    } else if (t.scope === 'district-or-region') {
      chamberRules = {
        passThreshold: function (id, ctx) {
          return ctx.votes >= t.pct * ctx.districtValid || ctx.regionVotes >= t.pct * ctx.regionValid;
        }
      };
    } else {
      chamberRules = { threshold: t.pct, thresholdScope: t.scope };
    }
    return Electoral.allocateChamber(districts, chamberRules);
  }

  function mergeBallots(ballots) {
    var votes = {};
    var blank = 0;
    Object.keys(ballots).forEach(function (d) {
      blank += ballots[d].blank;
      ballots[d].lists.forEach(function (l) {
        var id = Array.isArray(l) ? l[0] : l.id;
        var v = Array.isArray(l) ? l[2] : l.votes;
        votes[id] = (votes[id] || 0) + v;
      });
    });
    return {
      blank: blank,
      lists: Object.keys(votes).map(function (id) { return { id: id, votes: votes[id] }; })
    };
  }

  // Next regular election date (YYYY-MM-DD) for a region, given the date of
  // its last election and whether that election was a snap one.
  function nextRegularElection(region, lastElection, lastWasSnap) {
    var r = RULES[region];
    var y = Number(lastElection.slice(0, 4));
    if (r.calendar === 'may' && (!lastWasSnap || r.snapKeepsCycle)) {
      var next = 2015;
      while (next <= y || (lastWasSnap && next < y)) {
        next += 4;
      }
      return fourthSundayOfMay(next);
    }
    return (y + 4) + lastElection.slice(4);
  }

  function fourthSundayOfMay(year) {
    var d = new Date(Date.UTC(year, 4, 1));
    var firstSunday = 1 + ((7 - d.getUTCDay()) % 7);
    var day = firstSunday + 21;
    return year + '-05-' + (day < 10 ? '0' : '') + day;
  }

  var api = {
    RULES: RULES,
    magnitudesFor: magnitudesFor,
    electRegion: electRegion,
    nextRegularElection: nextRegularElection,
    fourthSundayOfMay: fourthSundayOfMay
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SpainRegionalRules = api;
  }
})(this);
