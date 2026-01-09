export function ProgressBar({ timeLeft, sessionTime }) {
  return (
    <div className="w-full max-w-[90%] sm:max-w-[17.1rem] h-2 bg-card rounded-full overflow-hidden mb-2 border-border">
      <div
        className="h-full bg-progress origin-left transition-transform duration-1000 ease-linear"
        style={{
          transform: `scaleX(${1 - timeLeft / sessionTime})`,
        }}
      ></div>
    </div>
  );
}
