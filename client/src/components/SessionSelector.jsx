export function SessionSelector({
  currentSession,
  onSessionChange,
  focusTime,
  shortBreak,
  longBreak,
}) {
  const sessions = [
    { label: "Focus", type: "focus", time: focusTime },
    { label: "Short Break", type: "shortBreak", time: shortBreak },
    { label: "Long Break", type: "longBreak", time: longBreak },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-10 sm:mb-10 w-full max-w-md sm:w-auto">
      {sessions.map((session) => (
        <button
          key={session.type}
          className={`px-4 sm:px-6 py-2 text-[0.8rem] sm:text-[0.875rem] font-semibold rounded-2xl border-2 transition-all duration-150 cursor-pointer select-none ${
            currentSession === session.type
              ? "bg-primary text-primary-text border-primary"
              : "bg-card text-secondary-text border-border hover:bg-secondary hover:text-secondary-hover-text"
          }`}
          onClick={() => onSessionChange(session.type, session.time)}
        >
          {session.label}
        </button>
      ))}
    </div>
  );
}
