import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("tiles", "assets/tiles/overworld.png");
    this.load.image("weapons-knife", "assets/weapons/knife.png");
    this.load.tilemapTiledJSON("world", "assets/tiles/overworld.json");
    this.load.atlas(
      "hero",
      "assets/character/hero.png",
      "assets/character/hero.json"
    );
    this.load.atlas("log", "assets/enemies/log.png", "assets/enemies/log.json");
    this.load.atlas(
      "hud-hearts",
      "assets/hud/hearts.png",
      "assets/hud/hearts.json"
    );
  }
  create() {
    this.scene.start("game");
  }
}
