import Phaser from "phaser";

export class Game extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private hero?: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("game");
  }

  preload() {
    if (!this.input.keyboard) throw new Error("Keyboard Input not found");

    this.cursors = this.input.keyboard.createCursorKeys();
  }

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

    this.hero = this.physics.add.sprite(100, 60, "hero", "walk-down-0.png");

    this.anims.create({
      key: "hero-idle-down",
      frames: [{ key: "hero", frame: "walk-down-0.png" }],
    });
    this.anims.create({
      key: "hero-idle-up",
      frames: [{ key: "hero", frame: "walk-up-0.png" }],
    });
    this.anims.create({
      key: "hero-idle-left",
      frames: [{ key: "hero", frame: "walk-left-0.png" }],
    });
    this.anims.create({
      key: "hero-idle-right",
      frames: [{ key: "hero", frame: "walk-right-0.png" }],
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
  }

  update(totalTime: number, deltaTime: number) {
    if (!this.cursors || !this.hero) return;

    const speed = 100;
    if (this.cursors.left.isDown) {
      this.hero.anims.play("hero-walk-left", true);
      this.hero.setVelocity(-speed, 0);
      return;
    }
    if (this.cursors.right.isDown) {
      this.hero.anims.play("hero-walk-right", true);
      this.hero.setVelocity(speed, 0);
      return;
    }
    if (this.cursors.up.isDown) {
      this.hero.anims.play("hero-walk-up", true);
      this.hero.setVelocity(0, -speed);
      return;
    }
    if (this.cursors.down.isDown) {
      this.hero.anims.play("hero-walk-down", true);
      this.hero.setVelocity(0, speed);
      return;
    }

    this.hero.anims.play("hero-idle-down", true);
    this.hero.setVelocity(0, 0);

    // this.hero.anims.play("hero-walk-down");
    // this.hero.anims.play("hero-walk-up");
    // this.hero.anims.play("hero-walk-right");

    // hero.anims.play("hero-idle-left");
    // hero.anims.play("hero-idle-right");
    // hero.anims.play("hero-idle-up");
    // this.hero.anims.play("hero-idle-down");
  }
}
