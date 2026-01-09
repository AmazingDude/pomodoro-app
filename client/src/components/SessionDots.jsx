export function SessionDots({ completedSessions, totalSessions }) {
  return (
    <div className="flex gap-2 mt-2 mb-6">
      {[...Array(totalSessions)].map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 transition-all duration-300 ${
            i < completedSessions % totalSessions
              ? "bg-primary border-primary"
              : "border-border bg-transparent"
          }`}
        ></div>
      ))}
    </div>
  );
}
