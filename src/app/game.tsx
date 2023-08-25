"use client";
import { useEffect } from "react";
import Phaser from "phaser";
import { GridEngine, GridEngineHeadless } from "grid-engine";
import { Preloader, Game } from "~/game/scenes";

export default function GameContainer() {
  useEffect(() => {
    console.log("> Phaser.Game");

    const game = new Phaser.Game({
      parent: "game-container",
      scene: [Preloader, Game],
      width: 460,
      height: 260,
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 } },
      },
      scale: { zoom: 3.7 },
    });
    // @TODO verificar se precisar remover a instancia
    return () => {
      console.log("> game.destroy");
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" />;
}
