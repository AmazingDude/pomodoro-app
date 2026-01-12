# Pomotan - Technical Documentation

This document provides detailed technical information about Pomotan's architecture, implementation, and design decisions. For a quick overview, see the [README](README.md).

## Project Context

Pomotan was built as my final project for Harvard's CS50x course, demonstrating proficiency in web development, React state management, and user interface design. The name "Pomotan" combines "Pomodoro" (the time management technique) with a playful, approachable aesthetic.

## How It Works (Technical Explanation)

Pomotan is built with React 19 and Vite, leveraging modern JavaScript features and React Hooks for state management. The application has been refactored from a single-component architecture into a modular structure with custom hooks and isolated components.

### Architecture Overview

The application follows a component-based architecture with separation of concerns:

**Components:**

- `Header.jsx` - App title and tagline
- `SessionSelector.jsx` - Focus/Break session toggle buttons
- `TimerDisplay.jsx` - Main timer with session-specific icons
- `ProgressBar.jsx` - Visual progress indicator
- `SessionDots.jsx` - Completion dots showing progress
- `TimerControls.jsx` - Start/Pause and Reset dropdown menu
- `SettingsDialogContent.jsx` - Settings panel UI

**Custom Hooks:**

- `useTimer.js` - All timer logic and state management
- `useAudio.js` - Audio loading and playback
- `usePictureInPicture.js` - PiP window management with optimized DOM updates

**Context:**

- `ThemeContext.jsx` - Global theme management

### State Management

The application uses React's `useState` hook extensively to manage various pieces of state:

**Timer State (useTimer hook):**

- `timeLeft` - Remaining seconds in current session
- `isRunning` - Whether timer is actively counting
- `currentSession` - 'focus', 'shortBreak', or 'longBreak'
- `completedSessions` - Counter persisted to localStorage
- `showColon` - Controls blinking colon animation
- `countdown` - Auto-start countdown state
- `nextSession` - Upcoming session type during countdown

**Settings State (App.jsx):**

- Duration preferences for each session type
- Auto-start enabled/disabled
- Sound enabled/disabled
- Sessions before long break (2-8)

Settings are initialized from localStorage on component mount, allowing user preferences to persist between sessions. Whenever settings change, they're automatically saved back to localStorage and the timer is reset to reflect the new durations.

### Timer Logic

The core timer functionality uses `setInterval` within a `useEffect` hook that runs when `isRunning` is true:

```javascript
useEffect(() => {
  if (!isRunning) return;

  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        handleSessionEnd();
        return 0;
      }
      return prev - 1;
    });
    setShowColon((prev) => !prev); // Blinking effect
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning]);
```

**Session Progression:**
The session progression logic implements the classic Pomodoro pattern:

1. After each focus session, increment `completedSessions`
2. If `completedSessions % sessionsBeforeLongBreak === 0`, schedule long break
3. Otherwise, schedule short break
4. After any break, next session is always focus

This mathematical approach using modulo is cleaner than complex conditional chains.

### Auto-Start Feature

When auto-start is enabled, session transitions include a 3-second countdown:

```javascript
useEffect(() => {
  if (countdown === null || countdown <= 0) return;

  const timer = setTimeout(() => {
    setCountdown(countdown - 1);
    if (countdown - 1 === 0) {
      setIsRunning(true);
      setCountdown(null);
      toast.success(`${nextSession} started!`);
    }
  }, 1000);

  return () => clearTimeout(timer);
}, [countdown]);
```

This prevents jarring automatic transitions and gives users time to prepare mentally for the next session.

### Audio System

Audio elements are created once during component initialization:

```javascript
const [sounds] = useState(() => ({
  focusEnd: new Audio("/sounds/focus-end.mp3"),
  breakEnd: new Audio("/sounds/break-end.mp3"),
}));
```

This prevents recreating Audio objects on every render. The sounds are preloaded for instant playback.

**iOS Audio Handling:**
An `audioUnlocked` state handles iOS restrictions that prevent auto-playing audio without user interaction. The first button click unlocks audio capabilities by playing and immediately pausing both sound files.

### Theme System

Theming is handled through a Context API provider that wraps the entire application:

```javascript
const themes = {
  sunset: {
    displayColor: "#FF6B6B",
    cssVars: {
      "--bg-color": "#1a1a2e",
      "--text-color": "#eee",
      // ... more variables
    },
  },
  // ... more themes
};
```

When a theme is selected, CSS variables are applied to the document root:

