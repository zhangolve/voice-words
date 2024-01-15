// npm install microsoft-cognitiveservices-speech-sdk
// https://learn.microsoft.com/en-us/azure/developer/javascript/tutorial/convert-text-to-speech-cognitive-services


import sdk from 'microsoft-cognitiveservices-speech-sdk';
import { Buffer } from 'buffer';
import { PassThrough } from 'stream';
import fs from 'fs';

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
                    
                    // return stream from memory
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


// https://vercel.com/zhangolve/voice-words/stores/blob/store_AHXYVZntTmQx1RNq/guides


const transform = async (word, text) => {
    // const { text } = req.body;
    const key = process.env.AZURE_KEY;
    const region = process.env.AZURE_REGION;
    const filename = `${word}.mp3}`;
    const stream = await textToSpeech(key, region, text, filename);
    res.setHeader('Content-Type', 'audio/mpeg');
    stream.pipe(res);
}


// const migrate = async () => {

// }


export default transform;