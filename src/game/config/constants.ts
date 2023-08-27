export type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];

export const DIRECTION = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
} as const;
