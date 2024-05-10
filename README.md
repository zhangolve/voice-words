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


# 已实现

- support custom sentence 
- support bulk upload 
- https://github.com/f2face/cloudflare-r2

调研一下，如何使用ffmpeg,在vercel环境下拼接视频。
- give it a try https://github.com/ffmpegwasm/ffmpeg.wasm 
- https://medium.com/@tareqaziz0065/ffmpeg-awesome-with-next-js-6580f6517660

https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/apps/nextjs-app/app/Home.tsx 前端渲染，合并多个音频。性能如何？？？！！！vercel 免费版本有限制。



- 生成tts， 异步任务， 生成后保存到数据库
-  根据情况考虑是否部署到docker上。
- https://www.npmjs.com/package/p-retry 引入它，用于错误处理
- 词组的处理

- 当前word/flashcard 的状态管理。。考虑引入 https://jotai.org/docs/core/atom, 目前倒是也没有用jotai的必要
https://swr.vercel.app/zh-CN/examples/subscription
- 用上了新的vps

- 新的单词，添加笔记，无效。


# todo


还是使用docker吧，实际只有一个有效的final.mp3文件，其他的都是临时文件，可以删除。

//是不是应该有一个单词数量限制，一次生成太多单词，会导致生成时间过长，也可能会有一些潜在的问题吧，比如占用资源比较多。另外，如何更快地利用数据也是一个问题。每一个audio也许都有默认值和自定义值。默认值其实是通用的。

search page / update page 都用到了同一个方法。。


telegram bot 
audio upload 


删除过期的audio，如果新生成了audio。。

- 有一个job，每天同步words 到vocabulary_for_ielts,现在是手动的，可以自动化，也可以做到UI里

https://github.com/TeaByte/telegram-auth-nextjs 集成telegram 。。


- 单词加标签，通过加标签，将单词分组，然后可以根据标签进行搜索。

- 修改内容，点击卡片cancel，结果内容被保存了，当时看还是修改过的。不是很好改！！可以引入状态管理解决。

- 标签页的名字，title,可以修改。
- 笔记是一个rtf，这样可以放图片。。
- 单词的关联，联想。。 
- 暂停的规则，还要加强，有时候语音播放到一半，换单词了，播放还在继续。
- 调整正确的例句中文翻译。。
- 自定义快捷键

# docker build -t .

Build your container: docker build -t nextjs-docker .
Run your container: docker run -p 3000:3000 nextjs-docker



