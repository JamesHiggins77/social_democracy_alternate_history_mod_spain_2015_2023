'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const E = require('../out/html/spain/entities.js');
const ROOT = path.join(__dirname, '..', 'out', 'html');

test('every mapped portrait, logo and emblem exists', () => {
  for (const map of [E.PARTY_IMG, E.PERSON_IMG, E.TOPIC_IMG]) {
    for (const [k, rel] of Object.entries(map)) {
      assert.ok(fs.existsSync(path.join(ROOT, E.IMG, rel)), k + ': ' + rel);
    }
  }
});

test('mapped people exist in the people list', () => {
  const names = new Set(E.PEOPLE.map(p => p[0][0]));
  for (const k of Object.keys(E.PERSON_IMG)) assert.ok(names.has(k), k);
});

test('event images in scenes exist', () => {
  const dir = path.join(__dirname, '..', 'source', 'scenes', 'spain');
  for (const f of fs.readdirSync(dir)) {
    const s = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of s.matchAll(/class="sp-event-img" src="([^"]+)"/g)) {
      assert.ok(fs.existsSync(path.join(ROOT, decodeURI(m[1]))), m[1]);
    }
  }
});

test('hover cards show the portrait and party logo', () => {
  const html = E.cardHtml('Pedro Sánchez', true);
  assert.ok(/sp-ent-photo/.test(html) && /sp-ent-plogo/.test(html));
  assert.ok(/sp-ent-emblem/.test(E.cardHtml('NATO', true)));
});
