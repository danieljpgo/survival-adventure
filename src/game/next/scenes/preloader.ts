import Phaser from "phaser";
import { HUD, GAME } from ".";

export const PRELOADER = {
  KEY: "preloader",
} as const;

export const ASSETS = {
  BASE_URL: "assets/",
  HERO: { KEY: "hero" },
  ENEMY: { KEY: "log" },
  TILES: { KEY: "tiles" },
  SPRITESHEET: { KEY: "spritesheet" },
  WEAPONS: { KNIFE: { KEY: "knife" } },
  TILEMAP: {
    KEY: "overworld",
    LAYERS: {
      BASE: "Base",
      GROUND: "Ground",
      WALLS: "Walls",
      CHESTS: "Chests",
      ENEMIES: "Enemies",
      SPAWN: "Spawn",
    },
  },
  POINTS: {
    CHESTS: "ChestPoint",
    ENEMIES: "EnemyPoint",
    SPAWN: "SpawnPoint",
  },
} as const;

export class Preloader extends Phaser.Scene {
  constructor() {
    super(PRELOADER.KEY);
  }

  preload() {
    this.load.baseURL = ASSETS.BASE_URL;
    this.load.tilemapTiledJSON(ASSETS.TILEMAP.KEY, "tiles/overworld.json");
    this.load.image(ASSETS.TILES.KEY, "tiles/overworld.png");
    this.load.image(ASSETS.WEAPONS.KNIFE.KEY, "weapons/knife.png");
    this.load.spritesheet(ASSETS.SPRITESHEET.KEY, "tiles/objects.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.atlas(
      ASSETS.HERO.KEY,
      "character/hero.png",
      "character/hero.json"
    );
    this.load.atlas(
      ASSETS.ENEMY.KEY,
      "enemies/log.png",
      "enemies/log.json"
    );
  }

  create() {
    this.scene.start(GAME.KEY);
    this.scene.start(HUD.KEY);
  }
}
