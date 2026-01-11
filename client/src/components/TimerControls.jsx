import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function TimerControls({
  isRunning,
  onStartPause,
  onReset,
  onResetAll,
  onAudioUnlock,
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-6 sm:px-9 py-[0.4rem] text-sm sm:text-base bg-primary text-primary-text border-primary border-2 rounded-r-full opacity-85 hover:opacity-70 transition-all duration-150 cursor-pointer select-none flex-1 sm:flex-none flex items-center justify-center gap-1">
            Reset
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-32">
          <DropdownMenuItem
            onClick={onReset}
            className="cursor-pointer flex-col items-start gap-0.5 hover:bg-primary/15"
          >
            <span className="font-medium">Reset Timer</span>
            <span className="text-xs opacity-60">Current session</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onResetAll}
            className="cursor-pointer flex-col items-start gap-0.5 hover:bg-primary/15"
          >
            <span className="font-medium">Reset All</span>
            <span className="text-xs opacity-60">Timer + sessions</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
