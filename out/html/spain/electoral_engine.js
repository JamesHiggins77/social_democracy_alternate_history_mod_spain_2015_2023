// Spanish electoral arithmetic: seat apportionment and D'Hondt allocation.
//
// Used for the Congress of Deputies (52 constituencies) and for regional
// parliaments, whose rules differ only in district magnitudes and thresholds.
// Works in the browser (window.SpainElectoral) and in Node (require).
(function (root) {
  'use strict';

  // ---------------------------------------------------------------------
  // Seat apportionment between provinces (LOREG art. 162).
  //
  // Ceuta and Melilla elect one deputy each. Every other province gets an
  // initial minimum of two seats; the remaining seats are shared by
  // population using the largest-remainder method.
  // ---------------------------------------------------------------------
  function apportionCongress(populations, opts) {
    opts = opts || {};
    var total = opts.total || 350;
    var minimum = opts.minimum === undefined ? 2 : opts.minimum;
    var fixed = opts.fixed || { 'Ceuta': 1, 'Melilla': 1 };
    var seats = {};
    var provinces = [];
    var remaining = total;
    var populationSum = 0;
    Object.keys(populations).forEach(function (p) {
      if (fixed[p] !== undefined) {
        seats[p] = fixed[p];
        remaining -= fixed[p];
      } else {
        seats[p] = minimum;
        remaining -= minimum;
        provinces.push(p);
        populationSum += populations[p];
      }
    });
    return largestRemainder(populations, provinces, populationSum, remaining, seats);
  }

  // Shares `pool` seats among `keys` in proportion to `weights` (Hare quota,
  // largest remainders), adding to any seats already in `seats`.
  function largestRemainder(weights, keys, weightSum, pool, seats) {
    seats = seats || {};
    var quota = weightSum / pool;
    var given = 0;
    var remainders = [];
    keys.forEach(function (k) {
      var exact = weights[k] / quota;
      var whole = Math.floor(exact);
      seats[k] = (seats[k] || 0) + whole;
      given += whole;
      remainders.push({ key: k, rest: exact - whole, weight: weights[k] });
    });
    remainders.sort(function (a, b) {
      return (b.rest - a.rest) || (b.weight - a.weight);
    });
    for (var i = 0; i < pool - given; i++) {
      seats[remainders[i].key] += 1;
    }
    return seats;
  }

  // ---------------------------------------------------------------------
  // D'Hondt allocation within one district (LOREG art. 163).
  //
  // lists: [{id, votes}], one entry per candidacy on the ballot.
  // opts.threshold: fraction of valid votes (candidacies + blank) a list
  //   needs to enter the count, e.g. 0.03.
  // opts.blank: blank votes, which count towards valid votes.
  // opts.eligible: optional set {id: true}; when given, only these lists
  //   compete (used for region-wide thresholds).
  // Ties are broken in favour of the list with more votes overall; an exact
  // tie is resolved by ballot order here (the law uses a draw).
  // ---------------------------------------------------------------------
  function dhondt(lists, seats, opts) {
    opts = opts || {};
    var threshold = opts.threshold || 0;
    var valid = (opts.blank || 0);
    lists.forEach(function (l) { valid += l.votes; });
    var competing = lists.filter(function (l) {
      if (opts.eligible && !opts.eligible[l.id]) {
        return false;
      }
      return l.votes > 0 && l.votes >= threshold * valid;
    });
    var result = {};
    competing.forEach(function (l) { result[l.id] = 0; });
    for (var s = 0; s < seats; s++) {
      var best = null;
      var bestQuotient = -1;
      competing.forEach(function (l) {
        var q = l.votes / (result[l.id] + 1);
        if (q > bestQuotient || (q === bestQuotient && best && l.votes > best.votes)) {
          best = l;
          bestQuotient = q;
        }
      });
      if (!best) {
        break;
      }
      result[best.id] += 1;
    }
    Object.keys(result).forEach(function (id) {
      if (result[id] === 0) {
        delete result[id];
      }
    });
    return result;
  }

  // ---------------------------------------------------------------------
  // Whole-chamber allocation.
  //
  // districts: {name: {seats, blank, lists: [{id, votes}]}}
  // rules.threshold: fraction (default 0.03).
  // rules.thresholdScope: 'district' (default) or 'region' - a region-wide
  //   threshold is measured against valid votes in the whole chamber.
  // rules.passThreshold: optional function(id, ctx) -> bool, for systems
  //   with alternative thresholds (e.g. the Canary Islands).
  // Returns {totals: {id: seats}, districts: {name: {id: seats}}}.
  // ---------------------------------------------------------------------
  function allocateChamber(districts, rules) {
    rules = rules || {};
    var threshold = rules.threshold === undefined ? 0.03 : rules.threshold;
    var scope = rules.thresholdScope || 'district';
    var regionVotes = {};
    var regionValid = 0;
    Object.keys(districts).forEach(function (d) {
      regionValid += districts[d].blank || 0;
      districts[d].lists.forEach(function (l) {
        regionVotes[l.id] = (regionVotes[l.id] || 0) + l.votes;
        regionValid += l.votes;
      });
    });
    var totals = {};
    var byDistrict = {};
    Object.keys(districts).forEach(function (d) {
      var district = districts[d];
      var opts = { blank: district.blank || 0 };
      if (rules.passThreshold) {
        opts.eligible = {};
        var dValid = opts.blank;
        district.lists.forEach(function (l) { dValid += l.votes; });
        district.lists.forEach(function (l) {
          var ctx = {
            district: d, votes: l.votes, districtValid: dValid,
            regionVotes: regionVotes[l.id], regionValid: regionValid
          };
          if (rules.passThreshold(l.id, ctx)) {
            opts.eligible[l.id] = true;
          }
        });
      } else if (scope === 'region') {
        opts.eligible = {};
        Object.keys(regionVotes).forEach(function (id) {
          if (regionVotes[id] >= threshold * regionValid) {
            opts.eligible[id] = true;
          }
        });
      } else {
        opts.threshold = threshold;
      }
      var res = dhondt(district.lists, district.seats, opts);
      byDistrict[d] = res;
      Object.keys(res).forEach(function (id) {
        totals[id] = (totals[id] || 0) + res[id];
      });
    });
    return { totals: totals, districts: byDistrict };
  }

  // Congress of Deputies from province-level ballots.
  // provinces: {name: {population, blank, lists: [[id, label, votes]] or [{id, votes}]}}
  // apportionment: optional {name: seats}; computed from population if absent.
  function electCongress(provinces, apportionment) {
    if (!apportionment) {
      var pops = {};
      Object.keys(provinces).forEach(function (p) { pops[p] = provinces[p].population; });
      apportionment = apportionCongress(pops);
    }
    var districts = {};
    Object.keys(provinces).forEach(function (p) {
      districts[p] = {
        seats: apportionment[p],
        blank: provinces[p].blank || 0,
        lists: provinces[p].lists.map(normaliseList)
      };
    });
    var result = allocateChamber(districts, { threshold: 0.03 });
    result.apportionment = apportionment;
    return result;
  }

  function normaliseList(l) {
    return Array.isArray(l) ? { id: l[0], votes: l[2] } : l;
  }

  // Seats needed for an absolute majority of a chamber.
  function absoluteMajority(chamberSize) {
    return Math.floor(chamberSize / 2) + 1;
  }

  var api = {
    apportionCongress: apportionCongress,
    largestRemainder: largestRemainder,
    dhondt: dhondt,
    allocateChamber: allocateChamber,
    electCongress: electCongress,
    absoluteMajority: absoluteMajority
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SpainElectoral = api;
  }
})(this);
