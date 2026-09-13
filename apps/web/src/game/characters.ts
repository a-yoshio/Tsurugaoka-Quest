import { assetUrl } from "./assets";

export type CharacterId = "fb" | "hary" | "lipton";

export type Character = {
  id: CharacterId;
  key: string;
  name: string;
  answer: string;
  image: string;
};

export const characters: Character[] = [
  { id: "fb", key: "fb", name: "えふびぃ", answer: "えふびぃだ。", image: assetUrl("character/fb-front.png") },
  { id: "hary", key: "hary", name: "はりぃ", answer: "はりぃだよ", image: assetUrl("character/hary-front.png") },
  { id: "lipton", key: "lipton", name: "りぷお", answer: "りぷおだよ。", image: assetUrl("character/lipton-front.png") },
];
