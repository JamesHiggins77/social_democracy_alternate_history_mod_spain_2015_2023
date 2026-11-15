'use strict';
const test = require('node:test');
const assert = require('node:assert');
const U = require('../out/html/spain/spain_ui.js');

test('defeat thresholds: PP alone 186, PP + Vox 193', () => {
  assert.strictEqual(U.noPathToGovernment({ pp: 185 }).lost, false);
  assert.strictEqual(U.noPathToGovernment({ pp: 186 }).lost, true);
  assert.strictEqual(U.noPathToGovernment({ pp: 150, vox: 42 }).lost, false);
  assert.strictEqual(U.noPathToGovernment({ pp: 150, vox: 43 }).lost, true);
  assert.strictEqual(U.noPathToGovernment({ pp: 123 }).lost, false);
});
