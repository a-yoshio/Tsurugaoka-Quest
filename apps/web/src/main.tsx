import Phaser from "phaser";
import "./styles.css";
import { ChapterScene } from "./game/scenes/ChapterScene";
import { OpeningScene } from "./game/scenes/OpeningScene";
import { StartScene } from "./game/scenes/StartScene";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-root",
  width: 960,
  height: 540,
  backgroundColor: "#151515",
  scene: [StartScene, OpeningScene, ChapterScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
  },
});

window.addEventListener("beforeunload", () => game.destroy(true));
