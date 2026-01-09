import { useEffect, useState, useRef } from "react";

export function usePictureInPicture(timerState, settings) {
  const [pipWindow, setPipWindow] = useState(null);
  const [isPipSupported] = useState("documentPictureInPicture" in window);
  const elementsRef = useRef(null);

  const {
    timeLeft,
    showColon,
    currentSession,
    sessionTime,
    isRunning,
    completedSessions,
    setIsRunning,
  } = timerState;

  // Update session title only when currentSession changes
  useEffect(() => {
    if (!pipWindow || pipWindow.closed || !elementsRef.current) return;

    const { titleEl } = elementsRef.current;
    if (titleEl) {
      titleEl.textContent =
        currentSession === "focus"
          ? "Focus"
          : currentSession === "shortBreak"
          ? "Short Break"
          : "Long Break";
    }
  }, [pipWindow, currentSession]);

  // Update timer display and progress when timeLeft or showColon changes
  useEffect(() => {
    if (!pipWindow || pipWindow.closed || !elementsRef.current) return;

    const { timerEl, progressEl, minutesSpan, colonSpan, secondsSpan } = elementsRef.current;

    if (timerEl && minutesSpan && colonSpan && secondsSpan) {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      
      minutesSpan.textContent = mins.toString().padStart(2, "0");
      secondsSpan.textContent = secs.toString().padStart(2, "0");
      colonSpan.style.opacity = showColon ? "1" : "0.8";
    }

    if (progressEl) {
      progressEl.style.transform = `scaleX(${1 - timeLeft / sessionTime})`;
    }
  }, [pipWindow, timeLeft, showColon, sessionTime]);

  // Update play/pause button when isRunning changes
  useEffect(() => {
    if (!pipWindow || pipWindow.closed || !elementsRef.current) return;

    const { playPauseBtn } = elementsRef.current;
    if (playPauseBtn) {
      playPauseBtn.textContent = isRunning ? "Pause" : "Start";
    }
  }, [pipWindow, isRunning]);

  // Update session dots when completedSessions changes
  useEffect(() => {
    if (!pipWindow || pipWindow.closed || !elementsRef.current) return;

    const { dots } = elementsRef.current;
    if (!dots) return;

    const styles = getComputedStyle(document.documentElement);
    const primaryColor = styles.getPropertyValue("--color-primary").trim();
    const borderColor = styles.getPropertyValue("--color-border").trim();

    dots.forEach((dot, i) => {
      const isCompleted = i < completedSessions % settings.sessionsBeforeLongBreak;
      dot.style.border = `2px solid ${isCompleted ? primaryColor : borderColor}`;
      dot.style.background = isCompleted ? primaryColor : "transparent";
    });
  }, [pipWindow, completedSessions, settings.sessionsBeforeLongBreak]);

  const togglePictureInPicture = async () => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
      elementsRef.current = null;
      return;
    }

    try {
      const pip = await window.documentPictureInPicture.requestWindow({
        width: 400,
        height: 300,
      });

      setPipWindow(pip);

      // Load Google Fonts in PiP window
      const fontLink = pip.document.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap";
      pip.document.head.appendChild(fontLink);

      // Copy all stylesheets to PiP window
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssText = [...styleSheet.cssRules]
            .map((rule) => rule.cssText)
            .join("");
          const style = pip.document.createElement("style");
          style.textContent = cssText;
          pip.document.head.appendChild(style);
        } catch (e) {
          // External stylesheet - create link
          const link = pip.document.createElement("link");
          link.rel = "stylesheet";
          link.type = styleSheet.type;
          link.media = styleSheet.media;
          link.href = styleSheet.href;
          pip.document.head.appendChild(link);
        }
      });

      // Apply CSS variables from current theme
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      // Get actual computed color values with correct variable names
      const bgColor = styles.getPropertyValue("--color-background").trim();
      const textColor = styles.getPropertyValue("--color-foreground").trim();
      const cardBg = styles.getPropertyValue("--color-card").trim();
      const progressColor = styles.getPropertyValue("--color-progress").trim();

      // Copy all theme CSS variables to PiP window
      const themeVars = [
        "--color-background",
        "--color-foreground",
        "--color-primary",
        "--color-primary-text",
        "--color-secondary",
        "--color-secondary-text",
        "--color-border",
        "--color-card",
        "--color-progress",
        "--color-secondary-hover",
        "--color-secondary-hover-text",
      ];

      themeVars.forEach((varName) => {
        const value = styles.getPropertyValue(varName);
        if (value) {
          pip.document.documentElement.style.setProperty(varName, value);
        }
      });

      // Create PiP content
      pip.document.body.style.cssText = `
        margin: 0;
        background-color: ${bgColor};
        color: ${textColor};
        font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      `;

      const container = pip.document.createElement("div");
      container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        padding: 20px;
      `;

      const topRow = pip.document.createElement("div");
      topRow.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      `;

      const title = pip.document.createElement("div");
      title.id = "pip-title";
      title.style.cssText = `
        font-size: 0.875rem;
        opacity: 0.8;
        color: ${textColor};
      `;

      const sessionDots = pip.document.createElement("div");
      sessionDots.id = "pip-session-dots";
      sessionDots.style.cssText = `
        display: flex;
        gap: 6px;
      `;

      // Create dots for completed sessions and cache them
      const dots = [];
      for (let i = 0; i < settings.sessionsBeforeLongBreak; i++) {
        const dot = pip.document.createElement("div");
        dot.className = `pip-dot-${i}`;
        const isCompleted =
          i < completedSessions % settings.sessionsBeforeLongBreak;
        dot.style.cssText = `
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 2px solid ${
            isCompleted
              ? styles.getPropertyValue("--color-primary").trim()
              : styles.getPropertyValue("--color-border").trim()
          };
          background: ${
            isCompleted
              ? styles.getPropertyValue("--color-primary").trim()
              : "transparent"
          };
          transition: all 0.3s;
        `;
        sessionDots.appendChild(dot);
        dots.push(dot);
      }

      topRow.appendChild(title);
      topRow.appendChild(sessionDots);

      const timerDisplay = pip.document.createElement("div");
      timerDisplay.id = "pip-timer";
      timerDisplay.style.cssText = `
        font-size: 4rem;
        font-weight: 900;
        font-variant-numeric: tabular-nums;
        font-feature-settings: "tnum";
        line-height: 1;
        letter-spacing: -0.025em;
        color: ${textColor};
        font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      `;

      // Create timer spans and cache them
      const minutesSpan = pip.document.createElement("span");
      minutesSpan.style.display = "inline-block";
      
      const colonSpan = pip.document.createElement("span");
      colonSpan.style.cssText = `
        display: inline-block;
        position: relative;
        top: -0.07em;
        transition: opacity 100ms;
      `;
      colonSpan.textContent = ":";
      
      const secondsSpan = pip.document.createElement("span");
      secondsSpan.style.display = "inline-block";

      timerDisplay.appendChild(minutesSpan);
      timerDisplay.appendChild(colonSpan);
      timerDisplay.appendChild(secondsSpan);

      const progressBar = pip.document.createElement("div");
      progressBar.style.cssText = `
        width: 80%;
        height: 8px;
        background: ${cardBg};
        border-radius: 4px;
        margin-top: 16px;
        overflow: hidden;
      `;

      const progressFill = pip.document.createElement("div");
      progressFill.id = "pip-progress";
      progressFill.style.cssText = `
        height: 100%;
        background: ${progressColor};
        transform-origin: left;
        transition: transform 1s linear;
      `;

      const playPauseBtn = pip.document.createElement("button");
      playPauseBtn.id = "pip-play-pause";
      playPauseBtn.style.cssText = `
        margin-top: 16px;
        padding: 8px 20px;
        background: ${styles.getPropertyValue("--color-primary").trim()};
        color: ${styles.getPropertyValue("--color-primary-text").trim()};
        border: none;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
        font-family: 'Inter', sans-serif;
      `;
      playPauseBtn.textContent = isRunning ? "Pause" : "Start";
      playPauseBtn.addEventListener("click", () => {
        setIsRunning((prev) => !prev);
      });
      playPauseBtn.addEventListener("mouseenter", () => {
        playPauseBtn.style.opacity = "0.8";
      });
      playPauseBtn.addEventListener("mouseleave", () => {
        playPauseBtn.style.opacity = "1";
      });

      progressBar.appendChild(progressFill);
      container.appendChild(topRow);
      container.appendChild(timerDisplay);
      container.appendChild(progressBar);
      container.appendChild(playPauseBtn);
      pip.document.body.appendChild(container);

      // Cache all DOM element references
      elementsRef.current = {
        titleEl: title,
        timerEl: timerDisplay,
        minutesSpan,
        colonSpan,
        secondsSpan,
        progressEl: progressFill,
        playPauseBtn,
        dots,
      };

      pip.addEventListener("pagehide", () => {
        setPipWindow(null);
        elementsRef.current = null;
      });
    } catch (error) {
      console.error("Failed to open Picture-in-Picture:", error);
    }
  };

  return {
    togglePictureInPicture,
    isPipSupported,
  };
}
