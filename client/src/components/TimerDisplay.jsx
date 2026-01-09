import { Timer, Sparkles, Coffee, Leaf } from "lucide-react";

export function TimerDisplay({
  timeLeft,
  showColon,
  currentSession,
  countdown,
  nextSession,
}) {
  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;

    return (
      <>
        <span className="inline-block">{mins.toString().padStart(2, "0")}</span>
        <span
          className="relative -top-[0.07em] inline-block transition-opacity duration-100"
          style={{ opacity: showColon ? 1 : 0.8 }}
        >
          :
        </span>
        <span className="inline-block">{secs.toString().padStart(2, "0")}</span>
      </>
    );
  };

  const getSessionTitle = () => {
    if (countdown !== null) {
      const sessionName =
        nextSession === "focus"
          ? "Focus session"
          : nextSession === "shortBreak"
          ? "Short break"
          : "Long break";
      return (
        <span className="flex items-center gap-2">
          {sessionName} starts in {countdown}...{" "}
          <Timer className="w-5 h-5 inline-block relative -top-0.5" />
        </span>
      );
    }

    if (currentSession === "focus") {
      return (
        <span className="flex items-center gap-2">
          Let's focus together~{" "}
          <Sparkles className="w-5 h-5 inline-block text-amber-400 relative -top-0.5" />
        </span>
      );
    }
    if (currentSession === "shortBreak") {
      return (
        <span className="flex items-center gap-2">
          Time for a lil' break{" "}
          <Coffee className="w-6 h-6 inline-block relative -top-0.5" />
        </span>
      );
    }
    return (
      <span className="flex items-center gap-2">
        Take a longer rest{" "}
        <Leaf
          className="w-5 h-5 inline-block text-[#6abc81] relative -top-0.5"
          strokeWidth={3}
        />
      </span>
    );
  };

  return (
    <div
      key={currentSession}
      className="flex flex-col items-center justify-center transition-all duration-300 animate-fadeIn"
    >
      <h2 className="text-base sm:text-xl mb-2 select-none text-foreground text-center px-4">
        {getSessionTitle()}
      </h2>

      <div
        className="min-w-[8ch] text-center tabular-nums tracking-normal font-black leading-none mb-1 select-none text-foreground text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
        style={{
          fontSize: "clamp(3.75rem, 6.5vw, 12rem)",
          fontWeight: 900,
          fontVariantNumeric: "tabular-nums",
          fontFeatureSettings: '"tnum"',
        }}
      >
        {formatTime(timeLeft)}
      </div>
    </div>
  );
}
