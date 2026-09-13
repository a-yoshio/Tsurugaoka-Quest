import Phaser from "phaser";
import { assetUrl } from "../assets";

const SOUND_ENABLED_STORAGE_KEY = "tsurugaoka-quest-sound-enabled";

export class StartScene extends Phaser.Scene {
  private startButton!: Phaser.GameObjects.Rectangle;
  private startButtonLabel!: Phaser.GameObjects.Text;
  private soundEnabled = this.loadSoundPreference();
  private soundButton!: Phaser.GameObjects.Rectangle;
  private soundButtonLabel!: Phaser.GameObjects.Text;

  constructor() {
    super("StartScene");
  }

  preload() {
    this.load.image("hary", assetUrl("hary-front.png"));
    this.load.image("fb", assetUrl("fb-front.png"));
    this.load.image("lipton", assetUrl("lipton-front.png"));
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .rectangle(width / 2, height / 2, width, height, 0x151515)
      .setDepth(-1);

    this.soundButton = this.add
      .rectangle(width - 82, 28, 112, 36, 0xfacc15)
      .setInteractive({ useHandCursor: true });
    this.soundButtonLabel = this.add
      .text(width - 82, 28, `SOUND: ${this.soundEnabled ? "ON" : "OFF"}`, {
        color: "#000000",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.soundButton.on("pointerover", () => {
      this.soundButton.setFillStyle(0xffe66d);
    });
    this.soundButton.on("pointerout", () => {
      this.soundButton.setFillStyle(0xfacc15);
    });
    this.soundButton.on("pointerdown", () => {
      this.soundEnabled = !this.soundEnabled;
      window.localStorage.setItem(
        SOUND_ENABLED_STORAGE_KEY,
        String(this.soundEnabled),
      );
      this.soundButtonLabel.setText(`SOUND: ${this.soundEnabled ? "ON" : "OFF"}`);
    });

    const characterSize = Math.min((width - 72) / 3, height * 0.34, 180);
    const characterY = height * 0.53;
    const characterSpacing = characterSize + Math.min(18, width * 0.02);
    this.add
      .rectangle(
        width / 2,
        characterY,
        characterSize + characterSpacing * 2,
        characterSize,
        0x151515,
      )
      .setDepth(-0.5);

    const characterImages = [
      this.add.image(width / 2 - characterSpacing, characterY, "hary"),
      this.add.image(width / 2, characterY, "fb"),
      this.add.image(width / 2 + characterSpacing, characterY, "lipton"),
    ];
    characterImages.forEach((characterImage, index) => {
      characterImage.setOrigin(0.5).setAlpha(0.95);
      characterImage.setDisplaySize(characterSize, characterSize);
      this.tweens.add({
        targets: characterImage,
        y: characterY - Math.min(24, characterSize * 0.16),
        duration: 320,
        delay: index * 180,
        ease: "Sine.easeOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 260,
      });
    });

    const titleWidth = Math.min(width - 56, 720);
    const titleHeight = 142;
    const titleY = height * 0.15;
    const titleContainer = this.add.container(width / 2, -titleHeight);

    titleContainer
      .add(
        this.add
          .graphics()
          .fillStyle(0xfacc15, 0.8)
          .fillRoundedRect(
            -titleWidth / 2,
            -titleHeight / 2,
            titleWidth,
            titleHeight,
            16,
          ),
      )
      .add(
        this.add
          .text(0, 0, "TSURUGAOKA QUEST", {
            color: "#000000",
            fontFamily: '"Courier New", monospace',
            fontSize: `${Math.min(64, width / 13)}px`,
            fontStyle: "bold",
            letterSpacing: 3,
            shadow: {
              offsetX: 2,
              offsetY: 2,
              color: "#6b5500",
              blur: 0,
              stroke: true,
              fill: true,
            },
          })
          .setOrigin(0.5),
      )
      .setAlpha(0);

    this.tweens.add({
      targets: titleContainer,
      y: titleY,
      alpha: 1,
      duration: 1800,
      ease: "Sine.easeOut",
    });

    this.startButton = this.add
      .rectangle(width / 2, height * 0.78, Math.min(width - 140, 250), 58, 0xfacc15)
      .setInteractive({ useHandCursor: true });
    this.startButtonLabel = this.add
      .text(width / 2, height * 0.78, "START", {
        color: "#000000",
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.startButton.on("pointerover", () => {
      this.startButton.setFillStyle(0xffe66d);
      this.startButton.setScale(1.03);
      this.startButtonLabel.setScale(1.03);
    });
    this.startButton.on("pointerout", () => {
      this.startButton.setFillStyle(0xfacc15);
      this.startButton.setScale(1);
      this.startButtonLabel.setScale(1);
    });
    this.startButton.on("pointerdown", () => {
      if (this.soundEnabled) {
        this.playStartSound();
      }
      this.startButton.disableInteractive();
      this.tweens.add({
        targets: [this.startButton, this.startButtonLabel],
        alpha: 0.35,
        duration: 220,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });
      this.scene.start("OpeningScene");
    });
  }

  private loadSoundPreference() {
    return window.localStorage.getItem(SOUND_ENABLED_STORAGE_KEY) !== "false";
  }

  private playStartSound() {
    const AudioContextClass = window.AudioContext;
    const context = new AudioContextClass();
    const masterGain = context.createGain();
    const now = context.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
    masterGain.connect(context.destination);

    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const noteGain = context.createGain();
      const startAt = now + index * 0.11;

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, startAt);
      noteGain.gain.setValueAtTime(0.0001, startAt);
      noteGain.gain.exponentialRampToValueAtTime(0.7, startAt + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.32);
      oscillator.connect(noteGain);
      noteGain.connect(masterGain);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.34);
    });

    window.setTimeout(() => {
      void context.close();
    }, 1100);
  }
}
