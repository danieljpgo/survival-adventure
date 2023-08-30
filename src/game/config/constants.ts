export type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];

export type KeyboardInput =
  (typeof KEYBOARD_INPUT)[keyof typeof KEYBOARD_INPUT];

export const DIRECTION = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
} as const;

export const HUD = {
  HERO_HEALTH_CHANGED: "hero-health-changed",
};

export const KEYBOARD_INPUT = {
  W: "w",
  A: "a",
  S: "s",
  D: "d",
  J: "j",
  K: "k",
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  SPACE: "space",
  SHIFT: "shift",
} as const;
