import Phaser from "phaser";
import { ASSETS } from ".";

export const GAME = {
  KEY: "game",
};

export class Game extends Phaser.Scene {
  private hero: any;
  constructor() {
    super(GAME.KEY);
  }

  create() {
    this.hero = this.add.sprite(100, 100, ASSETS.HERO.KEY);
  }
}
