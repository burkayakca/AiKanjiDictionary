import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction:
    'You are a helpful assistant that provides detailed information about Japanese kanji. When a user asks about a kanji, respond with the following structured data in JSON format:\n\nKanji Character (kanji): The requested kanji character.\nOnyomi Readings (onyomi): An array of onyomi readings in hiragana. If no onyomi exists, return ["-"].\nKunyomi Readings (kunyomi): An array of kunyomi readings in katakana. If no kunyomi exists, return ["-"].\nMeaning (meaning): The English meaning of the kanji.\nValidity Check (isValid): A boolean value indicating whether the provided kanji is valid (true) or not (false).\nStroke Count (StrokeNumber): The total number of strokes required to write the kanji.\nExample Words (examples): An array of words that include the kanji in compound form, each with its reading in hiragana and English meaning',
});

const generationConfig = {
  temperature: 0.1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      kanji: {
        type: "string",
        description: "The requested kanji character.",
      },
      jlpt: {
        type: "string",
        description: "JLPT Level of the Kanji",
      },
      onyomi: {
        type: "array",
        description: "Onyomi readings in katakana With their Romaji readings in parenthesis Leave space between parenthesis and the word. If none, return ['-'].",
        items: {
          type: "string",
        },
      },
      kunyomi: {
        type: "array",
        description: "Kunyomi readings in hiragana With their Romaji readings in parenthesis  Leave space between parenthesis and the word. If none, return ['-'].",
        items: {
          type: "string",
        },
      },
      meaning: {
        type: "string",
        description: "The English meaning of the kanji.",
      },
      isValid: {
        type: "boolean",
        description: "Indicates if the given kanji is valid.",
      },
      strokeNumber: {
        type: "integer",
        description: "Total number of strokes in the kanji.",
      },
      examples: {
        type: "array",
        description: "Example compound words using the kanji.",
        items: {
          type: "object",
          properties: {
            word: {
              type: "string",
              description: "A compound word that includes the kanji.",
            },
            reading: {
              type: "string",
              description: "The reading of the word in hiragana. With its Romaji in parenthesis  Leave space between parenthesis and the word",
            },
            meaning: {
              type: "string",
              description: "The English meaning of the word.",
            },
          },
          required: ["word", "reading", "meaning"],
        },
      },
    },
    required: [
      "kanji",
      "jlpt",
      "onyomi",
      "kunyomi",
      "meaning",
      "isValid",
      "strokeNumber",
      "examples",
    ],
  },
};

async function getKanji(character) {
  const chatSession = model.startChat({
    generationConfig,
  });

  const result = await chatSession.sendMessage(character);
  const responseText = await result.response.text();
  const responseJson = JSON.parse(responseText);
  console.log(responseJson);

  return responseJson; // Return the parsed JSON response
};

export default getKanji;