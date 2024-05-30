"use client";
import { useEffect, useState, useRef } from "react";
import { useCreateWordExample } from "../utils";
import SearchBar from "./SearchInput";
import ReviewCard from "@/components/ReviewCard";
import { useMySWR } from "@/utils";
import { usePrevious } from "@/hooks";
import { good, retry, master, currentWordAtom } from "../learn/utils";
import Buttons from "@/components/Buttons";

/*

由于没有把例句的中文翻译存储到数据库中,则如果改变了例句内容,则翻译就找不到了,我们的翻译是undefined,这是显然不对的. 所以我们需要重新生成翻译,又会有新的问题.

*/
export default function Search() {
  const [word, setWord] = useState("");
  const inputRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const prevAudioContent = usePrevious(data?.word + data?.sentence);
  const {
    data: example,
    error,
    isLoading,
    setShouldFetch,
  } = useCreateWordExample(word);
  const {
    data: wordData,
    mutate,
    error: wordError,
    isLoading: wordIsLoading,
  } = useMySWR({ url: word ? `/api/word?word=${word}` : null });

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (word && wordData) {
      console.log(wordData, "wordData");
      if (wordData.word) {
        setData(wordData.word);
        setShowButtons(true);
      } else {
        setShouldFetch(true);
        setShowButtons(false);
      }
    }
  }, [wordData, word, setShouldFetch]);

  useEffect(() => {
    const createTTS = () => {
      fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: {
            english: `${data.word}, ${data.word}, ${data.sentence}`,
            chinese: `${data.translation}`,
          },
          word: data.word,
        }),
      })
        .then((res) => res.json())
        .then((ttsData) => {
          setData({ ...data, audio: ttsData.objectKey });
        })
        .catch((err) => console.log(err));
    };

    // audio文本 和 sentence 文本不一致,也要重新生成
    console.log(prevAudioContent, data?.word + data?.sentence);
    // if (data?.word && prevAudioContent !== data?.word + data?.sentence) {
    if (data?.word && !data.audio) {
      createTTS();
    }
  }, [data, prevAudioContent]);

  useEffect(() => {
    if (example?.word) {
      const rurrentContent = example;
      setData({
        ...rurrentContent,
        translations: [rurrentContent.translation_word],
      });
    }
  }, [example]);

  const submitSave = (data) => {
    const method = data?.id ? "PUT" : "POST";
    fetch("/api/word", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        mutate({ word: data });
      })
      .catch((err) => console.log(err));
  };

  const onRetry = async () => {
    await retry(word);
    setShowButtons(false);
  };

  const onMaster = async () => {
    await master(word);
    setShowButtons(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div>
        <SearchBar
          handleSearch={(e) => {
            e.preventDefault();
            const currentWord = inputRef.current.value;

            if (currentWord) {
              setWord(currentWord);
              setLoading(true);
            }
          }}
          inputRef={inputRef}
        />
        {(data || loading) && <ReviewCard word={data} onSave={submitSave} />}
        {showButtons && <Buttons {...{ onRetry, onGood: null, onMaster }} />}
      </div>
    </main>
  );
}
