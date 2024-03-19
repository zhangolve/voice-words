// npm install microsoft-cognitiveservices-speech-sdk
// https://learn.microsoft.com/en-us/azure/developer/javascript/tutorial/convert-text-to-speech-cognitive-services


// import sdk from 'microsoft-cognitiveservices-speech-sdk';
import * as sdk from "microsoft-cognitiveservices-speech-sdk"
// import { put } from '@vercel/blob'; little storage

import { NextRequest, NextResponse } from "next/server";

import { Buffer } from 'buffer';
import { PassThrough } from 'stream';
import fs from 'fs';
import bucket from './bucket';

/**
 * Node.js server code to convert text to speech
 * @returns stream
 * @param {*} key your resource key
 * @param {*} region your resource region
 * @param {*} text text to convert to audio/speech
 * @param {*} filename optional - best for long text - temp file for converted speech/audio
 */
const textToSpeech = async (key, region, text, filename)=> {
    
    // convert callback function to promise
    return new Promise((resolve, reject) => {
        const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
        speechConfig.speechSynthesisOutputFormat = 5; // mp3
        // speechConfig.speechSynthesisVoiceName = "zh-CN-XiaochenNeural";
        speechConfig.speechSynthesisVoiceName = "en-US-JaneNeural";

        
        let audioConfig = null;
      
        
        // const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

        // 监听合成事件
        synthesizer.synthesisCompleted = (s, e) => {
            if (e.result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                console.log('语音合成完成');
        
                // 将合成的音频保存到文件
                console.log(`音频要保存到 ${filename}`);
                const buffer = Buffer.from(e.result.audioData);
                fs.writeFileSync(filename, buffer);
                console.log(`音频已保存到 ${filename}`);
                resolve();
            } else {
                console.error('合成失败:', e.result.reason);
            }
        };
        
        // 开始合成文本为语音
        console.log('开始合成...');
        synthesizer.speakTextAsync(text);
    });
        
};


export async function POST(req) {
    const reqBody = await req.json();
    const { text,word } = reqBody;
    const key = process.env.AZURE_KEY;
    const region = process.env.AZURE_REGION;
    const now = +new Date();
    const fileName = `${word.replace(' ','_')}-${now}.mp3`;
    const filePath = process.env.VERCEL_ENV !== 'development'? `/tmp/${fileName}`:`temp/${fileName}` ;
    await textToSpeech(key, region, text, filePath);
    console.log('filePath',filePath)
    const blob = await bucket.uploadFile(filePath, fileName, undefined ,"audio/mpeg");
    return NextResponse.json(blob);
}


