import { useEffect, useState } from "react";

import { useLockInPets } from "../lockin/useLockInPets.ts";
import { watchClickable } from "./clickable.ts";
import { loadPetManifest, type PetPlacement } from "./petManifest.ts";

// Every pet is its own document in a sandboxed frame: a pet's CSS and JS
// cannot reach the host page or another pet. The overlay window ignores
// cursor events except over elements a pet marks `.clickable`.
export function PetsOverlay() {
  const [pets, setPets] = useState<PetPlacement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const lockIn = useLockInPets();

  useEffect(watchClickable, []);
  useEffect(() => {
    loadPetManifest().then(setPets, (reason: unknown) => setError(String(reason)));
  }, []);

  if (error) return <p className="error">{error}</p>;
  return (
    <>
      {pets.map((pet, index) => (
        <iframe
          key={index}
          className="pet"
          sandbox="allow-scripts allow-same-origin"
          src={`/pets/${pet.file}`}
          title={pet.file}
          style={{
            left: pet.x ?? 0,
            top: pet.y ?? 0,
            width: pet.width ?? "100%",
            height: pet.height ?? "100%",
          }}
        />
      ))}
      {lockIn.anchor && <div className="lockin-badge">🔒 Locked in: {lockIn.anchor}</div>}
      {lockIn.pets.map((html, index) => (
        <iframe
          key={`lockin-${index}`}
          className="pet"
          sandbox="allow-scripts allow-same-origin"
          srcDoc={html}
          title="lock-in pet"
          style={{ inset: 0, width: "100%", height: "100%" }}
        />
      ))}
    </>
  );
}
