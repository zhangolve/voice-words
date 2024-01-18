"use client"
import {useEffect, useState} from 'react';
import ReviewCard from '../components/ReviewCard'
import Buttons from '../components/Buttons'
import {good, retry, master} from './utils'

const Review = () => {
    const [words, setWords] = useState([])
    const [currentWord, setCurrentWord] = useState()
    useEffect(()=>{
        fetch('/api/due-date-words', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setWords(data.result)
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(()=>{
        setCurrentWord(words[0])
    },[words])

    const onRetry = async () => {
        await retry(currentWord.word);
        console.log('09999')
        setWords(words.slice(1))
    }

    const onGood = async () => {
        await good(currentWord.word, currentWord.nextPeriod);
        setWords(words.slice(1))
    }

    const onMaster = async () => {
        await master(currentWord.word);
        setWords(words.slice(1))
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {currentWord &&
            <div className='review'>
                <ReviewCard word={currentWord} key={currentWord.word}/>
                <Buttons {...{onRetry,onGood, onMaster}}/>
            </div>
            }
            </main>
    )

}

export default Review;