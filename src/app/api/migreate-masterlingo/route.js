// use azure or google genomi to get data.
// use azure tts to create audio 

// send post request to  https://api.masterlingo.app/graphql 

import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import rawData from './result.json'

export async function GET() {
    // send post request to  https://api.masterlingo.app/graphql
    const words = rawData.data.getFlashcards;
    
    // sql`INSERT INTO Pets (Name, Owner) VALUES (${petName}, ${ownerName});`
    // if (!res.ok) {
    //     // This will activate the closest `error.js` Error Boundary
    //     // throw new Error('Failed to fetch data')
    //     // return 'error'
    //     return NextResponse.json({ error: 'ERROR' }, { status: 500 });
    //   }

  // period type = [1,2,4,7,15,30,60,120,240,480,960]

    // const formatData = words.map(({original,translations,notes,context,due_date,currentInterval })=>`("${original}", ARRAY['${translations.toString()}'], "${notes}", "${context?.replace('_MSLINGO_W_', original)}", ${due_date}, ${currentInterval})`);

    // const formatData = words.map(({original,translations,notes,context,due_date,currentInterval })=>`("${original}", ARRAY['${translations.toString()}'], "${notes}", "${context?.replace('_MSLINGO_W_', original)}", ${due_date}, ${currentInterval})`);

    const formatData = words.map(word=> ({
      word: word.original,
      translations: word.translations,
      note: word.notes,
      sentence: word.context?.replace('_MSLINGO_W_', word.original),
      dueDate: word.due_date,
      period: word.currentInterval,
    }))

    console.log(formatData,'formatData')

    try {
      for(var i = 0; i < formatData.length; i++) {
        const query = formatData[i];
        console.log(`INSERT INTO words (word, translations, note, sentence, due_date, period) VALUES (${query.word}, ARRAY${query.translations}, ${query.note}, ${query.sentence}, ${query.dueDate}, ${query.period})`,'query')

        // await sql`INSERT INTO words (word, translations, note, sentence, due_date, period) VALUES (${query.word}, ${query.translations}, ${query.note}, ${query.sentence}, ${query.dueDate}, ${query.period})`;
      }
      // await sql`INSERT INTO words (word, translations, note, sentence, due_date, period) VALUES (${query})`;
      // await sql`INSERT INTO Pets (Name, Owner) VALUES ('1', '2');`;
      return NextResponse.json({ result:formatData.length}, { status: 200 })
      // 42061 语法错误
    }
    catch (error) {
      console.log(error,'error')
      return NextResponse.json({ error }, { status: 500 });
    }

    // sql`INSERT INTO your_table_name (word, translations, note, due_date, sentence, period, audio)
    //   VALUES
    // ('apple', ARRAY['苹果'], '', NULL, 'This is an apple.', 1, 'name1'),
    // ('orange', ARRAY['橙子'], '', NULL, 'This is an orange.', 2, 'name2'),
    // ('banana', ARRAY['香蕉'], '', NULL, 'This is a banana.', 3, 'name3');
    // `

    // console.log('6666')
    // return NextResponse.json({ result:formatData }, { status: 200 })
}