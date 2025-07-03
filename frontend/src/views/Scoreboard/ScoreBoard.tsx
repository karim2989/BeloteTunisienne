import type { ReactNode } from "react"
import "./scoreBoard.css"

export default function ScoreBoard(): ReactNode {
    return (
        <div className="scoreboard">

            <div className="scoreboardRow">
                <div className="teamCircle team1"></div>
                <span className="scoreboardUsername">EvilSailor</span>
                <div className="flexfiller"></div>
                <span className="scoreboardScore">250</span>
            </div>
            <div className="scoreboardRow">
                <div className="teamCircle team1"></div>
                <span className="scoreboardUsername">EvilSailor</span>
                <div className="flexfiller"></div>
                <span className="scoreboardScore">250</span>
            </div>
            <div className="scoreboardRow">
                <div className="teamCircle team2"></div>
                <span className="scoreboardUsername">EvilSailor</span>
                <div className="flexfiller"></div>
                <span className="scoreboardScore">250</span>
            </div>
            <div className="scoreboardRow">
                <div className="teamCircle "></div>
                <span className="scoreboardUsername">EvilSailor</span>
                <div className="flexfiller"></div>
                <span className="scoreboardScore">250</span>
            </div>
            <div className="scoreboardRow">
                <div className="scoreboardTeamName team1">team 1</div>
                <div className="scoreboardTeamName team2">team 2</div>
            </div>
        </div>
    )
}