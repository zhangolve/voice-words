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
- 生成tts， 异步任务， 生成后保存到数据库
- 部署到docker上。
- 词组的处理
- 用上了新的vps


# todo

2025.7.4

- 删除过期的audio，如果新生成了audio。。
- 有一个job，每天同步words 到vocabulary_for_ielts,现在是手动的，可以自动化，也可以做到UI里
- https://github.com/TeaByte/telegram-auth-nextjs 集成telegram 。。
- 单词加标签，通过加标签，将单词分组，然后可以根据标签进行搜索。
- 修改内容，点击卡片cancel，结果内容被保存了，当时看还是修改过的。不是很好改！！可以引入状态管理解决。
- 标签页的名字，title,可以修改。
- 笔记是一个rtf，这样可以放图片。。 
- 调整正确的例句中文翻译。。
- badge， 根据level，不同的颜色。search的时候也标记出来，可以去将原来已经明确记得的单词改成0天。
- https://github.com/changhongzi/BNC_COCA_EN2CN?tab=readme-ov-file  词频表，重要性，有些认识即可，有些要重点记忆。
- potion 有问题，改了句子，语音没有同步做修改。
- 数据统计,有趣的分析??!!是不是有点花里胡哨。。
- 移动端样式，侧拉菜单效果
- 或许可以有一个mastered 再次巩固的tab
- 给出中文写出合适的英文。。。、在添加笔记的过程中，输入+- 的问题。
- voice-words，大小写不敏感。。词语关联等。

# docker build -t .

Build your container: docker build -t nextjs-docker .
Run your container: docker run -p 3000:3000 nextjs-docker

add .env docker

可以使用test/test测试


