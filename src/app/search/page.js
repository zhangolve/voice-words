"use client"
import { useEffect, useState } from 'react'

const exampleJSON  = JSON.stringify({ "word": "acclimated",
"pronunciation": "/əˈklaɪmətid/",
"example": "The hikers acclimated to the high altitude gradually, allowing them to enjoy the mountain views without experiencing altitude sickness.",
"translation": "这些徒步旅行者逐渐适应了高海拔，使他们能够在不出现高原反应的情况下欣赏山景。"});



export default function Search() {
  const [word, setWord] = useState('')
  const [data, setData] = useState(null)
  const [blob, setBlob] = useState(null)


  const submit = () => {
    if(!word) {
      return ;
    } 

    fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userPrompt: `给出这个单词${word}的音标，给出一个英文例句和他的例句中文翻译，以json的形式返回,输出格式为 ${exampleJSON}`})
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
          setData(jsonObject)
        } catch (error) {
          console.error('JSON解析出错：', error.message);
        }

      })
      .catch(err => console.log(err))
  }
  
  const createTTS = () => {
    fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: `${word}, ${word}, ${data.example}, ${data.translation}`, word })
        })
          .then(res => res.json())
          .then(data => {console.log(data);setBlob(data)})
          .catch(err => console.log(err))
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <input onChange={(e)=> {  
          // debounce 
        setWord(e.target.value)
      }} className=''/> <button onClick={submit} className='submit'>submit</button>
      {data?.example}
      {data?.example && <button onClick={createTTS}>create tts</button>}
      {blob && <audio src={`${blob.publicUrl}`} controls></audio>}
    </main>
  )
}
