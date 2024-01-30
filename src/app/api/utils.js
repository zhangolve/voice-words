
import { sql } from '@vercel/postgres';
import fs from 'fs'


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

export const createWordExample = async (word)=> {
    let data = null;
    try {
    const res = await fetch({
        url: process.env.URL +'/api/translate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userPrompt: `给出这个单词${word}的音标，中文翻译，给出一个英文例句和他的例句中文翻译，以json的形式返回,输出格式为 ${exampleJSON}`})
      })
      const rawData = await res.json();
      data = formatTranslation(rawData)
      } catch (error) {
        fs.appendFileSync('error.txt', `${word} \n`);
        return {error: 'error'}
      }
      if(!data) {
        fs.appendFileSync('error.txt', `${word} \n`);
        return {error: 'error'}
      }

      const ttsRes = await fetch(process.env.URL +'/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: `${data.word}, ${data.word}, ${data.sentence}, ${data.translation}`, word: data.word })
      })
      const ttsData = await ttsRes.json();
      return {data, ttsData}
}


export async function createNewTts(query) {
    let translation = query.translation;
    if(!translation) { 
        const res = await fetch(process.env.URL +'/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userPrompt: `翻译这个句子为中文：${query.sentence}`})
            })
            const data = await res.json();
            translation = data.text;
    }  
        const ttsRes = await fetch(process.env.URL +'/api/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: `${query.word}, ${query.word}, ${query.sentence}, ${translation}`, word:query.word })
        })  
        const ttsData = await ttsRes.json();
        await sql`UPDATE words SET audio = ${ttsData.objectKey} WHERE word = ${query.word};`;
}

