// the-bell · bell.mjs — THE PEAL LAW: the gate you can hear.
//
// The estate debugs by listening (the-ear: a correlated fault is audible while every metric
// is green). This organ turns that law into an object anyone can hold: a mutation verdict
// becomes a BELL. A clean gate rings TRUE — pure harmonic partials, long decay, a full peal.
// Surviving mutants CRACK it — partials detuned by golden-angle noise, decay collapsing to a
// thud, the peal cut short. Test-theatre has a sound, and it is not a pleasant one.
//
//   · READ  — a witness verdict parsed from the WHOLE output (the last balanced JSON object
//             carrying "clean" — judging by the last line once mis-read "}" as a verdict).
//   · PEAL  — verdict → a deterministic sound recipe: same verdict, same bell, always.
//             The recipe is pure data; the page's speaker is just the mouth.
//
// The bell ratios are the classic minor-third church bell partials (hum, prime, tierce,
// quint, nominal, deciem, double octave) — a real bell's voice, not an synth guess.
//
// Pure and total: garbage in → { ok:false, why }, never a throw mid-ring.

export const GOLDEN_TURN = 1 - 1 / ((1 + Math.sqrt(5)) / 2);   // ≈ 0.381966…
export const PARTIALS = [
  { name: 'hum',     ratio: 0.5,  gain: 0.6 },
  { name: 'prime',   ratio: 1.0,  gain: 1.0 },
  { name: 'tierce',  ratio: 1.2,  gain: 0.8 },
  { name: 'quint',   ratio: 1.5,  gain: 0.5 },
  { name: 'nominal', ratio: 2.0,  gain: 0.7 },
  { name: 'deciem',  ratio: 2.67, gain: 0.35 },
  { name: 'double',  ratio: 4.0,  gain: 0.2 },
];

const S = (v) => (typeof v === 'string' ? v : '');
const round3 = (x) => Math.round(x * 1000) / 1000;

/** READ — vendored from witness-kit's verdict law (same author, same argument): the verdict
 *  is the LAST balanced JSON object carrying a "clean" key; prose never fools it. */
export function readVerdict(output) {
  if (!S(output)) return { ok: false, why: 'nothing to ring — paste a witness verdict' };
  const at = output.lastIndexOf('"clean"');
  if (at < 0) return { ok: false, why: 'no verdict in this text — the bell rings gates, not prose' };
  let start = output.lastIndexOf('{', at);
  while (start >= 0) {
    let depth = 0, end = -1;
    for (let i = start; i < output.length; i++) {
      const c = output[i];
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end > at) {
      try {
        const o = JSON.parse(output.slice(start, end + 1));
        if (typeof o.clean === 'boolean') {
          const total = Number.isInteger(o.total) ? o.total : null;
          const killed = Number.isInteger(o.killed) ? o.killed : null;
          const survived = Array.isArray(o.survived) ? o.survived.length : (o.clean ? 0 : null);
          if (total === null || killed === null || survived === null)
            return { ok: false, why: 'a verdict without counts cannot be weighed — total, killed and survived are the bell metal' };
          return { ok: true, clean: o.clean, total, killed, survived };
        }
      } catch { /* widen and retry */ }
    }
    start = output.lastIndexOf('{', start - 1);
  }
  return { ok: false, why: 'a "clean" key with no balanced verdict around it — mangled output rings nothing' };
}

/**
 * PEAL — the verdict as a bell. Deterministic recipe:
 *   · fundamental 220 Hz (a church bell's honest register)
 *   · CLEAN: the partials exactly on ratio, decay 6s, strikes = 3 (a true peal)
 *   · CRACKED: each partial detuned by golden-angle noise scaled by the survival rate —
 *     crack = survived/total; detune_i = (frac(i·φturn) − 0.5) · crack · 0.24 of the ratio.
 *     Decay collapses toward a thud (6s → 0.8s as crack → 1); one strike only — a cracked
 *     bell is not rung twice; and a BUZZ partial appears at 1.03·prime, louder with crack.
 *   · verdictWord: what the listener should hear, said in words too.
 */
export function pealOf(verdict) {
  const v = verdict && typeof verdict === 'object' && !Array.isArray(verdict) ? verdict : null;
  if (!v) return { ok: false, why: 'pass readVerdict() output' };
  for (const k of ['clean', 'total', 'killed', 'survived'])
    if (!(k in v)) return { ok: false, why: 'verdict missing ' + k };
  if (typeof v.clean !== 'boolean' || !Number.isInteger(v.total) || !Number.isInteger(v.killed) || !Number.isInteger(v.survived))
    return { ok: false, why: 'a verdict is { clean, total, killed, survived } with honest types' };
  if (v.total < 1) return { ok: false, why: 'zero mutants is not a gate — a bell needs metal to ring' };
  if (v.killed + v.survived > v.total) return { ok: false, why: 'killed + survived exceeds total — this verdict is broken, not cracked' };
  if (v.clean && v.survived > 0) return { ok: false, why: 'clean with survivors is a contradiction — one of them is lying' };
  const crack = round3(v.survived / v.total);
  const partials = PARTIALS.map((p, i) => {
    const noise = ((i * GOLDEN_TURN) % 1) - 0.5;
    return {
      name: p.name,
      ratio: round3(p.ratio * (1 + noise * crack * 0.24)),
      gain: round3(p.gain * (1 - crack * 0.3)),
    };
  });
  if (crack > 0) partials.push({ name: 'buzz', ratio: 1.03, gain: round3(0.15 + crack * 0.5) });
  const decay = round3(6 - crack * 5.2);
  const strikes = crack === 0 ? 3 : 1;
  const verdictWord = crack === 0
    ? 'TRUE — ' + v.killed + ' of ' + v.total + ' mutants dead; the bell rings clean and long'
    : 'CRACKED — ' + v.survived + ' survivor(s) in ' + v.total + '; hear the buzz? that is test-theatre, ringing';
  return { ok: true, fundamental: 220, partials, decay, strikes, crack, verdictWord };
}
