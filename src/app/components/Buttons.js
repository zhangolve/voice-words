const Again = ({onClick})=> {
    return (
        <div className="mr-2 md:mr-3 flex flex-col flex-1 cursor-pointer justify-center py-2 text-xs font-semibold leading-none text-white transition duration-300 rounded-lg bg-red-300 hover:bg-red-400" onClick={onClick}>
            <div className="flex flex-col justify-center items-center select-none">
                <div className="text-lg">Again</div>
                <div className="text-xs font-semibold">&lt;10min</div>
            </div>
        </div>
    )
}

const Good = ({onClick})=> {
    return (
        <div className="mr-2 md:mr-3 flex flex-col flex-1 cursor-pointer justify-center py-2 text-xs font-semibold leading-none text-white transition duration-300 rounded-lg bg-green-300 hover:bg-green-400" onClick={onClick}>
            <div className="flex flex-col justify-center items-center select-none">
                <div className="text-lg">Good</div>
                {/* <div className="text-xs font-semibold">38days</div> */}
            </div>
        </div>
    )
}


const Easy = ({onClick})=> {
    return (
        <div className="mr-2 md:mr-3 flex flex-col flex-1 cursor-pointer justify-center py-2 text-xs font-semibold leading-none text-white transition duration-300 rounded-lg bg-blue-300 hover:bg-blue-400" onClick={onClick}>
            <div className="flex flex-col justify-center items-center select-none">
                <div className="text-lg">mastered</div>
                {/* <div className="text-xs font-semibold">45days</div> */}
            </div>
        </div>
    )
}

const Buttons = ({onRetry,onGood, onMaster})=> {
    return (<div className="flex items-center mt-4 md:mt-7 w-full sm:ml-0">
        <Again onClick={onRetry}/>
        <Good onClick={onGood}/>
        <Easy onClick={onMaster}/>
    </div>);
}

export default Buttons;