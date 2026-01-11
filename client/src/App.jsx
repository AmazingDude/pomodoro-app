import { useState } from "react";
import { useTheme } from "./contexts/ThemeContext";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SettingsDialogContent from "./components/SettingsDialogContent.jsx";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { SessionSelector } from "./components/SessionSelector";
import { TimerDisplay } from "./components/TimerDisplay";
import { ProgressBar } from "./components/ProgressBar";
import { SessionDots } from "./components/SessionDots";
import { TimerControls } from "./components/TimerControls";
import { useTimer } from "./hooks/useTimer";
import { useAudio } from "./hooks/useAudio";
import { usePictureInPicture } from "./hooks/usePictureInPicture";
import { Settings, PictureInPicture2 } from "lucide-react";

function App() {
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

  // Audio management
  const { unlockAudio, playSound } = useAudio();

  // Timer management
  const timer = useTimer(settings, (soundType) =>
    playSound(soundType, settings.soundEnabled)
  );

  // Picture-in-Picture
  const { togglePictureInPicture, isPipSupported } = usePictureInPicture(
    {
      timeLeft: timer.timeLeft,
      showColon: timer.showColon,
      currentSession: timer.currentSession,
      sessionTime: timer.sessionTime,
      isRunning: timer.isRunning,
      completedSessions: timer.completedSessions,
      setIsRunning: timer.setIsRunning,
    },
    settings
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 -mt-12 sm:mt-0">
        <Header />

        <SessionSelector
          currentSession={timer.currentSession}
          onSessionChange={timer.handleSessionChange}
          focusTime={timer.focusTime}
          shortBreak={timer.shortBreak}
          longBreak={timer.longBreak}
        />

        <TimerDisplay
          timeLeft={timer.timeLeft}
          showColon={timer.showColon}
          currentSession={timer.currentSession}
          countdown={timer.countdown}
          nextSession={timer.nextSession}
        />

        <ProgressBar
          timeLeft={timer.timeLeft}
          sessionTime={timer.sessionTime}
        />

        <SessionDots
          completedSessions={timer.completedSessions}
          totalSessions={settings.sessionsBeforeLongBreak}
        />

        <TimerControls
          isRunning={timer.isRunning}
          onStartPause={() => {
            if (timer.countdown !== null) return;
            unlockAudio();
            timer.setIsRunning((prev) => !prev);
          }}
          onReset={timer.handleReset}
          onResetAll={timer.handleResetAll}
          onAudioUnlock={unlockAudio}
        />

        {/* Settings Button - Bottom Right */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogTrigger asChild>
            <button className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-13 sm:h-13 bg-primary text-primary-text rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 hover:opacity-90 transition-all flex items-center justify-center cursor-pointer">
              <Settings className="w-6 h-6" />
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

        {/* Picture-in-Picture Button */}
        {isPipSupported && (
          <button
            onClick={togglePictureInPicture}
            className="fixed bottom-4 right-20 sm:bottom-8 sm:right-24 w-12 h-12 sm:w-13 sm:h-13 bg-primary text-primary-text rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 hover:opacity-90 transition-all flex items-center justify-center cursor-pointer"
            title="Open mini player"
          >
            <PictureInPicture2 className="w-6 h-6" />
          </button>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
