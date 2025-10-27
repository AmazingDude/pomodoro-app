import { useEffect, useState } from "react";

function App() {
  const [focusTime, setFocusTime] = useState(1 * 60); // 25 minutes in seconds
  const [shortBreak, setShortBreak] = useState(5 * 60);
  const [longBreak, setLongBreak] = useState(15 * 60);

  const [completedSessions, setCompletedSessions] = useState(0);

  const [timeLeft, setTimeLeft] = useState(focusTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showColon, setShowColon] = useState(true);

  const [currentSession, setCurrentSession] = useState("focus"); // focus, shortBreak, longBreak

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          if (currentSession === "focus") {
            alert("Ding ding! You did it! Let’s rest a little. 🍵");
          } else {
            alert("Break is over! Time to focus!🍀");
          }
          handleSessionEnd();
          return 0;
        }
        // console.log(prev); // testing
        return prev - 1;
      });
      setShowColon((prev) => !prev); // blinking colon effect
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

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

  const handleSessionEnd = () => {
    if (currentSession === "focus") {
      // increment focus session counter
      setIsRunning(false);
      const newCount = completedSessions + 1;
      setCompletedSessions(newCount);

      // decide short or long break
      if (newCount % 4 === 0) {
        setCurrentSession("longBreak");
        setTimeLeft(longBreak);
      } else {
        setCurrentSession("shortBreak");
        setTimeLeft(shortBreak);
      }
    } else if (
      currentSession === "shortBreak" ||
      currentSession === "longBreak"
    ) {
      // After any break, start a new focus session
      setIsRunning(false);
      setCurrentSession("focus");
      setTimeLeft(focusTime);
    }
  };

  const sessionTime =
    currentSession === "focus"
      ? focusTime
      : currentSession === "shortBreak"
      ? shortBreak
      : longBreak;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-7 left-7 text-left select-none">
        <h1 className="text-2xl font-bold opacity-90">Pomotan 🍅</h1>
        <p className="text-xs opacity-60">(˶ᵔ ᵕ ᵔ˶) your tiny focus buddy</p>
      </div>
      <h2 className="text-xl mb-2 select-none">
        {currentSession === "focus"
          ? "Let’s focus together~ ✨"
          : currentSession === "shortBreak"
          ? "Time for a lil’ break 🍵"
          : "Take a longer rest 🌙"}
      </h2>

      {/* Timer Display */}
      <div className="text-8xl min-w-[8ch] text-center tabular-nums tracking-tight font-black mb-1 select-none">
        {formatTime(timeLeft)}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-3xs h-2 bg-white rounded-full overflow-hidden mb-7">
        <div
          className="h-full bg-secondary origin-left transition-transform duration-1000 ease-linear"
          style={{ transform: `scaleX(${1 - timeLeft / sessionTime})` }}
        ></div>
      </div>

      {/* Buttons */}
      <div className="flex">
        <button
          className={`${
            isRunning
              ? "px-11 bg-card text-secondary border-secondary"
              : "px-12 bg-primary text-white border-primary"
          } py-[0.4rem] border-2 rounded-l-full hover:opacity-80 transition-all duration-150 cursor-pointer select-none`}
          onClick={() => setIsRunning((prev) => !prev)}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          className="px-11 bg-primary text-white border-primary py-[0.4rem] border-2 rounded-r-full hover:opacity-80 transition-all duration-150 cursor-pointer select-none"
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(
              currentSession === "focus"
                ? focusTime
                : currentSession === "shortBreak"
                ? shortBreak
                : longBreak
            );
            setShowColon(true);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
