import Phaser from "phaser";
import { type Direction, DIRECTION } from "../config/constants";

export const LOG = { SPEED: 50 } as const;

export const HEALTH_STATE = {
  IDLE: "idle",
  DAMAGE: "damage",
  DEAD: "dead",
} as const;

export class Log extends Phaser.Physics.Arcade.Sprite {
  private iframe = 0;
  private health = 2;
  private healthState: (typeof HEALTH_STATE)[keyof typeof HEALTH_STATE] =
    HEALTH_STATE.IDLE; //TODO improve naming

  private direction: Direction = DIRECTION.DOWN;
  private event: Phaser.Events.EventEmitter;
  private timer: Phaser.Time.TimerEvent;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.anims.play("log-sleep");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (!this.body) throw new Error("Log body not found");
    this.body.onCollide = true;
    this.body.setSize(
      this.body.width - this.body.width / 2,
      this.body.height - this.body.height / 2
    );

    this.event = scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollide,
      this
    );
    this.timer = scene.time.addEvent({
      delay: 4000,
      loop: true,
      callback: () => {
        // Random direction
        const nextDirection = Object.values(DIRECTION)?.at(
          Phaser.Math.Between(0, 3)
        );
        this.direction = nextDirection ?? DIRECTION.RIGHT;
      },
    });
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    // console.log(this.healthState);
    // console.log(this.health);
    if (this.healthState === HEALTH_STATE.DEAD) {
      return;
    }

    if (this.healthState === HEALTH_STATE.DAMAGE) {
      this.iframe += delta;
      if (this.iframe < 200) return;

      this.healthState = HEALTH_STATE.IDLE;
      this.setTint(0xffffff);
      this.iframe = 0;
    }

    switch (this.direction) {
      case DIRECTION.LEFT:
        this.anims.play("log-walk-left", true);
        this.setVelocity(-LOG.SPEED, 0);
        break;
      case DIRECTION.RIGHT:
        this.anims.play("log-walk-right", true);
        this.setVelocity(LOG.SPEED, 0);
        break;
      case DIRECTION.UP:
        this.anims.play("log-walk-up", true);
        this.setVelocity(0, -LOG.SPEED);
        break;
      case DIRECTION.DOWN:
        this.anims.play("log-walk-down", true);
        this.setVelocity(0, LOG.SPEED);
        break;
      default:
        this.anims.play("log-walk-down", true);
        this.setVelocity(0, LOG.SPEED);
        break;
    }
  }

  update() {
    console.log("abc");
  }

  destroy(fromScene?: boolean) {
    this.timer.destroy();
    this.event.destroy();
    super.destroy(fromScene);
  }

  private handleTileCollide() {
    // Random direction
    const nextDirection = Object.values(DIRECTION)?.at(
      Phaser.Math.Between(0, 3)
    );
    this.direction = nextDirection ?? DIRECTION.RIGHT;
  }

  handleDamage(
    enemy: Phaser.Physics.Arcade.Sprite,
    knife: Phaser.Physics.Arcade.Image
  ) {
    // Prevent taking damage if already taking damage
    if (this.healthState === HEALTH_STATE.DAMAGE) return;

    const knockback = {
      x: enemy.x - knife.x,
      y: enemy.y - knife.y,
    };
    const nextPosition = new Phaser.Math.Vector2(knockback.x, knockback.y)
      .normalize()
      .scale(200);

    const direction = this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
    this.iframe = 0;
    this.health = this.health - 1;

    if (this.health > 0) {
      this.anims.play(`log-idle-${direction}`, true);
      this.healthState = HEALTH_STATE.DAMAGE;
      this.setVelocity(nextPosition.x, nextPosition.y);
      this.setTint(0xff0000);
      return;
    }

    this.anims.play(`log-dead`, true);
    this.healthState = HEALTH_STATE.DEAD;
    this.setVelocity(0, 0);
    this.setTint(0xffffff);
  }
}

// TODO improve here
export function createLogAnims(anims: Phaser.Animations.AnimationManager) {
  anims.create({
    key: "log-dead",
    frames: anims.generateFrameNames("log", {
      start: 0,
      end: 3,
      prefix: "sleep-",
      suffix: ".png",
    }),
    frameRate: 8,
  });

  anims.create({
    key: "log-sleep",
    frames: anims.generateFrameNames("log", {
      start: 0,
      end: 3,
      prefix: "sleep-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 8,
  });

  anims.create({
    key: "log-wake-up",
    frames: anims.generateFrameNames("log", {
      start: 0,
      end: 2,
      prefix: "wake-up-",
      suffix: ".png",
    }),
    repeat: 0,
    frameRate: 8,
  });

  anims.create({
    key: "log-idle-down",
    frames: [{ key: "log", frame: "walk-down-0.png" }],
  });
  anims.create({
    key: "log-idle-up",
    frames: [{ key: "log", frame: "walk-up-0.png" }],
  });
  anims.create({
    key: "log-idle-left",
    frames: [{ key: "log", frame: "walk-left-0.png" }],
  });
  anims.create({
    key: "log-idle-right",
    frames: [{ key: "log", frame: "walk-right-0.png" }],
  });

  anims.create({
    key: "log-walk-down",
    frames: anims.generateFrameNames("log", {
      start: 0,
      end: 3,
      prefix: "walk-down-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 8,
  });
  anims.create({
    key: "log-walk-up",
    frames: anims.generateFrameNames("log", {
      start: 0,
      end: 3,
      prefix: "walk-up-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 8,
  });
  anims.create({
    key: "log-walk-left",
    frames: anims.generateFrameNames("log", {
      start: 0,
      end: 3,
      prefix: "walk-left-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 8,
  });
  anims.create({
    key: "log-walk-right",
    frames: anims.generateFrameNames("log", {
      start: 0,
      end: 3,
      prefix: "walk-right-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 8,
  });
}
