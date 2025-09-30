import WebSocket from "ws";
import Room from "./Room";
import User from "./User";
import sanitizeHtml from 'sanitize-html';
import { Bid } from "shared/src/Bid";
import { Card } from "shared/src/Card";
import Round, { RoundState } from "shared/src/Round";

const MAX_ROOMS = 1000;
let rooms: Map<number, Room> = new Map();
let users: Map<string, User> = new Map();

function _auth(auth: { username: string, password: number }): boolean {
    if (!users.has(auth.username)) return false;
    return users.get(auth.username)?.Password == auth.password;
}


export function OnRequestConnectOrReconnect(username: string, password: number, ws: WebSocket) {
    if (username != sanitizeHtml(username)) { console.log("username rejected: " + username);; return; }
    if (users.has(username)) { // reconnection:
        if (users.get(username)?.Password != password)
            ws.send(JSON.stringify({ cmd: "connection declined", roomid: users.get(username)?.Room }));
        else {
            let u = users.get(username) as User
            u.Ws = ws;
            users.set(username, u);
            ws.send(JSON.stringify({ cmd: "connection accepted", content: undefined }));
            console.log("player reconnected: " + username);
            if (u.Room != null) {// has room
                let room = rooms.get(u.Room as number)
                ws.send(JSON.stringify(
                    {
                        cmd: "room accepted",
                        content: { indexInRoom: room?.Users.indexOf(username), roomNumber: room?.RoomNumber }
                    }
                ))
                SyncScoreBoard(room?.RoomNumber as number);
                SyncBid(room?.RoomNumber as number);
                SyncHands(room?.RoomNumber as number);
                SyncTable(room?.RoomNumber as number);
            }
        }
    }
    else {
        users.set(username, new User(password, username, ws));
        ws.send(JSON.stringify({ cmd: "connection accepted", content: undefined }));
        console.log("player connected: " + username);
    }

    ws.onclose = () => {
        if (users.has(username) && users.get(username)) {
            const roomNumber = users.get(username)?.Room
            if (!roomNumber) return;
            const room = rooms.get(roomNumber) as Room;
            let roomStillActive = false;

            //@ts-ignore
            room.Users.forEach((e) => {
                //@ts-ignore
                if (users.get(e).Ws?.readyState < WebSocket.CLOSING) roomStillActive = true;
            })
            if (!roomStillActive) {
                room?.Users.forEach((e) => { users.delete(e) })
                rooms.delete(roomNumber);
                console.log("room ", roomNumber, " has been closed");
            }
        }
    }
}

export function OnRequestRoom(auth: { username: string, password: number }, content: { roomType: "create" | "join" | "auto", roomNumber: number }) {
    if (!_auth(auth)) { console.log("auth failed"); return; }
    

    let roomNumber = content.roomNumber;
    ///@ts-ignore
    if (typeof content.roomNumber == 'string') roomNumber = Number.parseInt(roomNumber);
    if (content.roomType == 'auto') {
        let roomItterator = rooms.entries().next();
        let lookupSuccessfull = false;
        while (!roomItterator.done) {
            const r = rooms.get(roomItterator.value[0])
            if (r)
                if (r?.userCount < 4) {
                    roomNumber = (r.RoomNumber) as number;
                    lookupSuccessfull = true;
                    break;
                }
        }
        if(lookupSuccessfull == false) content.roomType ="create"
    }
    if (content.roomType == 'create') {
        let attempts = 5;
        do {
            roomNumber = Math.floor(Math.random() * MAX_ROOMS);
        }
        while (rooms.has(roomNumber) && attempts-- > 0);
        if (attempts <= 0)
            return;// just gives up
        rooms.set(roomNumber, new Room(roomNumber));
        console.log("new room created:", roomNumber);
    }

    let r = rooms.get(roomNumber) as Room
    if(!r) return; // requested  non existante room
    if (r?.Users.indexOf(auth.username) == -1)
        r?.AddUser(auth.username);
    let u = users.get(auth.username) as User;
    u.Room = roomNumber
    users.set(auth.username, u);
    rooms.set(roomNumber, r);

    (u.Ws as WebSocket).send(JSON.stringify(
        {
            cmd: "room accepted",
            content: { indexInRoom: r?.Users.indexOf(auth.username), roomNumber: roomNumber }
        }
    ));
    SyncScoreBoard(roomNumber);
    SyncHands(roomNumber);
    SyncBid(roomNumber);
    SyncTable(roomNumber);
}

