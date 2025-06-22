import { sql } from "@vercel/postgres";
import fs from "fs";
// import { GoogleGenerativeAI } from "@google/generative-ai";

import { GoogleGenAI as GoogleGenerativeAI } from "@google/genai";

const exampleJSON = JSON.stringify({
  word: "acclimated",
  pronunciation: "ə'klaɪmətid",
  translation_word: "适应",
  sentence:
    "The hikers acclimated to the high altitude gradually, allowing them to enjoy the mountain views without experiencing altitude sickness.",
  translation:
    "这些徒步旅行者逐渐适应了高海拔，使他们能够在不出现高原反应的情况下欣赏山景。",
});

const formatTranslation = (data) => {
  const jsonString = data;
  // 从字符串中提取JSON部分
  const jsonStartIndex = jsonString.indexOf("{");
  const jsonEndIndex = jsonString.lastIndexOf("}");
  const jsonContent = jsonString.substring(jsonStartIndex, jsonEndIndex + 1);
  console.log(jsonString, "jsonString");
  // 解析JSON
  try {
    const jsonObject = JSON.parse(jsonContent);
    return jsonObject;
  } catch (error) {
    return null;
  }
};

export async function translate(userPrompt) {
  const genAI = new GoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      // model: 'gemini-2.0-flash-001',
      contents: userPrompt,
    });
    const text = response.text;
    console.log(text, "text");
    return text;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const createWordExample = async (word) => {
  console.log(word, "word");
  let data = null;
  try {
    const rawData = await translate(
      `给出这个单词或短语 ${word} 的音标，中文翻译，给出一个英文例句和他的例句中文翻译，以json的形式返回,输出格式为 ${exampleJSON}`,
    );
    data = formatTranslation(rawData);
  } catch (error) {
    console.log(error, "error");
    // fs.appendFileSync('error.txt', `${word} \n`);
    return { error: "error" };
  }
  if (!data) {
    // fs.appendFileSync('error.txt', `${word} \n`);
    return { error: "error" };
  }

  const ttsRes = await fetch(process.env.URL + "/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: {
        english: `${data.word}, ${data.word}, ${data.sentence}`,
        chinese: `${data.translation}`,
      },
      word: data.word,
    }),
  });
  const ttsData = await ttsRes.json();
  return { data, ttsData };
};

export async function createNewTts(query) {
  console.log(query, "query", query.sentence);
  let translation = query.translation;
  if (!translation) {
    const res = await fetch(process.env.URL + "/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userPrompt: `翻译这个句子为中文：${query.sentence}`,
      }),
    });
    if (!res.ok) {
    console.error(`Translation API error: ${res.status} ${res.statusText}`);
    const errorText = await res.text();
    console.error(`Response body: ${errorText}...`);
    throw new Error(`Translation API returned error: ${res.status}`);
    }
    const data = await res.json();
    translation = data.text;
  }
  console.log(translation, "translation");
  const ttsRes = await fetch(process.env.URL + "/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: {
        english: `${query.word}, ${query.word}, ${query.sentence}`,
        chinese: `${translation}`,
      },
      word: query.word,
    }),
  });
  if (!ttsRes.ok) {
    console.error(`TTS API error: ${ttsRes.status} ${ttsRes.statusText}`);
    const errorText = await ttsRes.text();
    console.error(`Response body: ${errorText.substring(0, 200)}...`);
    throw new Error(`TTS API returned error: ${ttsRes.status}`);
  }
  const ttsData = await ttsRes.json();
  await sql`UPDATE words SET audio = ${ttsData.objectKey} WHERE word = ${query.word};`;
}
