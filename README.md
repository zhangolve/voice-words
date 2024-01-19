This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


# todo

- support custom sentence 
- support bulk upload 
- --experimental-https

- https://github.com/f2face/cloudflare-r2

调研一下，如何使用ffmpeg,在vercel环境下拼接视频。
- give it a try https://github.com/ffmpegwasm/ffmpeg.wasm 
- https://medium.com/@tareqaziz0065/ffmpeg-awesome-with-next-js-6580f6517660

https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/nextjs-app/app/Home.tsx 前端渲染，合并多个音频。性能如何？？？！！！


// 生成tts， 异步任务， 生成后保存到数据库
// 根据情况考虑是否部署到docker上。
还是使用docker吧，实际只有一个有效的final.mp3文件，其他的都是临时文件，可以删除。

//是不是应该有一个单词数量限制，一次生成太多单词，会导致生成时间过长，也可能会有一些潜在的问题吧，比如占用资源比较多。另外，如何更快地利用数据也是一个问题。每一个audio也许都有默认值和自定义值。默认值其实是通用的。

search page / update page 都用到了同一个方法。。

当前word/flashcard 的状态管理。。考虑引入 https://jotai.org/docs/core/atom
https://swr.vercel.app/zh-CN/examples/subscription


