import { Card } from "shared/src/Card";
import { Deck } from "shared/src/Deck";
import { BidEmotion, DeserializeConnectOrReconnect, DeserializeMessage, DeserializeRequestConnectOrReconnect, DeserializeRoom, DeserializeSyncCurrentBid, DeserializeSyncCurrentPlayer, DeserializeSyncHand, DeserializeSyncScoreboard, DeserializeSyncTable, ObjectType, RequestRoomType, SerializeRequestBid, SerializeRequestConnectOrReconnect, SerializeRequestMessage, SerializeRequestPlay, SerializeRequestRoom } from "shared/src/OverTheNetworkObject.ts";
import { Bid } from "shared/src/bid";

let ws = new WebSocket("ws://localhost:4000");
ws.binaryType = 'arraybuffer';

let stringToRoomType = new Map<string, RequestRoomType>([['create', RequestRoomType.new], ['join', RequestRoomType.join], ['auto', RequestRoomType.matchMaking]]);

let isOpen = false;
let isConnected = false;

let auth_id: number
let auth_pw: number
let auth_username: string
let auth_room: number


export abstract class ExternalHooks {
    public static OnConnect: (isConnected: boolean) => void = () => { };
    public static OnRoom: (roomNumber: number) => void = () => { };
    public static OnMessage: (id: number, message: string) => void = () => { };

    public static OnSyncScoreboard: (usernamesLengths: Uint8Array, usernames: string[], scores: Int32Array) => () => {};
    public static OnSyncHand: (hand: Deck) => void = () => { };
    public static OnSyncCurrentBid: (bid: Bid) => void = () => { };
    public static OnSyncCurrentPlayer: (playerId: number) => void = () => { };
    public static OnSyncTable: (hand: Deck) => void = () => { };
}

ws.onopen = () => isOpen = true;
ws.onerror = () => isOpen = false;
ws.onclose = () => isOpen = false;

ws.onmessage = (e) => {
    let dv = new DataView(e.data);
    switch (dv.getUint8(0)) {
        case ObjectType.ConnectOrReconnect: onConnect(e.data); break;
        case ObjectType.Room: onRoom(e.data); break;
        case ObjectType.Message: onMessage(e.data); break;
        case ObjectType.SyncCurrentBid: onSyncCurrentBid(e.data); break;
        case ObjectType.SyncCurrentPlayer: onSyncCurrentPlayer(e.data); break;
        case ObjectType.SyncScoreboard: onSyncScoreboard(e.data); break;
        case ObjectType.SyncHand: onSyncHand(e.data); break;
        case ObjectType.SyncTable: onSyncTable(e.data); break;

        default: console.error("unresolved command ", dv.getUint8(0)); break;
    }
};

//#region Connection
export function RequestConnect(username: string, password: string) {
    if (!isOpen) { alert("you are not connected to the internet"); return; }
    let data = SerializeRequestConnectOrReconnect(username, password);

    ws.send(data);

    let { id, pw } = DeserializeRequestConnectOrReconnect(data)
    auth_id = id;
    auth_pw = pw;
    auth_username = username;
}

function onConnect(input: ArrayBuffer) {
    isConnected = DeserializeConnectOrReconnect(input) != 0;
    ExternalHooks.OnConnect(isConnected);
}
//#endregion

//#region Matchmaking
export function RequestRoom(matchTypeString: string, roomNumber: number) {
    if (!isOpen) { alert("you are not connected to the internet"); return; }
    let matchType = stringToRoomType.get(matchTypeString);
    if (matchType == undefined) throw 'invalid match type';

    ws.send(SerializeRequestRoom(auth_id, auth_pw, matchType, roomNumber));
}

function onRoom(data: ArrayBuffer) {
    let { roomNumber } = DeserializeRoom(data);
    auth_room = roomNumber;

    ExternalHooks.OnRoom(roomNumber);
}

//#endregion

//#region Messaging
export function RequestMessage(message: string) {
    if (!isOpen) { alert("you are not connected to the internet"); return; }

    ws.send(SerializeRequestMessage(auth_id, auth_pw, message));
}

function onMessage(data: ArrayBuffer) {
    let { id, message } = DeserializeMessage(data);

    ExternalHooks.OnMessage(id, message);
}

//#endregion

//#region Bidding and playing
export function RequestBid(bid: Bid, selectedEmoji: string) {
    if (!isOpen) { alert("you are not connected to the internet"); return; }
    ws.send(SerializeRequestBid(auth_id, auth_pw, bid, BidEmotion.neutral));
}

export function RequestPlay(card: Card) {
    if (!isOpen) { alert("you are not connected to the internet"); return; }
    ws.send(SerializeRequestPlay(auth_id, auth_pw, card));
}

//#endregion

//#region Sync handling

function onSyncScoreboard(data: ArrayBuffer) {
    let { scores, usernames, usernamesLengths } = DeserializeSyncScoreboard(data)
    ExternalHooks.OnSyncScoreboard(usernamesLengths, usernames, scores);
}

function onSyncHand(data: ArrayBuffer) {
    let { hand } = DeserializeSyncHand(data);
    ExternalHooks.OnSyncHand(hand);
}

function onSyncTable(data: ArrayBuffer) {
    let { hand } = DeserializeSyncTable(data);
    ExternalHooks.OnSyncTable(hand);
}

function onSyncCurrentBid(data: ArrayBuffer) {
    let { bid } = DeserializeSyncCurrentBid(data);
    ExternalHooks.OnSyncCurrentBid(bid);
}

function onSyncCurrentPlayer(data: ArrayBuffer) {
    let { playerId } = DeserializeSyncCurrentPlayer(data);
    ExternalHooks.OnSyncCurrentPlayer(playerId);
}
//#endregion