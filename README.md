# the-bell — the gate you can hear

**LIVE: https://sjgant80-hub.github.io/the-bell/**

Paste a mutation verdict. Strike the bell.

A **clean gate rings true** — the classic church-bell partials (hum, prime, minor-third
tierce, quint, nominal) exactly on ratio, six seconds of decay, a peal of three. **Surviving
mutants crack it**: every partial pulled off pitch by golden-angle noise scaled to
`survived/total`, every voice dimmed, the decay collapsed toward a thud, and a buzz partial
beating just off the prime — the beat frequency *is* the crack. One strike only; a cracked
bell is not rung twice.

Nothing is a sound effect. The flaw **is** the audio.

## Why

The estate debugs by listening: a correlated fault is audible while every metric reads
green ([the-ear](https://github.com/sjgant80-hub/the-ear)). This is that law as an object
anyone can hold — a mutation verdict you can *hear*. Pipe your CI's verdict to a speaker in
the hallway and the whole team knows the gate's health without opening a dashboard. Theatre
buzzes. Truth rings.

## The law — [`bell.mjs`](bell.mjs) · witness **29/31 + 2 argued equivalents, CLEAN**

- `readVerdict(output)` — the verdict from the *whole* output (the last balanced JSON object
  carrying `"clean"`); countless or contradictory verdicts are refused, never rung —
  *"clean with survivors is a contradiction — one of them is lying."*
- `pealOf(verdict)` — a deterministic sound recipe: same verdict, same bell, always. The
  recipe is pure data; the page's speaker is just the mouth. The suite pins the exact clean
  ratios, the exact crack arithmetic, and the monotone law: more survivors → shorter ring,
  louder buzz, further off pitch.

```bash
node --test        # the peal law against its falsifiable examples
```

---

*Built on the Konomi architecture, created by Thomas Frumkin. The estate builds WITH Konomi.
MIT.*
