import { GoogleGenAI, Type } from "@google/genai";
import { Character } from "../types";

const characterSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: {
      type: Type.STRING,
      description: 'The full name of the fantasy character.',
    },
    class: {
      type: Type.STRING,
      description: 'The RPG class.',
    },
    race: {
      type: Type.STRING,
      description: 'The fantasy race.',
    },
    backstory: {
      type: Type.STRING,
      description: 'A brief, evocative one-sentence backstory.',
    },
    alignment: {
      type: Type.STRING,
      description: 'The moral alignment.',
    },
    rarity: {
      type: Type.STRING,
      enum: ['Common', 'Uncommon', 'Rare', 'Legendary', 'Artifact'],
    },
    element: {
      type: Type.STRING,
      enum: ['Fire', 'Water', 'Earth', 'Air', 'Void', 'Light', 'Dark'],
    },
    stats: {
      type: Type.OBJECT,
      properties: {
        health: { type: Type.INTEGER, description: 'Base Health Points' },
        mana: { type: Type.INTEGER, description: 'Base Mana Points' },
        strength: { type: Type.INTEGER, description: 'Base Strength/Physical Power' },
      },
      required: ['health', 'mana', 'strength'],
    },
  },
  required: ['id', 'name', 'class', 'race', 'backstory', 'alignment', 'stats', 'rarity', 'element'],
};

export const generateCharacter = async (): Promise<Character> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Generate a unique fantasy collectible card character. Include a unique ID, rarity, and elemental affinity. You MUST provide exactly three stats: Health, Mana, and Strength. Scale them realistically for a level 1 fantasy hero.',
    config: {
      responseMimeType: "application/json",
      responseSchema: characterSchema,
    },
  });

  if (!response.text) {
    throw new Error('No response text received from Gemini API');
  }

  return JSON.parse(response.text.trim()) as Character;
};

export const generatePortrait = async (character: Character): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `A professional fantasy collectible card game (CCG) illustration. 
    Character: ${character.race} ${character.class}. 
    Name: ${character.name}. 
    Element: ${character.element}.
    Backstory: ${character.backstory}. 
    Style: Epic digital painting, detailed armor/robes, cinematic lighting, stylized fantasy background matching the ${character.element} element. High contrast, sharp focus. No text.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('Failed to generate image data.');
};

export const generateNewBackstory = async (character: Character): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Write a unique origin story for ${character.name} (${character.race} ${character.class}, element of ${character.element}). Max 2 sentences. DARK FANTASY tone.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text?.trim() || "A legend yet unwritten.";
};
