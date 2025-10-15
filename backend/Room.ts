import Round from "shared/src/Round";
import { SyncHands,SyncScoreBoard } from "./Server";

export default class Room {
    public userCount: number;
    public Users: string[];
    public Scores: number[];
    public Teams: (-1 | 0 | 1)[];
    public CurrentRound: Round;
    public RoomNumber: number;

    constructor(roomNumber: number) {
        this.userCount = 0;
        this.Users = [];
        this.Scores = [0, 0, 0, 0];
        this.Teams = [0, 1, 0, 1];
        this.CurrentRound = new Round(0);
        this.RoomNumber = roomNumber;
    }

    public AddUser(username: string): void {
        if (this.userCount == 4) return;
        this.Users[this.userCount++] = username;
        if (this.userCount == 4) {
            SyncScoreBoard(this.RoomNumber);
            SyncHands(this.RoomNumber);
        }
    }
}