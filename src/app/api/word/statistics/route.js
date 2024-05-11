import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const word = await sql`SELECT period, COUNT(*) AS count
        FROM words
        GROUP BY period ORDER BY period;`;
    return NextResponse.json(
      {
        result: word.rows.map(({ period, count }) => ({
          period,
          count: Number(count) ?? count,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ error }, { status: 500 });
  }
}
