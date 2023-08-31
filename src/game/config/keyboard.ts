import { KeyboardInput } from "./constants";

export function getKeyboardMoviment(
  cursors: Record<KeyboardInput, Phaser.Input.Keyboard.Key>
) {
  if (
    (cursors.up.isDown || cursors.w.isDown) &&
    (cursors.left.isDown || cursors.a.isDown)
  ) {
    return "up-left";
  }
  if (
    (cursors.up.isDown || cursors.w.isDown) &&
    (cursors.right.isDown || cursors.d.isDown)
  ) {
    return "up-right";
  }
  if (
    (cursors.right.isDown || cursors.d.isDown) &&
    (cursors.down.isDown || cursors.s.isDown)
  ) {
    return "down-right";
  }
  if (
    (cursors.left.isDown || cursors.a.isDown) &&
    (cursors.down.isDown || cursors.s.isDown)
  ) {
    return "down-left";
  }
  if (cursors.up.isDown || cursors.w.isDown) {
    return "up";
  }
  if (cursors.left.isDown || cursors.a.isDown) {
    return "left";
  }
  if (cursors.right.isDown || cursors.d.isDown) {
    return "right";
  }
  if (cursors.down.isDown || cursors.s.isDown) {
    return "down";
  }
}
