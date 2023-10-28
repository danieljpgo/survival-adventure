import { EVENTS } from "~/game/config/constants";
import { SCORE, Score } from "../ui";
import { ASSETS } from ".";
import { PLAYER } from "../entities";

export const HUD = {
  KEY: "hud",
} as const;

export class Hud extends Phaser.Scene {
  private score?: Score;
  private hearts?: Phaser.GameObjects.Group;

  constructor() {
    super(HUD.KEY);
  }

  create() {
    this.score = new Score(this, 20, 20, 0);
    this.hearts = this.add.group({ classType: Phaser.GameObjects.Image });
    this.hearts.createMultiple({
      key: ASSETS.HEARTS.KEY,
      frame: "heart-4:4.png",
      quantity: PLAYER.HEARTS,
      setXY: {
        x: 16,
        y: 16,
        stepX: 16,
      },
    });
    this.initListeners();
  }

  private initListeners() {
    this.game.events.on(EVENTS.CHEST_LOOT, this.handleChestLoot, this);
    this.game.events.on(
      EVENTS.PLAYER_HEALTH_CHANGED,
      this.handlePlayerHealthChanged,
      this
    );
  }

  private handleChestLoot() {
    if (!this.score) throw new Error("Score not found");

    this.score.changeValue(SCORE.ACTIONS.INCREASE, 10);
  }

  private handlePlayerHealthChanged(health: number) {
    if (!this.hearts) throw new Error("Hearts has no children");
    this.hearts.children?.each((go, index) => {
      const heart = go as Phaser.GameObjects.Sprite;
      const position = index + 1;
      const hearts = health / 4;
      const partialHeart = hearts % 1;

      if (position - 1 > hearts) {
        heart.setTexture(ASSETS.HEARTS.KEY, "heart-0:4.png");
        return null;
      }
      if (position > hearts && partialHeart === 0) {
        heart.setTexture(ASSETS.HEARTS.KEY, "heart-0:4.png");
        return null;
      }
      if (position > hearts && partialHeart === 0.25) {
        heart.setTexture(ASSETS.HEARTS.KEY, "heart-1:4.png");
        return null;
      }
      if (position > hearts && partialHeart === 0.5) {
        heart.setTexture(ASSETS.HEARTS.KEY, "heart-2:4.png");
        return null;
      }
      if (position > hearts && partialHeart === 0.75) {
        heart.setTexture(ASSETS.HEARTS.KEY, "heart-3:4.png");
        return null;
      }

      return null;
    });
  }
}
