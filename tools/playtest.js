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
    if (start.length) { ok = start.filter(([c]) => (AHIST ? /ahistorical/i : /: historical/i).test(c.title || '')); if (!ok.length) { ok = start; } }
    // --smart: a sensible player avoids the extreme and self-destructive options
    if (SMART && ok.length > 1) {
      const BAD = /nation of nations|federal Europe|Recentralise|Stand up to Brussels|hard bargain|Resign|Repeal|Anti-Capitalist|dark arts|Rig|sabotage|Leave politics|Call it what it is|refuse/i;
      const good = ok.filter(([c]) => !BAD.test(c.title || ''));
      if (good.length) { ok = good; }
    }
    // --good: a strong player also prefers the moves that build a majority
    // and keep the party and partners on side
    if (GOOD && ok.length > 1) {
      const PREF = /agreement with Podemos|In proportion|Pay the price|Present the budget|Present the|Seek investiture|Go to the debate|primary of the members|Fight it out|Federal Committee|Defend the government|Four more years|Stop the right|government in waiting|Time for a change|Sign the draft|Accept the draft|Bring them in|minimum wage|pensions|welfare|Decent jobs|federal reform|Spain at the heart|Pro-European|Firmly unionist|dialogue|Look presidential|Keep the party together|stays|Hold the parliamentary group/i;
      const pref = ok.filter(([c]) => PREF.test(c.title || ''));
      if (pref.length && Math.random() < 0.8) { ok = pref; }
    }
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
           flags: { cdate: q.congress_date_seen || 0, seat: q.seat_seen || 0, iceta: q.iceta_seen || 0, recupera: q.recupera_seen || 0, crowd: q.crowdfund_seen || 0, heredia: q.heredia_seen || 0, chacon: q.chacon_seen || 0, demand: q.demand_seen || 0, cat_crisis: q.cat_crisis_seen || 0, vistalegre: q.vox_rise_seen || 0, breakthrough: q.vox_breakthrough || 0 },
           pm_months: q.pm_months || 0, psc: q.psc_split || 0, left: q.left_split || 0, coup: q.rebellion_used || 0,
           right: (q.realign && q.realign.right && q.realign.right.leader) || 'pp', leftLead: (q.realign && q.realign.left && q.realign.left.leader) || 'psoe',
           vox_final: Math.round(10 * ((q.true_poll || {}).vox || 0)) / 10, pp_final: Math.round(10 * ((q.true_poll || {}).pp || 0)) / 10,
           psoe_final: Math.round(10 * ((q.true_poll || {}).psoe || 0)) / 10,
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
      `  {cdate ${r.flags.cdate} seat ${r.flags.seat} iceta ${r.flags.iceta} rec ${r.flags.recupera} crowd ${r.flags.crowd} her ${r.flags.heredia} chacon ${r.flags.chacon} demand ${r.flags.demand} crisis ${r.flags.cat_crisis} vistalegre ${r.flags.vistalegre} breakthrough ${r.flags.breakthrough}}`);
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
  console.log('Months as PM: mean', mean(runs.map(r => r.pm_months)), ' max', Math.max(...runs.map(r => r.pm_months)), ' reached 102:', runs.filter(r => r.pm_months >= 102).length);
  console.log('Final polls: PSOE', mean(runs.map(r => r.psoe_final)), ' PP', mean(runs.map(r => r.pp_final)), ' Vox', mean(runs.map(r => r.vox_final)));
  console.log('PSC splits', runs.filter(r => r.psc).length, ' left splits', runs.filter(r => r.left).length, ' coups', runs.filter(r => r.coup).length,
    ' right led by', runs.map(r => r.right).join(','), ' left led by', runs.map(r => r.leftLead).join(','));
  const errs = Object.keys(errors);
  console.log('Script errors:', errs.length ? '' : 'none');
  errs.forEach(k => console.log(`  ${errors[k]}x ${k}`));
})();
