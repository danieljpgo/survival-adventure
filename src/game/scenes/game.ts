import Phaser from "phaser";
import { Log, createLogAnims } from "../enemies/log";
import { Hero, createHeroAnims, HERO } from "../character/hero";
import { debug } from "~/lib/debug";
import { HUD } from "../config/constants";
import { events } from "../config/events";

export class Game extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private hero?: Hero;
  private heroEnemiesCollider?: Phaser.Physics.Arcade.Collider;
  private enemies?: Phaser.Physics.Arcade.Group;
  private knives?: Phaser.Physics.Arcade.Group;

  constructor() {
    super("game");
  }

  preload() {
    if (!this.input.keyboard) throw new Error("Keyboard Input not found");

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run("hud");

    //TODO improve here
    createHeroAnims(this.anims);
    createLogAnims(this.anims);

    const map = this.make.tilemap({ key: "world" });
    const tileset = map.addTilesetImage("world", "tiles", 16, 16);
    if (!tileset) throw new Error("World tileset not found");

    const ground = map.createLayer("Ground", tileset);
    const walls = map.createLayer("Walls", tileset);
    if (!ground) throw new Error("Ground layer not found");
    if (!walls) throw new Error("Walls layer not found");

    this.hero = new Hero(this, HERO.SPAWN.X, HERO.SPAWN.Y, "hero");
    if (!this.hero.body) throw new Error("Hero body not found");

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });
    this.hero.setKnives(this.knives);
    // const log = new Log(this, HERO.SPAWN.X, HERO.SPAWN.Y, "log");
    this.enemies = this.physics.add.group({ classType: Log });
    this.enemies.get(50, 100, "log");
    this.enemies.get(50, 100, "log");
    this.enemies.get(50, 100, "log");

    this.cameras.main.startFollow(this.hero);
    this.physics.add.collider(this.hero, walls);
    this.physics.add.collider(this.enemies, walls);
    this.physics.add.collider(this.knives, walls);
    this.physics.add.collider(this.knives, this.knives);
    this.physics.add.collider(
      this.knives,
      this.enemies,
      this.handleKnifeEnemyCollision,
      undefined,
      this
    );
    this.heroEnemiesCollider = this.physics.add.collider(
      this.enemies,
      this.hero,
      this.handleHeroEnemyCollision,
      undefined,
      this
    );

    walls.setCollisionByProperty({ collides: true });
    walls.renderDebug(debug.graphics(this), debug.styles);
  }

  update(total: number, delta: number) {
    if (!this.hero) throw new Error("Hero not found");
    if (!this.cursors) throw new Error("Cursors not found");

    this.hero.update(this.cursors);
  }

  private handleHeroEnemyCollision(
    hero: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    if (!this.hero) throw new Error("Hero not found");
    if (!("x" in enemy)) throw new Error("Enemy is not a Phaser.Tilemaps.Tile");
    if (!("x" in hero)) throw new Error("Enemy is not a Phaser.Tilemaps.Tile");

    this.hero.handleDamage(hero, enemy);

    events.scene.emit(HUD.HERO_HEALTH_CHANGED, this.hero.getHealth);
    if (this.hero.getHealth === 0) {
      this.heroEnemiesCollider?.destroy();
    }
  }

  private handleKnifeWallsCollision(
    hero: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    if (!this.hero) throw new Error("Hero not found");
    if (!("x" in enemy)) throw new Error("Enemy is not a Phaser.Tilemaps.Tile");
    if (!("x" in hero)) throw new Error("Enemy is not a Phaser.Tilemaps.Tile");
  }

  private handleKnifeEnemyCollision(
    knives:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    if (!this.knives) throw new Error("knives not found");
    if (!this.enemies) throw new Error("enemies not found");
    if (!("type" in enemy))
      throw new Error(
        "Enemy is not a Phaser.Types.Physics.Arcade.GameObjectWithBody"
      );
    if (!("type" in knives))
      throw new Error(
        "knives is not a Phaser.Types.Physics.Arcade.GameObjectWithBody"
      );

    this.knives.killAndHide(knives);
    this.physics.world.remove(knives.body);
    // enemy.play("log-dead");
    // @TODO health system for enemies
    this.enemies.killAndHide(enemy);
    this.physics.world.remove(enemy.body);

    // enemy.on(
    //   Phaser.Animations.Events.ANIMATION_COMPLETE_KEY,
    //   function (animation, frame) {
    //     // Aqui você pode executar a ação que deseja após a animação
    //     console.log("Animação completada! Executando a próxima ação.");
    //     console.log({ animation, frame });
    //     // Coloque sua próxima ação aqui
    //   },
    //   enemy
    // );
  }
}
