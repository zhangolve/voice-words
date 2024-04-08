"use client"
import { useEffect, useState, useRef } from 'react'
import { useCreateWordExample, formatData } from '../utils';
import SearchBar from './SearchInput';
import ReviewCard from '@/components/ReviewCard';
import { useMySWR } from "@/utils";

export default function Search() {
  const [word, setWord] = useState('')
  const inputRef = useRef(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { data: example, error, isLoading, setShouldFetch } = useCreateWordExample(word);
  const {data: wordData, error: wordError, isLoading: wordIsLoading} = useMySWR({url: word ? `/api/word?word=${word}`: null})
  
  useEffect(()=>{
    if(data) {
      setLoading(false)
    }
  }, [data])

  useEffect(()=>{
      if(word) {
        if(wordData?.word) {
          setData(wordData.word)
        } else {
          setShouldFetch(true)
        }
      }
  }, [wordData])


  useEffect(()=>{
    const createTTS = () => {
      fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: {english: `${data.word}, ${data.word}, ${data.sentence}`,chinese: `${data.translation}`}, word:data.word })
      })
        .then(res => res.json())
        .then(ttsData => {setData({...data, audio: ttsData.objectKey})})
        .catch(err => console.log(err))
    }

    if(data?.word && !data?.audio) {
      createTTS()
    }
  }, [data?.sentence])
  
  useEffect(()=>{
      if(example?.word) {
          const rurrentContent = example
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
        <SearchBar handleSearch={
          (e) => {
            e.preventDefault();
            const currentWord = inputRef.current.value;

            if(currentWord) {
              setWord(currentWord);
              setLoading(true)
            }
          }
        }
        inputRef={inputRef}
        />
        {
          (data || (loading)) && <ReviewCard word={data} onSave={submitSave} />
        }
      </div>
    </main>
  )
}


