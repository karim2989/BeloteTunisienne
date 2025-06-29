import { Card, CardUtils } from './Card'
import { Bid, BidType } from './Bid'

export enum ObjectType {
    Ping = 0,
    RequestConnectOrReconnect = 1,
    ConnectOrReconnect = 2,
    RequestRoom = 3,
    Room = 4,
    RequestMessage = 5,
    Message = 6,
    RequestBid = 7,
    RequestPlay = 8,
    SyncScoreboard = 9,
    SyncHand = 10,
    SyncCurrentBid = 11,
    SyncCurrentPlayer = 12,
    SyncTable = 13
}
export enum ConnectionType { noconnection = 0, connection = 1, reconnection = 2 }
export enum RequestRoomType { matchMaking = 0, new = 1, join = 2, leave = 3 }
export enum BidEmotion { laugh = 0, neutral, indecisive }
export type OverTheNetworkObject = ArrayBuffer;

function xorHash(bytes: Uint8Array): number {
    let hash = 0;
    let offset = 0;
    for (let i = 0; i < bytes.length; i++) {
        hash ^= bytes[i] << offset;
        offset = (offset + 8) % 32;
    }
    return hash;
}

//#region Connection
export function DeserializeRequestConnectOrReconnect(input: OverTheNetworkObject): { type: ObjectType, id: number, pw: number, username: string } {
    let dv = new DataView(input);
    return {
        type: ObjectType.RequestConnectOrReconnect,
        id: dv.getUint32(1),
        pw: dv.getUint32(5),
        username: new TextDecoder().decode(input.slice(9))
    };
}
export function SerializeRequestConnectOrReconnect(username: string, password: string): OverTheNetworkObject {
    let usernameBytes = new TextEncoder().encode(username);
    let passwordBytes = new TextEncoder().encode(password);

    let id = xorHash(new Uint8Array(usernameBytes));
    let pw = xorHash(new Uint8Array(passwordBytes));

    let output = new Uint8Array(9 + usernameBytes.length);
    output[0] = ObjectType.RequestConnectOrReconnect;
    output[1] = id >> 24;
    output[2] = id >> 16;
    output[3] = id >> 8;
    output[4] = id;
    output[5] = pw >> 24;
    output[6] = pw >> 16;
    output[7] = pw >> 8;
    output[8] = pw;
    output.set(usernameBytes, 9);
    return output.buffer;
}

export function SerializeConnectOrReconnect(result: ConnectionType): OverTheNetworkObject {
    let output = new Uint8Array(2);
    output[0] = ObjectType.ConnectOrReconnect;
    output[1] = result;
    return output.buffer;
}

export function DeserializeConnectOrReconnect(input: OverTheNetworkObject): ConnectionType {
    return new DataView(input).getUint8(1) as ConnectionType;
}

//#endregion

function writeAuth(data: Uint8Array, id: number, pw: number) {
    data[1] = id >> 24;
    data[2] = id >> 16;
    data[3] = id >> 8;
    data[4] = id;
    data[5] = pw >> 24;
    data[6] = pw >> 16;
    data[7] = pw >> 8;
    data[8] = pw;
    return data;
}

function readAuth(data: DataView) {
    return {
        id: data.getUint32(1),
        pw: data.getUint32(5)
    };
}

//#region Room
export function SerializeRequestRoom(id: number, pw: number, type: RequestRoomType, roomNumber: number): OverTheNetworkObject {
    let output = new Uint8Array(14);
    output[0] = ObjectType.RequestRoom;
    output = writeAuth(output, id, pw)
    output[9] = type;
    output[10] = roomNumber >> 24;
    output[11] = roomNumber >> 16;
    output[12] = roomNumber >> 8;
    output[13] = roomNumber;
    return output.buffer;
}

export function DeserializeRequestRoom(input: OverTheNetworkObject): { id: number, pw: number, type: ObjectType, roomType: RequestRoomType, roomNumber: number } {
    let dv = new DataView(input);
    if (dv.byteLength != 14) throw 'Corrupt request'
    let auth = readAuth(dv);
    return {
        id: auth.id,
        pw: auth.pw,
        type: ObjectType.RequestRoom,
        roomType: dv.getUint8(9),
        roomNumber: dv.getUint32(10)
    };
}

