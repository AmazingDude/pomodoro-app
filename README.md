# Pomotan 🍅

#### Description:

Pomotan is a modern, feature-rich Pomodoro timer web application designed to help users enhance their productivity and maintain focus through structured work intervals. The name "Pomotan" combines "Pomodoro" (the time management technique) with a playful, approachable aesthetic. This project was built as my final project for Harvard's CS50x course, demonstrating proficiency in web development, React state management, and user interface design.

The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. Pomotan implements this technique with extensive customization options, six beautiful themes, sound notifications, and persistent settings that survive browser sessions. The application is fully responsive, working seamlessly on desktop and mobile devices, and includes thoughtful features like dynamic browser tab titles that display the current timer countdown even when users switch to other tabs.

## Features

Pomotan offers a comprehensive set of features that make it both powerful and delightful to use:

**Core Timer Functionality:**

- Three session types: Focus sessions, short breaks, and long breaks
- Customizable duration for each session type (1-60 minutes for focus/long breaks, 1-30 minutes for short breaks)
- Visual progress bar showing completion percentage
- Session counter with visual indicators showing progress toward the next long break
- Automatic session cycling with configurable intervals
- Start/Pause and Reset controls for complete timer management

**User Experience Enhancements:**

- Dynamic browser tab title showing countdown and session type (e.g., "23:49 | Focus")
- Auto-start feature with a 3-second countdown between sessions
- Sound notifications for session completion (different sounds for focus vs. break endings)
- Toast notifications with friendly, encouraging messages
- Blinking colon animation in the timer display
- Smooth animations and transitions throughout the interface

**Customization Options:**

- Six carefully designed themes: Sunset, Midnight, Matcha, Snow, Dusk, and Mono
- Adjustable session durations with both slider and number input controls
- Configurable number of focus sessions before a long break (2-8 sessions)
- Toggle switches for auto-start and sound notifications
- All settings persist across browser sessions using localStorage

**Responsive Design:**

- Fully responsive layout optimized for mobile, tablet, and desktop
- Touch-friendly controls for mobile users
- Adaptive font sizes and spacing based on screen size
- Custom scrollbar styling in the settings dialog

## How It Works (Technical Explanation)

Pomotan is built with React 19 and Vite, leveraging modern JavaScript features and React Hooks for state management. The application architecture revolves around a single main component (`App.jsx`) that manages all timer logic and state, with supporting context providers for theming and reusable UI components built with Radix UI primitives.

**State Management:**
The application uses React's `useState` hook extensively to manage various pieces of state:

- Timer state: `timeLeft`, `isRunning`, `currentSession`
- Settings state: duration preferences, auto-start, sound enabled, sessions before long break
- UI state: dialog visibility, countdown display, completed sessions count

Settings are initialized from localStorage on component mount, allowing user preferences to persist between sessions. Whenever settings change, they're automatically saved back to localStorage and the timer is reset to reflect the new durations.

**Timer Logic:**
The core timer functionality uses `setInterval` within a `useEffect` hook that runs when `isRunning` is true. Each second, it decrements `timeLeft` by 1 and toggles the colon visibility for a blinking effect. When the timer reaches zero, it triggers `handleSessionEnd()`, which determines the next session type based on the completed sessions count and user settings.

The session progression logic implements the classic Pomodoro pattern: after each focus session, the app increments a counter. If this counter is divisible by the configured "sessions before long break" value, a long break is scheduled; otherwise, a short break occurs. After any break, the next session is always a focus session.

**Auto-Start Feature:**
When auto-start is enabled, session transitions include a 3-second countdown state. This uses a separate `useEffect` hook that monitors the `countdown` state variable. When countdown reaches zero, `isRunning` is set to true automatically, seamlessly transitioning to the next session while displaying a toast notification.

**Sound System:**
Audio elements are created once during component initialization using the `useState` hook with a function initializer. This prevents recreating Audio objects on every render. The sounds are preloaded for instant playback. An `audioUnlocked` state variable handles iOS restrictions that prevent auto-playing audio without user interaction—the first button click unlocks audio capabilities.

**Theme System:**
Theming is handled through a Context API provider (`ThemeContext.jsx`) that wraps the entire application. Six theme objects define CSS custom properties for colors. When a theme is selected, the context provider applies these variables to the document root using `document.documentElement.style.setProperty()`. Tailwind CSS classes reference these CSS variables, enabling instant theme switching without page reload.

