import { WebSocket } from "ws";

export default class User {
    public Username: string
    public Password: number;
    public Room: number | null
    public Ws: WebSocket | null;

    constructor(pw: number, username: string, ws: WebSocket, room: number | null = null) {
        this.Password = pw;
        this.Username = username;
        this.Room = room;
        this.Ws = ws;
    }
}