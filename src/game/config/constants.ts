export type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];

export const DIRECTION = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
} as const;

export const HUD = {
  HERO_HEALTH_CHANGED: "hero-health-changed",
};
