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
    // walls.renderDebug(this.add.graphics().setAlpha(0.5), {
    //   tileColor: null,
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    // });

    const hero = this.add.sprite(100, 60, "hero", "walk-down-0.png");

    this.anims.create({
      key: "hero-idle-down",
      frames: [{ key: "hero", frame: "walk-down-0.png" }],
    });
    this.anims.create({
      key: "hero-walk-down",
      frames: this.anims.generateFrameNames("hero", {
        start: 0,
        end: 3,
        prefix: "walk-down-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 8,
    });
    this.anims.create({
      key: "hero-walk-up",
      frames: this.anims.generateFrameNames("hero", {
        start: 0,
        end: 3,
        prefix: "walk-up-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 8,
    });
    this.anims.create({
      key: "hero-walk-left",
      frames: this.anims.generateFrameNames("hero", {
        start: 0,
        end: 3,
        prefix: "walk-left-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 8,
    });
    this.anims.create({
      key: "hero-walk-right",
      frames: this.anims.generateFrameNames("hero", {
        start: 0,
        end: 3,
        prefix: "walk-right-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 8,
    });

    hero.anims.play("hero-walk-idle");
    // hero.anims.play("hero-walk-down");
    // hero.anims.play("hero-walk-up");
    // hero.anims.play("hero-walk-left");
    // hero.anims.play("hero-walk-right");
  }

  update() {}
}
