// Strategy search: plays the game headless (see playtest.js), logging every
// option and card chosen, and scores each game by the PSOE's results.
//   node tools/strategy_search.js N --out runs.json [--stats stats.json --eps 0.15]
// With --stats, choices are made greedily from the mean score of games in
// which each option was taken (epsilon-greedy); without it, at random
// (minus the self-destructive options, as --smart).
// Original header: Headless random playthroughs: runs the compiled game (out/game.json, made
// by `npx dendrynexus make-html`) in Node with the game's own engine and
// scripts, choosing cards and options at random, and reports what happens
// at each general election.
//
//   node tools/playtest.js [games=20] [--grand] [--json]
//
// --grand always offers the PP a grand coalition when the option appears,
// to measure its effect. Every other choice is random.
'use strict';
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const GAMES = Number(args.find(a => /^\d+$/.test(a)) || 20);
const FORCE_GRAND = args.includes('--grand');
const GOOD = args.includes('--good');
const SMART = args.includes('--smart') || GOOD;
const AHIST = args.includes('--ahist');
const AS_JSON = args.includes('--json');

// the browser globals the scenes expect
const spain = f => require(path.join(ROOT, 'out', 'html', 'spain', f));
global.window = global;
global.document = { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] };
global.SpainGame = spain('game_state.js');
global.SpainParliament = spain('parliament.js');
global.SpainUI = spain('spain_ui.js');
global.SpainVoteModel = spain('vote_model.js');

const engine = require(path.join(ROOT, 'node_modules', 'dendrynexus', 'lib', 'engine.js'));
const json = fs.readFileSync(path.join(ROOT, 'out', 'game.json'), 'utf8');

function loadGame() {
  return new Promise((resolve, reject) => engine.convertJSONToGame(json, (err, g) => err ? reject(err) : resolve(g)));
}

function makeUI() {
  const ui = { decks: [], hand: [], pinned: [] };
  const noop = () => {};
  ['beginGame', 'beginOutput', 'endOutput', 'newPage', 'removeChoices', 'displayContent', 'displayChoices',
   'displayGameOver', 'setStyle', 'setBg', 'setSprites', 'setSpriteStyle', 'audio', 'signal'].forEach(k => { ui[k] = noop; });
  ui.displayDecks = d => { ui.decks = d || []; };
  ui.displayHand = h => { ui.hand = h || []; };
  ui.displayPinnedCards = p => { ui.pinned = p || []; };
  return ui;
}


const pick = a => a[Math.floor(Math.random() * a.length)];
const OUT = (() => { const i = args.indexOf('--out'); return i >= 0 ? args[i + 1] : null; })();
const STATS = (() => { const i = args.indexOf('--stats'); return i >= 0 ? JSON.parse(fs.readFileSync(args[i + 1], 'utf8')) : null; })();
const EPS = (() => { const i = args.indexOf('--eps'); return i >= 0 ? Number(args[i + 1]) : 0.15; })();
const BAD = /nation of nations|federal Europe|Recentralise|Leave politics|Resign rather|dark arts|Rig|sabotage/i;
function value(key) {
  const s = STATS && STATS[key];
  if (!s || s.n < 3) { return null; }
  return s.mean;
}
function choose(options, keyOf) {
  if (!options.length) { return null; }
  if (!STATS || Math.random() < EPS) { return pick(options); }
  let best = null, bv = -Infinity;
  options.forEach(o => {
    const v = value(keyOf(o));
    const vv = v === null ? (STATS.__mean || 0) + 2 + Math.random() : v + Math.random() * 0.5;
    if (vv > bv) { bv = vv; best = o; }
  });
  return best;
}

