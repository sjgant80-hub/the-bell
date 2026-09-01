// bell.test.mjs — the peal law, falsifiable. Load-bearing: a clean gate rings exactly on the
// classic ratios with the full peal, one survivor audibly cracks it (detune + buzz + collapsed
// decay), the recipe is deterministic, and a lying verdict is refused, never rung.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GOLDEN_TURN, PARTIALS, readVerdict, pealOf } from './bell.mjs';

const CLEAN = { clean: true, total: 39, killed: 39, survived: 0 };
const DIRTY = { clean: false, total: 10, killed: 8, survived: 2 };

test('READ — the whole-output law: prose never fools it, counts are the bell metal', () => {
  const out = 'mutation gate: room.mjs …\n{\n "total": 39, "killed": 39, "survived": [], "clean": true\n}\n✓ no test-theatre\n';
  assert.deepEqual(readVerdict(out), { ok: true, clean: true, total: 39, killed: 39, survived: 0 });
  const dirty = 'x\n{"total": 10, "killed": 8, "survived": [{"line":3},{"line":9}], "clean": false}\ntail prose';
  assert.deepEqual(readVerdict(dirty), { ok: true, clean: false, total: 10, killed: 8, survived: 2 });
  assert.match(readVerdict('').why, /nothing to ring/);
  assert.match(readVerdict('no verdict here').why, /rings gates, not prose/);
  assert.match(readVerdict('"clean" but no json').why, /mangled output rings nothing/);
  assert.match(readVerdict('{"clean": true}').why, /counts cannot be weighed/, 'a countless verdict is refused, not guessed');
  // each count missing ALONE refuses — a guard needing two absences is theatre
  assert.match(readVerdict('{"clean": true, "killed": 5, "survived": []}').why, /counts cannot be weighed/, 'total missing alone');
  assert.match(readVerdict('{"clean": true, "total": 5, "survived": []}').why, /counts cannot be weighed/, 'killed missing alone');
  assert.match(readVerdict('{"clean": false, "total": 5, "killed": 5}').why, /counts cannot be weighed/, 'survived missing alone on an unclean verdict');
  // the golden turn is a CONSTANT, pinned — the detune law must not follow a drifted export
  assert.ok(Math.abs(GOLDEN_TURN - 0.3819660112501051) < 1e-12, '1 − 1/φ, to the bit');
});

test('PEAL — a clean gate rings TRUE: exact ratios, long decay, a full peal of three', () => {
  const p = pealOf(CLEAN);
  assert.ok(p.ok);
  assert.equal(p.crack, 0);
  assert.equal(p.strikes, 3, 'a true bell is rung thrice');
  assert.equal(p.decay, 6, 'six seconds of honest ring');
  assert.equal(p.fundamental, 220);
  assert.equal(p.partials.length, PARTIALS.length, 'no buzz on a clean bell');
  p.partials.forEach((pp, i) => {
    assert.equal(pp.ratio, PARTIALS[i].ratio, pp.name + ' sits exactly on the classic ratio');
    assert.equal(pp.gain, PARTIALS[i].gain, pp.name + ' at full voice');
  });
  assert.match(p.verdictWord, /^TRUE — 39 of 39 mutants dead/);
  assert.deepEqual(pealOf(CLEAN), p, 'same verdict, same bell, always');
});

test('PEAL — survivors CRACK it: detuned partials, the buzz, a thudding decay, one strike', () => {
  const p = pealOf(DIRTY);
  assert.equal(p.crack, 0.2, 'two of ten survived');
  assert.equal(p.strikes, 1, 'a cracked bell is not rung twice');
  assert.ok(p.decay < 6 && p.decay > 0.7, 'the ring collapses toward a thud: ' + p.decay);
  assert.equal(p.decay, 4.96, '6 − 0.2·5.2, exactly');
  const buzz = p.partials.find((x) => x.name === 'buzz');
  assert.ok(buzz, 'the buzz partial appears');
  assert.equal(buzz.ratio, 1.03, 'just off the prime — the beat frequency IS the crack');
  assert.equal(buzz.gain, 0.25, '0.15 + 0.2·0.5');
  const prime = p.partials.find((x) => x.name === 'prime');
  assert.notEqual(prime.ratio, 1.0, 'the prime itself is pulled off pitch');
  // detune is golden-angle noise: partial i shifts by (frac(i·φturn) − 0.5) · crack · 0.24
  const expectPrime = Math.round(1.0 * (1 + (((1 * GOLDEN_TURN) % 1) - 0.5) * 0.2 * 0.24) * 1000) / 1000;
  assert.equal(prime.ratio, expectPrime, 'the detune is law, not vibes');
  assert.match(p.verdictWord, /^CRACKED — 2 survivor\(s\) in 10; hear the buzz\? that is test-theatre, ringing$/);
});

