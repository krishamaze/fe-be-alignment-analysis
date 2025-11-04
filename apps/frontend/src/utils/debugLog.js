// src/utils/debugLog.js

export function generateDebugLog() {
  // Viewport / window measurements
  const vh = window.innerHeight;
  const svh = window.visualViewport ? window.visualViewport.height : vh;
  const dvh = window.visualViewport ? window.visualViewport.height : vh;
  const inner = window.innerHeight;
  const visual = window.visualViewport?.height ?? inner;
  const screenH = window.screen.height;

  // CSS variables we care about
  const styles = getComputedStyle(document.documentElement);
  const cssVars = {
    '--addressbar-fill':
      styles.getPropertyValue('--addressbar-fill')?.trim() || '0px',
    '--topbar-h': styles.getPropertyValue('--topbar-h')?.trim() || '0px',
    '--mainnav-h': styles.getPropertyValue('--mainnav-h')?.trim() || '0px',
  };

  // Safe-area insets (iOS notch / home indicator)
  const safeArea = {
    top: styles.getPropertyValue('env(safe-area-inset-top)') || '0px',
    bottom: styles.getPropertyValue('env(safe-area-inset-bottom)') || '0px',
  };

  // Check if keyboard is open (simple heuristic)
  const keyboard = document.documentElement.classList.contains('keyboard-open')
    ? 'open'
    : 'closed';

  // Applied paddings on <main>
  const mainEl = document.querySelector('main');
  const mainStyles = mainEl ? getComputedStyle(mainEl) : {};
  const mainOffsets = {
    paddingTop: mainStyles.paddingTop || 'n/a',
    paddingBottom: mainStyles.paddingBottom || 'n/a',
  };

  // Build a single log string
  const log = [
    `[${new Date().toLocaleTimeString()}]`,
    `vh=${vh} svh=${svh} dvh=${dvh.toFixed ? dvh.toFixed(2) : dvh}`,
    `| inner=${inner} visual=${visual} screen=${screenH}`,
    `| ${Object.entries(cssVars)
      .map(([k, v]) => `${k}=${v}`)
      .join(' ')}`,
    `| safe-area-top=${safeArea.top} safe-area-bottom=${safeArea.bottom}`,
    `| main-padding-top=${mainOffsets.paddingTop} main-padding-bottom=${mainOffsets.paddingBottom}`,
    `| keyboard=${keyboard}`,
  ].join(' ');

  // Copy to clipboard
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(log).catch((err) => {
      console.error('Failed to copy debug log:', err);
    });
  }

  return log;
}
