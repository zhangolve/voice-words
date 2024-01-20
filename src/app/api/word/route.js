import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

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
    console.log(`${query.word}, ${query.word}, ${query.sentence}, ${translation}`,'9999999')
        const ttsRes = await fetch(process.env.URL +'/api/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: `${query.word}, ${query.word}, ${query.sentence}, ${translation}`, word:query.word })
        })  
        const ttsData = await ttsRes.json();
        console.log('finish')
        await sql`UPDATE words SET audio = ${ttsData.objectKey} WHERE word = ${query.word};`;
}


export async function GET() {
    try {
        const words = await sql`select * from words`;
        return NextResponse.json(words, { status: 200 })
    }
    catch (error) {
      console.log(error,'error')
      return NextResponse.json({ error }, { status: 500 });
    }
}

export async function PUT(req) {
    const reqBody = await req.json();
    // 是否可以修改word
    const { word, sentence, note, translations} = reqBody;
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


export async function POST(req) {
    const reqBody = await req.json();
    // 是否可以修改word
    const { word, sentence, note, translations, audio} = reqBody;
    const due_date = +new Date();
    try {
        await sql`insert into words (word, sentence, note, translations, audio, due_date，period) values (${word}, ${sentence}, ${note}, ${translations}, ${audio},${due_date}, 1)`;
        return NextResponse.json({ result:'ok'}, { status: 200 })
    }
    catch (error) {
      console.log(error,'error')
      return NextResponse.json({ error }, { status: 500 });
    }
}



