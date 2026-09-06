// The ragebait pet: `public/pets/baby-overlay.html`, a self-contained
// HTML/SVG/JS document that crawls a baby up to the screen, sneezes on it,
// licks it, and smears the mess around. It reads its own configuration from
// the query string, so a spawn is a URL — nothing here builds markup.
export const BABY_PET_DOCUMENT = "/pets/baby-overlay.html";

// Each baby is a full-screen document animating on its own clock, so the
// escalation is capped rather than unbounded.
export const MAX_BABIES = 4;

// The overlay clamps `speed` to 0.2-5; escalation stays well inside that.
const SPEED_STEP = 0.35;
// Splat layout is seeded, so a given index always smears the same way.
const SEED_BASE = 20260906;
const SEED_STEP = 7919;

// The document for the `index`-th baby of one distraction: same animation,
// its own splat, and more frantic than the baby before it. `loop` keeps it
// going for as long as the user stays away.
export function babyPetSrc(index = 0): string {
  const params = new URLSearchParams({
    loop: "1",
    seed: String(SEED_BASE + index * SEED_STEP),
    speed: (1 + index * SPEED_STEP).toFixed(2),
  });
  return `${BABY_PET_DOCUMENT}?${params.toString()}`;
}

// Host-drawn caption naming the distraction, since the overlay document
// carries no text of its own.
export function babyTaunt(url?: string | null): string {
  const host = hostname(url);
  return host ? `${host} again?` : "back to work.";
}

// Rust reads this off the frontmost Chrome tab, so it is whatever that tab
// happens to hold — an unparseable one just leaves the taunt generic.
function hostname(url?: string | null): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
