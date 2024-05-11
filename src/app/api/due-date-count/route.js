import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

const getTimestampForTomorrow = () => {
  // 获取当前日期
  const today = new Date();

  // 创建一个新的日期对象，代表明天
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // 设置明天的时间为 00:00:00
  tomorrow.setHours(0, 0, 0, 0);

  // 获取明天的结束时间，即明天的开始时间加上一天的毫秒数减一
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(23, 59, 59, 999);

  // 转换成时间戳
  const tomorrowStartTimestamp = tomorrow.getTime();
  const tomorrowEndTimestamp = tomorrowEnd.getTime();
  return { tomorrowStartTimestamp, tomorrowEndTimestamp };
};

export async function GET(req) {
  try {
    let timestamp;
    const { now } = Object.fromEntries(req.nextUrl.searchParams);
    if (!now) {
      timestamp = new Date().getTime();
    } else {
      timestamp = Number(now);
    }
    const { tomorrowStartTimestamp, tomorrowEndTimestamp } =
      getTimestampForTomorrow();

    const result =
      await sql`select COUNT(*) from words where due_date < ${timestamp};`;
    const result2 =
      await sql`select COUNT(*) from words where due_date between ${tomorrowStartTimestamp} and ${tomorrowEndTimestamp};`;
    return NextResponse.json(
      {
        result: { now: result.rows[0].count, tomorrow: result2.rows[0].count },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ error }, { status: 500 });
  }
}
