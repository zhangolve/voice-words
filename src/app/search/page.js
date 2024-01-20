"use client"
import { useEffect, useState } from 'react'
import { useCreateWordExample, formatData } from '../utils';



export default function Search() {
  const [word, setWord] = useState('')
  const [data, setData] = useState(null)
  const [blob, setBlob] = useState(null)
  const { data: example, error, isLoading, setShouldFetch } = useCreateWordExample(word);


  const submit = () => {
    if(!word) {
      return ;
    } 
    setShouldFetch(true)
  }
  
  useEffect(()=>{
    console.log(example,'example')
    if(example?.text) {
        const rurrentContent = formatData(example) || {}
        setData({...rurrentContent,translations: [rurrentContent.translation_word]})
    }
}, [example])


  const createTTS = () => {
    fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: `${word}, ${word}, ${data.sentence}, ${data.translation}`, word })
        })
          .then(res => res.json())
          .then(data => {setBlob(data)})
          .catch(err => console.log(err))
  }

  const submitSave =()=> {
      fetch('/api/word', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({word, audio:blob.objectKey, ...data})
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
        })
        .catch(err => console.log(err))
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <>
        <input onChange={(e)=> {
            // debounce 
          setWord(e.target.value)
        }} />
        <button onClick={submit} className='submit'>submit</button>
        {data?.sentence}
        {data?.sentence && <button onClick={createTTS}>create tts</button>}
        {blob && <audio src={`${blob.publicUrl}`} controls></audio>}
        {blob && <button onClick={submitSave} className="mr-2 md:mr-3 flex flex-col flex-1 cursor-pointer justify-center py-2 text-xs font-semibold leading-none text-white transition duration-300 rounded-lg bg-blue-300 hover:bg-blue-400">save</button>}
      </>
    </main>
  )
}


