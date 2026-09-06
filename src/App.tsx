import { PetsOverlay } from "virtual:target-overlay";

import { APP_TITLE } from "./app-config.ts";
import { modules } from "./generated/modules.ts";
import { currentView } from "./view.ts";

// The app shell. The overlay window draws the pets and nothing else; any
// other window shows the Module panels. The overlay comes from the module the
// bundler selected for this Target, so the Web Target carries no desktop IPC.
export function App() {
  if (currentView() === "overlay") {
    return (
      <div className="overlay">
        <PetsOverlay />
      </div>
    );
  }
  return (
    <main>
      <header>
        <p className="eyebrow">Desktop pets</p>
        <h1>{APP_TITLE}</h1>
      </header>

      {modules.map((module) => (
        <module.Component key={module.name} />
      ))}
    </main>
  );
}