test('PEAL — the worse the theatre, the deader the bell: crack scales everything', () => {
  const bad = pealOf({ clean: false, total: 10, killed: 1, survived: 9 });
  const mild = pealOf({ clean: false, total: 10, killed: 9, survived: 1 });
  assert.ok(bad.decay < mild.decay, 'more survivors, shorter ring');
  const badBuzz = bad.partials.find((x) => x.name === 'buzz');
  const mildBuzz = mild.partials.find((x) => x.name === 'buzz');
  assert.ok(badBuzz.gain > mildBuzz.gain, 'more survivors, louder buzz');
  const badPrime = bad.partials.find((x) => x.name === 'prime');
  const mildPrime = mild.partials.find((x) => x.name === 'prime');
  assert.ok(Math.abs(badPrime.ratio - 1) > Math.abs(mildPrime.ratio - 1), 'more survivors, further off pitch');
  assert.ok(bad.partials.find((x) => x.name === 'hum').gain < 0.6, 'crack dims every voice');
});

test('PEAL — lying verdicts are refused, never rung', () => {
  assert.match(pealOf(null).why, /pass readVerdict\(\) output/);
  assert.match(pealOf(7).why, /pass readVerdict/);
  assert.match(pealOf([]).why, /pass readVerdict/);
  const { total, ...missing } = CLEAN;
  assert.match(pealOf(missing).why, /verdict missing total/);
  assert.match(pealOf({ ...CLEAN, total: '39' }).why, /honest types/);
  assert.match(pealOf({ ...CLEAN, clean: 'yes' }).why, /honest types/, 'clean mis-typed alone');
  assert.match(pealOf({ ...CLEAN, killed: '39' }).why, /honest types/, 'killed mis-typed alone');
  assert.match(pealOf({ ...CLEAN, survived: '0' }).why, /honest types/, 'survived mis-typed alone');
  assert.match(pealOf({ ...CLEAN, total: 0, killed: 0 }).why, /a bell needs metal to ring/);
  assert.match(pealOf({ clean: false, total: 5, killed: 4, survived: 2 }).why, /broken, not cracked/, 'counts that cannot add up are a broken verdict');
  assert.match(pealOf({ clean: true, total: 5, killed: 4, survived: 1 }).why, /one of them is lying/, 'clean with survivors is a contradiction, named');
});

test('THE FUZZ — 300 random verdicts: total, deterministic, crack in [0,1], the sound always speaks', () => {
  let seed = 432;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let t = 0; t < 300; t++) {
    const total = 1 + Math.floor(rnd() * 100);
    const survived = Math.floor(rnd() * (total + 1));
    const killed = total - survived;
    const v = { clean: survived === 0, total, killed, survived };
    const a = pealOf(v), b = pealOf(v);
    assert.deepEqual(a, b, 'no moods');
    assert.ok(a.ok);
    assert.ok(a.crack >= 0 && a.crack <= 1);
    assert.ok(a.decay > 0.7, 'even the deadest bell makes a sound');
    assert.ok(a.partials.every((p) => p.ratio > 0 && p.gain >= 0), 'every partial is playable');
    assert.ok(typeof a.verdictWord === 'string' && a.verdictWord.length > 0, 'the verdict is said in words too');
    assert.equal(a.strikes, survived === 0 ? 3 : 1);
  }
});
