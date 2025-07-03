import type { ReactNode } from "react";
import ScoreBoard from "./Scoreboard/ScoreBoard";
import "./gamescreen.css"
import ChatBox from "./ChatBox/ChatBox";

export default function GameScreen(): ReactNode {
    return (
        <>
        <aside>
            <ScoreBoard />
            <ChatBox/> 
        </aside>
        <div className='flexfiller leftaside'>
            <div className="bidInfo square">bid info</div>
            <div className=" square">variable area</div>
            <div className="hand rectangle">your hand</div>
        </div>
        </>
    )
}