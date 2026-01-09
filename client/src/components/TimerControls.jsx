export function TimerControls({ 
  isRunning, 
  onStartPause, 
  onReset,
  onAudioUnlock 
}) {
  const handleStartPause = () => {
    onAudioUnlock();
    onStartPause();
  };

  return (
    <div className="flex w-full max-w-xs sm:max-w-none sm:w-auto">
      <button
        className={`${
          isRunning
            ? "px-8 sm:px-11 bg-card text-secondary-text border-border hover:bg-secondary hover:text-secondary-hover-text"
            : "px-9 sm:px-12 bg-primary text-primary-text border-primary"
        } py-[0.4rem] text-sm sm:text-base border-2 rounded-l-full hover:opacity-80 transition-all duration-150 cursor-pointer select-none flex-1 sm:flex-none`}
        onClick={handleStartPause}
      >
        {isRunning ? "Pause" : "Start"}
      </button>
      <button
        className="px-8 sm:px-11 py-[0.4rem] text-sm sm:text-base bg-primary text-primary-text border-primary border-2 rounded-r-full opacity-90 hover:opacity-70 transition-all duration-150 cursor-pointer select-none flex-1 sm:flex-none"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}