```javascript
Object.entries(theme.cssVars).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});
```

Tailwind CSS classes reference these CSS variables, enabling instant theme switching without page reload.

### Picture-in-Picture Optimization

The PiP feature uses the Document Picture-in-Picture API (Chrome/Edge 116+) with performance optimizations:

**DOM Element Caching:**

```javascript
const elementsRef = useRef(null);

// Cache elements once
if (!elementsRef.current && pipWindow) {
  elementsRef.current = {
    titleEl: pipWindow.document.getElementById("pip-title"),
    timerEl: pipWindow.document.getElementById("pip-timer"),
    minutesSpan: pipWindow.document.querySelector(".pip-minutes"),
    // ... more elements
  };
}
```

**Split useEffects:**
Instead of one large effect that runs on every state change, the hook uses focused effects:

1. Session title updates (only when session changes)
2. Timer and progress updates (when timeLeft changes)
3. Play/pause button updates (when isRunning changes)
4. Session dots updates (when completedSessions changes)

This prevents unnecessary DOM queries and updates, significantly improving performance.

### Dynamic Document Title

A dedicated `useEffect` hook monitors timer state and updates the browser tab title:

```javascript
useEffect(() => {
  if (isRunning) {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.title = `${mins}:${secs.toString().padStart(2, "0")} | ${
      currentSession === "focus" ? "Focus" : "Break"
    }`;
  } else {
    document.title = "Pomotan";
  }
}, [timeLeft, isRunning, currentSession]);
```

This allows users to track their timer from any browser tab.

### Persistence

The application uses localStorage for four types of data:

1. **Pomodoro settings** - Durations, auto-start, sound preferences, sessions before long break
2. **Current theme** - Selected theme name
3. **Current session** - Active session type (focus/break)
4. **Completed sessions** - Session counter that survives refresh

Data is loaded on component mount and saved whenever it changes using `useEffect` hooks with appropriate dependencies.

## File Structure

```
client/
├── public/
│   └── sounds/
│       ├── focus-end.mp3
│       └── break-end.mp3
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── popover.jsx
│   │   │   └── sonner.jsx
│   │   ├── Header.jsx
│   │   ├── SessionSelector.jsx
│   │   ├── TimerDisplay.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── SessionDots.jsx
│   │   ├── TimerControls.jsx
│   │   └── SettingsDialogContent.jsx
│   ├── contexts/
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useTimer.js
│   │   ├── useAudio.js
│   │   └── usePictureInPicture.js
│   ├── lib/
│   │   └── utils.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── jsconfig.json
├── components.json
└── package.json
```

### Key Files Explained

**useTimer.js (~220 lines):**

- Encapsulates all timer state and logic
- Manages session progression and auto-start countdown
- Handles localStorage persistence for completedSessions
- Exports handleReset and handleResetAll functions
- Integrates with sound playback via callback

**usePictureInPicture.js (~319 lines):**

- Creates and manages PiP window lifecycle
- Uses useRef for DOM element caching (performance optimization)
- Split into 4 focused useEffects by dependency
- Direct textContent updates instead of innerHTML
- Handles PiP window close event

**useAudio.js (~54 lines):**

- Loads audio files and handles iOS unlock
- Provides playSound function with error handling
- Preloads both focus-end and break-end sounds

**ThemeContext.jsx:**

- Defines 7 theme objects with CSS variables
- Applies themes dynamically to document root
- Persists theme selection to localStorage
- Provides theme state globally via Context API

**App.jsx (~200 lines):**

- Main orchestrator component
- Manages settings state and persistence
- Integrates all hooks (useTimer, useAudio, usePictureInPicture)
- Renders component tree with proper prop passing
- Contains Settings, PiP, and About buttons

**index.css:**

- Tailwind directives and CSS imports
- CSS variable definitions for theme system
- Custom animations for shadcn components
- Radix UI component styling overrides
- Custom scrollbar styles

## Design Decisions

### Component Extraction

The app was refactored from a monolithic 700+ line component into smaller, focused components and custom hooks. This improves:

- **Code maintainability** - Easier to understand and modify
- **Reusability** - Components can be reused or tested independently
- **Separation of concerns** - Logic (hooks) vs UI (components)

### CSS Variables for Theming

Rather than CSS-in-JS or separate stylesheets per theme:

- ✅ Instant theme switching without re-rendering components
- ✅ Better performance
- ✅ Cleaner separation between styling and logic
- ✅ Easy to add new themes (just define CSS variable mappings)

### localStorage Over Backend

