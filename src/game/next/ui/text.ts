import Phaser from "phaser";

export class Text extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y, text, {
      fontSize: "calc(50vh / 25)",
      color: "#fff",
      stroke: "#000",
      strokeThickness: 4,
    });
    this.setOrigin(0, 0);
    scene.add.existing(this);
  }
}
