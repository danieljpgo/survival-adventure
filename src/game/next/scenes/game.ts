import Phaser from "phaser";
import { EVENTS } from "~/game/config/constants";
import { Enemy, initEnemyAnimations } from "../entities/enemy";
import { Player, initPlayerAnimations } from "../entities";
import { ASSETS } from ".";
// import { debug } from "~/lib/debug"; /* Debug */

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
    initEnemyAnimations(this.anims);
    initPlayerAnimations(this.anims);

    const map = this.initMap();
    this.player = new Player(this, 100, 100);
    this.initCamera();
    this.initChests(map.value);
    this.initEnemies(map.value, map.layer);

    this.physics.add.collider(this.player, map.layer.walls);
  }

  update() {
    if (!this.player) throw new Error("Player not found");

    this.player.update(this);
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
    // walls.renderDebug(debug.graphics(this), debug.styles); /* Debug */
    this.physics.world.setBounds(0, 0, base.width, base.height);

    return {
      value: map,
      layer: { base, ground, walls },
    };
  }

  private initCamera() {
    if (!this.player) throw new Error("Player not found");

    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
    this.cameras.main.startFollow(this.player, false, 1, 1);
    this.cameras.main.setZoom(2);
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

  private initEnemies(
    map: Phaser.Tilemaps.Tilemap,
    layers: ReturnType<typeof this.initMap>["layer"]
  ) {
    if (!this.player?.swordHitbox) throw new Error("Player not found");

    const enemiesPoints = map.filterObjects(
      ASSETS.TILEMAP.LAYERS.ENEMIES,
      (obj) => obj.name === ASSETS.POINTS.ENEMIES
    );
    if (!enemiesPoints) throw new Error("EnemyPoints not found");

    this.enemies = enemiesPoints.map((point) => {
      if (!point.x || !point.y) throw new Error("EnemyPoints X/Y not found");
      if (!this.player) throw new Error("Player not found");

      return new Enemy(this, point.x, point.y, this.player).setName(
        point.id.toString()
      );
    });

    this.physics.add.collider(this.enemies, layers.walls);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.player, this.enemies, (obj1) => {
      (obj1 as Player).handleDamage(1);
    });
    this.physics.add.overlap(
      this.player.swordHitbox,
      this.enemies,
      this.handleSwordEnemyCollision,
      undefined,
      this
    );
  }

  private handleSwordEnemyCollision(
    sword:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    if (!("x" in sword))
      throw new Error(
        "Enemy is not a Phaser.Types.Physics.Arcade.GameObjectWithBody"
      );
    if (!("state" in enemy))
      throw new Error(
        "Enemy is not a Phaser.Types.Physics.Arcade.GameObjectWithBody"
      );

    const knockback = {
      x: enemy.body.x - sword.x,
      y: enemy.body.y - sword.y,
    };
    const nextPosition = new Phaser.Math.Vector2(knockback.x, knockback.y)
      .normalize()
      .scale(200);

    const currentEnemy = enemy as Enemy;
    currentEnemy.setVelocity(nextPosition.x, nextPosition.y);
    currentEnemy.handleDamage(1);
  }
}