For a productivity timer, no backend was implemented:

- ✅ Instant-loading
- ✅ Privacy-friendly (no data collection)
- ✅ Deployable as static site
- ✅ Works offline
- ❌ No cross-device sync (acceptable tradeoff)

### Radix UI Primitives

Using Radix UI for Dialog, Dropdown, Popover:

- ✅ Accessible by default (keyboard nav, ARIA attributes)
- ✅ Unstyled - full control over appearance
- ✅ Battle-tested components
- ✅ Smaller bundle than full component libraries

### Reset Dropdown Menu

Instead of a single reset button or long-press gesture:

- ✅ Two clear options: "Reset Timer" vs "Reset All"
- ✅ Helper text explains what each does
- ✅ Better UX than modal confirmation
- ✅ Uses shadcn dropdown component for consistency

### Separate Sounds for Different Sessions

Using different audio files for focus vs. break completions:

- Provides immediate audio feedback
- Users know what happened without looking at screen
- Different tones match session mood (focused vs relaxed)

## Technologies Used

- **React 19.1.1** - Core UI library
- **Vite 7.1.7** - Build tool and dev server
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives (Dialog, Dropdown, Popover)
- **Sonner** - Toast notification library
- **Lucide React** - Icon library
- **localStorage API** - Client-side persistence
- **Document Picture-in-Picture API** - Floating mini player
- **class-variance-authority** - Variant-based component APIs
- **clsx & tailwind-merge** - Conditional className utilities

## Challenges Faced

### iOS Audio Restrictions

**Problem:** Mobile browsers require user interaction before playing audio.

**Solution:** Implemented `audioUnlocked` state and `unlockAudio()` function that plays and immediately pauses both sound files on first user click. This primes the audio context for later playback.

### State Synchronization

**Problem:** Multiple interdependent state variables required careful management.

**Solution:** Used functional updates and carefully chosen dependency arrays in `useEffect` hooks. Ensured settings changes update timer durations without breaking current session.

### Theme Flash on Load

**Problem:** Brief flash of default styles before React applies theme.

**Solution:** Initialize theme state from localStorage and use `useEffect` that runs immediately on mount to apply CSS variables to document root.

### PiP Performance

**Problem:** Running DOM queries every second caused performance issues.

**Solution:** Implemented useRef caching for all DOM elements and split useEffects by dependency. Replaced innerHTML with direct textContent updates.

### Responsive Dialog Mobile Shift

**Problem:** Opening dropdown on mobile caused header to shift position.

**Solution:** Changed Header from `absolute` to `fixed` positioning to lock it to viewport.

### Timer Accuracy

**Problem:** JavaScript's `setInterval` isn't perfectly accurate due to event loop delays.

**Decision:** Acceptable for Pomodoro timer - sub-second precision isn't critical for 25-minute sessions. Avoided over-engineering with `requestAnimationFrame` or elapsed time checking.

## Future Improvements

- **Session History & Statistics** - Track sessions over time, show streaks
- **Task Integration** - Attach task descriptions to focus sessions
- **Keyboard Shortcuts** - Hotkeys for start/pause, reset, settings
- **Progressive Web App** - Service worker for offline support and installation
- **Desktop Notifications** - Alert when sessions end even if tab isn't visible
- **Session Goals** - Set daily focus session targets
- **Multiple Timers/Profiles** - Different configs for different work types
- **Data Export** - Download session history as JSON/CSV
- **Optional Cloud Sync** - Firebase/Supabase integration while keeping local-only default
- **Comprehensive Accessibility Audit** - Screen reader testing

## Performance Considerations

1. **Minimal Re-renders** - Custom hooks prevent unnecessary component updates
2. **DOM Element Caching** - PiP uses useRef to cache all DOM references
3. **CSS Variables** - Theme switching doesn't trigger React re-renders
4. **Audio Preloading** - Sounds loaded once, played instantly
5. **Split Effects** - PiP uses 4 focused useEffects instead of 1 large one
6. **localStorage Debouncing** - Settings saved only when they change, not on every render

## Browser Compatibility

- **Modern browsers** - Chrome, Firefox, Safari, Edge (latest versions)
- **Picture-in-Picture** - Chrome/Edge 116+ only
- **Mobile** - iOS Safari, Chrome Mobile, Samsung Internet
- **iOS Audio** - Handled with unlock mechanism
- **localStorage** - All modern browsers (no fallback needed for this use case)

---

_For the user-friendly overview and quick start guide, see the [README](README.md)._
