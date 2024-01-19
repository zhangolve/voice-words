import {useState, useRef, useEffect} from 'react';
import { FaPencilAlt } from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import EditFlashCard from './EditFlashCard';

const Card = ({ word, onSave }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const playAudio = (e) => {
    e.stopPropagation();
    if(audioRef.current) {
      setIsAudioPlaying(!isAudioPlaying);
    } else {
      const audio = new Audio(`${process.env.NEXT_PUBLIC_R2_DOMAIN}/${word.audio}`);
      audioRef.current = audio;
      setIsAudioPlaying(true);
    }
  };

  useEffect(()=>{
    if(audioRef.current) {
      if(isAudioPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioPlaying])

  const content = isAudioPlaying ? word.sentence: (!isFlipped ? word.word: word.translations.toString())

  return (
    <div className="rounded overflow-hidden shadow-lg m-4 card cursor-pointer relative" onClick={()=> { setIsAudioPlaying(false); setIsFlipped(!isFlipped)}}>
      <div className={`px-6 py-4 flex items-center justify-center h-full transition-transform duration-700 ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}>
        <p className="text-gray-700 text-base text-center text-lg font-bold">{content}</p>
        <div className="icons absolute bottom-0 left-0 right-0 px-6 py-4 flex justify-between">
          <FaPencilAlt onClick={()=>setIsOpen(true)}/>
          <AiFillAudio onClick={playAudio}/>
        </div>
      </div>
      <EditFlashCard flashcard={word} isOpen={isOpen} onClose={()=>setIsOpen(false)} onSave={onSave}/>
    </div>
  );
};


export default Card;

