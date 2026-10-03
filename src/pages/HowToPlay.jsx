import { Link } from "react-router-dom";

const steps = [
  "Pick a level: Easy, Medium or Hard.",
  "Click a card to flip it, then click a second card.",
  "If the two cards match, they stay open. If not, they flip back.",
  "Remember where each emoji is, and find every pair.",
  "Finish with as few moves as you can to beat your best score.",
];

export default function HowToPlay() {
  return (
    <main className="mx-auto max-w-xl px-4 pb-10 pt-5">
      <h1 className="text-center text-[length:clamp(30px,6vw,44px)] font-semibold">How to play</h1>

      <ol className="mt-6 space-y-3">
        {steps.map((text, i) => (
          <li key={i} className="flex items-center gap-4 rounded-2xl bg-white/70 p-4 dark:bg-white/10">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-pink font-semibold text-white">
              {i + 1}
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-block rounded-full bg-brand-pink px-6 py-2.5 text-lg text-white shadow-[0_4px_0_#e0688a]"
        >
          Start playing
        </Link>
      </div>
    </main>
  );
}
