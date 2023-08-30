import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("tiles", "assets/tiles/overworld.png");
    this.load.image("weapons-knife", "assets/weapons/knife.png");
    this.load.tilemapTiledJSON("world", "assets/tiles/world-01.json");
    this.load.atlas(
      "hero",
      "assets/character/texture.png",
      "assets/character/texture.json"
    );
    this.load.atlas(
      "log",
      "assets/enemies/log/texture.png",
      "assets/enemies/log/texture.json"
    );
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
