import Phaser from "phaser";
import { Log, createLogAnims } from "../enemies/log";
import { HERO, createHeroAnims } from "../character/hero";
import { debug } from "~/lib/debug";

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
    //TODO improve here
    createHeroAnims(this.anims);
    createLogAnims(this.anims);

    const map = this.make.tilemap({ key: "world" });
    const tileset = map.addTilesetImage("world", "tiles", 16, 16);
    if (!tileset) throw new Error("World tileset not found");

    const ground = map.createLayer("Ground", tileset);
    const walls = map.createLayer("Walls", tileset);
    if (!ground) throw new Error("Ground layer not found");
    if (!walls) throw new Error("Walls layer not found");

    this.hero = this.physics.add.sprite(
      HERO.SPAWN.X,
      HERO.SPAWN.Y,
      "hero",
      "walk-down-0.png"
    );
    if (!this.hero.body) throw new Error("Hero body not found");

    this.hero.body.setSize(
      this.hero.width,
      this.hero.height - this.hero.height / 2
    );

    const enemies = this.physics.add.group({
      classType: Log,
      createCallback: (go) => {
        if (!go.body || !("setSize" in go.body)) return;

        go.body.onCollide = true;
        go.body.setSize(
          go.body.width - go.body.width / 2,
          go.body.height - go.body.height / 2
        );
      },
    });

    enemies.get(50, 100, "log");
    // enemies.get(100, 100, "log");
    // enemies.get(150, 100, "log");
    // enemies.get(200, 100, "log");

    this.cameras.main.startFollow(this.hero);
    this.physics.add.collider(this.hero, walls);
    this.physics.add.collider(enemies, walls);
    walls.setCollisionByProperty({ collides: true });
    walls.renderDebug(debug.graphics(this), debug.styles);
  }

  update(total: number, delta: number) {
    if (!this.cursors || !this.hero) return;

    if (this.cursors.left.isDown) {
      this.hero.anims.play("hero-walk-left", true);
      this.hero.setVelocity(-HERO.SPEED, 0);
      return;
    }
    if (this.cursors.right.isDown) {
      this.hero.anims.play("hero-walk-right", true);
      this.hero.setVelocity(HERO.SPEED, 0);
      return;
    }
    if (this.cursors.up.isDown) {
      this.hero.anims.play("hero-walk-up", true);
      this.hero.setVelocity(0, -HERO.SPEED);
      return;
    }
    if (this.cursors.down.isDown) {
      this.hero.anims.play("hero-walk-down", true);
      this.hero.setVelocity(0, HERO.SPEED);
      return;
    }

    const currentDirection =
      this.hero.anims.currentAnim?.key.split("-").at(-1) ?? "down";
    this.hero.anims.play(`hero-idle-${currentDirection}`, true);
    this.hero.setVelocity(0, 0);
  }
}

// log.anims.play("log-idle-left");
// log.anims.play("log-idle-right");
// log.anims.play("log-idle-up");
// log.anims.play("log-idle-down");
// log.anims.play("log-walk-down");
// log.anims.play("log-walk-left");
// log.anims.play("log-walk-right");
// log.anims.play("log-walk-up");
