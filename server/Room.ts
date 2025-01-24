import Round from "shared/src/Round";

export default class Room {
    public userCount: number
    public Users: Int32Array;
    public CurrentRound: Round;
    public RoomNumber: number;
    public Scoreboard: Int32Array;

    constructor (roomNumber: number) {
        this.userCount = 0;
        this.Users = new Int32Array(4);
        this.CurrentRound = new Round(0);
        this.RoomNumber = roomNumber;
        this.Scoreboard = new Int32Array(4);
    }

    public AddUser(id:number) : void {
        if (this.userCount == 4) return;
        this.Users[this.userCount++] = id;
    }
}