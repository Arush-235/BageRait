import { useEffect, useState } from "react";
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";

import { MAX_BABIES, babyPetSrc, babyTaunt } from "./babyPet.ts";
import { lockIn, type Unlock } from "./lockIn.ts";

export const HOTKEY = "CmdOrCtrl+Shift+L";
// 5s on another app before the first baby, one more every 5s after that.
const DWELL_MS = 5000;
const ESCALATE_MS = 5000;

// There is one global hotkey and React StrictMode mounts this effect twice in
// development, so an unguarded pair of async register/unregister calls
// interleaves: the cleanup's unregister resolves before either register does,
// unregisters nothing, and leaves two live handlers on one shortcut. Every
// call goes through this queue instead, so they apply in the order they were
// made and the last one wins.
let hotkeyQueue: Promise<unknown> = Promise.resolve();
const queueHotkey = (work: () => Promise<unknown>): Promise<unknown> => {
  hotkeyQueue = hotkeyQueue.then(work, work);
  return hotkeyQueue;
};

// ⌘⇧L toggles lock-in. Returns the anchor app while locked in, the taunt for
// the current distraction, and the pet documents to render.
export function useLockInPets(): {
  anchor: string | null;
  taunt: string | null;
  pets: string[];
} {
  const [pets, setPets] = useState<string[]>([]);
  const [taunt, setTaunt] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<string | null>(null);

  useEffect(() => {
    let unlock: Unlock | null = null;
    let escalate: ReturnType<typeof setInterval> | null = null;
    const clear = () => {
      if (escalate) clearInterval(escalate);
      escalate = null;
      setPets([]);
      setTaunt(null);
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
        clear();
        if (t.state === "focused") return;
        // Distracted: one baby now, another every ESCALATE_MS up to the cap.
        setTaunt(babyTaunt(t.url));
        let spawned = 0;
        const spawn = () => {
          spawned += 1;
          setPets((current) => [...current, babyPetSrc(current.length)]);
          if (spawned >= MAX_BABIES && escalate) {
            clearInterval(escalate);
            escalate = null;
          }
        };
        spawn();
        escalate = setInterval(spawn, ESCALATE_MS);
      });
    };
    void queueHotkey(() =>
      register(HOTKEY, (e) => {
        if (e.state === "Pressed") void toggle().catch(console.error);
      }).catch(console.error),
    );
    return () => {
      void queueHotkey(() => unregister(HOTKEY).catch(console.error));
      void unlock?.();
      clear();
    };
  }, []);

  return { anchor, taunt, pets };
}
