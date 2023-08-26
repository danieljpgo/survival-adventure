import Phaser from "phaser";
// import { debug } from "~/lib/debug";

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
    const tileset = map.addTilesetImage("world", "tiles", 16, 16);
    if (!tileset) throw new Error("World tileset not found");

    const ground = map.createLayer("Ground", tileset);
    const walls = map.createLayer("Walls", tileset);
    if (!ground) throw new Error("Ground layer not found");
    if (!walls) throw new Error("Walls layer not found");

    walls.setCollisionByProperty({ collides: true });

    const initialPosition = { x: 100, y: 60 }; //TODO move this to a better place
    this.hero = this.physics.add.sprite(
      initialPosition.x,
      initialPosition.y,
      "hero",
      "walk-down-0.png"
    );
    if (!this.hero.body) throw new Error("Hero body not found");

    this.hero.body.setSize(
      this.hero.width,
      this.hero.height - this.hero.height / 2
    );
    this.physics.add.collider(this.hero, walls);
    this.cameras.main.startFollow(this.hero);

    //TODO improve animation creation
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

    // walls.renderDebug(debug.graphics(this), debug.styles);

    //TODO improve animation creation
    this.anims.create({
      key: "log-idle-down",
      frames: [{ key: "log", frame: "walk-down-0.png" }],
    });
    this.anims.create({
      key: "log-idle-up",
      frames: [{ key: "log", frame: "walk-up-0.png" }],
    });
    this.anims.create({
      key: "log-idle-left",
      frames: [{ key: "log", frame: "walk-left-0.png" }],
    });
    this.anims.create({
      key: "log-idle-right",
      frames: [{ key: "log", frame: "walk-right-0.png" }],
    });
    this.anims.create({
      key: "log-walk-down",
      frames: this.anims.generateFrameNames("log", {
        start: 0,
        end: 3,
        prefix: "walk-down-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 8,
    });
    this.anims.create({
      key: "log-walk-up",
      frames: this.anims.generateFrameNames("log", {
        start: 0,
        end: 3,
        prefix: "walk-up-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 8,
    });
    this.anims.create({
      key: "log-walk-left",
      frames: this.anims.generateFrameNames("log", {
        start: 0,
        end: 3,
        prefix: "walk-left-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 8,
    });
    this.anims.create({
      key: "log-walk-right",
      frames: this.anims.generateFrameNames("log", {
        start: 0,
        end: 3,
        prefix: "walk-right-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 8,
    });
    const log = this.physics.add.sprite(100, 100, "log", "walk-down-1.png");
    log.body.setSize(log.width - log.width / 2, log.height - log.height / 2);
    // log.anims.play("log-idle-left");
    // log.anims.play("log-idle-right");
    // log.anims.play("log-idle-up");
    // log.anims.play("log-idle-down");

    // log.anims.play("log-walk-down");
    // log.anims.play("log-walk-left");
    // log.anims.play("log-walk-right");
    // log.anims.play("log-walk-up");
  }

  update(totalTime: number, deltaTime: number) {
    if (!this.cursors || !this.hero) return;

    const speed = 100; //TODO move this to a better place
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
    const currentDirection =
      this.hero.anims.currentAnim?.key.split("-").at(-1) ?? "down";
    this.hero.anims.play(`hero-idle-${currentDirection}`, true);
    this.hero.setVelocity(0, 0);
  }
}
