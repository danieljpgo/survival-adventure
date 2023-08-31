import Phaser from "phaser";
import { Player } from "../entities";
import { ASSETS } from ".";
import { debug } from "~/lib/debug";

export const GAME = {
  KEY: "game",
} as const;

export class Game extends Phaser.Scene {
  private player?: Player;

  constructor() {
    super(GAME.KEY);
  }

  create() {
    const map = this.initMap();
    this.player = new Player(this, 100, 100);
    this.physics.add.collider(this.player, map.layers.walls);
  }

  update() {
    if (!this.player) throw new Error("Player not found");

    this.player.update();
  }

  private initMap() {
    const map = this.make.tilemap({ key: ASSETS.TILEMAP.KEY });
    const tileset = map.addTilesetImage(
      ASSETS.TILEMAP.KEY,
      ASSETS.TILES.KEY,
      16,
      16
    );
    if (!tileset) throw new Error("Tileset not found");

    const base = map.createLayer(ASSETS.TILEMAP.LAYERS.BASE, tileset, 0, 0);
    const ground = map.createLayer(ASSETS.TILEMAP.LAYERS.GROUND, tileset, 0, 0);
    const walls = map.createLayer(ASSETS.TILEMAP.LAYERS.WALLS, tileset, 0, 0);
    if (!base) throw new Error("Base layer not found");
    if (!ground) throw new Error("Ground layer not found");
    if (!walls) throw new Error("Walls layer not found");

    walls.setCollisionByProperty({ collides: true });
    walls.renderDebug(debug.graphics(this), debug.styles);
    this.physics.world.setBounds(0, 0, base.width, base.height);

    return {
      layers: { base, ground, walls },
    };
  }
}