export function SerializeRoom(roomNumber: number): OverTheNetworkObject {
    let output = new Uint8Array(5);
    output[0] = ObjectType.Room;
    output[1] = roomNumber >> 24;
    output[2] = roomNumber >> 16;
    output[3] = roomNumber >> 8;
    output[4] = roomNumber;
    return output.buffer;
}

export function DeserializeRoom(input: OverTheNetworkObject): { type: ObjectType, roomNumber: number } {
    let dv = new DataView(input);
    return {
        type: ObjectType.Room,
        roomNumber: dv.getUint32(1)
    };
}
//#endregion



//#region Messages
export function SerializeRequestMessage(id: number, pw: number, message: string): OverTheNetworkObject {
    let messageBytes = new TextEncoder().encode(message);
    let output = new Uint8Array(9 + messageBytes.length);
    output[0] = ObjectType.RequestMessage;
    output = writeAuth(output, id, pw);
    output.set(messageBytes, 9);
    return output;
}

export function DeserializeRequestMessage(input: OverTheNetworkObject): { id: number, pw: number, message: string } {
    let dv = new DataView(input);
    let auth = readAuth(dv);
    return {
        id: auth.id,
        pw: auth.pw,
        message: new TextDecoder().decode(input.slice(9))
    };
}

export function SerializeMessage(id: number, message: string): OverTheNetworkObject {
    let output = SerializeRequestMessage(id, 0, message) as Uint8Array;
    output[0] = ObjectType.Message;
    return output;
}

export function DeserializeMessage(input: OverTheNetworkObject): { id: number, message: string } {
    return DeserializeRequestMessage(input);
}

//#endregion

//#region Bidding
export function SerializeRequestBid(id: number, pw: number, bid: Bid, emotion: BidEmotion): OverTheNetworkObject {
    let output = new ArrayBuffer(1 + (10 * 4)) //1 byte + 6 elements * 4 bytes
    let dv = new DataView(output)

    dv.setUint8(0, ObjectType.RequestBid)
    dv.setInt32(1, id)
    dv.setInt32(5, pw)
    dv.setInt32(9, bid.Player as number)
    dv.setInt32(13, bid.Type as number)
    dv.setInt32(17, bid.Trump as number)
    dv.setInt32(21, bid.Value)
    dv.setInt32(25, bid.Contree ? 1 : 0)
    dv.setInt32(29, bid.Surcontree ? 1 : 0)
    dv.setInt32(33, bid.Surmanchee ? 1 : 0)
    dv.setInt32(37, emotion as number);

    return output;
}

export function DeserializeRequestBid(input: OverTheNetworkObject): { id: number, pw: number, bid: Bid, emotion: BidEmotion } {
    if (input.byteLength != 41) throw 'Corrupt request'
    let dv = new DataView(input);
    let bid = new Bid(
        dv.getInt32(9),
        dv.getInt32(13) as BidType,
        dv.getInt32(17) as Card,
        dv.getInt32(21)
    );
    bid.Contree = dv.getInt32(25) === 1;
    bid.Surcontree = dv.getInt32(29) === 1;
    bid.Surmanchee = dv.getInt32(33) === 1;
    return {
        id: dv.getInt32(1),
        pw: dv.getInt32(5),
        bid: bid,
        emotion: dv.getInt32(37) as BidEmotion
    };
}

//#endregion

//#region Playing
export function SerializeRequestPlay(id: number, pw: number, card: Card): OverTheNetworkObject {
    let output = Buffer.alloc(1 + (3 * 4)) //1 byte + 3 elements * 4 btes

    output.writeUInt8(ObjectType.RequestPlay, 0)
    output.writeInt32BE(id, 1)
    output.writeInt32BE(pw, 5)
    output.writeInt32BE(card as number, 9)
    return output;
}

export function DeserializeRequestPlay(input: OverTheNetworkObject): { id: number, pw: number, card: Card } {
    if (input.byteLength != 13) throw 'Corrupt request'
    let dv = new DataView(input);
    return {
        id: dv.getInt32(1),
        pw: dv.getInt32(5),
        card: dv.getInt32(9) as Card
    };
}
//#endregion

