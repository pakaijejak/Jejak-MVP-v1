export function apakahModeStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}
