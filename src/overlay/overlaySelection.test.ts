import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { TARGETS } from "../graphql/transport/targetSelection.ts";
import { overlayModuleForTarget } from "./overlaySelection.ts";

const repositoryRoot = new URL("../../", import.meta.url);
const sourceOf = (module: string) =>
  readFileSync(fileURLToPath(new URL(module, repositoryRoot)), "utf8");

test("every Target maps to an overlay module that exists", () => {
  const modules = TARGETS.map((target) => overlayModuleForTarget(target));

  for (const module of modules) {
    assert.ok(
      existsSync(fileURLToPath(new URL(module, repositoryRoot))),
      `${module} is missing`,
    );
  }

  assert.equal(new Set(modules).size, TARGETS.length, "two Targets share an overlay");
});

// check-target-bundles.sh proves this on the built artifact. This says the same
// thing about the source, so the reason the Web Target's overlay must stay
// Tauri-free is written down next to the module that has to stay that way.
test("the Web Target's overlay reaches for no Tauri API", () => {
  assert.doesNotMatch(sourceOf(overlayModuleForTarget("web")), /@tauri-apps/);
});

test("the Desktop Target's overlay is the one that does", () => {
  assert.match(sourceOf(overlayModuleForTarget("desktop")), /PetsOverlay/);
});
