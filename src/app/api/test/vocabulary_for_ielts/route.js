// 先不做自定义word list 
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        const result = await sql`SELECT *
        FROM vocabulary_for_ielts
        WHERE word NOT IN (SELECT word FROM words) and mastered is null
        ORDER BY RANDOM()
        LIMIT 10;`;
        return NextResponse.json({ result: result.rows }, { status: 200 });
    } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
    }
}


export async function PUT(request) {
    const { word, mastered, translations } = await request.json();
    console.log(mastered, word, translations, 'mastered')
    try {
        if(mastered) {
            const result = await sql`UPDATE vocabulary_for_ielts
            SET mastered = ${mastered}
            WHERE word = ${word};`;
        } else {
            const res = sql`
            WITH update_vocabulary AS (
                UPDATE vocabulary_for_ielts
                SET mastered = ${mastered}
                WHERE word = ${word}
                RETURNING word
              )
              INSERT INTO words (word, note, translations)
              SELECT word, '雅思词汇', ${[translations]}
              FROM update_vocabulary;
            `
        }
        return NextResponse.json({ result:'ok' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
