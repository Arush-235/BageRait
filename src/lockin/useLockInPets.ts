import { useEffect, useState } from "react";
import { emit } from "@tauri-apps/api/event";
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";

import { babyPetSrc, babyTaunt } from "./babyPet.ts";
import { devLog, devLogError } from "./devLog.ts";
import { lockIn, type Unlock } from "./lockIn.ts";

export const HOTKEY = "CmdOrCtrl+Shift+L";
// 5s on another app before the baby arrives.
const DWELL_MS = 5000;

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
    let anchorApp: string | null = null;
    let distractions = 0;
    const clear = () => {
      setPets([]);
      setTaunt(null);
    };
    // The pet announces its outro to the parent frame. That is the cue to walk
    // the user back: Rust brings the anchor forward, the poll sees it in front,
    // and the distraction ends the ordinary way.
    const onMessage = (event: MessageEvent) => {
      const message = event.data as { source?: string; event?: string } | null;
      if (message?.source !== "babyOverlay" || message.event !== "finish" || !anchorApp) return;
      devLog(`pet finished, refocusing ${anchorApp}`);
      void emit("lockin:refocus", { app: anchorApp }).catch(devLogError("refocus failed"));
    };
    window.addEventListener("message", onMessage);
    const toggle = async () => {
      if (unlock) {
        await unlock();
        unlock = null;
        anchorApp = null;
        setAnchor(null);
        clear();
        return;
      }
      unlock = await lockIn({ dwellMs: DWELL_MS }, (t) => {
        devLog(`${t.state}: ${t.app}${t.url ? ` (${t.url})` : ""}`);
        if (t.state === "locked") {
          anchorApp = t.app;
          return setAnchor(t.app);
        }
        clear();
        if (t.state === "focused") return;
        distractions += 1;
        setTaunt(babyTaunt(t.url));
        setPets([babyPetSrc(distractions - 1)]);
      });
    };
    void queueHotkey(() =>
      register(HOTKEY, (e) => {
        if (e.state !== "Pressed") return;
        devLog(`${HOTKEY} pressed`);
        void toggle().catch(devLogError("lock-in toggle failed"));
      }).then(
        () => devLog(`${HOTKEY} registered`),
        devLogError(`${HOTKEY} could not be registered`),
      ),
    );
    return () => {
      window.removeEventListener("message", onMessage);
      void queueHotkey(() =>
        unregister(HOTKEY).catch(devLogError(`${HOTKEY} could not be unregistered`)),
      );
      void unlock?.();
      clear();
    };
  }, []);

  return { anchor, taunt, pets };
}
