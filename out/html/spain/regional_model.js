// Regional parliament elections driven by the vote model.
//
// Each community's last real regional result is the baseline. The change in
// that community's vote since December 2015 (from the class + regional vote
// model) is applied to every district as a swing, then the community's own
// electoral rules allocate the seats.  Parties that only stand in regional
// elections (PAR, Compromís, Foro...) hold their baseline strength unless the
// game changes their territorial modifier.
(function (root) {
  'use strict';

  var isNode = typeof module !== 'undefined' && module.exports;
  var VoteModel = isNode ? require('./vote_model.js') : root.SpainVoteModel;
  var Rules = isNode ? require('./regional_rules.js') : root.SpainRegionalRules;

  var GAME_START = '2015-12-20';
  var SMOOTHING = 0.02;
  // Regional lists standing for several general-election parties at once.
  var ALIASES = { jxsi: ['erc', 'junts'] };

  // Who governs each community when the game starts (December 2015).
  var GOVERNMENTS_2015 = {
    'Andalucía': { type: 'Minority with external support', president: 'Susana Díaz', party: 'psoe', cabinet: ['psoe'], support: ['cs'] },
    'Aragón': { type: 'Minority coalition with external support', president: 'Javier Lambán', party: 'psoe', cabinet: ['psoe', 'cha'], support: ['up', 'iu'] },
    'Asturias': { type: 'Minority', president: 'Javier Fernández', party: 'psoe', cabinet: ['psoe'], support: [] },
    'Baleares': { type: 'Minority coalition with external support', president: 'Francina Armengol', party: 'psoe', cabinet: ['psoe', 'mes'], support: ['up'] },
    'Canarias': { type: 'Coalition majority', president: 'Fernando Clavijo', party: 'cc', cabinet: ['cc', 'psoe'], support: [] },
    'Cantabria': { type: 'Minority coalition', president: 'Miguel Ángel Revilla', party: 'prc', cabinet: ['prc', 'psoe'], support: [] },
    'Castilla-La Mancha': { type: 'Minority with external support', president: 'Emiliano García-Page', party: 'psoe', cabinet: ['psoe'], support: ['up'] },
    'Castilla y León': { type: 'Minority', president: 'Juan Vicente Herrera', party: 'pp', cabinet: ['pp'], support: [] },
    'Cataluña': { type: 'Acting (no investiture yet)', president: 'Artur Mas (acting)', party: 'jxsi', cabinet: ['jxsi'], support: [],
                  note: 'JxSí needs the CUP for an investiture; the CUP refuses Mas.' },
    'Comunidad Valenciana': { type: 'Minority coalition with external support', president: 'Ximo Puig', party: 'psoe', cabinet: ['psoe', 'compromis'], support: ['up'] },
    'Extremadura': { type: 'Minority', president: 'Guillermo Fernández Vara', party: 'psoe', cabinet: ['psoe'], support: [] },
    'Galicia': { type: 'Majority', president: 'Alberto Núñez Feijóo', party: 'pp', cabinet: ['pp'], support: [] },
    'La Rioja': { type: 'Minority with external support', president: 'José Ignacio Ceniceros', party: 'pp', cabinet: ['pp'], support: ['cs'] },
    'Madrid': { type: 'Minority with external support', president: 'Cristina Cifuentes', party: 'pp', cabinet: ['pp'], support: ['cs'] },
    'Región de Murcia': { type: 'Minority with external support', president: 'Pedro Antonio Sánchez', party: 'pp', cabinet: ['pp'], support: ['cs'] },
    'Navarra': { type: 'Minority coalition with external support', president: 'Uxue Barkos', party: 'geroa', cabinet: ['geroa', 'up', 'x:I-E'],
                 support: ['bildu'] },
    'País Vasco': { type: 'Minority', president: 'Iñigo Urkullu', party: 'pnv', cabinet: ['pnv'], support: [] }
  };

  function baselineDate(elections, asOf) {
    var pick = null;
    Object.keys(elections).sort().forEach(function (d) {
      if (d <= asOf) {
        pick = d;
      }
    });
    return pick;
  }

  // Starting composition of every regional parliament.
  function startingParliaments(regionalData) {
    var out = {};
    Object.keys(regionalData.regions).forEach(function (r) {
      var els = regionalData.regions[r];
      var d = baselineDate(els, GAME_START);
      var votes = {};
      var total = 0;
      Object.keys(els[d].districts).forEach(function (dn) {
        els[d].districts[dn].lists.forEach(function (l) {
          votes[l[0]] = (votes[l[0]] || 0) + l[2];
          total += l[2];
        });
      });
      var shares = {};
      Object.keys(votes).forEach(function (id) { shares[id] = 100 * votes[id] / total; });
      out[r] = {
        voteShares: shares,
        lastElection: d,
        lastWasSnap: false,
        seats: JSON.parse(JSON.stringify(els[d].seats)),
        government: GOVERNMENTS_2015[r],
        nextElection: Rules.nextRegularElection(r, d, false)
      };
    });
    return out;
  }

  function normalise(raw) {
    var sum = 0;
    var out = {};
    Object.keys(raw).forEach(function (k) { sum += raw[k]; });
    Object.keys(raw).forEach(function (k) { out[k] = sum > 0 ? raw[k] / sum : 0; });
    return out;
  }

  function swing(b, B, N) {
    if (N <= B) {
      return B > 0 ? b * N / B : 0;
    }
    return b + (N - B) * (b + SMOOTHING) / (B + SMOOTHING);
  }

  // Ballots for a regional election in `region` on `date`.
  function regionalBallots(state, base, regionalData, region, asOf) {
    var els = regionalData.regions[region];
    var baseline = els[baselineDate(els, asOf || GAME_START)];
    var now = normalise(VoteModel.regionalShares(state, base)[region]);
    var then = base.regionShares[region];
    var tMod = (state.territorialMod && state.territorialMod[region]) || {};
    var ballots = {};
    Object.keys(baseline.districts).forEach(function (dName) {
      var d = baseline.districts[dName];
      var total = 0;
      d.lists.forEach(function (l) { total += l[2]; });
      var shares = {};
      d.lists.forEach(function (l) {
        var id = l[0];
        var b = l[2] / total;
        var ids = ALIASES[id] || [id];
        var N = 0;
        var B = 0;
        var known = false;
        ids.forEach(function (g) {
          // follow the general-election trend only where the party stood
          // in this community's December 2015 general-election vote
          if (then[g] > 0) {
            known = true;
          }
          N += now[g] || 0;
          B += then[g] || 0;
        });
        if (known) {
          shares[id] = swing(b, B, N);
        } else {
          shares[id] = b * (tMod[id] === undefined ? 1 : tMod[id]);
        }
      });
      // statewide parties that did not stand in the baseline regional vote
      Object.keys(now).forEach(function (g) {
        if (shares[g] === undefined && VoteModel.STATEWIDE.indexOf(g) !== -1 && now[g] > (then[g] || 0)) {
          shares[g] = now[g] - (then[g] || 0);
        }
      });
      var sum = 0;
      Object.keys(shares).forEach(function (id) { sum += shares[id]; });
      ballots[dName] = {
        blank: d.blank,
        lists: Object.keys(shares).map(function (id) {
          return { id: id, votes: Math.round(total * shares[id] / sum) };
        })
      };
    });
    return ballots;
  }

  function runRegionalElection(state, base, regionalData, region, date) {
    var ballots = regionalBallots(state, base, regionalData, region);
    return Rules.electRegion(region, ballots, date, regionalData.regions[region]);
  }

  var api = {
    GOVERNMENTS_2015: GOVERNMENTS_2015,
    startingParliaments: startingParliaments,
    regionalBallots: regionalBallots,
    runRegionalElection: runRegionalElection
  };
  if (isNode) {
    module.exports = api;
  } else {
    root.SpainRegionalModel = api;
  }
})(this);
