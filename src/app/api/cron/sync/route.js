import { NextResponse } from 'next/server'
import { createWordExample, createNewTts, getMissingData } from '../../utils' 
import { sql } from '@vercel/postgres';



export async function GET(req) {
    try {
        let timestamp;
        const { now } = Object.fromEntries(req.nextUrl.searchParams);
        if(!now) {
            timestamp = new Date().getTime();
        }
        else {
            timestamp = Number(now);
        }
        const missingSentenceWordsResult = await sql`SELECT * FROM words WHERE sentence IS NULL`;
        const missingSentenceWords = missingSentenceWordsResult.rows;
        // 补全sentence
        for(var i = 0; i < missingSentenceWords.length; i++) {
            const word = missingSentenceWords[i].word;
            const {data, ttsData} = await createWordExample(word);
            const translations = missingSentenceWords[i].translations || [translation_word]
            const due_date = missingSentenceWords[i].due_date || +new Date();
            console.log(data,'data')
            if(data) {
                await sql`update words set sentence=${data.sentence},translations=${translations}, period=1, audio=${ttsData.objectKey}, due_date=${due_date} where word = ${word} `;
            }
        }
        const missingAudioWordsResult = await sql`select * from words where audio is NULL and sentence is not NULL`;
        const missingAudioWords = missingAudioWordsResult.rows;
        for(var i = 0; i < missingAudioWords.length; i++) {
            await createNewTts(missingAudioWords[i]);
        }
        return NextResponse.json({
            result: {
                missingAudioWords: missingAudioWords.length, 
                missingSentenceWords: missingSentenceWords.length,
                timestamp,
            }}, { status: 200 })
    }
    catch (error) {
      console.log(error,'error')
      return NextResponse.json({ error }, { status: 500 });
    }
}