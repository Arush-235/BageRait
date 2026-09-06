// The Web Target's overlay: there is no overlay window in a browser, so there
// is nothing to draw. It exists so the bundler has a module to resolve
// `virtual:target-overlay` to without pulling the Desktop Target's Tauri
// imports — its cursor pass-through and global hotkey — into a browser bundle.
export function PetsOverlay(): null {
  return null;
}
