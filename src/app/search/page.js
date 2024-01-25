"use client"
import { useEffect, useState } from 'react'
import { useCreateWordExample, formatData } from '../utils';
import SearchBar from './SearchInput';
import ReviewCard from '../components/ReviewCard';

export default function Search() {
  const [word, setWord] = useState('')

  const [data, setData] = useState(null)
  const { data: example, error, isLoading, setShouldFetch } = useCreateWordExample(word);


  const submit = (word) => {
    if(!word) {
      return ;
    } 
    fetch(`/api/word?word=${word}`)
      .then(res => res.json())
      .then(data => {
        if(data?.word) {
          setData(data.word)
        } else {
          setShouldFetch(true)
        }
      })
      .catch(err => console.log(err))
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
        .then(ttsData => {setData({...data, audio: ttsData.objectKey})})
        .catch(err => console.log(err))
    }

    if(data?.word) {
      createTTS()
    }
  }, [data?.sentence])
  
  useEffect(()=>{
      if(example?.text) {
          const rurrentContent = formatData(example) || {}
          setData({...rurrentContent,translations: [rurrentContent.translation_word]})
      }
    }, [example])

  const submitSave =()=> {
      const method = data?.id ? 'PUT' : 'POST';
      fetch('/api/word', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
      </div>
    </main>
  )
}


