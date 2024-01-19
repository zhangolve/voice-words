export async function GET(req) {
    const reqBody = await req.json();
    const { text,word } = reqBody;
    const key = process.env.AZURE_KEY;
    const region = process.env.AZURE_REGION;
    const fileName = `${word}.mp3`;
    const filePath = process.env.VERCEL_ENV !== 'development'? `/tmp/${fileName}`:`temp/${fileName}` ;
    await textToSpeech(key, region, text, filePath);
    const blob = await bucket.uploadFile(filePath, fileName, undefined ,"audio/mpeg");
    return NextResponse.json(blob);
}