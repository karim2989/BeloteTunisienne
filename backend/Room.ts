import Round from "shared/src/Round";

export default class Room {
    public userCount: number;
    public Users: string[];
    public CurrentRound: Round;
    public RoomNumber: number;
    public Scoreboard: Int32Array;

    constructor(roomNumber: number) {
        this.userCount = 0;
        this.Users = [];
        this.CurrentRound = new Round(0);
        this.RoomNumber = roomNumber;
        this.Scoreboard = new Int32Array(4);
    }

    public AddUser(username: string): void {
        if (this.userCount == 4) return;
        this.Users[this.userCount++] = username;
    }
}