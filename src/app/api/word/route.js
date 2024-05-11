import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { createNewTts } from "../utils";

export async function GET(req) {
  try {
    const { word: sqlWord } = Object.fromEntries(req.nextUrl.searchParams);
    if (sqlWord) {
      const word = await sql`select * from words where word = ${sqlWord}`;
      return NextResponse.json({ word: word.rows[0] }, { status: 200 });
    } else {
      const words = await sql`select * from words`;
      return NextResponse.json(words, { status: 200 });
    }
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(req) {
  const reqBody = await req.json();
  const { word: rawWord, sentence, note, translations } = reqBody;
  const word = rawWord.trim();
  try {
    const previousResult = await sql`select * from words where word = ${word} `;
    const previousData = previousResult.rows[0];
    if (previousData.sentence && previousData.sentence == sentence) {
      await sql`update words set note=${note}, translations=${translations} where word = ${word} `;
    } else {
      await sql`update words set sentence=${sentence}, note=${note}, translations=${translations}, audio=null where word = ${word} `;
      createNewTts(reqBody);
    }
    return NextResponse.json({ result: "ok" }, { status: 200 });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req) {
  const reqBody = await req.json();
  // 是否可以修改word
  const {
    word: rawWord,
    sentence,
    note,
    translations,
    audio,
    pronunciation,
  } = reqBody;
  const word = rawWord.trim();
  const due_date = +new Date();
  try {
    await sql`insert into words (word, sentence, note, translations, audio, Due_date, Period,pronunciation) VALUES (${word}, ${sentence}, ${note}, ${translations}, ${audio}, ${due_date}, 1, ${pronunciation})`;
    await sql``;
    return NextResponse.json({ result: "ok" }, { status: 200 });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ error }, { status: 500 });
  }
}
