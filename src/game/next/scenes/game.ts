import Phaser from "phaser";
import { Player } from "../entities";
import { ASSETS } from ".";
import { debug } from "~/lib/debug";
import { EVENTS } from "~/game/config/constants";
import { Enemy } from "../entities/enemy";

export const GAME = {
  KEY: "game",
} as const;

export class Game extends Phaser.Scene {
  private player?: Player;
  private enemies?: Array<Enemy>;

  constructor() {
    super(GAME.KEY);
  }

  create() {
    const map = this.initMap();
    this.player = new Player(this, 100, 100);
    this.initChests(map.value);
    this.initCamera();
    this.initEnemies(map.value, map.layer);

    this.physics.add.collider(this.player, map.layer.walls);
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
      value: map,
      layer: { base, ground, walls },
    };
  }

  private initChests(map: Phaser.Tilemaps.Tilemap) {
    const chestPoints = map.filterObjects(
      ASSETS.TILEMAP.LAYERS.CHESTS,
      (obj) => obj.name === ASSETS.POINTS.CHESTS
    );
    if (!chestPoints) throw new Error("ChestPoints not found");

    const chests = chestPoints.map((point) => {
      if (!point.x || !point.y) throw new Error("ChestPoints X/Y not found");

      return this.physics.add.sprite(
        point.x,
        point.y,
        ASSETS.SPRITESHEET.KEY,
        0
      );
    });
    if (!chests) throw new Error("Chests not found");

    chests.forEach((chest) => {
      if (!this.player) throw new Error("Player not found");

      this.physics.add.overlap(this.player, chest, (_, obj2) => {
        this.game.events.emit(EVENTS.CHEST_LOOT);
        this.cameras.main.flash();
        obj2.destroy();
      });
    });
  }

  private initCamera() {
    if (!this.player) throw new Error("Player not found");

    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
    this.cameras.main.startFollow(this.player, false, 0.09, 0.09);
    this.cameras.main.setZoom(2);
  }

  private initEnemies(
    map: Phaser.Tilemaps.Tilemap,
    layers: ReturnType<typeof this.initMap>["layer"]
  ) {
    const enemiesPoints = map.filterObjects(
      ASSETS.TILEMAP.LAYERS.ENEMIES,
      (obj) => obj.name === ASSETS.POINTS.ENEMIES
    );
    if (!enemiesPoints) throw new Error("EnemyPoints not found");

    this.enemies = enemiesPoints.map((point) => {
      if (!point.x || !point.y) throw new Error("EnemyPoints X/Y not found");
      if (!this.player) throw new Error("Player not found");

      return new Enemy(
        this,
        point.x,
        point.y,
        ASSETS.SPRITESHEET.KEY,
        this.player
        // 503
      ).setName(point.id.toString());
    });

    this.physics.add.collider(this.enemies, layers.walls);
    this.physics.add.collider(this.enemies, this.enemies);

    if (!this.player) throw new Error("Player not found");
    this.physics.add.collider(this.player, this.enemies, (obj1, _) => {
      (obj1 as Player).handleDamage(1);
    });
  }
}