**Dynamic Document Title:**
A dedicated `useEffect` hook monitors `timeLeft`, `isRunning`, and `currentSession` states. It formats the current time as MM:SS and updates `document.title` accordingly. When the timer is running, the title shows "MM:SS | Session Name"; when paused or stopped, it displays "Pomotan". This allows users to track their timer from any browser tab.

**Persistence:**
The application uses localStorage for three types of data:

1. Pomodoro settings (durations, auto-start, sound preferences, sessions before long break)
2. Current theme selection
3. Current session type (focus, short break, or long break)

Data is loaded on component mount and saved whenever it changes, using `useEffect` hooks with appropriate dependencies.

## File Structure and What Each File Does

```
client/
├── public/
│   └── sounds/
│       ├── focus-end.mp3          # Sound played when focus session ends
│       └── break-end.mp3          # Sound played when break session ends
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.jsx         # Reusable button component using CVA
│   │   │   ├── dialog.jsx         # Dialog primitives from Radix UI
│   │   │   └── sonner.jsx         # Toast notification component
│   │   └── SettingsDialogContent.jsx  # Settings panel UI and logic
│   ├── contexts/
│   │   └── ThemeContext.jsx       # Theme provider with 6 theme definitions
│   ├── lib/
│   │   └── utils.js               # Utility function for className merging
│   ├── App.jsx                    # Main application component with timer logic
│   ├── main.jsx                   # React app entry point with providers
│   └── index.css                  # Global styles, Tailwind directives, theme CSS
├── index.html                     # HTML entry point
├── vite.config.js                 # Vite configuration with path aliases
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration for Tailwind
├── eslint.config.js               # ESLint rules and configuration
├── jsconfig.json                  # JavaScript project configuration
├── components.json                # shadcn/ui component configuration
└── package.json                   # Dependencies and scripts
```

**Key Files Explained:**

- **App.jsx** (500+ lines): The heart of the application. Contains all timer logic, state management, session progression, sound playback, and the main UI layout. It orchestrates all features and manages the interaction between different parts of the app.

- **ThemeContext.jsx**: Implements the Context API to provide theme state globally. Defines six complete theme objects with CSS variable mappings. Applies themes dynamically to the DOM and persists theme selection to localStorage.

- **SettingsDialogContent.jsx**: A controlled component that renders the settings panel. Includes theme selector, duration sliders with number inputs, session counter configuration, and toggle switches for auto-start and sound. Uses controlled inputs that update the parent component's state.

- **index.css**: Contains Tailwind directives, custom CSS animations (fadeIn), CSS variable definitions for theming, custom scrollbar styles, slider styling, and overrides for Radix UI Dialog and Sonner toast components to respect theme colors.

- **vite.config.js**: Configures Vite build tool with React SWC plugin for fast refresh, Tailwind CSS plugin, and path alias resolution (`@/` maps to `./src/`).

## Design Decisions

Several important design decisions shaped Pomotan's development:

**Single Component Architecture:** I chose to keep the main timer logic in a single `App.jsx` component rather than breaking it into smaller components. This decision was intentional—the timer state is highly interconnected (changing session types affects time left, settings changes reset timers, etc.), and keeping everything in one place makes the logic easier to understand and debug. This follows the principle of colocation: keep related code together until you have a clear reason to separate it.

**CSS Variables for Theming:** Rather than using CSS-in-JS or separate stylesheets per theme, I implemented theming through CSS custom properties. This approach provides instant theme switching without re-rendering components, better performance, and cleaner separation between styling and logic. The theme definitions are data structures that map to CSS variables, making it easy to add new themes.

**localStorage Over Backend:** For a productivity timer, I decided against implementing a backend server. User preferences and session state are stored locally in the browser. This choice makes the app instant-loading, privacy-friendly (no data collection), deployable as a static site, and usable offline. For this use case, the benefits outweigh the limitation of not syncing across devices.

**Radix UI Primitives:** I used Radix UI for accessible, unstyled UI primitives (Dialog, Slot) rather than building from scratch or using a complete component library. This gives me full control over styling while ensuring keyboard navigation, focus management, and ARIA attributes are handled correctly—critical for accessibility.

**Auto-Start with Countdown:** When implementing auto-start, I added a 3-second countdown before the next session begins. This prevents jarring automatic transitions and gives users time to prepare mentally for the next session. The countdown also displays which session type is coming next.

**Separate Sounds for Different Sessions:** Using different audio files for focus vs. break completions provides audio feedback that immediately communicates what just happened without requiring users to look at the screen.

**Dynamic Tab Title:** Updating the browser tab title with the timer countdown was a deliberate UX enhancement. Users often work in other tabs during focus sessions, and seeing the timer in the tab title lets them monitor progress without switching contexts.

