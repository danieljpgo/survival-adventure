import Phaser from "phaser";

export const HERO = {
  SPAWN: { X: 100, Y: 60 },
  SPEED: 100,
} as const;

export class Hero extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.anims.play("hero-idle-down");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (!this.body) throw new Error("Hero body not found");
    this.body.setSize(this.width, this.height - this.height / 2);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors.left.isDown) {
      this.anims.play("hero-walk-left", true);
      this.setVelocity(-HERO.SPEED, 0);
      return;
    }
    if (cursors.right.isDown) {
      this.anims.play("hero-walk-right", true);
      this.setVelocity(HERO.SPEED, 0);
      return;
    }
    if (cursors.up.isDown) {
      this.anims.play("hero-walk-up", true);
      this.setVelocity(0, -HERO.SPEED);
      return;
    }
    if (cursors.down.isDown) {
      this.anims.play("hero-walk-down", true);
      this.setVelocity(0, HERO.SPEED);
      return;
    }

    const currentDirection =
      this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
    this.anims.play(`hero-idle-${currentDirection}`, true);
    this.setVelocity(0, 0);
  }
}

// TODO improve here
export function createHeroAnims(anims: Phaser.Animations.AnimationManager) {
  anims.create({
    key: "hero-idle-down",
    frames: [{ key: "hero", frame: "walk-down-0.png" }],
  });
  anims.create({
    key: "hero-idle-up",
    frames: [{ key: "hero", frame: "walk-up-0.png" }],
  });
  anims.create({
    key: "hero-idle-left",
    frames: [{ key: "hero", frame: "walk-left-0.png" }],
  });
  anims.create({
    key: "hero-idle-right",
    frames: [{ key: "hero", frame: "walk-right-0.png" }],
  });

  anims.create({
    key: "hero-walk-down",
    frames: anims.generateFrameNames("hero", {
      start: 0,
      end: 3,
      prefix: "walk-down-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 8,
  });
  anims.create({
    key: "hero-walk-up",
    frames: anims.generateFrameNames("hero", {
      start: 0,
      end: 3,
      prefix: "walk-up-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 8,
  });
  anims.create({
    key: "hero-walk-left",
    frames: anims.generateFrameNames("hero", {
      start: 0,
      end: 3,
      prefix: "walk-left-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 8,
  });
  anims.create({
    key: "hero-walk-right",
    frames: anims.generateFrameNames("hero", {
      start: 0,
      end: 3,
      prefix: "walk-right-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 8,
  });
}
