import Phaser from "phaser";

export class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {}

  create() {
    const map = this.make.tilemap({ key: "world" });
    const tileset = map.addTilesetImage("world", "tiles");
    if (!tileset) throw new Error("World tileset not found");

    const ground = map.createLayer("Ground", tileset);
    const walls = map.createLayer("Walls", tileset);
    if (!walls) throw new Error("Walls layer not found");

    walls.setCollisionByProperty({ collides: true });

    walls.renderDebug(this.add.graphics().setAlpha(0.5), {
      tileColor: null,
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    });
  }

  update() {}
}

// map.createStaticLayer => map.createLayer
