import { useEffect, useState } from "react";
import { useTheme } from "./contexts/ThemeContext";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SettingsDialogContent from "./components/SettingsDialogContent.jsx";
import { toast, Toaster } from "sonner";

function App() {
  const [completedSessions, setCompletedSessions] = useState(0);
  const {
    theme,
    currentTheme,
    setCurrentTheme,
    themes: availableThemes,
  } = useTheme();

  // Settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      autoStart: false,
      sessionsBeforeLongBreak: 4,
      soundEnabled: true,
    };
  });

  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [nextSession, setNextSession] = useState(null);

  const [focusTime, setFocusTime] = useState(settings.focusDuration * 60);
  const [shortBreak, setShortBreak] = useState(
    settings.shortBreakDuration * 60
  );
  const [longBreak, setLongBreak] = useState(settings.longBreakDuration * 60);

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedSession = localStorage.getItem("currentSession");
    if (savedSession === "focus") return focusTime;
    else if (savedSession === "shortBreak") return shortBreak;
    else if (savedSession === "longBreak") return longBreak;
    return focusTime; // default
  });
  const [isRunning, setIsRunning] = useState(false);
  const [showColon, setShowColon] = useState(true);

  const [currentSession, setCurrentSession] = useState(() => {
    return localStorage.getItem("currentSession") || "focus";
  }); // focus, shortBreak, longBreak

  const [focusEndSound] = useState(() => {
    const audio = new Audio("/sounds/focus-end.mp3");
    audio.preload = "auto";
    audio.load();
    return audio;
  });
  const [breakEndSound] = useState(() => {
    const audio = new Audio("/sounds/break-end.mp3");
    audio.preload = "auto";
    audio.load();
    return audio;
  });
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Unlock audio on iOS with first user interaction
  const unlockAudio = () => {
    if (audioUnlocked) return;
    focusEndSound
      .play()
      .then(() => {
        focusEndSound.pause();
        focusEndSound.currentTime = 0;
      })
      .catch(() => {});
    breakEndSound
      .play()
      .then(() => {
        breakEndSound.pause();
        breakEndSound.currentTime = 0;
      })
      .catch(() => {});
    setAudioUnlocked(true);
  };

  const playSound = (soundType) => {
    if (!settings.soundEnabled) return;
    const audio = soundType === "focus" ? focusEndSound : breakEndSound;
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Audio playback failed:", error);
      });
    }
  };

  useEffect(() => {
    localStorage.setItem("pomodoroSettings", JSON.stringify(settings));

    setFocusTime(settings.focusDuration * 60);
    setShortBreak(settings.shortBreakDuration * 60);
    setLongBreak(settings.longBreakDuration * 60);

    if (currentSession === "focus") setTimeLeft(settings.focusDuration * 60);
    if (currentSession === "shortBreak")
      setTimeLeft(settings.shortBreakDuration * 60);
    if (currentSession === "longBreak")
      setTimeLeft(settings.longBreakDuration * 60);

    setIsRunning(false);
  }, [settings]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          handleSessionEnd();
          return 0;
        }
        return prev - 1;
      });
      setShowColon((prev) => !prev);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    const savedSession = localStorage.getItem("currentSession");
    if (savedSession) {
      setCurrentSession(savedSession);
      if (savedSession === "focus") setTimeLeft(focusTime);
      else if (savedSession === "shortBreak") setTimeLeft(shortBreak);
      else setTimeLeft(longBreak);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentSession", currentSession);
  }, [currentSession]);

  // Update document title based on timer
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const formattedTime = `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;

    if (isRunning) {
      const sessionName =
        currentSession === "focus"
          ? "Focus"
          : currentSession === "shortBreak"
          ? "Short Break"
          : "Long Break";
      document.title = `${formattedTime} | ${sessionName}`;
    } else {
      document.title = "Pomotan";
    }
  }, [timeLeft, isRunning, currentSession]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      setNextSession(null);
      setIsRunning(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

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
      const newCount = completedSessions + 1;
      setCompletedSessions(newCount);

      playSound("focus");

      const nextSessionType =
        newCount % settings.sessionsBeforeLongBreak === 0
          ? "longBreak"
          : "shortBreak";

      if (settings.autoStart) {
        // Start countdown before auto-starting
        setNextSession(nextSessionType);
        setCountdown(3);
        setTimeout(() => {
          toast("Ding ding! You did it! Let's rest a little. 🍵");
        }, 100);
      } else {
        setTimeout(() => {
          toast("Ding ding! You did it! Let's rest a little. 🍵");
        }, 100);
      }

      // Decide short or long break
      if (nextSessionType === "longBreak") {
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
      playSound("break");

      if (settings.autoStart) {
        // Start countdown before auto-starting
        setNextSession("focus");
        setCountdown(3);
        setTimeout(() => {
          toast("Break is over! Time to focus! 🍀");
        }, 100);
      } else {
        setTimeout(() => {
          toast("Break is over! Time to focus! 🍀");
        }, 100);
      }

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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 -mt-12 sm:mt-0">
        {/* Header */}
        <div className="absolute top-4 left-4 sm:top-7 sm:left-7 text-left select-none">
          <h1 className="text-xl sm:text-2xl font-bold opacity-100 text-foreground">
            Pomotan 🍅
          </h1>
          <p className="text-[0.65rem] sm:text-xs opacity-60 text-foreground">
            (˶ᵔ ᵕ ᵔ˶) your tiny focus buddy
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-10 sm:mb-10 w-full max-w-md sm:w-auto">
          {[
            { label: "Focus", type: "focus" },
            { label: "Short Break", type: "shortBreak" },
            { label: "Long Break", type: "longBreak" },
          ].map((session) => (
            <button
              key={session.type}
              className={`px-4 sm:px-6 py-2 text-[0.8rem] sm:text-[0.875rem] font-semibold rounded-2xl border-2 transition-all duration-150 cursor-pointer select-none ${
                currentSession === session.type
                  ? "bg-primary text-primary-text border-primary"
                  : "bg-card text-secondary-text border-border hover:bg-secondary hover:text-secondary-hover-text"
              }`}
              onClick={() => {
                setCurrentSession(session.type);
                setIsRunning(false);
                setTimeLeft(
                  session.type === "focus"
                    ? focusTime
                    : session.type === "shortBreak"
                    ? shortBreak
                    : longBreak
                );
                setShowColon(true);
              }}
            >
              {session.label}
            </button>
          ))}
        </div>

        {/* Session Title */}
        <div
          key={currentSession}
          className="flex flex-col items-center justify-center transition-all duration-300 animate-fadeIn"
        >
          <h2 className="text-base sm:text-xl mb-2 select-none text-foreground text-center px-4">
            {countdown !== null ? (
              <>
                {nextSession === "focus"
                  ? "Focus session"
                  : nextSession === "shortBreak"
                  ? "Short break"
                  : "Long break"}{" "}
                starts in {countdown}... ⏱️
              </>
            ) : currentSession === "focus" ? (
              <>Let's focus together~ ✨</>
            ) : currentSession === "shortBreak" ? (
              <>
                Time for a lil' break{" "}
                <i className="fa-solid fa-mug-hot relative top-[-0.1rem]"></i>
              </>
            ) : (
              <>Take a longer rest 🍃</>
            )}
          </h2>

          {/* Timer Display */}
          <div
            className="min-w-[8ch] text-center tabular-nums tracking-tight font-black leading-none mb-1 select-none text-foreground text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
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

        {/* Progress Bar */}
        <div className="w-full max-w-[90%] sm:max-w-[17.1rem] h-2 bg-card rounded-full overflow-hidden mb-2  border-border">
          <div
            className="h-full bg-progress origin-left transition-transform duration-1000 ease-linear"
            style={{
              transform: `scaleX(${1 - timeLeft / sessionTime})`,
            }}
          ></div>
        </div>

        <div className="flex gap-2 mt-2 mb-6">
          {[...Array(settings.sessionsBeforeLongBreak)].map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 transition-all duration-300 ${
                i < completedSessions % settings.sessionsBeforeLongBreak
                  ? "bg-primary border-primary"
                  : "border-border bg-transparent"
              }`}
            ></div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex w-full max-w-xs sm:max-w-none sm:w-auto">
          <button
            className={`${
              isRunning
                ? "px-8 sm:px-11 bg-card text-secondary-text border-border hover:bg-secondary hover:text-secondary-hover-text"
                : "px-9 sm:px-12 bg-primary text-primary-text border-primary"
            } py-[0.4rem] text-sm sm:text-base border-2 rounded-l-full hover:opacity-80 transition-all duration-150 cursor-pointer select-none flex-1 sm:flex-none`}
            onClick={() => {
              unlockAudio();
              setIsRunning((prev) => !prev);
            }}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            className="px-8 sm:px-11 py-[0.4rem] text-sm sm:text-base bg-primary text-primary-text border-primary border-2 rounded-r-full opacity-90 hover:opacity-70 transition-all duration-150 cursor-pointer select-none flex-1 sm:flex-none"
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

        {/* Settings Button - Bottom Right */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogTrigger asChild>
            <button className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-13 sm:h-13 bg-primary text-primary-text rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 hover:opacity-90 transition-all flex items-center justify-center cursor-pointer">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </DialogTrigger>
          <SettingsDialogContent
            settings={settings}
            setSettings={setSettings}
            availableThemes={availableThemes}
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
          />
        </Dialog>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
