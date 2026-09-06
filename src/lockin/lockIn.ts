import { emit, listen } from "@tauri-apps/api/event";

// JS half of lock-in mode. Rust captures the frontmost app as the anchor on
// `lockin:start`, announces it as `locked`, then streams a transition on every change.
export type Transition = {
  state: "locked" | "focused" | "distracted";
  app: string;
  url?: string | null;
};

export type Unlock = () => Promise<void>;

export async function lockIn(
  options: { dwellMs: number },
  onChange: (transition: Transition) => void,
): Promise<Unlock> {
  const unlisten = await listen<Transition>("lockin", (event) => onChange(event.payload));
  await emit("lockin:start", options);
  return async () => {
    unlisten();
    await emit("lockin:stop");
  };
}
