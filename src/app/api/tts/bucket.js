import { R2 } from 'node-cloudflare-r2';

const r2 = new R2({
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
});

const bucket = r2.bucket('word-voice');

// Set your bucket's public URL
bucket.provideBucketPublicUrl('https://pub-fe41e95858cc483d810d17b182efd9c7.r2.dev');

export default bucket;