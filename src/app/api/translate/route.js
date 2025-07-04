import { NextResponse } from "next/server";

import { translate } from "../utils";

export async function POST(req) {
  console.log(req, "req");
  const reqBody = await req.json();
  const { userPrompt } = reqBody;
  const text = await translate(userPrompt);
  console.log(text, "text");
  if (text) {
    return NextResponse.json({
      text,
    });
  }
  return NextResponse.json({
    text: "Unable to process the prompt. Please try again.",
  });
}
