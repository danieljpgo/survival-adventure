import Phaser from "phaser";

export const debug = {
  graphics: (scene: Phaser.Scene) => scene.add.graphics().setAlpha(0.5),
  styles: {
    tileColor: null,
    faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
  },
};
