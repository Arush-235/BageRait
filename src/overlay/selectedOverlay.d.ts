// The module the bundler resolves to one Target's overlay at build time.
// Type checking sees the contract rather than either Target's implementation,
// so nothing downstream can come to depend on the Desktop Target's overlay;
// each implementation is checked against the same contract in its own module.

declare module "virtual:target-overlay" {
  export const PetsOverlay: import("./overlayContract.ts").PetsOverlayComponent;
}
