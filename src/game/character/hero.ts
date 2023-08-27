// TODO improve here

export const HERO = {
  SPAWN: { X: 100, Y: 60 },
  SPEED: 100,
} as const;

export function createHeroAnims(anims: Phaser.Animations.AnimationManager) {
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
}
