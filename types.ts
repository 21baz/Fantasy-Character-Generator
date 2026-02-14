export interface Stats {
  health: number;
  mana: number;
  strength: number;
}

export interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  backstory: string;
  stats: Stats;
  alignment: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Artifact';
  element: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Void' | 'Light' | 'Dark';
  portraitUrl?: string;
  savedAt?: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}