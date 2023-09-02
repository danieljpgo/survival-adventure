import { Score } from "../ui";

export const HUD = {
  KEY: "hud",
} as const;

export class Hud extends Phaser.Scene {
  private score?: Score;

  constructor() {
    super(HUD.KEY);
  }
  create() {
    this.score = new Score(this, 20, 20, 0);
  }
}
