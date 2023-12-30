import { getKeyboardMoviment } from "~/game/config/keyboard";
import { KeyboardInput } from "~/game/config/constants";
import { ASSETS } from "../scenes";
import { Text } from "../ui";
import { Actor } from ".";

// SPAWN: { X: 150, Y: 150 },

export const PLAYER = {
  SPEED: 100,
  COOLDOWN: 500,
  HP: 3 * 4,
  HEARTS: 3,
  IFRAME_DURATION: 250,
  STATE: {
    IDLE: "idle",
    DAMAGE: "damage",
    MOVIMENT: "moviment",
    ATTACK: "attack",
    DEAD: "dead",
  },
} as const;

export class Player extends Actor {
  private cooldown = 0;
  private cursors?: Record<KeyboardInput, Phaser.Input.Keyboard.Key>;
  public knives?: Phaser.Physics.Arcade.Group;
  public swordHitbox?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  public state: (typeof PLAYER.STATE)[keyof typeof PLAYER.STATE] =
    PLAYER.STATE.IDLE;
  private iframe = 0;
  // private healthState: (typeof PLAYER.STATE)[keyof typeof PLAYER.STATE] =
  //   PLAYER.STATE.IDLE; //TODO improve naming

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.HERO.KEY, PLAYER.HP);

    this.initCursors();
    this.initBody();
    this.initSword(scene);
    this.initKnives(scene);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    switch (this.state) {
      case PLAYER.STATE.DEAD:
        return;
      case PLAYER.STATE.DAMAGE:
        this.iframe += delta;
        this.setTint(0x18ff); /* Debug */
        if (this.iframe < PLAYER.IFRAME_DURATION) return;
        this.state = PLAYER.STATE.IDLE;
        this.setTint(0xffffff);
        this.iframe = 0;
        break;
      case PLAYER.STATE.ATTACK:
        this.cooldown += delta;
        this.setTint(0x18ffff); /* Debug */
        if (this.cooldown < PLAYER.COOLDOWN) return;
        this.setTint(0xffffff); /* Debug */
        this.state = PLAYER.STATE.IDLE;
        this.cooldown = 0;
        if (!this.body) throw new Error("Body not found");
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
    if (!this.cursors) throw new Error("Cursors not found");
    if (!this.swordHitbox?.body) throw new Error("swordHitbox not found");

    // Prevent movement when taking damage
    if (this.state === PLAYER.STATE.DAMAGE) return;
    // Prevent movement when hero is dead
    if (this.state === PLAYER.STATE.DEAD) return;

    this.setVelocity(0, 0);

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

    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.shift) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.k)
    ) {
      if (!this.knives) throw new Error("Hero body not found");

      const direction = this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
      const vec = new Phaser.Math.Vector2(0, 0);
      if (direction === "up") {
        vec.y = -1;
      }
      if (direction === "down") {
        vec.y = 1;
      }
      if (direction === "left") {
        vec.x = -1;
      }
      if (direction === "right") {
        vec.x = 1;
      }

      const angle = vec.angle();
      const knife = this.knives.get(this.x, this.y, ASSETS.WEAPONS.KNIFE.KEY);

      knife.setActive(true);
      knife.setVisible(true);
      knife.setRotation(angle);
      knife.setVelocity(vec.x * 300, vec.y * 300);

      knife.x = knife.x + vec.x * 8;
      knife.y = knife.y + vec.y * 8;
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
        this.setVelocity(0, 0);
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

  private initKnives(scene: Phaser.Scene) {
    this.knives = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    scene.physics.add.collider(this.knives, this.knives);
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

  public handleDamage(knockback: { x: number; y: number }, damage?: number) {
    if (this.state === PLAYER.STATE.DEAD) return;
    if (this.state === PLAYER.STATE.DAMAGE) return;

    super.handleDamage(knockback, damage);

    const nextPosition = new Phaser.Math.Vector2(knockback.x, knockback.y)
      .normalize()
      .scale(200);

    const direction = this.anims.currentAnim?.key.split("-").at(-1) ?? "down";
    this.iframe = 0;
    this.hp = this.hp - 1;

    if (this.hp > 1) {
      this.anims.play(`hero-idle-${direction}`, true);
      this.state = PLAYER.STATE.DAMAGE;
      this.setVelocity(nextPosition.x, nextPosition.y);
      this.setTint(0xff0000);
      return;
    }

    this.anims.play(`hero-dead-${direction}`, true);
    this.state = PLAYER.STATE.DEAD;
    this.setVelocity(0, 0);
    this.setTint(0xffffff);

    alert("YOU DIED");
    window.location.reload();
  }

  public handleKnifeCollision(
    knife: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    if (!knife) throw new Error("Knife is not a Arcade.Image");
    const currentKnife = knife as Phaser.Physics.Arcade.Image;

    currentKnife.scene.tweens.add({
      targets: currentKnife,
      duration: 300,
      repeat: 3,
      yoyo: true,
      alpha: 0.5,
      onStart: () => {},
      onComplete: () => {
        if (!currentKnife.body) return;
        if (!this.knives) return;

        currentKnife.body.enable = false;
        this.knives.setAlpha(0);
        this.knives.killAndHide(currentKnife);
        this.knives.remove(currentKnife, true);
      },
    });
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
