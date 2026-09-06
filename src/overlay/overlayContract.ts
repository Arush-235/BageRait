//! What every Target's overlay module must supply, and nothing more.
//!
//! `App.tsx` renders the overlay for the overlay view without knowing which
//! Target it was built for, so both modules are checked against this one type.

import type { ReactElement } from "react";

/** Draws the pets for a Target that has an overlay window, or nothing. */
export type PetsOverlayComponent = () => ReactElement | null;
