import { EVENTS } from "~/game/config/constants";
import { SCORE, Score } from "../ui";

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
    this.initListeners();
  }

  private initListeners() {
    this.game.events.on(EVENTS.CHEST_LOOT, this.handleChestLoot, this);
  }

  private handleChestLoot() {
    if (!this.score) throw new Error("Score not found");

    this.score.changeValue(SCORE.ACTIONS.INCREASE, 10);
  }
}
