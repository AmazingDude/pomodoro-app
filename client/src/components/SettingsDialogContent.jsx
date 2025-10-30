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
        className="sm:max-w-[26.5625rem] bg-card text-foreground border-border max-h-[85vh] overflow-y-auto animate-in duration-300 ease-out
                         data-[state=closed]:fade-out-0
                         data-[state=open]:fade-in-0
                         sm:rounded-lg"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Theme Selector */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-foreground">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(availableThemes).map(([key, themeOption]) => (
                <button
                  key={key}
                  onClick={() => setCurrentTheme(key)}
                  className={`p-3 rounded-lg border-2 transition-all capitalize ${
                    currentTheme === key
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: themeOption.displayColor }}
                    ></div>
                    <span className="text-sm font-medium text-foreground">
                      {themeOption.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Focus Duration */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              Focus Duration (minutes)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    focusDuration: Math.max(1, prev.focusDuration - 1),
                  }))
                }
                className="w-10 h-10 rounded-lg border-2 border-border hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center font-bold"
              >
                −
              </button>
              <input
                type="number"
                value={settings.focusDuration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    focusDuration: Math.max(1, parseInt(e.target.value) || 1),
                  }))
                }
                className="flex-1 text-center text-lg font-semibold border-2 border-border rounded-lg py-2 focus:outline-none focus:border-primary bg-card text-foreground"
              />
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    focusDuration: Math.min(60, prev.focusDuration + 1),
                  }))
                }
                className="w-10 h-10 rounded-lg border-2 border-border hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Short Break Duration */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              Short Break (minutes)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    shortBreakDuration: Math.max(
                      1,
                      prev.shortBreakDuration - 1
                    ),
                  }))
                }
                className="w-10 h-10 rounded-lg border-2 border-border hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center font-bold"
              >
                −
              </button>
              <input
                type="number"
                value={settings.shortBreakDuration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    shortBreakDuration: Math.max(
                      1,
                      parseInt(e.target.value) || 1
                    ),
                  }))
                }
                className="flex-1 text-center text-lg font-semibold border-2 border-border rounded-lg py-2 focus:outline-none focus:border-primary bg-card text-foreground"
              />
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    shortBreakDuration: Math.min(
                      30,
                      prev.shortBreakDuration + 1
                    ),
                  }))
                }
                className="w-10 h-10 rounded-lg border-2 border-border hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Long Break Duration */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              Long Break (minutes)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    longBreakDuration: Math.max(1, prev.longBreakDuration - 1),
                  }))
                }
                className="w-10 h-10 rounded-lg border-2 border-border hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center font-bold"
              >
                −
              </button>
              <input
                type="number"
                value={settings.longBreakDuration}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    longBreakDuration: Math.max(
                      1,
                      parseInt(e.target.value) || 1
                    ),
                  }))
                }
                className="flex-1 text-center text-lg font-semibold border-2 border-border rounded-lg py-2 focus:outline-none focus:border-primary bg-card text-foreground"
              />
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    longBreakDuration: Math.min(60, prev.longBreakDuration + 1),
                  }))
                }
                className="w-10 h-10 rounded-lg border-2 border-border hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Sessions Before Long Break */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              Sessions before long break
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    sessionsBeforeLongBreak: Math.max(
                      2,
                      prev.sessionsBeforeLongBreak - 1
                    ),
                  }))
                }
                className="w-10 h-10 rounded-lg border-2 border-border hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center font-bold"
              >
                −
              </button>
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
                className="flex-1 text-center text-lg font-semibold border-2 border-border rounded-lg py-2 focus:outline-none focus:border-primary bg-card text-foreground"
              />
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    sessionsBeforeLongBreak: Math.min(
                      8,
                      prev.sessionsBeforeLongBreak + 1
                    ),
                  }))
                }
                className="w-10 h-10 rounded-lg border-2 border-border hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Auto-start Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
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
            <label className="text-sm font-semibold text-foreground">
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
