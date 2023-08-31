import Phaser from "phaser";
import { GAME } from ".";

export const PRELOADER = {
  KEY: "preloader",
} as const;

export const ASSETS = {
  BASE_URL: "assets/",
  HERO: { KEY: "hero" },
  TILES: { KEY: "tiles" },
  TILEMAP: {
    KEY: "overworld",
    LAYERS: {
      BASE: "Base",
      GROUND: "Ground",
      WALLS: "Walls",
    },
  },
} as const;

export class Preloader extends Phaser.Scene {
  constructor() {
    super(PRELOADER.KEY);
  }

  preload() {
    this.load.baseURL = "assets/";
    this.load.tilemapTiledJSON(ASSETS.TILEMAP.KEY, "tiles/overworld.json");
    this.load.image(ASSETS.TILES.KEY, "tiles/overworld.png");
    this.load.atlas(
      ASSETS.HERO.KEY,
      "character/hero.png",
      "character/hero.json"
    );
  }

  create() {
    this.scene.start(GAME.KEY);
  }
}
