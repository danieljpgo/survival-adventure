import { Actor, Player } from ".";

export const ENEMY = {
  AGGRO_RADIUS: 100,
} as const;

export class Enemy extends Actor {
  private target?: Player;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    target: Player,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.target = target;
    // scene.add.existing(this);
    // scene.physics.add.existing(this);

    if (!this.body) throw new Error("Enemy body not found");
    this.body.setSize(
      this.body.width - this.body.width / 2,
      this.body.height - this.body.height / 2
    );
  }

  public setTarget(target: Player) {
    this.target = target;
  }

  // brains
  preUpdate(time: number, delta: number) {
    if (!this.target) throw new Error("Target not found");

    if (
      Phaser.Math.Distance.BetweenPoints(
        { x: this.x, y: this.y },
        { x: this.target?.x, y: this.target?.y }
      ) < ENEMY.AGGRO_RADIUS
    ) {
      this.setVelocityX(this.target.x - this.x);
      this.setVelocityY(this.target.y - this.y);
      return;
    }
    this.setVelocity(0);
  }
}