## Technologies Used

- **React 19.1.1**: Core UI library for building the component-based interface
- **Vite 7.1.7**: Build tool and development server providing fast hot module replacement
- **Tailwind CSS 4.1.14**: Utility-first CSS framework for styling
- **@radix-ui/react-dialog**: Accessible, unstyled dialog primitives
- **Sonner**: Beautiful toast notification library
- **localStorage API**: Browser storage for persisting user preferences
- **Lucide React**: Icon library for UI elements
- **class-variance-authority**: For creating variant-based component APIs
- **clsx & tailwind-merge**: Utilities for conditional and merged className handling
- **ESLint**: Code linting for maintaining code quality
- **@vitejs/plugin-react-swc**: Fast refresh using SWC compiler

## Challenges Faced

**iOS Audio Restrictions:** One significant challenge was handling iOS Safari's strict audio autoplay policies. Mobile browsers require user interaction before playing audio. I solved this by implementing an `audioUnlocked` state and an `unlockAudio()` function that plays and immediately pauses both sound files on the first user click (the Start button). This primes the audio context for later playback.

**State Synchronization:** Managing multiple interdependent state variables (settings, current session, time left, running state) required careful use of `useEffect` hooks. I had to ensure that changing settings updated timer durations without breaking the current session, and that session changes properly reset the timer. The solution involved using functional updates and carefully chosen dependency arrays.

**Theme Persistence and Application:** Applying themes on initial load before React fully renders was tricky—there was a brief flash of default styles. I resolved this by initializing the theme state from localStorage and using a `useEffect` that runs immediately on mount to apply CSS variables to the document root.

**Responsive Dialog Scrolling:** The settings dialog needed custom scrollbar styling that respected the current theme. Default scrollbars don't support theme colors, so I implemented custom webkit-scrollbar CSS with theme variable references and Firefox scrollbar properties, ensuring the dialog felt cohesive with the rest of the application.

**Session Progression Logic:** Determining when to schedule a long break versus a short break required careful logic. I implemented a modulo operation on the completed sessions count: if `completedSessions % sessionsBeforeLongBreak === 0`, trigger a long break. This mathematical approach is cleaner than maintaining complex conditional chains.

**Timer Accuracy:** JavaScript's `setInterval` isn't perfectly accurate due to event loop delays. For a Pomodoro timer, this small drift is acceptable, but I considered using `requestAnimationFrame` or checking actual elapsed time. I decided against over-engineering this since sub-second precision isn't critical for 25-minute sessions.

## Future Improvements

While Pomotan is fully functional and polished, several enhancements could make it even better:

- **Session History & Statistics**: Track completed sessions over time, display daily/weekly statistics, and show productivity streaks to motivate users.

- **Task Integration**: Allow users to attach a task description to each focus session, creating a log of what they worked on during each Pomodoro.

- **Keyboard Shortcuts**: Implement hotkeys for start/pause (Space), reset (R), and opening settings (S) for power users who prefer keyboard navigation.

- **Progressive Web App (PWA)**: Add a service worker and manifest file to enable installation on mobile devices and offline functionality.

- **Desktop Notifications**: Use the Notifications API to alert users when sessions end, even if the tab isn't visible.

- **Session Goals**: Let users set a target number of focus sessions per day and track progress toward that goal.

- **Multiple Timers/Profiles**: Support different timer configurations for different types of work (e.g., deep work, meetings, creative sessions).

- **Data Export**: Allow users to download their session history as JSON or CSV for personal analysis.

- **Sync Across Devices**: Implement optional cloud sync using a backend service like Firebase or Supabase, while keeping local-only mode as default.

- **Accessibility Audit**: While basic accessibility is covered via Radix UI, a comprehensive audit with screen reader testing would ensure the app is usable by everyone.

## AI Usage Disclosure

Some parts of this project's documentation were assisted by AI tools such as GitHub Copilot and ChatGPT, but all code was written and understood by me. I used AI primarily for:

- Generating boilerplate code structures that I then customized
- Debugging specific issues by describing the problem and receiving suggestions
- Refining this README documentation for clarity and completeness

All core logic, design decisions, and implementation details were conceived and executed by me. I can explain every line of code in this project and the reasoning behind architectural choices.

---

**Live Demo**: https://pomotan.vercel.app  
**Repository**: [https://github.com/AmazingDude/pomodoro-app](https://github.com/AmazingDude/pomodoro-app)

_This project is dedicated to everyone striving to focus better in an increasingly distracting world. Happy focusing! ✨_
