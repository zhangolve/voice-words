import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

const periods = [0, 1, 2, 4, 7, 15, 30, 60, 120, 240, 480, 960];

export async function GET() {
  try {
    const now = +new Date();
    const result =
      await sql`select * from words where due_date < ${now} order by due_date `; //LIMIT 10;
    const adjustedData = result.rows.map((item) => {
      const currentPeriod = item.period < 1000 ? item.period : 0;
      const nextPeriod = periods.indexOf(currentPeriod) + 1;
      return {
        ...item,
        period: item.period < 1000 ? item.period : 0,
        nextPeriod: periods[nextPeriod],
      };
    });
    return NextResponse.json({ result: adjustedData }, { status: 200 });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(req) {
  const reqBody = await req.json();
  const { word, due_date, period } = reqBody;
  try {
    await sql`update words set due_date=${due_date}, period=${period} where word = ${word} `;
    return NextResponse.json({ result: due_date }, { status: 200 });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ error }, { status: 500 });
  }
}
