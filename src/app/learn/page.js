"use client";
import { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";
import Buttons from "../components/Buttons";
import { good, retry, master, currentWordAtom } from "./utils";
import { useAtom } from "jotai";
import ExportButton from "./ExportBtn";

const Review = () => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useAtom(currentWordAtom);

  const fetchNewData = () => {
    fetch("/api/due-date-words", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setWords(data.result);
      })
      .catch((err) => console.log(err));
  };

  const onSave = (word) => {
    fetch("/api/word", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(word),
    })
      .then((res) => res.json())
      .then((data) => {
        fetchNewData();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchNewData();
  }, []);

  useEffect(() => {
    if (!words?.length) {
      setCurrentWord(null);
      return;
    }
    setCurrentWord(words[0]);
  }, [setCurrentWord, words]);

  const onRetry = async () => {
    await retry(currentWord.word);
    setWords(words.slice(1));
  };

  const onGood = currentWord?.nextPeriod
    ? async () => {
        await good(currentWord.word, currentWord.nextPeriod);
        setWords(words.slice(1));
      }
    : null;

  const onMaster = async () => {
    await master(currentWord.word);
    setWords(words.slice(1));
  };

  console.log(words,'words')

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ExportButton words={words}/>
      {currentWord && (
        <div className="review">
          <ReviewCard
            word={currentWord}
            key={currentWord.word}
            onSave={onSave}
          />
          {/* <audio src={`${process.env.R2_DOMAIN}/${currentWord.audio}`} controls></audio> */}
          <Buttons {...{ onRetry, onGood, onMaster }} />
        </div>
      )}
      {!currentWord && <div>no more words</div>}
    </main>
  );
};

export default Review;
