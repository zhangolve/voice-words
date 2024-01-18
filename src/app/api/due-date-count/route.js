import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const now = +new Date();
        const result = await sql`select COUNT(*) from words where due_date < ${now};`;
        console.log(result,'result')
        return NextResponse.json({ result:result.rows[0].count}, { status: 200 })
    }
    catch (error) {
      console.log(error,'error')
      return NextResponse.json({ error }, { status: 500 });
    }

}