// One card. It does not know the game rules, it only shows what it is told.
export default function Card({ emoji, faceUp, matched, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={faceUp ? emoji : "Hidden card"}
      className={`aspect-square border-0 bg-transparent p-0 [perspective:600px] ${
        matched ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <span
        className={`relative block h-full w-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] ${
          faceUp ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* back of the card */}
        <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-linear-to-br from-brand-pink to-brand-lilac text-[length:clamp(22px,6vw,34px)] font-semibold text-white shadow-md shadow-purple-900/20 [backface-visibility:hidden] hover:brightness-110">
          ?
        </span>

        {/* front of the card */}
        <span
          className={`absolute inset-0 flex items-center justify-center rounded-2xl text-[length:clamp(28px,8vw,46px)] shadow-md shadow-purple-900/20 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            matched ? "animate-pop bg-[#e4ffe9]" : "bg-brand-cream"
          }`}
        >
          {emoji}
        </span>
      </span>
    </button>
  );
}
