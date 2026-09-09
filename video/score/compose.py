"""
An original score for The Highest Branch.

Written here rather than licensed, so the film carries nothing that isn't
Saadan's to publish. It is synthesised from scratch: struck tones built from
sine partials, a bowed drone, and a low pulse that arrives with the city and
leaves with it.

Four sections, following the film:
  A  the forest        warm, modal, unhurried, no pulse at all
  B  the stone trees   the pulse starts, the mode turns minor, the phrase
                       shortens and repeats, because that is what the years
                       in the tower do
  C  the dark floors   almost everything is taken away
  D  the top           the forest phrase returns, slower, and resolves

Run: python3 score/compose.py  ->  public/score.wav
"""

import math
import struct
import wave

import numpy as np

SR = 44100
LEN = 150.0
N = int(SR * LEN)

out = np.zeros(N, dtype=np.float64)


def place(buf, start_s, sig):
    i = int(start_s * SR)
    j = min(N, i + len(sig))
    if i >= N:
        return
    buf[i:j] += sig[: j - i]


def struck(freq, dur, amp=0.28, bright=1.0):
    """A struck tone: partials that decay faster the higher they are."""
    t = np.linspace(0, dur, int(dur * SR), endpoint=False)
    sig = np.zeros_like(t)
    for k, w in enumerate([1.0, 0.5, 0.28, 0.16, 0.09], start=1):
        decay = np.exp(-t * (2.4 + k * 1.5) / max(0.4, dur))
        sig += w * bright ** (k - 1) * np.sin(2 * np.pi * freq * k * t) * decay
    # A short attack, so it reads as struck and not as blown.
    attack = np.clip(t / 0.006, 0, 1)
    return sig * attack * amp


def drone(freq, dur, amp=0.12):
    t = np.linspace(0, dur, int(dur * SR), endpoint=False)
    vib = 1 + 0.0016 * np.sin(2 * np.pi * 0.23 * t)
    sig = (
        np.sin(2 * np.pi * freq * t * vib)
        + 0.45 * np.sin(2 * np.pi * freq * 1.5 * t * vib)
        + 0.2 * np.sin(2 * np.pi * freq * 2 * t)
    )
    env = np.clip(t / 3.0, 0, 1) * np.clip((dur - t) / 3.0, 0, 1)
    return sig * env * amp


def pulse(dur=0.5, amp=0.16, freq=58.0):
    t = np.linspace(0, dur, int(dur * SR), endpoint=False)
    body = np.sin(2 * np.pi * freq * t * np.exp(-t * 2.2))
    env = np.exp(-t * 9.0)
    return body * env * amp


def note(name, octave):
    """Equal temperament, A4 = 440."""
    names = {"C": -9, "D": -7, "E": -5, "F": -4, "G": -2, "A": 0, "B": 2}
    step = names[name[0]]
    if len(name) > 1:
        step += 1 if name[1] == "#" else -1
    return 440.0 * (2 ** ((step + (octave - 4) * 12) / 12))


# ── A. The forest ─────────────────────────────────────────────────────────
# D minor pentatonic, phrases that start and stop when they want to.
place(out, 0.0, drone(note("D", 2), 46, amp=0.14))
place(out, 0.0, drone(note("A", 2), 46, amp=0.07))

forest = ["D", "F", "G", "A", "C", "A", "G", "F"]
t = 1.2
for rep in range(5):
    for i, n in enumerate(forest):
        if rep and i % 3 == 2:
            continue
        octv = 4 if (i + rep) % 4 else 5
        place(out, t, struck(note(n, octv), 2.6, amp=0.24 - rep * 0.012))
        t += 0.92 if i % 2 == 0 else 1.16
    t += 1.1

# ── B. The stone trees ────────────────────────────────────────────────────
# The pulse arrives. The phrase gets shorter and comes round again sooner.
place(out, 40.0, drone(note("D", 2), 62, amp=0.12))
place(out, 40.0, drone(note("A#", 2), 62, amp=0.05))

beat = 0.62
t = 42.0
while t < 100.0:
    place(out, t, pulse(0.55, amp=0.13 + 0.05 * math.sin(t / 7)))
    t += beat

city = ["D", "F", "G", "A#", "A", "G", "F", "D"]
t = 43.0
while t < 98.0:
    for i, n in enumerate(city):
        if t > 98.0:
            break
        place(out, t, struck(note(n, 5 if i % 3 else 4), 1.7, amp=0.17, bright=0.86))
        t += beat * (1 if i % 4 else 2)
    t += beat

# ── C. The dark floors ────────────────────────────────────────────────────
# Nearly everything is taken away: a low fifth, and a strike that is too far
# apart to be a rhythm.
place(out, 98.0, drone(note("D", 2), 36, amp=0.15))
place(out, 100.0, drone(note("G#", 2), 30, amp=0.045))
for i, t in enumerate(np.arange(101.0, 130.0, 3.7)):
    place(out, float(t), struck(note("D" if i % 2 else "A#", 3), 3.4, amp=0.16, bright=0.6))

# ── D. The top ────────────────────────────────────────────────────────────
# The forest phrase, slower, and this time it finishes.
place(out, 128.0, drone(note("D", 2), 24, amp=0.16))
place(out, 128.0, drone(note("A", 2), 24, amp=0.09))
t = 131.0
for i, n in enumerate(["D", "F", "G", "A", "C", "A", "G", "F", "D"]):
    place(out, t, struck(note(n, 5 if i in (4, 5) else 4), 3.6, amp=0.26))
    t += 1.55
place(out, 146.0, struck(note("D", 3), 4.0, amp=0.3))

# ── Master ────────────────────────────────────────────────────────────────
# A gentle limiter rather than hard clipping, then a fade at each end.
out = np.tanh(out * 1.25) * 0.82
fade = int(SR * 1.5)
out[:fade] *= np.linspace(0, 1, fade)
out[-int(SR * 4) :] *= np.linspace(1, 0, int(SR * 4))

pcm = (np.clip(out, -1, 1) * 32767).astype(np.int16)
stereo = np.repeat(pcm[:, None], 2, axis=1).flatten()

with wave.open("public/score.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(struct.pack(f"<{len(stereo)}h", *stereo))

print(f"public/score.wav  {LEN:.0f}s  peak {np.abs(out).max():.2f}")
