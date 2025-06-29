import { WebSocket } from "ws";

export default class User {
    public Pw: number;
    public Username: string
    public Lastping: number
    public Room: number | null
    public Ws: WebSocket

    constructor(pw: number, username: string, lastping: number, ws: WebSocket, room: number | null) {
        this.Pw = pw;
        this.Username = username;
        this.Lastping = lastping;
        this.Room = room;
        this.Ws = ws;
    }
}