export function devLog(...args) {
  if (import.meta.env?.DEV) {
    console.debug(...args);
  }
}
