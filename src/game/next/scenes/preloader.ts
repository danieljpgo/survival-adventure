import Phaser from "phaser";
import { HUD, GAME } from ".";

export const PRELOADER = {
  KEY: "preloader",
} as const;

export const ASSETS = {
  BASE_URL: "assets/",
  HERO: { KEY: "hero" },
  TILES: { KEY: "tiles" },
  SPRITESHEET: { KEY: "spritesheet" },
  TILEMAP: {
    KEY: "overworld",
    LAYERS: {
      BASE: "Base",
      GROUND: "Ground",
      WALLS: "Walls",
      CHESTS: "Chests",
      ENEMIES: "Enemies",
    },
  },
  POINTS: {
    CHESTS: "ChestPoint",
    ENEMIES: "EnemyPoint",
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
    this.load.spritesheet(ASSETS.SPRITESHEET.KEY, "tiles/objects.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.atlas(
      ASSETS.HERO.KEY,
      "character/hero.png",
      "character/hero.json"
    );
  }

  create() {
    this.scene.start(GAME.KEY);
    this.scene.start(HUD.KEY);
  }
}
