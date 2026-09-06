import { emit } from "@tauri-apps/api/event";

// The overlay window is transparent, undecorated and non-focusable, so it has
// nowhere to show a console: `console.error` in it goes nowhere a person will
// ever look. That is how a failing global-hotkey registration stayed invisible
// through several sessions of "the shortcut does nothing". Send anything worth
// seeing to Rust, which prints it on the dev server's stderr.
//
// Debug builds only: this is a development aid, not a logging facility.
export const LOCKIN_LOG_EVENT = "lockin:log";

export function devLog(message: string): void {
  if (!import.meta.env.DEV) return;
  void emit(LOCKIN_LOG_EVENT, message).catch(() => {});
}

/** Reports a rejected promise instead of swallowing it. */
export function devLogError(context: string): (reason: unknown) => void {
  return (reason: unknown) => devLog(`${context}: ${String(reason)}`);
}
