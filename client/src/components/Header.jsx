export function Header() {
  return (
    <div className="fixed top-4 left-4 sm:top-7 sm:left-7 text-left select-none z-10">
      <h1 className="text-xl sm:text-2xl font-bold opacity-100 text-foreground flex items-center gap-2">
        Pomotan
        <img
          src="/tomato.svg"
          alt=""
          className="w-5 h-5 sm:w-6 sm:h-6 relative -top-[1px] sm:-top-[2px]"
          draggable="false"
          aria-hidden="true"
        />
      </h1>
      <p className="text-[0.65rem] sm:text-xs opacity-60 text-foreground">
        (˶ᵔ ᵕ ᵔ˶) your tiny focus buddy
      </p>
    </div>
  );
}
