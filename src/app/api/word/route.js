import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

async function createNewTts(query) {
    const res = await fetch(process.env.URL +'/api/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userPrompt: `翻译这个句子为中文：${query.sentence}`})
        })
        const data = await res.json();  
        const ttsRes = await fetch(process.env.URL +'/api/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: `${query.word}, ${query.word}, ${query.sentence}, ${data.text}`, word:query.word })
        })  
        const ttsData = await ttsRes.json();
        console.log('finish')
        await sql`UPDATE words SET audio = ${ttsData.objectKey} WHERE word = ${query.word};`;
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



