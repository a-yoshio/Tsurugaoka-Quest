import Phaser from "phaser";
import { characters, type Character } from "../characters";

export class OpeningScene extends Phaser.Scene {
  private dialogueText!: Phaser.GameObjects.Text;
  private speakerText!: Phaser.GameObjects.Text;
  private panel!: Phaser.GameObjects.Rectangle;
  private whiteOverlay!: Phaser.GameObjects.Rectangle;
  private advanceButton!: Phaser.GameObjects.Triangle;
  private typingTimer?: Phaser.Time.TimerEvent;
  private fullText = "";
  private characterImages: Phaser.GameObjects.Image[] = [];
  private characterNames: Phaser.GameObjects.Text[] = [];
  private selectedCharacter?: Character;
  private phase: "welcome" | "name" | "selection" | "confirm" | "warning" | "final" = "welcome";
  private isTyping = false;
  private canAdvance = false;
  private choiceObjects: Phaser.GameObjects.Text[] = [];

  constructor() {
    super("OpeningScene");
  }

  preload() {
    characters.forEach((character) => this.load.image(character.key, character.image));
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x151515);
    this.whiteOverlay = this.add
      .rectangle(width / 2, height / 2, width, height, 0xffffff)
      .setAlpha(0)
      .setDepth(1);
    this.createDialogueBox();
    this.showDialogue("???", "ようこそ、TSURUGAOKA QUESTの世界へ。", "welcome");
  }

  private createDialogueBox() {
    const { width, height } = this.scale;
    const panelHeight = Math.min(175, height * 0.31);
    const panelY = height - panelHeight / 2 - 18;
    this.panel = this.add
      .rectangle(width / 2, panelY, width - 36, panelHeight, 0xffffff)
      .setStrokeStyle(3, 0x111111)
      .setDepth(2)
      .setInteractive({ useHandCursor: true });
    this.speakerText = this.add
      .text(34, panelY - panelHeight / 2 + 16, "", {
        color: "#111111",
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);
    this.speakerText.setDepth(2);
    this.dialogueText = this.add
      .text(34, panelY - panelHeight / 2 + 52, "", {
        color: "#111111",
        fontFamily: "Arial, sans-serif",
        fontSize: `${Math.min(25, width / 32)}px`,
        wordWrap: { width: width - 95 },
      })
      .setOrigin(0, 0);
    this.dialogueText.setDepth(2);
    this.advanceButton = this.add
      .triangle(width - 54, panelY + panelHeight / 2 - 28, 0, 0, 20, 10, 40, 0, 0x111111)
      .setVisible(false)
      .setDepth(2)
      .setInteractive({ useHandCursor: true });

    this.panel.on("pointerdown", () => this.advanceDialogue());
    this.advanceButton.on("pointerdown", () => this.advanceDialogue());
  }

  private showDialogue(
    speaker: string,
    text: string,
    phase: OpeningScene["phase"],
  ) {
    this.phase = phase;
    this.clearChoices();
    this.speakerText.setText(speaker);
    this.fullText = text;
    this.dialogueText.setText("");
    this.advanceButton.setVisible(false);
    this.canAdvance = false;
    this.isTyping = true;
    this.typingTimer?.remove(false);
    let index = 0;
    this.typingTimer = this.time.addEvent({
      delay: 55,
      repeat: text.length - 1,
      callback: () => {
        index += 1;
        this.dialogueText.setText(text.slice(0, index));
        if (index === text.length) {
          this.isTyping = false;
          this.canAdvance = true;
          this.advanceButton.setVisible(true);
        }
      },
    });
  }

  private advanceDialogue() {
    if (this.isTyping) {
      this.typingTimer?.remove(false);
      this.dialogueText.setText(this.fullText);
      this.isTyping = false;
      this.canAdvance = true;
      this.advanceButton.setVisible(true);
      return;
    }
    if (!this.canAdvance) return;
    this.canAdvance = false;
    this.advanceButton.setVisible(false);

    if (this.phase === "welcome") {
      this.showDialogue("???", "そういえば、君、名前は？", "name");
    } else if (this.phase === "name") {
      this.showCharacterSelection();
    } else if (this.phase === "warning") {
      this.showDialogue("???", `${this.selectedCharacter?.name}、ひぃ----`, "final");
    } else if (this.phase === "final") {
      this.transitionToChapter();
    }
  }

  private showCharacterSelection() {
    this.phase = "selection";
    this.clearChoices();
    this.characterNames.forEach((name) => name.destroy());
    this.characterNames = [];
    const { width, height } = this.scale;
    const imageSize = Math.min(150, width * 0.24, height * 0.3);
    const spacing = Math.min(width * 0.28, 220);
    this.characterImages = characters.map((character, index) => {
      const image = this.add
        .image(width / 2 + (index - 1) * spacing, height * 0.34, character.key)
        .setDisplaySize(imageSize, imageSize)
        .setInteractive({ useHandCursor: true });
      image.on("pointerdown", () => this.selectCharacter(character));
      const name = this.add
        .text(image.x, image.y + imageSize / 2 + 15, character.name, {
          color: "#ffffff",
          fontSize: "18px",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      this.characterNames.push(name);
      return image;
    });

    this.speakerText.setText("???");
    this.dialogueText.setText("そういえば、君、名前は？");
    this.addChoice("1. えふびぃだ。", 0, () => this.selectCharacter(characters[0]));
    this.addChoice("2. はりぃだよ", 1, () => this.selectCharacter(characters[1]));
    this.addChoice("3. りぷおだよ。", 2, () => this.selectCharacter(characters[2]));
  }

  private selectCharacter(character: Character) {
    this.selectedCharacter = character;
    this.characterImages.forEach((image) => image.destroy());
    this.characterImages = [];
    this.characterNames.forEach((name) => name.destroy());
    this.characterNames = [];
    this.clearChoices();
    const { width, height } = this.scale;
    const image = this.add
      .image(width / 2, height * 0.34, character.key)
      .setDepth(1.5)
      .setDisplaySize(Math.min(190, width * 0.3, height * 0.37), Math.min(190, width * 0.3, height * 0.37));
    this.characterImages.push(image);
    this.tweens.add({
      targets: image,
      y: image.y - 14,
      duration: 300,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    this.showDialogue("???", `${character.name}か？`, "confirm");
    this.addChoice("1. そうだよ。", 0, () => this.confirmCharacter(true));
    this.addChoice("2. ちがうんだな。", 1, () => this.confirmCharacter(false));
  }

  private confirmCharacter(confirmed: boolean) {
    if (!confirmed) {
      this.characterImages.forEach((image) => image.destroy());
      this.characterImages = [];
      this.showCharacterSelection();
      return;
    }
    this.clearChoices();
    this.showDialogue(
      "???",
      `そうか、、、${this.selectedCharacter?.name}、いつまで寝ているんだ。学校遅刻するぞ。遅刻したら、どうなるか知っているよな？`,
      "warning",
    );
    const selectedImage = this.characterImages[0];
    this.tweens.add({
      targets: selectedImage,
      x: selectedImage.x + 5,
      duration: 50,
      yoyo: true,
      repeat: -1,
    });
    this.tweens.add({
      targets: selectedImage,
      alpha: 0,
      duration: 1800,
      ease: "Sine.easeIn",
    });
    this.tweens.add({
      targets: this.whiteOverlay,
      alpha: 1,
      duration: 1800,
      ease: "Sine.easeIn",
    });
  }

  private addChoice(label: string, index: number, callback: () => void) {
    const { height } = this.scale;
    const choice = this.add
      .text(58, height - 125 + index * 27, label, {
        color: "#111111",
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        backgroundColor: "#f1f1f1",
        padding: { left: 8, right: 8, top: 3, bottom: 3 },
      })
      .setDepth(3)
      .setInteractive({ useHandCursor: true });
    choice.on("pointerover", () => choice.setColor("#8a5a00"));
    choice.on("pointerout", () => choice.setColor("#111111"));
    choice.on("pointerdown", callback);
    this.choiceObjects.push(choice);
  }

  private clearChoices() {
    this.choiceObjects.forEach((choice) => choice.destroy());
    this.choiceObjects = [];
  }

  private transitionToChapter() {
    this.cameras.main.fade(1300, 255, 255, 255);
    this.time.delayedCall(1300, () => this.scene.start("ChapterScene"));
  }
}
