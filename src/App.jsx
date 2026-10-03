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
    <main className="app">
      <h1 className="title">Memory Match</h1>
      <p className="subtitle">Find all the pairs with the fewest moves.</p>

      <div className="levels">
        {Object.entries(LEVELS).map(([key, l]) => (
          <button
            key={key}
            className={`pill ${key === level ? "active" : ""}`}
            aria-pressed={key === level}
            onClick={() => newGame(key)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="stats">
        <div className="stat"><span>Moves</span><b>{moves}</b></div>
        <div className="stat"><span>Time</span><b>{formatTime(seconds)}</b></div>
        <div className="stat"><span>Best</span><b>{best[level] ?? "–"}</b></div>
      </div>

      <div className="board" style={{ "--cols": cols }}>
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

      <button className="restart" onClick={() => newGame()}>New game</button>

      {won && (
        <div className="win">
          {Array.from({ length: 24 }, (_, i) => (
            <i
              key={i}
              className="confetti"
              style={{ left: `${i * 4 + (i % 3)}%`, animationDelay: `${(i % 8) * 0.25}s` }}
            >
              {["🎉", "✨", "💖", "⭐"][i % 4]}
            </i>
          ))}
          <div className="win-card">
            <h2>You did it! 🎉</h2>
            <p>{moves} moves in {formatTime(seconds)}</p>
            <button className="restart" onClick={() => newGame()}>Play again</button>
          </div>
        </div>
      )}
    </main>
  );
}
