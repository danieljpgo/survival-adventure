"use client";
import Phaser from "phaser";
import { useEffect } from "react";
import { Preloader, Game, Hud } from "~/game/scenes";

export default function GameContainer() {
  useEffect(() => {
    console.log(">>> new Phaser.Game");

    const game = new Phaser.Game({
      title: "Survival Adventure",
      type: Phaser.WEBGL,
      parent: "game-container",
      scene: [Preloader, Game, Hud],
      scale: {
        zoom: 1,
        mode: Phaser.Scale.ScaleModes.NONE,
        width: window.innerWidth / 2,
        height: window.innerHeight / 2,
      },
      physics: {
        default: "arcade",
        arcade: { debug: true },
      },
      render: {
        antialiasGL: false,
        pixelArt: true,
      },
      autoFocus: true,
      backgroundColor: "#000000",
      canvasStyle: `display: block; width: 100%; height: 100%;`,
      audio: { disableWebAudio: false },
      callbacks: {
        postBoot: () => {
          console.log("postBoot");
        },
      },
    });

    // @TODO verificar se precisar remover a instancia
    return () => {
      console.log(">>> game.destroy");
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" className="grid place-items-center h-full" />;
}

// @TODO Resize
// interface Window {
//   sizeChanged: () => void;
//   game: Phaser.Game;
// }

// window.sizeChanged = () => {
//   if (window.game.isBooted) {
//     setTimeout(() => {
//       window.game.scale.resize(window.innerWidth, window.innerHeight);
//       window.game.canvas.setAttribute(
//         'style',
//         `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
//       );
//     }, 100);
//   }
// };
// window.onresize = () => window.sizeChanged();
