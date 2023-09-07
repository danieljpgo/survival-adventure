import Phaser from "phaser";

const ACTOR = {
  HP: 10,
} as const;

export class Actor extends Phaser.Physics.Arcade.Sprite {
  protected hp;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    hp?: number,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.hp = hp ?? ACTOR.HP;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true); //@TODO maybe change to .body
  }

  public getHP() {
    return this.hp;
  }

  public handleDamage(damage?: number) {
    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      yoyo: true,
      alpha: 0.5,
      onStart: () => {
        if (!damage) return;

        this.hp = this.hp - damage;
      },
      onComplete: () => {
        this.setAlpha(1);
      },
    });
  }
}
