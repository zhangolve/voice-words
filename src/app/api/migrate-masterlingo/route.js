import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import rawData from './result.json'
import fs from 'fs';



const exampleJSON  = JSON.stringify({ "word": "acclimated",
"pronunciation": "ə'klaɪmətid",
"translation_word": "适应",
"sentence": "The hikers acclimated to the high altitude gradually, allowing them to enjoy the mountain views without experiencing altitude sickness.",
"translation": "这些徒步旅行者逐渐适应了高海拔，使他们能够在不出现高原反应的情况下欣赏山景。"});

const formatTranslation = (data)=> {
  const jsonString = data.text;

    // 从字符串中提取JSON部分
  const jsonStartIndex = jsonString.indexOf('{');
  const jsonEndIndex = jsonString.lastIndexOf('}');
  const jsonContent = jsonString.substring(jsonStartIndex, jsonEndIndex + 1);

  // 解析JSON
  try {
    const jsonObject = JSON.parse(jsonContent);
    return jsonObject;
  } catch (error) {
    return null;
  }
}

export async function GET() {
    const words = rawData.data.getFlashcards;
    const formatData = words.map(word=> ({
      word: word.original,
      translations: word.translations,
      note: word.notes,
      sentence: word.context?.replace('_MSLINGO_W_', word.original),
      dueDate: word.dueDate,
      period: 4,
    }))
    
    try {
      for(var i = 0; i < formatData.length; i++) {
        const query = formatData[i];

        const sqlResult = await sql`SELECT EXISTS (
          SELECT 1
          FROM words
          WHERE word = ${query.word}
        );`
        if(sqlResult.rows[0].exists) {
          continue;
        }
        let data=null;
        try {
        const res = await fetch({
          url: process.env.URL +'/api/translate',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userPrompt: `给出这个单词${query.word}的音标，中文翻译，给出一个英文例句和他的例句中文翻译，以json的形式返回,输出格式为 ${exampleJSON}`})
        })
        const rawData = await res.json();
        data = formatTranslation(rawData)
        } catch (error) {
          fs.appendFileSync('error.txt', `${query.word} \n`);
          continue;
        }
        if(!data) {
          fs.appendFileSync('error.txt', `${query.word} \n`);
          continue;
        }
        const ttsRes = await fetch(process.env.URL +'/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: {english: `${data.word}, ${data.word}, ${data.sentence}`,chinese: `${data.translation}`}, word: data.word })
        })
        const ttsData = await ttsRes.json();
        await sql`INSERT INTO words (word, pronunciation, translations, note, sentence, due_date, period, audio) VALUES (${query.word}, ${data.pronunciation}, ${[data.translation_word]}, ${query.note}, ${data.sentence}, ${query.dueDate}, ${query.period}, ${ttsData.objectKey});`;  
        console.log('finish', i) 
      }
      return NextResponse.json({ result:formatData.length}, { status: 200 })
    }
    catch (error) {
      console.log(error,'error')
      return NextResponse.json({ error }, { status: 500 });
    }

}