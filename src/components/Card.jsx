// One card. It does not know the game rules, it only shows what it is told.
export default function Card({ emoji, faceUp, matched, onClick }) {
  return (
    <button
      className={`card ${faceUp ? "up" : ""} ${matched ? "matched" : ""}`}
      onClick={onClick}
      aria-label={faceUp ? emoji : "Hidden card"}
    >
      <span className="card-inner">
        <span className="card-face card-back">?</span>
        <span className="card-face card-front">{emoji}</span>
      </span>
    </button>
  );
}
