import Phaser from "phaser";

export const debug = {
  graphics: (scene: Phaser.Scene) => scene.add.graphics().setAlpha(0.4),
  styles: {
    tileColor: null,
    faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    collidingTileColor: new Phaser.Display.Color(255, 255, 255, 255),
  },
};
