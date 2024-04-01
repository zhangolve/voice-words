import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import pRetry, {AbortError} from 'p-retry';
import fs from 'fs'
import bucket from '../tts/bucket';

const filePath = process.env.VERCEL_ENV !== 'development'? `/tmp`:`temp` ;


async function setKv(key, value) {
    await fetch(`${process.env.voice_words_REST_API_URL}/set/${key}/${value}`, {
        headers: {
            Authorization: `Bearer ${process.env.voice_words_REST_API_TOKEN}`
        }
    })
}


function downloadFile(url, destination) {

    return new Promise((resolve, reject) => {
        if(fs.existsSync(destination)){
            resolve();
        }
        console.log( `curl -o ${destination} ${url}`)
        exec(`curl -o ${destination} ${url}`, (error) => {
            if (error) {
                // throw new AbortError('666');
            } else {
                resolve();
            }
        });
    });
}

// 合并文件
function concatFiles(fileList, outputFile) {
    if(fs.existsSync(outputFile)){
        return;
    }
    return new Promise((resolve, reject) => {
        console.log(`ffmpeg -i "concat:${fileList.join('|')}" -acodec copy ${outputFile}`)
        exec(`ffmpeg -i "concat:${fileList.join('|')}" -acodec copy ${outputFile}`, (error) => {
            if (error) {
                // console.log(error,'error')
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

// 下载并合并文件
async function downloadAndConcat(objectKeys, outputFile) {
    const urls = objectKeys.map(url =>`https://r2.hktkdy.com/${encodeURIComponent(url).replaceAll("'",'%27')}`);

    const files = [];

    for (let i = 0; i < urls.length; i++) {
        const file = objectKeys[i];
        console.log('download')
        const fileName = `${filePath}/${file.replaceAll(' ','_')}`
        const run = async () =>{
            await downloadFile(urls[i], fileName);
        }
        await pRetry(run, {retries: 5})
        files.push(fileName);
    }
    console.log('prepare to concat',files,outputFile)
    await concatFiles(files, outputFile);

    // 删除下载的文件
    // files.forEach(file => fs.unlinkSync(file));
}

export const dynamic = 'force-dynamic';

export async function GET(req) {
    const currentDate = new Date();

    // 设置时间为今天的最后时刻（23:59:59）
    currentDate.setHours(23, 59, 59, 999);

    // 获取时间戳
    const endOfDayTimestamp = currentDate.getTime();
    const result = await sql`select audio from words where due_date < ${endOfDayTimestamp} and audio is not null order by due_date`;
    const objectKeys = result.rows.map(row => row.audio);
    const outputFileName = `${endOfDayTimestamp}-concat.mp3`;
    try {
        const outputFile = `${filePath}/${outputFileName}`
        await downloadAndConcat(objectKeys, outputFile);
        console.log(outputFile, outputFileName, undefined ,"audio/mpeg")
        await bucket.uploadFile(outputFile, outputFileName, undefined ,"audio/mpeg");
        // fs.unlinkSync(outputFile)
        await setKv("concated_audio", outputFileName);
        return NextResponse.json({ message: 'Success',outputFileName }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    // const session = await kv.get("user_1_session");
}