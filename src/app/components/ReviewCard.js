import {useState, useRef, useEffect, useCallback } from 'react';
import { FaPencilAlt } from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import EditFlashCard from './EditFlashCard';

const LoadingCard = ()=> (
  <div className="review rounded overflow-hidden shadow-lg m-4 card cursor-pointer relative">
    <div className="animate-pulse flex space-x-4">
    <div className="rounded-full bg-slate-200 h-10 w-10"></div>
    <div className="flex-1 space-y-6 py-1">
      <div className="h-2 bg-slate-200 rounded"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-slate-200 rounded col-span-2"></div>
          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
        </div>
        <div className="h-2 bg-slate-200 rounded"></div>
      </div>
    </div>
  </div>
  </div>
)

const NormalCard = ({ word, onSave }) => {

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const playAudio = useCallback((e) => {
    e.stopPropagation();
    if(audioRef.current) {
      setIsAudioPlaying(!isAudioPlaying);
    } else {
      const audio = new Audio(`${process.env.NEXT_PUBLIC_R2_DOMAIN}/${word.audio}`);
      audioRef.current = audio;
      setIsAudioPlaying(true);
    }
  }, [isAudioPlaying, word.audio]);

  useEffect(()=>{
    audioRef.current = undefined;
    
  }, [word.audio])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause(); // 暂停音频播放
        audioRef.current = null; // 清除音频引用
      }
    };
  }, []);

  
  useEffect(()=>{
    if(audioRef.current) {
      if(isAudioPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioPlaying])

  const content = isAudioPlaying ? word.sentence: (!isFlipped ? <>{word.word}<br/>{word.pronunciation}</>: word.translations.toString());
  return (
    <div className="review rounded overflow-hidden shadow-lg m-4 card cursor-pointer relative" onClick={()=> { setIsAudioPlaying(false); setIsFlipped(!isFlipped)}}>
      <div className={`px-6 py-4 flex items-center justify-center h-full transition-transform duration-700 ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}>
        <p className="text-gray-700 text-base text-center text-lg font-bold" onClick={(e)=>e.stopPropagation()}>{content}</p>
        <div className="icons absolute bottom-0 left-0 right-0 px-6 py-4 flex justify-between">
          <FaPencilAlt onClick={()=>setIsOpen(true)}/>
          { word.audio &&
            <AiFillAudio onClick={playAudio}/>
          }
        </div>
      </div>
      {onSave && 
      <EditFlashCard flashcard={word} key={`${word.word}${isOpen}`} isOpen={isOpen} onClose={()=>setIsOpen(false)} onSave={onSave}/>
      }
    </div>
  );
};


const PreviewCard = ({word, onSave})=> {
  return word ? <NormalCard word={word} onSave={onSave}/> : <LoadingCard/>
}


export default PreviewCard;

