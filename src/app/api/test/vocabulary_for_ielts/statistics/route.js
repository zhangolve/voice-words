// 先不做自定义word list
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await sql`SELECT
        COUNT(CASE WHEN mastered IS TRUE THEN 1 END) AS mastered,
        COUNT(CASE WHEN mastered IS FALSE THEN 1 END) AS learning,
        COUNT(CASE WHEN mastered IS NULL THEN 1 END) AS ready
    FROM vocabulary_for_ielts;`;
    return NextResponse.json({ result: result.rows[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
