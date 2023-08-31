import { KeyboardInput } from "~/game/config/constants";
import { Actor } from ".";
import { ASSETS } from "../scenes";

export const PLAYER = {
  SPEED: 100,
};

export class Player extends Actor {
  private cursors?: Record<KeyboardInput, Phaser.Input.Keyboard.Key>;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.HERO.KEY);

    if (!this.body) throw new Error("Body not found");
    if (!this.scene.input.keyboard) throw new Error("Body not found");

    this.cursors = {
      ...this.scene.input.keyboard.createCursorKeys(),
      w: this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      j: this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.J),
      k: this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.K),
    };
    this.body.setSize(this.width, this.height - this.height / 2);
    this.initAnimations();
  }

  update() {
    if (!this.cursors) throw new Error("Cursors not found");

    this.setVelocity(0);
    if (
      (this.cursors.up.isDown || this.cursors.w.isDown) &&
      (this.cursors.left.isDown || this.cursors.a.isDown)
    ) {
      this.setVelocity(-PLAYER.SPEED, -PLAYER.SPEED);
      this.anims.play("hero-walk-left", true);
      return;
    }
    if (
      (this.cursors.up.isDown || this.cursors.w.isDown) &&
      (this.cursors.right.isDown || this.cursors.d.isDown)
    ) {
      this.setVelocity(PLAYER.SPEED, -PLAYER.SPEED);
      this.anims.play("hero-walk-right", true);
      return;
    }
    if (
      (this.cursors.right.isDown || this.cursors.d.isDown) &&
      (this.cursors.down.isDown || this.cursors.s.isDown)
    ) {
      this.setVelocity(PLAYER.SPEED, PLAYER.SPEED);
      this.anims.play("hero-walk-right", true);
      return;
    }
    if (
      (this.cursors.left.isDown || this.cursors.a.isDown) &&
      (this.cursors.down.isDown || this.cursors.s.isDown)
    ) {
      this.setVelocity(-PLAYER.SPEED, PLAYER.SPEED);
      this.anims.play("hero-walk-left", true);
      return;
    }
    if (this.cursors.up.isDown || this.cursors.w.isDown) {
      this.setVelocityY(-PLAYER.SPEED);
      this.anims.play("hero-walk-up", true);
      return;
    }
    if (this.cursors.left.isDown || this.cursors.a.isDown) {
      this.setVelocityX(-PLAYER.SPEED);
      this.anims.play("hero-walk-left", true);
      return;
    }
    if (this.cursors.right.isDown || this.cursors.d.isDown) {
      this.setVelocityX(PLAYER.SPEED);
      this.anims.play("hero-walk-right", true);
      return;
    }
    if (this.cursors.down.isDown || this.cursors.s.isDown) {
      this.setVelocityY(PLAYER.SPEED);
      this.anims.play("hero-walk-down", true);
      return;
    }
    const direction = this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
    this.anims.play(`hero-idle-${direction}`, true);
  }

  private initAnimations() {
    this.scene.anims.create({
      key: "hero-idle-down",
      frames: [{ key: "hero", frame: "walk-down-0.png" }],
    });
    this.scene.anims.create({
      key: "hero-idle-up",
      frames: [{ key: "hero", frame: "walk-up-0.png" }],
    });
    this.scene.anims.create({
      key: "hero-idle-left",
      frames: [{ key: "hero", frame: "walk-left-0.png" }],
    });
    this.scene.anims.create({
      key: "hero-idle-right",
      frames: [{ key: "hero", frame: "walk-right-0.png" }],
    });

    this.scene.anims.create({
      key: "hero-walk-down",
      frames: this.scene.anims.generateFrameNames("hero", {
        start: 0,
        end: 3,
        prefix: "walk-down-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 8,
    });
    this.scene.anims.create({
      key: "hero-walk-up",
      frames: this.scene.anims.generateFrameNames("hero", {
        start: 0,
        end: 3,
        prefix: "walk-up-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 8,
    });
    this.scene.anims.create({
      key: "hero-walk-left",
      frames: this.scene.anims.generateFrameNames("hero", {
        start: 0,
        end: 3,
        prefix: "walk-left-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 8,
    });
    this.scene.anims.create({
      key: "hero-walk-right",
      frames: this.scene.anims.generateFrameNames("hero", {
        start: 0,
        end: 3,
        prefix: "walk-right-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 8,
    });

    this.scene.anims.create({
      key: "hero-dead-right",
      frames: this.scene.anims.generateFrameNames("hero", {
        start: 0,
        end: 1,
        prefix: "dead-right-",
        suffix: ".png",
      }),
      frameRate: 2,
    });
    this.scene.anims.create({
      key: "hero-dead-left",
      frames: this.scene.anims.generateFrameNames("hero", {
        start: 0,
        end: 1,
        prefix: "dead-left-",
        suffix: ".png",
      }),
      frameRate: 2,
    });
    this.scene.anims.create({
      key: "hero-dead-up",
      frames: this.scene.anims.generateFrameNames("hero", {
        start: 0,
        end: 1,
        prefix: "dead-up-",
        suffix: ".png",
      }),
      frameRate: 2,
    });
    this.scene.anims.create({
      key: "hero-dead-down",
      frames: this.scene.anims.generateFrameNames("hero", {
        start: 0,
        end: 1,
        prefix: "dead-down-",
        suffix: ".png",
      }),
      frameRate: 2,
    });
  }
}
