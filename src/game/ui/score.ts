import { Text } from ".";

export const SCORE = {
  ACTIONS: {
    INCREASE: "increase",
    DECREASE: "decrease",
    UPDATE: "update",
  },
} as const;

export class Score extends Text {
  private value: number;
  constructor(scene: Phaser.Scene, x: number, y: number, init = 0) {
    super(scene, x, y, `Chests: ${init}/4`);

    scene.add.existing(this);
    this.value = init;
  }

  public getValue() {
    return this.value;
  }

  public changeValue(
    action: (typeof SCORE.ACTIONS)[keyof typeof SCORE.ACTIONS],
    value: number
  ) {
    switch (action) {
      case SCORE.ACTIONS.INCREASE:
        this.value += value;
        break;
      case SCORE.ACTIONS.INCREASE:
        this.value -= value;
        break;
      case SCORE.ACTIONS.UPDATE:
        this.value = value;
        break;
      default:
        throw new Error(`Unhandled action type: ${action}`);
    }
    this.setText(`Chests: ${this.value}/4`);
  }
}
