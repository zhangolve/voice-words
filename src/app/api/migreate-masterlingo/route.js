// use azure or google genomi to get data.
// use azure tts to create audio 

// send post request to  https://api.masterlingo.app/graphql 

import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import rawData from './result.json'

export async function GET() {
    const words = rawData.data.getFlashcards;
    const formatData = words.map(word=> ({
      word: word.original,
      translations: word.translations,
      note: word.notes,
      sentence: word.context?.replace('_MSLINGO_W_', word.original),
      dueDate: word.dueDate,
      period: word.currentInterval,
    }))
    
    try {
      for(var i = 0; i < formatData.length; i++) {
        const query = formatData[i];
        const result = await sql`select due_date from words where word = ${query.word} LIMIT 1;`;
        console.log(query.dueDate,'due date')
        if(!result.rows[0].due_date) {
          // const res = await fetch(process.env.URL +'/api/translate', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify({ userPrompt: `翻译这个句子为中文：${query.sentence}`})
          // })
          // const data = await res.json();  
          // const ttsRes = await fetch(process.env.URL +'/api/tts', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify({ text: `${query.word}, ${query.word}, ${query.sentence}, ${data.text}`, word:query.word })
          // })  
          // const ttsData = await ttsRes.json();
          await sql`UPDATE words SET due_date = ${query.dueDate} WHERE word = ${query.word};`;
        }        
      }
    
      return NextResponse.json({ result:formatData.length}, { status: 200 })
    }
    catch (error) {
      console.log(error,'error')
      return NextResponse.json({ error }, { status: 500 });
    }

}