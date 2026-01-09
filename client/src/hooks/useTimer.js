import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useTimer(settings, playSound) {
  const [completedSessions, setCompletedSessions] = useState(0);
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
    return focusTime;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [showColon, setShowColon] = useState(true);

  const [currentSession, setCurrentSession] = useState(() => {
    return localStorage.getItem("currentSession") || "focus";
  });

  const sessionTime =
    currentSession === "focus"
      ? focusTime
      : currentSession === "shortBreak"
      ? shortBreak
      : longBreak;

  // Update durations when settings change
  useEffect(() => {
    setFocusTime(settings.focusDuration * 60);
    setShortBreak(settings.shortBreakDuration * 60);
    setLongBreak(settings.longBreakDuration * 60);

    if (currentSession === "focus") setTimeLeft(settings.focusDuration * 60);
    if (currentSession === "shortBreak")
      setTimeLeft(settings.shortBreakDuration * 60);
    if (currentSession === "longBreak")
      setTimeLeft(settings.longBreakDuration * 60);

    setIsRunning(false);
  }, [settings, currentSession]);

  // Timer countdown
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

  // Load saved session
  useEffect(() => {
    const savedSession = localStorage.getItem("currentSession");
    if (savedSession) {
      setCurrentSession(savedSession);
      if (savedSession === "focus") setTimeLeft(focusTime);
      else if (savedSession === "shortBreak") setTimeLeft(shortBreak);
      else setTimeLeft(longBreak);
    }
  }, []);

  // Save current session
  useEffect(() => {
    localStorage.setItem("currentSession", currentSession);
  }, [currentSession]);

  // Update document title
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

  // Auto-start countdown
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
        setNextSession(nextSessionType);
        setCountdown(3);
        setTimeout(() => {
          toast("Ding ding! You did it! Let's rest a little.");
        }, 100);
      } else {
        setTimeout(() => {
          toast("Ding ding! You did it! Let's rest a little.");
        }, 100);
      }

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
        setNextSession("focus");
        setCountdown(3);
        setTimeout(() => {
          toast("Break is over! Time to focus!");
        }, 100);
      } else {
        setTimeout(() => {
          toast("Break is over! Time to focus!");
        }, 100);
      }

      setCurrentSession("focus");
      setTimeLeft(focusTime);
    }
  };

  const handleSessionChange = (sessionType, sessionDuration) => {
    setCurrentSession(sessionType);
    setIsRunning(false);
    setTimeLeft(sessionDuration);
    setShowColon(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(
      currentSession === "focus"
        ? focusTime
        : currentSession === "shortBreak"
        ? shortBreak
        : longBreak
    );
    setShowColon(true);
  };

  return {
    timeLeft,
    isRunning,
    showColon,
    currentSession,
    sessionTime,
    completedSessions,
    countdown,
    nextSession,
    focusTime,
    shortBreak,
    longBreak,
    setIsRunning,
    handleSessionChange,
    handleReset,
  };
}
