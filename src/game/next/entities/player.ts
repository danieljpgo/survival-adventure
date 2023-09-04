import { EVENTS, KeyboardInput } from "~/game/config/constants";
import { getKeyboardMoviment } from "~/game/config/keyboard";
import { Actor } from ".";
import { ASSETS } from "../scenes";
import { Text } from "../ui";

export const PLAYER = {
  SPEED: 100,
  COOLDOWN: 500,
  STATE: {
    IDLE: "idle",
    MOVIMENT: "moviment",
    ATTACK: "attack",
  },
} as const;

export class Player extends Actor {
  private cursors?: Record<KeyboardInput, Phaser.Input.Keyboard.Key>;
  private hpLabel?: Text;
  private cooldown = 0;

  public state: (typeof PLAYER.STATE)[keyof typeof PLAYER.STATE] =
    PLAYER.STATE.IDLE;

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
    this.body.setSize(
      this.width - this.width / 2,
      this.height - this.height / 2
    );
    this.body.setOffset(0, +this.height / 4);

    this.hpLabel = new Text(this.scene, this.x, this.y, this.hp.toString())
      .setFontSize(10)
      .setOrigin(0.5, 1.5);
    this.initAnimations();

    // this.cursors.space.on("down", (event: KeyboardEvent) => {
    // TODO Verificar se essa é a melhor implementação
    // this.anims.play("hero-attack-down", true);
    // this.scene.game.events.emit(EVENTS.PLAYER_ATTACK);
    // });
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (!this.cursors) throw new Error("Cursors not found");
    if (!this.body) throw new Error("Body not found");

    switch (this.state) {
      case PLAYER.STATE.ATTACK:
        this.setTint(0x18ff);
        this.cooldown += delta;
        if (this.cooldown < PLAYER.COOLDOWN) return;

        this.setTint(0xffffff);
        this.state = PLAYER.STATE.IDLE;
        this.cooldown = 0;
        this.body.setOffset(0, +this.height / 4);

        break;
      case PLAYER.STATE.MOVIMENT:
      case PLAYER.STATE.IDLE:
      default:
        break;
    }
  }

  update() {
    if (!this.body) throw new Error("Body not found");
    if (!this.cursors) throw new Error("Cursors not found");
    if (!this.hpLabel) throw new Error("hpLabel not found");

    this.hpLabel.setPosition(this.x, this.y).setOrigin(0.5, 1.5);
    this.setVelocity(0);

    // Prevent player to attack if is already attacking
    if (this.state === PLAYER.STATE.ATTACK) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.state = PLAYER.STATE.ATTACK;
      const direction = this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
      this.anims.play(`hero-attack-${direction}`, true);

      this.body.setOffset(this.width / 4, this.height / 4);
      return;
    }

    const moviment = getKeyboardMoviment(this.cursors);
    this.state = moviment ? PLAYER.STATE.MOVIMENT : PLAYER.STATE.IDLE;
    switch (moviment) {
      case "up-left":
        this.setVelocity(-PLAYER.SPEED, -PLAYER.SPEED);
        this.anims.play("hero-walk-left", true);
        break;
      case "up-right":
        this.setVelocity(PLAYER.SPEED, -PLAYER.SPEED);
        this.anims.play("hero-walk-right", true);
        break;
      case "down-right":
        this.setVelocity(PLAYER.SPEED, PLAYER.SPEED);
        this.anims.play("hero-walk-right", true);
        break;
      case "down-left":
        this.setVelocity(-PLAYER.SPEED, PLAYER.SPEED);
        this.anims.play("hero-walk-left", true);
        break;
      case "up":
        this.setVelocityY(-PLAYER.SPEED);
        this.anims.play("hero-walk-up", true);
        break;
      case "left":
        this.setVelocityX(-PLAYER.SPEED);
        this.anims.play("hero-walk-left", true);
        break;
      case "right":
        this.setVelocityX(PLAYER.SPEED);
        this.anims.play("hero-walk-right", true);
        break;
      case "down":
        this.setVelocityY(PLAYER.SPEED);
        this.anims.play("hero-walk-down", true);
        break;
      default:
        const current = this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
        this.anims.play(`hero-idle-${current}`, true);
        break;
    }
  }

  private initAnimations() {
    // idle
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

    // walk
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

    // attack
    this.scene.anims.create({
      key: "hero-attack-down",
      frames: this.scene.anims.generateFrameNames("hero", {
        start: 0,
        end: 3,
        prefix: "attack-down-",
        suffix: ".png",
      }),
      // repeat: -1,
      frameRate: 8,
    });
    this.scene.anims.create({
      key: "hero-attack-up",
      frames: this.scene.anims.generateFrameNames("hero", {
        start: 0,
        end: 3,
        prefix: "attack-up-",
        suffix: ".png",
      }),
      // repeat: -1,
      frameRate: 8,
    });
    this.scene.anims.create({
      key: "hero-attack-left",
      frames: this.scene.anims.generateFrameNames("hero", {
        start: 0,
        end: 3,
        prefix: "attack-left-",
        suffix: ".png",
      }),
      // repeat: -1,
      frameRate: 8,
    });
    this.scene.anims.create({
      key: "hero-attack-right",
      frames: this.scene.anims.generateFrameNames("hero", {
        start: 0,
        end: 3,
        prefix: "attack-right-",
        suffix: ".png",
      }),
      // repeat: -1,
      frameRate: 8,
    });

    // dead
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

  public handleDamage(damage?: number) {
    super.handleDamage(damage);
    if (!this.hpLabel) throw new Error("HP Label not found");

    this.hpLabel.setText(this.hp.toString());
  }
}
