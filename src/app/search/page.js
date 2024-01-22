"use client"
import { useEffect, useState } from 'react'
import { useCreateWordExample, formatData } from '../utils';
import SearchBar from './SearchInput';
import ReviewCard from '../components/ReviewCard';

export default function Search() {
  const [word, setWord] = useState('')
  const [data, setData] = useState(null)
  const [blob, setBlob] = useState(null)
  const { data: example, error, isLoading, setShouldFetch } = useCreateWordExample(word);


  const submit = (word) => {
    if(!word) {
      return ;
    } 
    setShouldFetch(true)
  }
  
  useEffect(()=>{
    const createTTS = () => {
      fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: `${data.word}, ${data.word}, ${data.sentence}, ${data.translation}`, word:data.word })
      })
        .then(res => res.json())
        .then(data => {setBlob(data)})
        .catch(err => console.log(err))
    }

    if(data?.word) {
      createTTS()
    }
  }, [data])
  
  useEffect(()=>{
      console.log(example,'example')
      if(example?.text) {
          const rurrentContent = formatData(example) || {}
          setData({...rurrentContent,translations: [rurrentContent.translation_word]})
      }
    }, [example])

  const submitSave =()=> {
      fetch('/api/word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audio:blob.objectKey, ...data})
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
        })
        .catch(err => console.log(err))
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div>
        <SearchBar search={word} handleSearch={
          (e) => {
            e.preventDefault();
            submit(word);
          }
        }
        setSearch={setWord}
        />
        {
          data && <ReviewCard word={data} onSave={submitSave}/>
        }
        {blob && <button onClick={submitSave} className="mr-2 md:mr-3 flex flex-col flex-1 cursor-pointer justify-center py-2 text-xs font-semibold leading-none text-white bg-blue-300 hover:bg-blue-400">save</button>}
      </div>
    </main>
  )
}


