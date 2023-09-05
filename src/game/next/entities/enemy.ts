import { Text } from "../ui";
import { Actor, Player } from ".";

export const ENEMY = {
  AGGRO_RADIUS: 100,
  IFRAME: 200,
  STATE: {
    IDLE: "idle",
    MOVIMENT: "moviment",
    DAMAGE: "damage",
    DEAD: "dead",
  },
} as const;

export class Enemy extends Actor {
  private target?: Player;
  private hpLabel?: Text;
  private iframe = 0;
  public state: (typeof ENEMY.STATE)[keyof typeof ENEMY.STATE] =
    ENEMY.STATE.IDLE;

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

    if (!this.body) throw new Error("Enemy body not found");
    this.body.setSize(
      this.body.width - this.body.width / 2,
      this.body.height - this.body.height / 2
    );

    this.hpLabel = new Text(this.scene, this.x, this.y, this.hp.toString())
      .setFontSize(10)
      .setOrigin(0.5, 1.5);

    // this.scene.game.events.on(
    //   EVENTS.PLAYER_ATTACK,
    //   this.handleMeleeDamage,
    //   this
    // );
    // this.on("destroy", () => {
    //   this.scene.game.events.removeListener(
    //     EVENTS.PLAYER_ATTACK,
    //     this.handleMeleeDamage
    //   );
    // });
  }

  public setTarget(target: Player) {
    this.target = target;
  }

  // brains
  preUpdate(time: number, delta: number) {
    if (!this.target) throw new Error("Target not found");
    if (!this.hpLabel) throw new Error("hpLabel not found");

    this.hpLabel.setPosition(this.x, this.y).setOrigin(0.5, 1.5);

    // if (this.state === ENEMY.STATE.DEAD) return

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
      this.setVelocityX(this.target.x - this.x);
      this.setVelocityY(this.target.y - this.y);
      return;
    }

    this.setVelocity(0);
  }

  public handleDamage(damage?: number) {
    // Prevent taking damage if already taking damage
    if (this.state === ENEMY.STATE.DAMAGE) return;

    super.handleDamage(damage);
    if (!this.hpLabel) throw new Error("HP Label not found");
    this.hpLabel.setText(this.hp.toString());

    if (this.hp > 0) {
      this.setTint(0xff0000);
      this.state = ENEMY.STATE.DAMAGE;
      return;
    }

    this.state = ENEMY.STATE.DEAD;
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
}
