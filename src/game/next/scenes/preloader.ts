import Phaser from "phaser";
import { GAME } from ".";

export const PRELOADER = {
  KEY: "preloader",
} as const;

export const ASSETS = {
  BASE_URL: "assets/",
  HERO: { KEY: "hero" },
} as const;

export class Preloader extends Phaser.Scene {
  constructor() {
    super(PRELOADER.KEY);
  }

  preload() {
    this.load.baseURL = "assets/";
    this.load.atlas(
      ASSETS.HERO.KEY,
      "character/hero.png",
      "character/hero.json"
    );
    // this.load.image(ASSETS.HERO.KEY, "character/hero.png");
  }

  create() {
    this.scene.start(GAME.KEY);
  }
}
