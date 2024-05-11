import { kv } from "@vercel/kv";
await kv.set("user_1_session", "session_token_value");
const session = await kv.get("user_1_session");
// 单词， 词组， 短语

// 艾宾浩斯记忆法 1,2,4,7,15,30,60,120,240,480,960

// {word: 'apple', translations: ['苹果'], note: '',dueDate: '',sentence: 'This is a apple.', period: 1, audio: 'name'}

// "id": "656439069e3879002076d01f",
// "original": "coalition",
// "originalLanguage": "610089d75fb6b10021c7e0dc",
// "translations": [
//     "联盟"
// ],
// "notes": "",
// "partOfSpeech": "NOUN",
// "nounGender": null,
// "state": "GRADUATED",
// "ease": 2.5,
// "currentInterval": 64800,
// "intervalModifier": 1,
// "dueDate": 1707553794444,
// "beforeRelearningInterval": null,
// "sourceUrl": "https://www.ft.com/content/822e4e21-a631-496e-accd-1c9d6288573c",
// "context": "A few weeks into the Gulf war in 1991, the US-led _MSLINGO_W_ faced nervy questions about the risk of becoming bogged down.",
// "transliteration": null,
// "__typename": "Flashcard"
// },
