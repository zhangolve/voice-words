"use client"
import {useEffect, useState} from 'react';
import ReviewCard from '../components/ReviewCard'
import Buttons from '@/components/Buttons'
import { retry, master} from './utils'
import { useMySWR } from "@/utils";
import Loading from '@/components/Loading'


const Review = () => {
    const [words, setWords] = useState([])
    const [currentWord, setCurrentWord] = useState()
    const {data, error, isLoading} = useMySWR({url:'/api/test/vocabulary_for_ielts'})

    useEffect(()=>{
        if(!data) return;
        setWords(data.result);
    }, [data])

    useEffect(()=>{
        setCurrentWord(words[0])
    },[words])

    const onRetry = async () => {
        await retry(currentWord);
        setWords(words.slice(1))
    }

    const onMaster = async () => {
        await master(currentWord);
        setWords(words.slice(1))
    }

    if(isLoading) return <Loading />

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {currentWord &&
            <div className='review'>
                <ReviewCard word={currentWord} key={currentWord.word} />
                <Buttons {...{onRetry, onMaster}}/>
            </div>
            }
            {
                !currentWord && <div>no more words</div>
            }
            </main>
    )

}

export default Review;