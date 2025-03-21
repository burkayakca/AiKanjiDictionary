import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
    Sen, Japonca kanji hakkında ayrıntılı bilgiler sağlayan faydalı bir asistansın.  
    Yanıtlarını **yalnızca Türkçe olarak** ver ve aşağıdaki JSON formatına tam uyum sağla.  

    Bir kullanıcı bir kanji karakteri hakkında bilgi istediğinde, aşağıdaki verileri sağlamalısın:

    - **Kanji Karakteri (kanji):** İstenen kanji karakteri.  
    - **Onyomi Okunuşları (onyomi):** Onyomi okunuşlarının **katakana** yazımı ve **Romaji** okunuşları parantez içinde (araya boşluk koy). Eğer onyomi yoksa "-" döndür.  
    - **Kunyomi Okunuşları (kunyomi):** Kunyomi okunuşlarının **hiragana** yazımı ve **Romaji** okunuşları parantez içinde (araya boşluk koy). Eğer kunyomi yoksa "-" döndür.  
    - **Anlamı (meaning):** Kanji karakterinin **Türkçe anlamı**.  
    - **Geçerlilik Kontrolü (isValid):** Girilen kanjinin geçerli olup olmadığını belirten bir true veya false değeri.  
    - **Toplam Çizgi Sayısı (strokeNumber):** Kanjiyi yazmak için gereken toplam çizgi sayısı.  
    - **Örnek Kelimeler (examples):** Kanjinin içinde geçtiği birleşik kelimeler listesi. Her kelime şu bilgileri içermelidir:  
    - **Kelime (word):** Kanji içeren birleşik kelime.  
    - **Okunuş (reading):** Kelimenin **hiragana** yazımı ve **Romaji** okunuşu parantez içinde (araya boşluk koy).  
    - **Anlamı (meaning):** Kelimenin **Türkçe anlamı**.  

    Yanıtın kesinlikle yukarıdaki **Türkçe açıklamalara uygun ve tam formatlı olmalıdır**.
`
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
        description: "İstenen kanji karakteri.",
      },
      onyomi: {
        type: "array",
        description: "Onyomi okunuşları katakana ile yazılır ve Romaji okunuşları parantez içinde verilir (araya boşluk koy). Eğer onyomi yoksa ['-'] döndür.",
        items: { type: "string" },
      },
      kunyomi: {
        type: "array",
        description: "Kunyomi okunuşları hiragana ile yazılır ve Romaji okunuşları parantez içinde verilir (araya boşluk koy). Eğer kunyomi yoksa ['-'] döndür.",
        items: { type: "string" },
      },
      meaning: {
        type: "string",
        description: "Kanji karakterinin Türkçe anlamı.",
      },
      isValid: {
        type: "boolean",
        description: "Verilen kanjinin geçerli olup olmadığını gösterir (true veya false).",
      },
      strokeNumber: {
        type: "integer",
        description: "Kanjiyi yazmak için gereken toplam çizgi sayısı.",
      },
      examples: {
        type: "array",
        description: "Kanjinin içinde geçtiği birleşik kelimelerin listesi.",
        items: {
          type: "object",
          properties: {
            word: {
              type: "string",
              description: "Kanji içeren birleşik kelime.",
            },
            reading: {
              type: "string",
              description: "Kelimenin hiragana ile yazılmış hali ve Romaji okunuşu parantez içinde (araya boşluk koy).",
            },
            meaning: {
              type: "string",
              description: "Kelimenin Türkçe anlamı.",
            },
          },
          required: ["word", "reading", "meaning"],
        },
      },
    },
    required: [
      "kanji",
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