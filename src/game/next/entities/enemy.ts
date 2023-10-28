import { Text } from "../ui";
import { ASSETS } from "../scenes";
import { Actor, Player } from ".";

export const ENEMY = {
  AGGRO_RADIUS: 100,
  IFRAME: 200,
  WAKE_UP: 500,
  HP: 10,
  STATE: {
    SLEEP: "sleep",
    IDLE: "idle",
    // MOVIMENT: "moviment",
    DAMAGE: "damage",
    DEAD: "dead",
  },
} as const;

export class Enemy extends Actor {
  private target?: Player;
  private hpLabel?: Text;
  private iframe = 0;
  private wakeUp = 0;
  public state: (typeof ENEMY.STATE)[keyof typeof ENEMY.STATE] =
    ENEMY.STATE.SLEEP;

  constructor(scene: Phaser.Scene, x: number, y: number, target: Player) {
    super(scene, x, y, ASSETS.ENEMY.KEY, ENEMY.HP);
    this.target = target;
    if (!this.body) throw new Error("Enemy body not found");
    this.body.setSize(
      this.body.width - this.body.width / 2,
      this.body.height - this.body.height / 2
    );

    this.hpLabel = new Text(this.scene, this.x, this.y, this.hp.toString())
      .setFontSize(10)
      .setOrigin(0.5, 1.5);
    this.anims.play("log-sleep", true);
  }

  public setTarget(target: Player) {
    this.target = target;
  }

  // brains
  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (!this.target) throw new Error("Target not found");
    if (!this.hpLabel) throw new Error("hpLabel not found");

    this.hpLabel.setPosition(this.x, this.y).setOrigin(0.5, 1.5);

    if (this.state === ENEMY.STATE.DAMAGE) {
      this.iframe += delta;
      if (this.iframe < ENEMY.IFRAME) return;

      this.state = ENEMY.STATE.IDLE;
      this.iframe = 0;
      this.setTint(0xffffff);
    }

    if (
      Phaser.Math.Distance.BetweenPoints(
        { x: this.x, y: this.y },
        { x: this.target.x, y: this.target.y }
      ) < ENEMY.AGGRO_RADIUS
    ) {
      // @TODO Improve here
      if (this.state === ENEMY.STATE.SLEEP) {
        if (this.wakeUp === 0) {
          this.anims.play("log-wake-up", true);
        }
        this.wakeUp += delta;

        if (this.wakeUp < ENEMY.WAKE_UP) return;

        this.state = ENEMY.STATE.IDLE;
      }

      // @TODO Improve here
      const direction = {
        x: this.target.x - this.x,
        y: this.target.y - this.y,
      };

      if (direction.x < 0 && direction.y < 0) {
        direction.x < direction.y
          ? this.anims.play("log-walk-left", true)
          : this.anims.play("log-walk-up", true);
      }
      if (direction.x < 0 && direction.y > 0) {
        direction.x < direction.y
          ? this.anims.play("log-walk-left", true)
          : this.anims.play("log-walk-down", true);
      }
      if (direction.x > 0 && direction.y < 0) {
        Math.abs(direction.x) > direction.y
          ? this.anims.play("log-walk-right", true)
          : this.anims.play("log-walk-up", true);
      }
      if (direction.x > 0 && direction.y > 0) {
        direction.x > direction.y
          ? this.anims.play("log-walk-right", true)
          : this.anims.play("log-walk-down", true);
      }

      this.setVelocityX(this.target.x - this.x);
      this.setVelocityY(this.target.y - this.y);
      return;
    }

    if (this.state === ENEMY.STATE.SLEEP) return;
    const direction = this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
    this.anims.play(`log-idle-${direction}`, true);
    this.setVelocity(0);
  }

  public handleDamage(knockback: { x: number; y: number }, damage?: number) {
    // Prevent taking damage if already taking damage
    if (this.state === ENEMY.STATE.DAMAGE) return;
    if (!this.hpLabel) throw new Error("HP Label not found");

    super.handleDamage(knockback, damage);
    this.hpLabel.setText(this.hp.toString());

    if (this.hp === 0) {
      this.state = ENEMY.STATE.DEAD;
      return;
    }

    this.state = ENEMY.STATE.DAMAGE;
  }
}

export function initEnemyAnimations(anims: Phaser.Animations.AnimationManager) {
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

// private handleMeleeDamage() {
//   if (!this.target) throw new Error("Target not found");
//   console.log("entrou");
//   if (
//     Phaser.Math.Distance.BetweenPoints(
//       { x: this.x, y: this.y },
//       { x: this.target.x, y: this.target.y }
//     ) < this.target.width
//   ) {
//     this.handleDamage();
//     this.disableBody(true, false);
//     this.scene.time.delayedCall(1000, () => {
//       this.destroy();
//     });
//   }
// }
// if (direction.x < 0 && direction.y === 0) {}
// if (direction.x > 0 && direction.y === 0) {}
// if (direction.x === 0 && direction.y > 0) {}
// if (direction.x === 0 && direction.y > 0) {}