//#region sync
export function SerializeSyncScoreboard(usernamesLengths: Uint8Array, usernames: string[], scores: Int32Array): OverTheNetworkObject {
    usernames.forEach(e => { if (e.length > 255) e = e.substring(0, 255); });
    usernamesLengths.forEach(e => e = Math.max(e, 255));

    let usernamesBytes = new TextEncoder().encode(usernames.join(''));
    let output = Buffer.alloc(1 + (1 + usernamesBytes.length) + (4 * (1 + 4))) //1 byte + 1 byte + usernames + 4 * (1 + 4)
    let i = 0;
    output.writeUInt8(ObjectType.SyncScoreboard, i++)
    output.writeUInt8(usernamesLengths[0], 1)
    output.writeUInt8(usernamesLengths[1], 2)
    output.writeUInt8(usernamesLengths[2], 3)
    output.writeUInt8(usernamesLengths[3], 4)
    output.writeInt32BE(scores[0], 5)
    output.writeInt32BE(scores[1], 9)
    output.writeInt32BE(scores[2], 13)
    output.writeInt32BE(scores[4], 17)
    output.copy(usernamesBytes, 18)
    return output;
}

export function DeserializeSyncScoreboard(input: OverTheNetworkObject): { usernamesLengths: Uint8Array, usernames: string[], scores: Int32Array } {
    let text = new TextDecoder().decode(input.slice(18, input.byteLength))
    return {
        usernamesLengths: new Uint8Array(input.slice(1, 5)),
        scores: new Int32Array(input.slice(5, 17)),
        usernames: [text, text, text, text]
    };
}
export function SerializeSyncCurrentBid(bid: Bid, emotion: BidEmotion): OverTheNetworkObject {
    let output = new ArrayBuffer(1 + (5 * 4)); // 1 byte + 5 elements * 4 bytes
    let dv = new DataView(output);
    dv.setUint8(0, ObjectType.SyncCurrentBid);
    dv.setInt32(1, bid.Player);
    dv.setInt32(5, bid.Type as number);
    dv.setInt32(9, bid.Trump as number);
    dv.setInt32(13, bid.Value);
    dv.setInt32(17, emotion)

    return output;
}

export function DeserializeSyncCurrentBid(input: OverTheNetworkObject): { bid: Bid, emotion: BidEmotion } {
    if (input.byteLength != 21) throw 'Corrupt request';
    let dv = new DataView(input);
    return {
        bid: new Bid(
            dv.getInt32(1),
            dv.getInt32(5) as BidType,
            dv.getInt32(9) as Card,
            dv.getInt32(13)
        ),
        emotion: dv.getInt32(17) as BidEmotion
    };
}

export function SerializeSyncCurrentPlayer(playerId: number): OverTheNetworkObject {
    let output = Buffer.alloc(1 + 4);
    output.writeUInt8(ObjectType.SyncCurrentPlayer, 0);
    output.writeInt32BE(playerId, 1);
    return output;
}

export function DeserializeSyncCurrentPlayer(input: OverTheNetworkObject): { playerId: number } {
    if (input.byteLength != 5) throw 'Corrupt request';
    let dv = new DataView(input);
    return {
        playerId: dv.getInt32(1)
    };
}

export function SerializeSyncHand(hand: number): OverTheNetworkObject {
    let output = Buffer.alloc(1 + 4);
    output.writeUInt8(ObjectType.SyncHand, 0);
    output.writeInt32BE(hand, 1);
    return output;
}

export function DeserializeSyncHand(input: OverTheNetworkObject): { hand: number } {
    if (input.byteLength != 5) throw 'Corrupt request';
    let dv = new DataView(input);
    return {
        hand: dv.getInt32(1)
    };
}

export function SerializeSyncTable(hand: number): OverTheNetworkObject {
    let output = Buffer.alloc(1 + 4);
    output.writeUInt8(ObjectType.SyncTable, 0);
    output.writeInt32BE(hand, 1);
    return output;
}

export function DeserializeSyncTable(input: OverTheNetworkObject): { hand: number } {
    if (input.byteLength != 5) throw 'Corrupt request';
    let dv = new DataView(input);
    return {
        hand: dv.getInt32(1)
    };
}

//#endregion