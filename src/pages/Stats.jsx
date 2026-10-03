import { useState } from "react";
import { LEVELS } from "../levels.js";
import { formatTime, readJSON } from "../storage.js";

export default function Stats() {
  const [best, setBest] = useState(() => readJSON("memory-best", {}));
  const [history, setHistory] = useState(() => readJSON("memory-history", []));

  function clearAll() {
    try {
      localStorage.removeItem("memory-best");
      localStorage.removeItem("memory-history");
    } catch {
      /* ignore */
    }
    setBest({});
    setHistory([]);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-10 pt-5">
      <h1 className="text-center text-[length:clamp(30px,6vw,44px)] font-semibold">Your stats</h1>

      {/* best score per level */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {Object.entries(LEVELS).map(([key, l]) => (
          <div key={key} className="rounded-2xl bg-white/70 p-4 text-center dark:bg-white/10">
            <p className="text-sm opacity-60">{l.label} best</p>
            <p className="text-3xl font-semibold">{best[key] ?? "–"}</p>
            <p className="text-xs opacity-60">moves</p>
          </div>
        ))}
      </div>

      {/* last games */}
      <h2 className="mb-2 mt-8 text-xl font-semibold">Recent games</h2>

      {history.length === 0 ? (
        <p className="rounded-2xl bg-white/70 p-5 text-center opacity-80 dark:bg-white/10">
          No games yet. Win a round and it will show up here!
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white/70 dark:bg-white/10">
          <table className="w-full text-left">
            <thead className="bg-brand-lilac/30 text-sm">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Level</th>
                <th className="px-4 py-2">Moves</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((g, i) => (
                <tr key={i} className="border-t border-brand-lilac/20">
                  <td className="px-4 py-2">{new Date(g.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{LEVELS[g.level]?.label ?? g.level}</td>
                  <td className="px-4 py-2">{g.moves}</td>
                  <td className="px-4 py-2">{formatTime(g.seconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={clearAll}
          className="cursor-pointer rounded-full border-2 border-brand-pink px-5 py-2 text-brand-pink transition hover:bg-brand-pink hover:text-white"
        >
          Clear my stats
        </button>
      </div>
    </main>
  );
}
