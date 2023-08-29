import Phaser from "phaser";
import { HUD } from "../config/constants";
import { HERO } from "../character/hero";
import { events } from "../config/events";

export class Hud extends Phaser.Scene {
  private hearts?: Phaser.GameObjects.Group;

  constructor() {
    super("hud");
  }

  create() {
    this.hearts = this.add.group({ classType: Phaser.GameObjects.Image });
    this.hearts.createMultiple({
      key: "hud-hearts",
      frame: "heart-4:4.png",
      quantity: HERO.HEARTS,
      setXY: {
        x: 16,
        y: 16,
        stepX: 16,
      },
    });

    events.scene.on(
      HUD.HERO_HEALTH_CHANGED,
      this.handlePlayerHealthChanged,
      this
    );

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      events.scene.off(
        HUD.HERO_HEALTH_CHANGED,
        this.handlePlayerHealthChanged,
        this
      );
    });
  }

  private handlePlayerHealthChanged(health: number) {
    if (!this.hearts) throw new Error("Hearts has no children");

    this.hearts.children?.each((go, index) => {
      // TODO Improve here
      const heart = go as Phaser.GameObjects.Sprite;
      const position = index + 1;
      const hearts = health / 4;
      const partialHeart = hearts % 1;

      if (position - 1 > hearts) {
        heart.setTexture("hud-hearts", "heart-0:4.png");
        return null;
      }
      if (position > hearts && partialHeart === 0) {
        heart.setTexture("hud-hearts", "heart-0:4.png");
        return null;
      }
      if (position > hearts && partialHeart === 0.25) {
        heart.setTexture("hud-hearts", "heart-1:4.png");
        return null;
      }
      if (position > hearts && partialHeart === 0.5) {
        heart.setTexture("hud-hearts", "heart-2:4.png");
        return null;
      }
      if (position > hearts && partialHeart === 0.75) {
        heart.setTexture("hud-hearts", "heart-3:4.png");
        return null;
      }

      return null;
    });
  }
}
