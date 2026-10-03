import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Game from "./pages/Game.jsx";
import Stats from "./pages/Stats.jsx";
import HowToPlay from "./pages/HowToPlay.jsx";

function loadTheme() {
  try {
    return localStorage.getItem("theme") === "dark";
  } catch {
    return false;
  }
}

// The layout shared by every page: background, navbar, and the routes
export default function App() {
  const [dark, setDark] = useState(loadTheme);

  // add or remove the "dark" class on <html> and remember the choice
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#ffe3ee] to-[#e6dcff] text-brand-ink transition-colors dark:from-[#1b1830] dark:to-[#2b2147] dark:text-white">
      <Navbar dark={dark} onToggle={() => setDark((d) => !d)} />

      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
