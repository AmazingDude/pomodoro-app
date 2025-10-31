import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SettingsDialogContent({
  settings,
  setSettings,
  availableThemes,
  currentTheme,
  setCurrentTheme,
}) {
  return (
    <>
      {DialogOverlay && (
        <DialogOverlay
          className="
          fixed inset-0 z-40 bg-black/40
          data-[state=open]:animate-in data-[state=open]:fade-in-0
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0
        "
        />
      )}

      <DialogContent
        className="w-[calc(100%-2rem)] max-w-[26.5625rem] mx-auto bg-card text-foreground border-border max-h-[85vh] overflow-y-auto animate-in duration-300 ease-out
                         data-[state=closed]:fade-out-0
                         data-[state=open]:fade-in-0
                         rounded-lg sm:rounded-lg
                         [&::-webkit-scrollbar]:w-[6px]
                         [&::-webkit-scrollbar-track]:bg-transparent
                         [&::-webkit-scrollbar-thumb]:bg-border
                         [&::-webkit-scrollbar-thumb]:rounded-[4px]
                         [&::-webkit-scrollbar-thumb:hover]:bg-primary
                         scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-center font-bold text-foreground">
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 py-2">
          {/* Theme Selector */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-foreground">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(availableThemes).map(([key, themeOption]) => (
                <button
                  key={key}
                  onClick={() => setCurrentTheme(key)}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all capitalize ${
                    currentTheme === key
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                      style={{ backgroundColor: themeOption.displayColor }}
                    ></div>
                    <span className="text-xs sm:text-sm font-medium text-foreground">
                      {themeOption.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Focus Duration */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-2 text-foreground">
              Focus Duration (minutes)
            </label>
            <div className="space-y-2">
              <input
                type="number"
                value={settings.focusDuration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    focusDuration: Math.max(
                      1,
                      Math.min(60, parseInt(e.target.value) || 1)
                    ),
                  }))
                }
                className="w-full text-center text-base sm:text-lg font-semibold border-2 border-border rounded-lg py-1.5 sm:py-2 focus:outline-none focus:border-primary bg-card text-foreground"
              />
              <input
                type="range"
                min="1"
                max="60"
                value={settings.focusDuration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    focusDuration: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Short Break Duration */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-2 text-foreground">
              Short Break (minutes)
            </label>
            <div className="space-y-2">
              <input
                type="number"
                value={settings.shortBreakDuration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    shortBreakDuration: Math.max(
                      1,
                      Math.min(30, parseInt(e.target.value) || 1)
                    ),
                  }))
                }
                className="w-full text-center text-base sm:text-lg font-semibold border-2 border-border rounded-lg py-1.5 sm:py-2 focus:outline-none focus:border-primary bg-card text-foreground"
              />
              <input
                type="range"
                min="1"
                max="30"
                value={settings.shortBreakDuration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    shortBreakDuration: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Long Break Duration */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-2 text-foreground">
              Long Break (minutes)
            </label>
            <div className="space-y-2">
              <input
                type="number"
                value={settings.longBreakDuration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    longBreakDuration: Math.max(
                      1,
                      Math.min(60, parseInt(e.target.value) || 1)
                    ),
                  }))
                }
                className="w-full text-center text-base sm:text-lg font-semibold border-2 border-border rounded-lg py-1.5 sm:py-2 focus:outline-none focus:border-primary bg-card text-foreground"
              />
              <input
                type="range"
                min="1"
                max="60"
                value={settings.longBreakDuration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    longBreakDuration: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Sessions Before Long Break */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-2 text-foreground">
              Sessions before long break
            </label>
            <div className="space-y-2">
              <input
                type="number"
                value={settings.sessionsBeforeLongBreak}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    sessionsBeforeLongBreak: Math.max(
                      2,
                      Math.min(8, parseInt(e.target.value) || 2)
                    ),
                  }))
                }
                className="w-full text-center text-base sm:text-lg font-semibold border-2 border-border rounded-lg py-1.5 sm:py-2 focus:outline-none focus:border-primary bg-card text-foreground"
              />
              <input
                type="range"
                min="2"
                max="8"
                value={settings.sessionsBeforeLongBreak}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    sessionsBeforeLongBreak: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Auto-start Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-semibold text-foreground">
              Auto-start sessions
            </label>
            <button
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  autoStart: !prev.autoStart,
                }))
              }
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.autoStart ? "bg-primary" : "bg-secondary"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-card rounded-full shadow-sm transition-transform ${
                  settings.autoStart ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-semibold text-foreground">
              Sound notifications
            </label>
            <button
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  soundEnabled: !prev.soundEnabled,
                }))
              }
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.soundEnabled ? "bg-primary" : "bg-secondary"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-card rounded-full shadow-sm transition-transform ${
                  settings.soundEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </DialogContent>
    </>
  );
}
