import Phaser from "phaser";
import { Player } from "../entities";

export const GAME = {
  KEY: "game",
} as const;

export class Game extends Phaser.Scene {
  private player?: Player;
  constructor() {
    super(GAME.KEY);
  }

  create() {
    // this.player = this.add.sprite(100, 100, ASSETS.HERO.KEY);
    this.player = new Player(this, 100, 100);
  }

  update(time: number, delta: number): void {
    if (!this.player) throw new Error("Player not found");

    this.player.update();
  }
}
