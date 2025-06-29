import React, { useState } from 'react';
import { ExternalHooks } from '../../Client';

export default function ScoreBoard() {
    const [scores, setScores] = useState<Int32Array>(new Int32Array());
    const [usernames, setUsernames] = useState<string[]>([]);

    //@ts-ignore
    ExternalHooks.OnSyncScoreboard = (usernamesLengths, newUsernames, newScores) => {
        setScores(newScores);
        setUsernames(newUsernames);
    };

    return (
        <div className="scoreboard">
            <h2>Scoreboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {usernames.map((username, index) => (
                        <tr key={index}>
                            <td>{username}</td>
                            <td>{scores[index]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}