import { useEffect, useState } from "react";
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";

import { babyHtml } from "./babyPet.ts";
import { lockIn, type Unlock } from "./lockIn.ts";

export const HOTKEY = "CmdOrCtrl+Shift+L";
// Demo timing: 5s before the first baby, one more every 5s until the user returns.
const DWELL_MS = 5000;
const ESCALATE_MS = 5000;

// ⌘⇧L toggles lock-in. Returns the anchor app while locked in, and the HTML
// documents to render as pets.
export function useLockInPets(): { anchor: string | null; pets: string[] } {
  const [pets, setPets] = useState<string[]>([]);
  const [anchor, setAnchor] = useState<string | null>(null);

  useEffect(() => {
    let unlock: Unlock | null = null;
    let escalate: ReturnType<typeof setInterval> | null = null;
    const clear = () => {
      if (escalate) clearInterval(escalate);
      escalate = null;
      setPets([]);
    };
    const toggle = async () => {
      if (unlock) {
        await unlock();
        unlock = null;
        setAnchor(null);
        clear();
        return;
      }
      unlock = await lockIn({ dwellMs: DWELL_MS }, (t) => {
        if (t.state === "locked") return setAnchor(t.app);
        if (t.state === "focused") return clear();
        setPets([babyHtml(t.url, 0)]);
        escalate = setInterval(
          () => setPets((current) => [...current, babyHtml(t.url, current.length)]),
          ESCALATE_MS,
        );
      });
    };
    register(HOTKEY, (e) => {
      if (e.state === "Pressed") void toggle().catch(console.error);
    }).catch(console.error);
    return () => {
      void unregister(HOTKEY).catch(console.error);
      void unlock?.();
      clear();
    };
  }, []);

  return { anchor, pets };
}
