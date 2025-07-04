import { useEffect, useState, type ReactNode } from "react"
import "./scoreBoard.css"
import { ExternalHooks } from "../../client";
class ScoreboardRowData {
    public Username: string;
    public Team: -1 | 0 | 1;
    public Scores: number;
    constructor(username: string, team: -1 | 0 | 1, scores: number) {
        this.Username = username;
        this.Team = team;
        this.Scores = scores;
    }
}
export default function ScoreBoard(): ReactNode {
    const [scoreboard, setScoreboard] = useState<ScoreboardRowData[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(-1)

    useEffect(() => {
        ExternalHooks.OnSyncScoreboard.push((teams, users, scores, current) => {
            let x = []
            for (let i = 0; i < users.length; i++) {
                x.push(new ScoreboardRowData(users[i], teams[i], scores[i]))
            }
            setScoreboard(x);
            setCurrentPlayerIndex(current);
        })
    })
    return (
        <div className="scoreboard">
            {scoreboard?.map((row, idx) => (
                <div
                    key={row.Username}
                    className={`scoreboardRow${currentPlayerIndex === idx ? " scoreboardCurrentPlayer" : ""}`}
                >
                    <div className={`teamCircle team${row.Team + 1}`}></div>
                    <span className="scoreboardUsername">{row.Username}</span>
                    <div className="flexfiller"></div>
                    <span className="scoreboardScore">{row.Scores}</span>
                </div>
            ))}

            <div className="scoreboardRow">
                <div className="scoreboardTeamName team1">team 1</div>
                <div className="scoreboardTeamName team2">team 2</div>
            </div>
        </div>
    )
}