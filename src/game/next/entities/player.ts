import { getKeyboardMoviment } from "~/game/config/keyboard";
import { KeyboardInput } from "~/game/config/constants";
import { ASSETS } from "../scenes";
import { Text } from "../ui";
import { Actor } from ".";

export const PLAYER = {
  SPEED: 100,
  COOLDOWN: 500,
  HP: 12,
  STATE: {
    IDLE: "idle",
    MOVIMENT: "moviment",
    ATTACK: "attack",
    DEAD: "dead",
  },
} as const;

export class Player extends Actor {
  private cooldown = 0;
  private hpLabel?: Text;
  private cursors?: Record<KeyboardInput, Phaser.Input.Keyboard.Key>;
  public swordHitbox?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  public state: (typeof PLAYER.STATE)[keyof typeof PLAYER.STATE] =
    PLAYER.STATE.IDLE;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.HERO.KEY, PLAYER.HP);

    this.initCursors();
    this.initBody();
    this.initSword(scene);

    // @TODO add hearts
    this.hpLabel = new Text(this.scene, this.x, this.y, this.hp.toString())
      .setFontSize(10)
      .setOrigin(0.5, 1.5);
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (!this.body) throw new Error("Body not found");

    switch (this.state) {
      case PLAYER.STATE.ATTACK:
        this.cooldown += delta;
        // this.setTint(0x18ffff); /* Debug */
        if (this.cooldown < PLAYER.COOLDOWN) return;
        // this.setTint(0xffffff); /* Debug */
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

  update(scene: Phaser.Scene) {
    if (!this.body) throw new Error("Body not found");
    if (!this.hpLabel) throw new Error("hpLabel not found");
    if (!this.cursors) throw new Error("Cursors not found");
    if (!this.swordHitbox?.body) throw new Error("swordHitbox not found");

    this.setVelocity(0);
    this.hpLabel.setPosition(this.x, this.y).setOrigin(0.5, 1.5);

    // Prevent player to attack if is already attacking
    if (this.state === PLAYER.STATE.ATTACK) {
      // Update hitbox position every frame
      this.placeSwordHitbox();
      return;
    }

    // Remove sword hitbox
    scene.physics.world.remove(this.swordHitbox.body);
    this.swordHitbox.visible = false;
    this.swordHitbox.body.enable = false;

    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.j)
    ) {
      this.state = PLAYER.STATE.ATTACK;
      const direction = this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
      this.anims.play(`hero-attack-${direction}`, true);
      this.body.setOffset(this.width / 4, this.height / 4);
      scene.physics.world.add(this.swordHitbox.body);
      // this.swordHitbox.visible = true; /* Debug */
      this.placeSwordHitbox();
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

  private initCursors() {
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
  }

  private initBody() {
    if (!this.body) throw new Error("Body not found");

    this.body.setSize(
      this.width - this.width / 2,
      this.height - this.height / 2
    );
    this.body.setOffset(0, +this.height / 4);
  }

  private initSword(scene: Phaser.Scene) {
    this.swordHitbox = scene.add.rectangle(
      this.x,
      this.y,
      16,
      16,
      0xffffff,
      0
    ) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    scene.physics.add.existing(this.swordHitbox);
  }

  private placeSwordHitbox() {
    if (!this.swordHitbox?.body) throw new Error("swordHitbox not found");

    const direction = this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
    switch (direction) {
      case "up":
        this.swordHitbox.scaleX = 1.25;
        this.swordHitbox.x = this.x;
        this.swordHitbox.y = this.y - this.height / 4;
        break;
      case "right":
        this.swordHitbox.scaleY = 1.25;
        this.swordHitbox.x = this.x + this.height / 4;
        this.swordHitbox.y = this.y;
        break;
      case "left":
        this.swordHitbox.scaleY = 1.25;
        this.swordHitbox.x = this.x - this.height / 4;
        this.swordHitbox.y = this.y;
        break;
      case "down":
      default:
        this.swordHitbox.scaleX = 1.25;
        this.swordHitbox.x = this.x;
        this.swordHitbox.y = this.y + this.height / 4;
        break;
    }
  }

  public handleDamage(damage?: number) {
    super.handleDamage(damage);
    if (!this.hpLabel) throw new Error("HP Label not found");

    this.hpLabel.setText(this.hp.toString());
  }
}

export function initPlayerAnimations(
  anims: Phaser.Animations.AnimationManager
) {
  // idle
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

  // walk
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

  // attack
  anims.create({
    key: "hero-attack-down",
    frames: anims.generateFrameNames("hero", {
      start: 0,
      end: 3,
      prefix: "attack-down-",
      suffix: ".png",
    }),
    // repeat: -1,
    frameRate: 8,
  });
  anims.create({
    key: "hero-attack-up",
    frames: anims.generateFrameNames("hero", {
      start: 0,
      end: 3,
      prefix: "attack-up-",
      suffix: ".png",
    }),
    // repeat: -1,
    frameRate: 8,
  });
  anims.create({
    key: "hero-attack-left",
    frames: anims.generateFrameNames("hero", {
      start: 0,
      end: 3,
      prefix: "attack-left-",
      suffix: ".png",
    }),
    // repeat: -1,
    frameRate: 8,
  });
  anims.create({
    key: "hero-attack-right",
    frames: anims.generateFrameNames("hero", {
      start: 0,
      end: 3,
      prefix: "attack-right-",
      suffix: ".png",
    }),
    // repeat: -1,
    frameRate: 8,
  });

  // dead
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

// back do idle after animation finish if need
// this.once(
//   Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
//     `hero-attack-${direction}`,
//   () => {
//     const current =
//       this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
//     this.anims.play(`hero-idle-${current}`, true);

//     console.log("abc");
//   }
// );

// scene.physics.world.remove(this.swordHitbox.body);
// this.swordHitbox.visible = false;
// this.swordHitbox.body.enable = false;

// scene.add.existing(this.swordHitbox);

// this.cursors.space.on("down", (event: KeyboardEvent) => {
// TODO Verificar se essa é a melhor implementação
// this.anims.play("hero-attack-down", true);
// game.events.emit(EVENTS.PLAYER_ATTACK);
// });

// public swordHitbox?: Phaser.Physics.Arcade.Body;
// private swordHitbox?: Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
