import { useEffect, useRef, useState } from "react";
import Card from "./components/Card.jsx";

const EMOJIS = ["🐱", "🐶", "🦊", "🐼", "🐸", "🦄", "🐙", "🦋", "🍓", "🍩", "🌈", "⭐"];

const LEVELS = {
  easy: { label: "Easy", pairs: 6, cols: 4 },
  medium: { label: "Medium", pairs: 8, cols: 4 },
  hard: { label: "Hard", pairs: 12, cols: 6 },
};

// Fisher-Yates shuffle
function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// every emoji appears twice; the id is the card's position in the deck
function makeDeck(pairs) {
  const picked = shuffle(EMOJIS).slice(0, pairs);
  return shuffle([...picked, ...picked]).map((emoji, id) => ({ id, emoji }));
}

function formatTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function loadBest() {
  try {
    return JSON.parse(localStorage.getItem("memory-best")) || {};
  } catch {
    return {};
  }
}

export default function App() {
  const [level, setLevel] = useState("easy");
  const [deck, setDeck] = useState(() => makeDeck(LEVELS.easy.pairs));
  const [flipped, setFlipped] = useState([]); // ids face up right now (max 2)
  const [matched, setMatched] = useState([]); // ids that are solved
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(loadBest); // fewest moves per level

  const hideTimer = useRef(null);
  const won = matched.length === deck.length;

  // the clock ticks while a game is running
  useEffect(() => {
    if (!running || won) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, won]);

  // save a new best score when the game is won
  useEffect(() => {
    if (!won) return;
    if (best[level] === undefined || moves < best[level]) {
      const updated = { ...best, [level]: moves };
      setBest(updated);
      try {
        localStorage.setItem("memory-best", JSON.stringify(updated));
      } catch {
        /* storage not available, ignore */
      }
    }
  }, [won]);

  function newGame(nextLevel = level) {
    clearTimeout(hideTimer.current);
    setLevel(nextLevel);
    setDeck(makeDeck(LEVELS[nextLevel].pairs));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
  }

  function pick(id) {
    // ignore clicks while two cards are showing, or on cards already open
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    setRunning(true);
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = next.map((i) => deck[i]);

    if (a.emoji === b.emoji) {
      setMatched((m) => [...m, ...next]);
      setFlipped([]);
    } else {
      // show the wrong pair for a moment, then flip them back
      hideTimer.current = setTimeout(() => setFlipped([]), 800);
    }
  }

  const { cols } = LEVELS[level];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#ffe3ee] to-[#e6dcff] text-brand-ink">
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-10 pt-7">
        <h1 className="text-[length:clamp(34px,7vw,52px)] font-semibold">Memory Match</h1>
        <p className="mb-4 mt-1 opacity-70">Find all the pairs with the fewest moves.</p>

        {/* level buttons */}
        <div className="mb-4 flex gap-2">
          {Object.entries(LEVELS).map(([key, l]) => (
            <button
              key={key}
              aria-pressed={key === level}
              onClick={() => newGame(key)}
              className={`cursor-pointer rounded-full border-2 border-brand-lilac px-[18px] py-2 transition hover:-translate-y-0.5 ${
                key === level ? "bg-brand-lilac text-white" : ""
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* moves / time / best */}
        <div className="mb-4 flex gap-3">
          {[
            ["Moves", moves],
            ["Time", formatTime(seconds)],
            ["Best", best[level] ?? "–"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex min-w-[92px] flex-col rounded-2xl bg-white/70 px-3.5 py-2 text-center"
            >
              <span className="text-[13px] opacity-60">{label}</span>
              <b className="text-[22px] font-semibold">{value}</b>
            </div>
          ))}
        </div>

        {/* board (columns depend on the level, so these two are inline styles) */}
        <div
          className="grid gap-2.5"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            width: `min(100%, ${cols * 120}px)`,
          }}
        >
          {deck.map((card) => (
            <Card
              key={card.id}
              emoji={card.emoji}
              faceUp={flipped.includes(card.id) || matched.includes(card.id)}
              matched={matched.includes(card.id)}
              onClick={() => pick(card.id)}
            />
          ))}
        </div>

        <button
          onClick={() => newGame()}
          className="mt-5 cursor-pointer rounded-full bg-brand-pink px-6 py-2.5 text-lg text-white shadow-[0_4px_0_#e0688a] active:translate-y-[3px] active:shadow-[0_1px_0_#e0688a]"
        >
          New game
        </button>
      </main>

      {won && (
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-brand-ink/45">
          {Array.from({ length: 24 }, (_, i) => (
            <i
              key={i}
              className="absolute -top-10 animate-fall text-[26px] not-italic"
              style={{ left: `${i * 4 + (i % 3)}%`, animationDelay: `${(i % 8) * 0.25}s` }}
            >
              {["🎉", "✨", "💖", "⭐"][i % 4]}
            </i>
          ))}
          <div className="animate-rise rounded-3xl bg-brand-cream px-10 py-7 text-center">
            <h2 className="mb-1.5 text-2xl font-semibold">You did it! 🎉</h2>
            <p className="text-xl">
              {moves} moves in {formatTime(seconds)}
            </p>
            <button
              onClick={() => newGame()}
              className="mt-5 cursor-pointer rounded-full bg-brand-pink px-6 py-2.5 text-lg text-white shadow-[0_4px_0_#e0688a] active:translate-y-[3px] active:shadow-[0_1px_0_#e0688a]"
            >
              Play again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
