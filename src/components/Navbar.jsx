import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Play" },
  { to: "/stats", label: "Stats" },
  { to: "/how-to-play", label: "How to play" },
];

export default function Navbar({ dark, onToggle }) {
  return (
    <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 pt-4">
      <div className="flex gap-1.5">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-1.5 transition ${
                isActive
                  ? "bg-brand-lilac text-white"
                  : "bg-white/60 hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/20"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>

      <button
        onClick={onToggle}
        aria-label="Toggle dark mode"
        className="cursor-pointer rounded-full bg-white/70 px-3.5 py-1.5 text-xl transition hover:scale-110 dark:bg-white/15"
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}
