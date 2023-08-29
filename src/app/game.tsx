"use client";
import { useEffect } from "react";
import Phaser from "phaser";
import { Preloader, Game, Hud } from "~/game/scenes";
// import { GridEngine, GridEngineHeadless } from "grid-engine";

export default function GameContainer() {
  useEffect(() => {
    console.log("> new Phaser.Game");

    const game = new Phaser.Game({
      parent: "game-container",
      scene: [Preloader, Game, Hud],
      width: 460,
      height: 260,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: true,
        },
      },
      scale: { zoom: 3.5 },
    });
    // @TODO verificar se precisar remover a instancia
    return () => {
      console.log("> game.destroy");
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" />;
}
