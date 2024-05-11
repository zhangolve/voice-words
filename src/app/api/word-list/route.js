// 先不做自定义word list
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 使用psql没有问题，使用这种nodejs的就不行。不知道为什么。
    // const result = await sql`COPY vocabulary_for_ielts (word, translations)
    // FROM './liuhongbo_IELTS.csv'
    // DELIMITER ','
    // CSV HEADER;`
    const result = await sql`select * from vocabulary_for_ielts`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
