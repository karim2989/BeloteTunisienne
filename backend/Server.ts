import { BidEmotion, ConnectionType, DeserializeConnectOrReconnect, DeserializeRequestBid, DeserializeRequestConnectOrReconnect, DeserializeRequestMessage, DeserializeRequestRoom, ObjectType, RequestRoomType, SerializeConnectOrReconnect, SerializeMessage, SerializeRoom, SerializeSyncCurrentBid, SerializeSyncScoreboard } from "shared/src/OverTheNetworkObject.ts";
import { WebSocket, WebSocketServer } from 'ws'
import Room from "./Room";
import User from "./User";


const MAX_ROOMS = 1000;
let rooms: Map<number, Room> = new Map();
let users: Map<number, User> = new Map();
function auth(id: number, pw: number): boolean {
    let user = users.get(id);
    if (!user) return false;
    return user.Pw == pw;
}

export function OnPing(data: ArrayBuffer) {
    let dv = new DataView(data);
    let id = dv.getUint32(1);
    let pw = dv.getUint32(2);
    if (auth(id, pw))
        ///@ts-expect-error
        users.get(id).lastping = Date.now();
}

export function OnRequestConnectOrReconnect(data: ArrayBuffer, ws: WebSocket) {
    let { id, pw, username } = DeserializeRequestConnectOrReconnect(data);
    if (users.has(id)) {
        ws.send(SerializeConnectOrReconnect(ConnectionType.reconnection));
        if (users.get(id)?.Room != null)
            ws.send(SerializeRoom(users.get(id)?.Room as number));
    }

    users.set(id, new User(pw, username, Date.now(), ws, null));
    ws.send(SerializeConnectOrReconnect(ConnectionType.connection));
}

export function OnRequestRoom(data: ArrayBuffer, ws: WebSocket) {
    let { roomNumber, roomType, id, pw } = DeserializeRequestRoom(data);

    if (!auth(id, pw)) return;

    if (roomType == RequestRoomType.new) {
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
    room?.AddUser(id);
    let r = users.get(id) as User;
    r.Room = roomNumber
    users.set(id, r);

    ws.send(SerializeRoom(roomNumber));

    let usernameLengths = new Uint8Array(4);
    let usernames = new Array<string>();
    for (let i = 0; i < (room?.userCount as number); i++) {
        let u = users.get(room?.Users[i] as number);
        usernameLengths[i] = u?.Username.length as number;
        usernames.push(u?.Username as string);
    }

    room?.Users.forEach(u => users.get(u)?.Ws.send(SerializeSyncScoreboard(usernameLengths, usernames, room.Scoreboard)));
}

export function OnRequestMessage(data: ArrayBuffer, ws: WebSocket) {
    let { id, pw, message } = DeserializeRequestMessage(data)
    if (!auth(id, pw)) return;

    let room = users.get(id)?.Room;
    if (!room) return;
    rooms.get(room)?.Users.forEach(u => { users.get(u)?.Ws.send(SerializeMessage(id, message)) });
}

export function OnRequestBid(data: ArrayBuffer, ws: WebSocket) {
    let { bid, id, pw, emotion } = DeserializeRequestBid(data);
    if (!auth(id, pw)) return;

    let room = users.get(id)?.Room;
    if (room == null) return;
    let round = rooms.get(room)?.CurrentRound;
    if (round == null) return;

    let r_id = rooms.get(room)?.Users.indexOf(id) as number;

    let res = round.Bid(bid);


    if (!res) return;

    syncCurrentBid(rooms.get(room) as Room, emotion);
}

function syncCurrentBid(room: Room, bidEmotion: BidEmotion) {
    let bid = room.CurrentRound.CurrentBid
    room.Users.forEach(u => {
        users.get(u)?.Ws.send(SerializeSyncCurrentBid(bid, bidEmotion))
    })
}