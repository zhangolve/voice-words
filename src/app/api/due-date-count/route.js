import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

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
        const result = await sql`select COUNT(*) from words where due_date < ${timestamp};`;
        return NextResponse.json({ result:result.rows[0].count}, { status: 200 })
    }
    catch (error) {
      console.log(error,'error')
      return NextResponse.json({ error }, { status: 500 });
    }

}