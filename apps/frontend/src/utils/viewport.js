function getCSSValue(value) {
  const el = document.createElement('div');
  el.style.height = value;
  document.body.appendChild(el);
  const px = el.offsetHeight;
  document.body.removeChild(el);
  return px;
}

export function updateViewportVars() {
  const lvh = getCSSValue('100lvh');
  const dvh = getCSSValue('100dvh');
  const filler = lvh - dvh; // address bar height

  document.documentElement.style.setProperty(
    '--addressbar-fill',
    filler + 'px'
  );

  // define default bar heights if missing
  if (
    !getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')
  ) {
    document.documentElement.style.setProperty('--topbar-h', '0px');
  }
  if (
    !getComputedStyle(document.documentElement).getPropertyValue('--mainnav-h')
  ) {
    document.documentElement.style.setProperty('--mainnav-h', '56px');
  }
}

export function handleKeyboard() {
  const vv = window.visualViewport;
  if (!vv) return;

  const open = window.innerHeight - vv.height > 150;
  document.documentElement.classList.toggle('keyboard-open', open);
}
