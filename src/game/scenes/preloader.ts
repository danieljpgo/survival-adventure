import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("tiles", "assets/tiles/overworld.png");
    this.load.tilemapTiledJSON("world", "assets/tiles/world-01.json");
  }
  create() {
    this.scene.start("game");
  }
}