async function playOne(game) {
  const ui = makeUI();
  const e = new engine.DendryEngine(ui, game);
  const log = console.log;
  console.log = () => {};
  e.beginGame();
  const Q = () => e.state.qualities;
  const taken = {};
  const seats = [], polls = [];
  let lastE = 0, lastM = -1, steps = 0, stuck = 0;
  while (!e.isGameOver() && steps < 6000) {
    steps += 1;
    const q = Q();
    if ((q.elections_held || 0) > lastE && q.congress) { lastE = q.elections_held; seats.push({ date: q.year + '-' + q.month, psoe: q.congress.psoe || 0, pp: q.congress.pp || 0, up: q.congress.up || 0, vox: q.congress.vox || 0, cs: q.congress.cs || 0 }); }
    const mk = q.year * 12 + q.month;
    if (mk !== lastM && q.true_poll) { lastM = mk; polls.push(q.true_poll.psoe || 0); }
    if (q.year > 2026) { break; }
    const scene = e.getCurrentScene();
    if (scene.isHand) {
      const hand = e.state.currentHands[e.state.sceneId] || [];
      if (hand.length < (scene.maxCards || 3) && ui.decks.length) {
        const d = choose(ui.decks.slice(), x => 'deck:' + x.id) || ui.decks[0];
        e.drawCard(d.id);
      }
      const now = e.state.currentHands[e.state.sceneId] || [];
      if (now.length) {
        const c = choose(now.slice(), x => 'card:' + x.id);
        taken['card:' + c.id] = 1;
        e.playCard(c.id); stuck = 0;
      } else if (ui.pinned.length) {
        const c = choose(ui.pinned.slice(), x => 'card:' + x.id);
        taken['card:' + c.id] = 1;
        e.playPinnedCard(c.id);
      } else {
        stuck += 1;
        const ch = (e.getCurrentChoices() || []).filter(c => c.canChoose !== false);
        if (ch.length) { e.choose(e.getCurrentChoices().indexOf(pick(ch))); }
        if (stuck > 5) { break; }
      }
      continue;
    }
    const all = e.getCurrentChoices() || [];
    let ok = all.map((c, i) => [c, i]).filter(([c]) => c.canChoose !== false && !c.unavailable);
    const start = ok.filter(([c]) => /new campaign/i.test(c.title || ''));
    if (start.length) { ok = start.filter(([c]) => (AHIST ? /ahistorical/i : /: historical/i).test(c.title || '')); if (!ok.length) { ok = start; } }
    if (ok.length > 1) { const g = ok.filter(([c]) => !BAD.test(c.title || '')); if (g.length) { ok = g; } }
    if (!ok.length) { break; }
    const sid = e.state.sceneId;
    const c = start.length ? ok[0] : choose(ok, ([o]) => 'opt:' + sid + ':' + (o.title || ''));
    if (!start.length) { taken['opt:' + sid + ':' + (c[0].title || '')] = 1; }
    e.choose(c[1]);
  }
  console.log = log;
  const q = Q();
  const advisers = Object.keys(q).filter(k => /^adv_[a-z]+$/.test(k) && q[k] === 1 && !/^adv_(count|pm|deputy|econ|loyalist|home)/.test(k)).map(k => k.slice(4));
  const meanPoll = polls.length ? polls.reduce((a, b) => a + b, 0) / polls.length : 0;
  const meanSeats = seats.length ? seats.reduce((a, b) => a + b.psoe, 0) / seats.length : 0;
  return { score: meanSeats + 3 * meanPoll, meanSeats, meanPoll, maxPoll: Math.max(...polls), finalPoll: q.true_poll ? q.true_poll.psoe : 0, seats,
           pm_months: q.pm_months || 0, advisers, econ: q.econ_word, social: q.social_word, constit: q.const_word, eu: q.eu_word, style: q.style_word,
           sanchismo: q.sanchismo, coup: q.rebellion_used || 0, leader: q.psoe_leader, taken: Object.keys(taken) };
}

(async function main() {
  const game = await loadGame();
  const runs = [];
  for (let i = 0; i < GAMES; i++) { runs.push(await playOne(game)); }
  if (OUT) { fs.writeFileSync(OUT, JSON.stringify(runs)); }
  runs.forEach((r, i) => console.log('#' + (i + 1), 'score', r.score.toFixed(1), 'seats', r.seats.map(s => s.psoe).join('/'), 'poll', r.meanPoll.toFixed(1), 'PM months', r.pm_months));
})();
