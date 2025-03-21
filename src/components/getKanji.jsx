import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
    You are a helpful assistant that provides detailed information about Japanese kanji.
    Provide the meanings in Turkish language 
    When a user asks about a kanji, respond with the following structured data in JSON format:
    
    - Kanji Character (kanji): The requested kanji character.
    - Onyomi Readings (onyomi): An array of onyomi readings in katakana with their Romaji readings in parentheses (separated by a space). If none, return ["-"].
    - Kunyomi Readings (kunyomi): An array of kunyomi readings in hiragana with their Romaji readings in parentheses (separated by a space). If none, return ["-"].
    - Meaning (meaning): The English meaning of the kanji.
    - Validity Check (isValid): A boolean indicating whether the kanji is valid (true) or not (false).
    - Stroke Count (strokeNumber): The total number of strokes in the kanji.
    - Example Words (examples): An array of words that include the kanji in compound form. Each entry includes:
      - Word (word): The compound word containing the kanji.
      - Reading (reading): The word's reading in hiragana with its Romaji in parentheses (separated by a space).
      - Meaning (meaning): The English meaning of the word.
  `,
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
      kanji: { type: "string", description: "The requested kanji character." },
      onyomi: {
        type: "array",
        description: "Onyomi readings in katakana with Romaji in parentheses (separated by a space). If none, return ['-'].",
        items: { type: "string" },
      },
      kunyomi: {
        type: "array",
        description: "Kunyomi readings in hiragana with Romaji in parentheses (separated by a space). If none, return ['-'].",
        items: { type: "string" },
      },
      meaning: { type: "string", description: "The English meaning of the kanji." },
      isValid: { type: "boolean", description: "Indicates if the given kanji is valid." },
      strokeNumber: { type: "integer", description: "Total number of strokes in the kanji." },
      examples: {
        type: "array",
        description: "Example compound words using the kanji.",
        items: {
          type: "object",
          properties: {
            word: { type: "string", description: "A compound word containing the kanji." },
            reading: { type: "string", description: "Reading in hiragana with Romaji in parentheses (separated by a space)." },
            meaning: { type: "string", description: "The English meaning of the word." },
          },
          required: ["word", "reading", "meaning"],
        },
      },
    },
    required: ["kanji", "onyomi", "kunyomi", "meaning", "isValid", "strokeNumber", "examples"],
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