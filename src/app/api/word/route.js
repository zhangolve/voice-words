import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";



const exampleJSON  = JSON.stringify({ "word": "acclimated",
"pronunciation": "ə'klaɪmətid",
"translation_word": "适应",
"sentence": "The hikers acclimated to the high altitude gradually, allowing them to enjoy the mountain views without experiencing altitude sickness.",
"translation": "这些徒步旅行者逐渐适应了高海拔，使他们能够在不出现高原反应的情况下欣赏山景。"});


async function createNewTts(query) {
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


export async function GET(req) {
    try {
        const { word:sqlWord } = Object.fromEntries(req.nextUrl.searchParams);
        if (sqlWord) {
            const word = await sql`select * from words where word = ${sqlWord}`;
            return NextResponse.json({word: word.rows[0]}, { status: 200 })
        } else {        
            const words = await sql`select * from words`;
            return NextResponse.json(words, { status: 200 })
        }
        
    }
    catch (error) {
      console.log(error,'error')
      return NextResponse.json({ error }, { status: 500 });
    }
}

export async function PUT(req) {
    const reqBody = await req.json();
    const { word: rawWord, sentence, note, translations} = reqBody;
    const word = rawWord.trim();
    try {
        await sql`update words set sentence=${sentence}, note=${note}, translations=${translations}, audio=null where word = ${word} `;
        createNewTts(reqBody);
        return NextResponse.json({ result:'ok'}, { status: 200 })
    }
    catch (error) {
      console.log(error,'error')
      return NextResponse.json({ error }, { status: 500 });
    }
}


const createWordExample = async (word)=> {
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
        fs.appendFileSync('error.txt', `${query.word} \n`);
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

export async function POST(req) {
    const reqBody = await req.json();
    // 是否可以修改word
    const { word: rawWord, sentence, note, translations, audio} = reqBody;
    const word = rawWord.trim();
    const due_date = +new Date();
    try {
        await sql`insert into words (word, sentence, note, translations, audio, Due_date, Period) VALUES (${word}, ${sentence}, ${note}, ${translations}, ${audio}, ${due_date}, 1)`;
        await sql``
        return NextResponse.json({ result:'ok'}, { status: 200 })
    }
    catch (error) {
      console.log(error,'error')
      return NextResponse.json({ error }, { status: 500 });
    }
}



