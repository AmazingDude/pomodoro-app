import { useEffect, useState } from "react";

function App() {
  const [timeLeft, setTimeLeft] = useState(1 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showColon, setShowColon] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          alert("Time for Break!");
          return 0;
        }
        // console.log(prev); // testing
        return prev - 1;
      });
      setShowColon((prev) => !prev);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 opacity-80">Focus Timer</h1>

      <div className="text-8xl min-w-[8ch] text-center tabular-nums tracking-tight font-black mb-6">
        {formatTime(timeLeft)}
      </div>
      <div className="flex">
        <button
          className={`${
            isRunning
              ? "px-11 bg-card text-secondary border-secondary"
              : "px-12 bg-primary text-white border-primary"
          } py-[0.4rem] border-2 rounded-l-full hover:opacity-80 transition-all duration-150 cursor-pointer`}
          onClick={() => setIsRunning((prev) => !prev)}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button className="px-10 py-[0.4rem] bg-primary border-2 border-primary text-white rounded-r-full hover:opacity-80 transition-all duration-150 cursor-pointer">
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
