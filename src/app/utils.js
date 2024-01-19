import useSWR from "swr";
import { useState } from "react";

const fetcher = (args) => fetch(args.url, args).then((res) => res.json());

const exampleJSON  = JSON.stringify({ "word": "acclimated",
"pronunciation": "/əˈklaɪmətid/",
"translation_word": "适应",
"sentence": "The hikers acclimated to the high altitude gradually, allowing them to enjoy the mountain views without experiencing altitude sickness.",
"translation": "这些徒步旅行者逐渐适应了高海拔，使他们能够在不出现高原反应的情况下欣赏山景。"});

export const formatData = (data)=> {
  const jsonString = data.text;

    // 从字符串中提取JSON部分
  const jsonStartIndex = jsonString.indexOf('{');
  const jsonEndIndex = jsonString.lastIndexOf('}');
  const jsonContent = jsonString.substring(jsonStartIndex, jsonEndIndex + 1);

  // 解析JSON
  try {
    const jsonObject = JSON.parse(jsonContent);
    return jsonObject;
  } catch (error) {
    return null;
  }
}

export const useCreateWordExample = (word, shouldFetch) => {
  // const [currentData, setCurrentData] = useState(null);
  const { data, error, isLoading } = useSWR(shouldFetch ? {
    url: '/api/translate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userPrompt: `给出这个单词${word}的音标，中文翻译，给出一个英文例句和他的例句中文翻译，以json的形式返回,输出格式为 ${exampleJSON}`})
  }: null, fetcher);
    return {
        data,
        isLoading,
        error,
    };
};

export const periods = [0,1,2,4,7,15,30,60,120,240,480,960]
