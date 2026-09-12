import Phaser from "phaser";

export class ChapterScene extends Phaser.Scene {
  constructor() {
    super("ChapterScene");
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000);
    this.add
      .text(width / 2, height / 2, "10月1日の朝", {
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        fontSize: `${Math.min(42, width / 18)}px`,
      })
      .setOrigin(0.5);
  }
}
