//! Which overlay module a bundle is built from.
//!
//! The overlay is the Desktop Target's whole reason for a window: it reaches
//! for Tauri's cursor, event, and global-shortcut APIs. A browser has no
//! overlay window and no IPC to reach, so building it into the Web Target
//! would ship desktop IPC to a browser — exactly what
//! `check-target-bundles.sh` forbids.
//!
//! The choice is made the same way the Transport's is: once, by the bundler,
//! from the same build-time flag. The other Target's overlay is not in the
//! module graph at all.
//!
//! This module is imported by `vite.config.ts`; it must stay free of any
//! browser or Node-only API.

import type { Target } from "../graphql/transport/targetSelection.ts";

/** The module identifier the application imports its overlay from. */
export const SELECTED_OVERLAY_MODULE_ID = "virtual:target-overlay";

const OVERLAY_MODULE_BY_TARGET: Record<Target, string> = {
  desktop: "./src/overlay/PetsOverlay.tsx",
  web: "./src/overlay/noOverlay.tsx",
};

/** The repository-relative overlay module the given Target is built from. */
export const overlayModuleForTarget = (target: Target): string =>
  OVERLAY_MODULE_BY_TARGET[target];
