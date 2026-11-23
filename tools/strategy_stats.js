// Aggregates strategy_search.js runs into per-choice mean scores.
//   node tools/strategy_stats.js out.json runs1.json runs2.json ...
'use strict';
const fs = require('fs');
const [out, ...files] = process.argv.slice(2);
const runs = files.flatMap(f => JSON.parse(fs.readFileSync(f, 'utf8')));
const stats = {};
const all = runs.map(r => r.score);
const mean = all.reduce((a, b) => a + b, 0) / all.length;
runs.forEach(r => r.taken.forEach(k => {
  stats[k] = stats[k] || { n: 0, sum: 0 };
  stats[k].n += 1; stats[k].sum += r.score;
}));
Object.keys(stats).forEach(k => { stats[k].mean = stats[k].sum / stats[k].n; stats[k].lift = stats[k].mean - mean; });
stats.__mean = mean;
fs.writeFileSync(out, JSON.stringify(stats));
console.log('runs', runs.length, 'mean score', mean.toFixed(1));