export function SyncScoreBoard(roomId: number): void {
    let r = rooms.get(roomId) as Room;
    r.Users.forEach(u =>
        users.get(u)?.Ws?.send(
            JSON.stringify({
                cmd: "scoreboard sync",
                content: {
                    users: r.Users,
                    teams: r.Teams,
                    scores: r.Scores,
                    currentPlayerIndex: r.CurrentRound.CurrentPlayer
                }
            })
        )
    );
}

export function OnBidRequest(auth: { username: string, password: number }, content: { bid: Bid }) {
    if (!_auth(auth)) { console.log("auth failed"); return; }

    let r = rooms.get(users.get(auth.username)?.Room as number) as Room;
    if (r.CurrentRound.Bid(content.bid)) {
        SyncBid(r.RoomNumber);
        SyncScoreBoard(r.RoomNumber);
    }
    else console.log("bid failed");
}
export function OnPlayRequest(auth: { username: string, password: number }, content: { card: Card }) {
    if (!_auth(auth)) { console.log("auth failed"); return; }

    let r = rooms.get(users.get(auth.username)?.Room as number) as Room;
    if (r.CurrentRound.Play(r.Users.indexOf(auth.username), content.card)) {
        if (r.CurrentRound.RoundState == RoundState.done) {
            r.Scores[0] = r.Scores[2] = r.CurrentRound.Scores[0];
            r.Scores[1] = r.Scores[3] = r.CurrentRound.Scores[1];
            r.CurrentRound = new Round((r.CurrentRound.FirstPlayer + 1) % 4)
            SyncBid(r.RoomNumber);
        }
        if (r.CurrentRound.Tricks)
            console.log("current winning card " + r.CurrentRound.Tricks.at(-1)?.WinningPlayIndex);
        SyncScoreBoard(r.RoomNumber);
        SyncTable(r.RoomNumber);
        SyncHands(r.RoomNumber);
    }
    else console.log("play failed");
}

export function SyncBid(roomId: number): void {
    let r = rooms.get(roomId) as Room;
    r.Users.forEach(u =>
        users.get(u)?.Ws?.send(
            JSON.stringify({
                cmd: "bid sync",
                content: {
                    bid: r.CurrentRound.CurrentBid
                }
            })
        )
    );
}

export function SyncHands(roomId: number): void {
    let r = rooms.get(roomId) as Room;    
    r.Users.forEach(u =>
        users.get(u)?.Ws?.send(
            JSON.stringify({
                cmd: "hand sync",
                content: {
                    hand: r.CurrentRound.Hands[r.Users.indexOf(u)]
                }
            })
        )
    );
}
export function SyncTable(roomId: number): void {
    let r = rooms.get(roomId) as Room;
    let cards: Card[] = []
    r.CurrentRound.Tricks.at(-1)?.Cards.forEach(e => {
        cards.push(e as Card);
    });

    r.Users.forEach(u =>
        users.get(u)?.Ws?.send(
            JSON.stringify({
                cmd: "table sync",
                content: {
                    deck: cards
                }
            })
        )
    );
}

export function OnMessageRequest(auth: { username: string, password: number }, content: { message: string }) {
    if (!_auth(auth)) { console.log("auth failed"); return; }

    let roomNumber = users.get(auth.username)?.Room as number;
    rooms.get(roomNumber)?.Users.forEach((u) => {
        let ws = users.get(u)?.Ws;
        if (ws && ws.OPEN)
            ws.send(JSON.stringify(
                {
                    cmd: "message recived",
                    content: { sender: auth.username, message: sanitizeHtml(content.message) }
                }))
    })
}

