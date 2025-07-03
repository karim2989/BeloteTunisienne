import WebSocket from "ws";
import Room from "./Room";
import User from "./User";

const MAX_ROOMS = 1000;
let rooms: Map<number, Room> = new Map();
let users: Map<string, User> = new Map();

function _auth(auth: { username: string, password: number }): boolean {
    if (!users.has(auth.username)) return false;
    return users.get(auth.username)?.Password == auth.password;
}


export function OnRequestConnectOrReconnect(username: string, password: number, ws: WebSocket) {
    if (users.has(username)) { // reconnection:
        if (users.get(username)?.Password != password)
            ws.send(JSON.stringify({ cmd: "connection declined", roomid: users.get(username)?.Room }));
        else {
            ws.send(JSON.stringify({ cmd: "connection accepted", content: undefined }));
            console.log("player reconnected: " + username);
            if (users.get(username)?.Room != null) {// has room
                let room = rooms.get(users.get(username)?.Room as number)
                ws.send(JSON.stringify(
                    {
                        cmd: "room accepted",
                        content: { indexInRoom: room?.Users.indexOf(username), roomNumber: room?.RoomNumber }
                    }
                ))
            }
        }
    }
    else {
        users.set(username, new User(password, username, ws));
        ws.send(JSON.stringify({ cmd: "connection accepted", content: undefined }));
        console.log("player connected: " + username);
    }

}

export function OnRequestRoom(auth: { username: string, password: number }, content: { roomType: "create" | "join" | "auto", roomNumber: number }) {
    if (!_auth(auth)) { console.log("auth failed"); return; }

    let roomNumber = content.roomNumber;
    if (content.roomType == 'create') {
        let attempts = 5;
        do {
            roomNumber = Math.floor(Math.random() * MAX_ROOMS);
        }
        while (rooms.has(roomNumber) && attempts-- > 0);
        if (attempts <= 0)
            return;// just gives up
        rooms.set(roomNumber, new Room(roomNumber));
    }    
    let room = rooms.get(roomNumber);
    room?.AddUser(auth.username);
    let u = users.get(auth.username) as User;
    u.Room = roomNumber
    users.set(auth.username, u);
    
    (u.Ws as WebSocket).send(JSON.stringify(
        {
            cmd: "room accepted",
            content: { indexInRoom: room?.Users.indexOf(auth.username), roomNumber: roomNumber }
        }
    ));
    /*
    let usernameLengths = new Uint8Array(4);
    let usernames = new Array<string>();
    for (let i = 0; i < (room?.userCount as number); i++) {
        let u = users.get(room?.Users[i] as number);
        usernameLengths[i] = u?.Username.length as number;
        usernames.push(u?.Username as string);
    }

    room?.Users.forEach(u => users.get(u)?.Ws.send(SerializeSyncScoreboard(usernameLengths,usernames,room.Scoreboard)));
*/
}