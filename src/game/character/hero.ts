import Phaser from "phaser";

export const HERO = {
  SPAWN: { X: 100, Y: 60 },
  SPEED: 100,
  IFRAME_DURATION: 250,
  HEARTS: 3,
} as const;

export const HEALTH_STATE = {
  IDLE: "idle",
  DAMAGE: "damage",
  DEAD: "dead",
} as const;

export class Hero extends Phaser.Physics.Arcade.Sprite {
  private iframe = 0;
  private health: number = HERO.HEARTS * 4;
  private healthState: (typeof HEALTH_STATE)[keyof typeof HEALTH_STATE] =
    HEALTH_STATE.IDLE; //TODO improve naming

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

  public get getHealth() {
    return this.health;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    switch (this.healthState) {
      case HEALTH_STATE.DAMAGE:
        this.iframe += delta;
        if (this.iframe < HERO.IFRAME_DURATION) return;

        this.healthState = HEALTH_STATE.IDLE;
        this.setTint(0xffffff);
        this.iframe = 0;
        break;
      case HEALTH_STATE.IDLE:
        // TODO
        break;
      case HEALTH_STATE.DEAD:
        // TODO
        break;
      default:
        break;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    // Prevent movement when taking damage
    if (this.healthState === HEALTH_STATE.DAMAGE) return;
    // Prevent movement when hero is dead
    if (this.healthState === HEALTH_STATE.DEAD) return;

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

    const direction = this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
    this.anims.play(`hero-idle-${direction}`, true);
    this.setVelocity(0, 0);
  }

  handleDamage(hero: Phaser.Tilemaps.Tile, enemy: Phaser.Tilemaps.Tile) {
    // Prevent taking damage if already taking damage
    if (this.healthState === HEALTH_STATE.DAMAGE) return;

    const knockback = {
      x: hero.x - enemy.x,
      y: hero.y - enemy.y,
    };
    const nextPosition = new Phaser.Math.Vector2(knockback.x, knockback.y)
      .normalize()
      .scale(200);

    const direction = this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
    this.iframe = 0;
    this.health = this.health - 1;

    if (this.health !== 0) {
      this.anims.play(`hero-idle-${direction}`, true);
      this.healthState = HEALTH_STATE.DAMAGE;
      this.setVelocity(nextPosition.x, nextPosition.y);
      this.setTint(0xff0000);
      return;
    }

    this.anims.play(`hero-dead-${direction}`, true);
    this.healthState = HEALTH_STATE.DEAD;
    this.setVelocity(0, 0);
    this.setTint(0xffffff);
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

  anims.create({
    key: "hero-dead-right",
    frames: anims.generateFrameNames("hero", {
      start: 0,
      end: 1,
      prefix: "dead-right-",
      suffix: ".png",
    }),
    frameRate: 2,
  });
  anims.create({
    key: "hero-dead-left",
    frames: anims.generateFrameNames("hero", {
      start: 0,
      end: 1,
      prefix: "dead-left-",
      suffix: ".png",
    }),
    frameRate: 2,
  });
  anims.create({
    key: "hero-dead-up",
    frames: anims.generateFrameNames("hero", {
      start: 0,
      end: 1,
      prefix: "dead-up-",
      suffix: ".png",
    }),
    frameRate: 2,
  });
  anims.create({
    key: "hero-dead-down",
    frames: anims.generateFrameNames("hero", {
      start: 0,
      end: 1,
      prefix: "dead-down-",
      suffix: ".png",
    }),
    frameRate: 2,
  });
}
