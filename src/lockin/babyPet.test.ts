import assert from "node:assert/strict";
import { test } from "node:test";

import { BABY_PET_DOCUMENT, babyPetSrc, babyTaunt } from "./babyPet.ts";

const params = (index: number) => new URLSearchParams(babyPetSrc(index).split("?")[1]);

test("a spawn points at the overlay document and loops while the user is away", () => {
  assert.ok(babyPetSrc(0).startsWith(`${BABY_PET_DOCUMENT}?`));
  assert.equal(params(0).get("loop"), "1");
});

test("each baby gets its own splat and a faster clock than the one before", () => {
  assert.notEqual(params(1).get("seed"), params(0).get("seed"));
  assert.equal(params(0).get("speed"), "1.00");
  assert.ok(Number(params(3).get("speed")) > Number(params(0).get("speed")));
});

test("the overlay's own clamp is never asked for an out-of-range speed", () => {
  assert.ok(Number(params(3).get("speed")) <= 5);
});

test("the taunt names the distracting site, without the www", () => {
  assert.equal(babyTaunt("https://www.youtube.com/watch?v=1"), "youtube.com again?");
});

test("no url, or one that will not parse, still taunts", () => {
  assert.equal(babyTaunt(null), "back to work.");
  assert.equal(babyTaunt(undefined), "back to work.");
  assert.equal(babyTaunt("not a url"), "back to work.");
});
