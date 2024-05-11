import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const result = await sql`CREATE TABLE words (
        id SERIAL PRIMARY KEY,
        word VARCHAR(255) NOT NULL,
        translations VARCHAR(255)[] NOT NULL,
        note TEXT,
        due_date DATE,
        sentence TEXT,
        period INTEGER,
        audio VARCHAR(255)
    );`;
    // {word: 'apple', translations: ['苹果'], note: '',dueDate: '',sentence: 'This is a apple.', period: 1, audio: 'name'}
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// write the postgreSQL query to create a table
// https://www.postgresqltutorial.com/postgresql-create-table/
