// src/utils/debugLog.js
export function generateDebugLog() {
  const now = new Date().toLocaleTimeString();

  const lvh = window.screen.height;
  const svh = window.innerHeight;
  const dvh = window.visualViewport?.height || 0;

  const inner = window.innerHeight;
  const visual = window.visualViewport?.height || 0;
  const screenH = window.screen.height;

  const cssVars = [
    "--addressbar-fill",
    "--topbar-h",
    "--mainnav-h",
    "--bottombar-h",
  ].map(
    name =>
      `${name}=${getComputedStyle(document.documentElement).getPropertyValue(
        name
      ).trim()}`
  );

  const keyboard = document.documentElement.classList.contains("keyboard-open")
    ? "open"
    : "closed";

  const log = `[${now}] vh=${lvh} svh=${svh} dvh=${dvh} | inner=${inner} visual=${visual} screen=${screenH} | ${cssVars.join(
    " "
  )} | keyboard=${keyboard}`;

  navigator.clipboard
    .writeText(log)
    .then(() => console.log("Debug log copied:", log))
    .catch(err => console.error("Failed to copy debug log:", err));

  return log;
}
