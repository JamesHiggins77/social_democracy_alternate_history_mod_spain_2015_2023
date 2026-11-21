// Headless random playthroughs: runs the compiled game (out/game.json, made
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
const errors = {};

async function playOne(game) {
  const ui = makeUI();
  const e = new engine.DendryEngine(ui, game);
  // report script errors with the scene they came from
  const log = console.log;
  console.log = (...a) => {
    if (typeof a[0] === 'string' && a[0].startsWith('Error:')) {
      errors[a[0].split('\n')[0] + ' in ' + (e.state && e.state.sceneId)] = (errors[a[0].split('\n')[0] + ' in ' + (e.state && e.state.sceneId)] || 0) + 1;
      return;
    }
    log(...a);
  };
  e.beginGame();
  const Q = () => e.state.qualities;
  const elections = [];
  let grand = null;
  let lastElections = 0;
  let steps = 0;
  let stuck = 0;
  while (!e.isGameOver() && steps < 6000) {
    steps += 1;
    const q = Q();
    if ((q.elections_held || 0) > lastElections && q.congress) {
      lastElections = q.elections_held;
      const vs = q.vote_shares || {};
      elections.push({ date: q.year + '-' + String(q.month).padStart(2, '0'), seats: Object.assign({}, q.congress),
                       vox_share: Math.round(10 * (vs.vox || 0)) / 10, pp_share: Math.round(10 * (vs.pp || 0)) / 10,
                       grand: !!q.grand_coalition });
    }
    if (q.grand_coalition && !grand) {
      grand = q.year + '-' + String(q.month).padStart(2, '0');
    }
    if (q.year > 2026) { break; }
    const scene = e.getCurrentScene();
    if (scene.isHand) {
      const hand = e.state.currentHands[e.state.sceneId] || [];
      if (hand.length < (scene.maxCards || 3) && ui.decks.length) {
        const order = ui.decks.slice().sort(() => Math.random() - 0.5);
        for (const d of order) {
          const c = e.drawCard(d.id);
          if (c && c.id) { break; }
        }
      }
      const now = e.state.currentHands[e.state.sceneId] || [];
      if (now.length) {
        e.playCard(pick(now).id);
        stuck = 0;
      } else if (ui.pinned.length) {
        e.playPinnedCard(pick(ui.pinned).id);
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
    // from the start menu, always start a campaign (not the lab or credits)
    const start = ok.filter(([c]) => /new campaign/i.test(c.title || ''));
    if (start.length) { ok = start; }
    if (!ok.length) { break; }
    let choice = pick(ok);
    if (FORCE_GRAND) {
      const g = ok.find(([c]) => /grand coalition/i.test(c.title || ''));
      if (g) { choice = g; }
    }
    e.choose(choice[1]);
  }
  console.log = log;
  const q = Q();
  return { elections, grand, end: q.year + '-' + q.month, pm: q.pm, government: q.government_type,
           flags: { cat_crisis: q.cat_crisis_seen || 0, vistalegre: q.vox_rise_seen || 0, breakthrough: q.vox_breakthrough || 0 },
           lost: q.loss_text || '', steps };
}

(async function main() {
  const game = await loadGame();
  const runs = [];
  for (let i = 0; i < GAMES; i++) {
    runs.push(await playOne(game));
  }
  if (AS_JSON) {
    console.log(JSON.stringify(runs, null, 1));
    return;
  }
  const mean = a => a.length ? Math.round(10 * a.reduce((x, y) => x + y, 0) / a.length) / 10 : NaN;
  runs.forEach((r, i) => {
    console.log(`#${i + 1} ends ${r.end} ${r.government || ''}${r.lost ? ' [LOST]' : ''}${r.grand ? ' grand coalition from ' + r.grand : ''}` +
      `  {crisis ${r.flags.cat_crisis} vistalegre ${r.flags.vistalegre} breakthrough ${r.flags.breakthrough}}`);
    r.elections.forEach(el => console.log(`    ${el.date}  PP ${el.seats.pp || 0}  PSOE ${el.seats.psoe || 0}  UP ${el.seats.up || 0}  Cs ${el.seats.cs || 0}  Vox ${el.seats.vox || 0} (${el.vox_share}%)${el.grand ? '  [after grand coalition]' : ''}`));
  });
  const after2019 = runs.flatMap(r => r.elections.filter(el => el.date >= '2019-01'));
  const last = runs.map(r => r.elections[r.elections.length - 1]).filter(Boolean).filter(el => el.date >= '2019-01');
  console.log('\nElections from 2019:', after2019.length, ' mean Vox seats', mean(after2019.map(el => el.seats.vox || 0)),
    ' mean Vox share', mean(after2019.map(el => el.vox_share)));
  console.log('Last election of each game (from 2019):', last.length, ' mean Vox seats', mean(last.map(el => el.seats.vox || 0)));
  const g = runs.flatMap(r => r.elections.filter(el => el.grand));
  if (g.length) {
    console.log('Elections held during a grand coalition:', g.length, ' mean Vox seats', mean(g.map(el => el.seats.vox || 0)),
      ' mean Vox share', mean(g.map(el => el.vox_share)));
  }
  const noRise = runs.filter(r => !r.flags.vistalegre);
  console.log('Games without the Vistalegre surge:', noRise.length, '/', runs.length,
    noRise.length ? ' mean Vox seats at their elections from 2019: ' + mean(noRise.flatMap(r => r.elections.filter(el => el.date >= '2019-01')).map(el => el.seats.vox || 0)) : '');
  console.log('Games lost:', runs.filter(r => r.lost).length, '/', runs.length);
  const errs = Object.keys(errors);
  console.log('Script errors:', errs.length ? '' : 'none');
  errs.forEach(k => console.log(`  ${errors[k]}x ${k}`));
})();
