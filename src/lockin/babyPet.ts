// The ragebait pet: `public/pets/baby-overlay.html`, a self-contained
// HTML/SVG/JS document that crawls a baby up to the screen, sneezes on it,
// licks it, and smears the mess around. It reads its own configuration from
// the query string, so a spawn is a URL -- nothing here builds markup.
export const BABY_PET_DOCUMENT = "/pets/baby-overlay.html";

// Splat layout is seeded, so a given index always smears the same way.
const SEED_BASE = 20260906;
const SEED_STEP = 7919;

// The document for the `index`-th distraction of a session: the same sequence
// with a different splat each time. It plays through once; its outro is the
// cue that walks the user back to the anchor.
export function babyPetSrc(index = 0): string {
  const params = new URLSearchParams({ seed: String(SEED_BASE + index * SEED_STEP) });
  return `${BABY_PET_DOCUMENT}?${params.toString()}`;
}

// Host-drawn caption naming the distraction, since the overlay document
// carries no text of its own.
export function babyTaunt(url?: string | null): string {
  const host = hostname(url);
  return host ? `${host} again?` : "back to work.";
}

// Rust reads this off the frontmost Chrome tab, so it is whatever that tab
// happens to hold -- an unparseable one just leaves the taunt generic.
function hostname(url?: string | null): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
