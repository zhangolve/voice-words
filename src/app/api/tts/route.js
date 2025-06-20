// npm install microsoft-cognitiveservices-speech-sdk
// https://learn.microsoft.com/en-us/azure/developer/javascript/tutorial/convert-text-to-speech-cognitive-services

// import sdk from 'microsoft-cognitiveservices-speech-sdk';
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
// import { put } from '@vercel/blob'; little storage

import { NextRequest, NextResponse } from "next/server";

import { Buffer } from "buffer";
import { PassThrough } from "stream";
import fs from "fs";
import bucket from "./bucket";

/**
 * Node.js server code to convert text to speech
 * @returns stream
 * @param {*} key your resource key
 * @param {*} region your resource region
 * @param {*} text text to convert to audio/speech
 * @param {*} filename optional - best for long text - temp file for converted speech/audio
 */
const textToSpeech = async (key, region, text, filename) => {
  const { english, chinese } = text;
  // convert callback function to promise
  const englishPromise = new Promise((resolve, reject) => {
    const englishSpeechConfig = sdk.SpeechConfig.fromSubscription(key, region);
    englishSpeechConfig.speechSynthesisOutputFormat = 5; // mp3
    englishSpeechConfig.speechSynthesisVoiceName = "en-US-JaneNeural";
    const englishSynthesizer = new sdk.SpeechSynthesizer(englishSpeechConfig);

    englishSynthesizer.synthesisCompleted = (s, e) => {
      if (e.result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("English speech synthesis completed");
        resolve(e.result.audioData);
      } else {
        console.error("English synthesis failed:", e.result.reason);
        reject(e.result.reason);
      }
    };

    console.log("Start synthesizing English...");
    englishSynthesizer.speakTextAsync(english);
  });

  // Convert Chinese text to speech
  const chinesePromise = new Promise((resolve, reject) => {
    const chineseSpeechConfig = sdk.SpeechConfig.fromSubscription(key, region);
    chineseSpeechConfig.speechSynthesisOutputFormat = 5; // mp3
    chineseSpeechConfig.speechSynthesisVoiceName = "zh-CN-XiaochenNeural";
    const chineseSynthesizer = new sdk.SpeechSynthesizer(chineseSpeechConfig);

    chineseSynthesizer.synthesisCompleted = (s, e) => {
      if (e.result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("Chinese speech synthesis completed");
        resolve(e.result.audioData);
      } else {
        console.error("Chinese synthesis failed:", e.result.reason);
        reject(e.result.reason);
      }
    };

    console.log("Start synthesizing Chinese...");
    chineseSynthesizer.speakTextAsync(chinese);
  });

  // Wait for both promises to resolve
  const [englishAudio, chineseAudio] = await Promise.all([
    englishPromise,
    chinesePromise,
  ]);

  // Combine English and Chinese audio
  const combinedAudio = Buffer.concat([
    Buffer.from(englishAudio),
    Buffer.from(chineseAudio),
  ]); // Code to combine audio files
  // Save combined audio to file
  console.log(`Audio will be saved to ${filename}`);
  fs.writeFileSync(filename, combinedAudio);
  console.log(`Audio saved to ${filename}`);
};

export async function POST(req) {
  console.log("Received request for TTS");
  const reqBody = await req.json();
  const { text, word } = reqBody;
  const key = process.env.AZURE_KEY;
  const region = process.env.AZURE_REGION;
  const now = +new Date();
  const fileName = `${word.replace(" ", "_")}-${now}.mp3`;
  const filePath =
    process.env.VERCEL_ENV !== "development"
      ? `/tmp/${fileName}`
      : `temp/${fileName}`;
  await textToSpeech(key, region, text, filePath);
  console.log("filePath", filePath);
  const blob = await bucket.uploadFile(
    filePath,
    fileName,
    undefined,
    "audio/mpeg",
  );

  return NextResponse.json(blob);
}

export async function GET(req) {
  console.log(await bucket.listObjects(10));
  return NextResponse.json({ result: "ok" });
}
