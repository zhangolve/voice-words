import { R2, Bucket } from 'node-cloudflare-r2';


// extends R2 instance

// @aws-sdk/client-s3
// https://github.com/f2face/cloudflare-r2/blob/main/src/R2.ts

class NewBucket extends Bucket {
    async listObjects(maxResults = 1000, continuationToken, prefix) {
        const result = await this.r2.listObjectsV2({
            Bucket: this.name,
            MaxKeys: maxResults,
            ContinuationToken: continuationToken,
            Prefix: prefix
        });
    
        return {
            objects:
                result.Contents?.map((content) => {
                    const {
                        Key: key,
                        LastModified: lastModified,
                        ETag: etag,
                        ChecksumAlgorithm: checksumAlgorithm,
                        Size: size,
                        StorageClass: storageClass,
                    } = content;
                    return {
                        key,
                        lastModified,
                        etag,
                        checksumAlgorithm,
                        size,
                        storageClass,
                    };
                }) || [],
            continuationToken: result.ContinuationToken,
            nextContinuationToken: result.NextContinuationToken,
        };
    }
}

const r2 = new R2({
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
});

r2.bucket = (name) => new NewBucket(r2.r2, name,r2.endpoint);
const bucket = new NewBucket(r2.r2, 'word-voice',r2.endpoint)// r2.bucket('word-voice');

// Set your bucket's public URL
bucket.provideBucketPublicUrl('https://pub-fe41e95858cc483d810d17b182efd9c7.r2.dev');

export default bucket;