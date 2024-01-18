import {useState} from 'react';

const Card = ({ word }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="rounded overflow-hidden shadow-lg m-4 card cursor-pointer" onClick={()=>setIsFlipped(!isFlipped)}>
      <div className={`px-6 py-4 flex items-center justify-center h-full transition-transform duration-700 ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}>
        <p className="text-gray-700 text-base text-center text-lg font-bold">{!isFlipped ? word.word: word.translations.toString()}</p>
      </div>
    </div>
  );
};


export default Card;

