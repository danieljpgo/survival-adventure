export type KeyboardInput =
  (typeof KEYBOARD_INPUT)[keyof typeof KEYBOARD_INPUT];

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

export const EVENTS = {
  CHEST_LOOT: "chest-loot",
  PLAYER_HEALTH_CHANGED: "player-health-changed",
} as const;
