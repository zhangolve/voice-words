"use client"
import { useEffect, useState } from 'react'


export default function Home() {
  const [word, setWord] = useState('')
  const [data, setData] = useState(null)
  useEffect(() => {
    if(!word) {
      return ;
    } 
    fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userPrompt: `给出这个单词${word}的音标，给出一个英文例句和他的例句中文翻译，以json的形式返回` })
    })
      .then(res => res.json())
      .then(data => {
        
        const jsonString = data.text;

        // 从字符串中提取JSON部分
        const jsonStartIndex = jsonString.indexOf('{');
        const jsonEndIndex = jsonString.lastIndexOf('}');
        const jsonContent = jsonString.substring(jsonStartIndex, jsonEndIndex + 1);

        // 解析JSON
        try {
          const jsonObject = JSON.parse(jsonContent);
          console.log(jsonObject);
        } catch (error) {
          console.error('JSON解析出错：', error.message);
        }

        console.log(data); setData(data.text.replace('`',''))
      })
      .catch(err => console.log(err))
    // fetch('/api/tts', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ text: 'Hello, my name is' })
    // })
      // .then(res => res.json())
      // .then(data => console.log(data))
      // .catch(err => console.log(err))
  }, [word])  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      hello world
      <input onChange={(e)=>setWord(e.target.value)}/>
      {data?.text}
    </main>
  )
}
