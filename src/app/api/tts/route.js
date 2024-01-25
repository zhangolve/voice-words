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
        speechConfig.speechSynthesisVoiceName = "zh-CN-XiaochenNeural";
        
        let audioConfig = null;
        
        if (filename) {
            audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
        }
        
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
        synthesizer.speakTextAsync(
            text,
            result => {
                
                const { audioData } = result;

                synthesizer.close();
                
                if (filename) {
                    
                    // return stream from file
                    const audioFile = fs.createReadStream(filename);
                    resolve(audioFile);
                    
                } else {
                    const bufferStream = new PassThrough();
                    bufferStream.end(Buffer.from(audioData));
                    resolve(bufferStream);
                }
            },
            error => {
                synthesizer.close();
                reject(error);
            }); 
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
    const blob = await bucket.uploadFile(filePath, fileName, undefined ,"audio/mpeg");
    return NextResponse.json(blob);
}


