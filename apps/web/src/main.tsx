import Phaser from "phaser";
import "./styles.css";

class StartScene extends Phaser.Scene {
  private startButton!: Phaser.GameObjects.Rectangle;
  private startButtonLabel!: Phaser.GameObjects.Text;

  constructor() {
    super("StartScene");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .rectangle(width / 2, height / 2, width, height, 0x101828)
      .setDepth(-1);

    const glow = this.add.graphics();
    glow.fillStyle(0x1e3a5f, 0.75);
    glow.fillCircle(width * 0.2, height * 0.2, 190);
    glow.fillStyle(0x172554, 0.65);
    glow.fillCircle(width * 0.82, height * 0.82, 220);

    this.add
      .rectangle(width / 2, height / 2, Math.min(width - 64, 680), 380, 0x0f172a, 0.92)
      .setStrokeStyle(2, 0x94a3b8, 0.2);

    this.add
      .text(width / 2, height / 2 - 65, "TSURUGAOKA QUEST", {
        color: "#f8fafc",
        fontFamily: "sans-serif",
        fontSize: "48px",
        fontStyle: "bold",
        letterSpacing: 3,
      })
      .setOrigin(0.5);

    this.startButton = this.add
      .rectangle(width / 2, height / 2 + 112, 250, 64, 0xf59e0b)
      .setInteractive({ useHandCursor: true });
    this.startButtonLabel = this.add
      .text(width / 2, height / 2 + 112, "ゲームを始める", {
        color: "#1e293b",
        fontFamily: "sans-serif",
        fontSize: "22px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.startButton.on("pointerover", () => {
      this.startButton.setFillStyle(0xfbbf24);
      this.startButton.setScale(1.03);
      this.startButtonLabel.setScale(1.03);
    });
    this.startButton.on("pointerout", () => {
      this.startButton.setFillStyle(0xf59e0b);
      this.startButton.setScale(1);
      this.startButtonLabel.setScale(1);
    });
    this.startButton.on("pointerdown", () => {
      this.startButtonLabel.setText("冒険の準備中...");
      this.startButton.disableInteractive();
    });
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-root",
  width: 960,
  height: 540,
  backgroundColor: "#101828",
  scene: StartScene,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
  },
});

window.addEventListener("beforeunload", () => game.destroy(true));
