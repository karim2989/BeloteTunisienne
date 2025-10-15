import type { Bid } from "shared/src/Bid";
import type { Deck } from "../../shared/src/Deck";
import type { Card } from "shared/src/Card";

let isOpen = false;
let isConnected = false;
let isInRoom = false;

export abstract class ExternalHooks {
    public static OnOpenOrClose: ((isOpen: boolean) => void)[] = [];
    public static OnConnectOrDisconnect: ((isConnected: boolean) => void)[] = [];
    public static OnEnterOrLeaveRoom: ((isInRoom: boolean) => void)[] = [];
    public static OnMessageRecived: ((sender: string, message: string) => void)[] = [];

    public static OnSyncScoreboard: ((teams: (-1 | 0 | 1)[], users: string[], scores: number[], currentPlayerIndex: number) => void)[] = [];
    public static OnSyncHand: ((hand: Deck) => void)[] = [];
    public static OnSyncBid: ((bid: Bid) => void)[] = [];
    public static OnSyncTable: ((table: Card[]) => void)[] = [];
}

let auth_username: string = ""
let auth_room: number = 0
let auth_pw: number = 0
let auth_inRoomIndex: number = -1
let nameboard: string[] = []

export function getUsername(): string { return auth_username; }
export function getRoomId(): number { return auth_room; }
export function getInRoomIndex(): number { return auth_inRoomIndex; }
export function getNameboard(): string[] { return nameboard; }

let ws: WebSocket;

function openWebSocket() {
    ws = new WebSocket("ws://localhost:4000");
    ws.onopen = () => {
        isOpen = true;
        ExternalHooks.OnOpenOrClose.forEach(e => e(true));
    }
    ws.onerror = ws.onclose = () => {
        isOpen = false;
        ExternalHooks.OnOpenOrClose.forEach(e => e(false));
        isConnected = false;
        ExternalHooks.OnConnectOrDisconnect.forEach(e => e(false));
        isInRoom = false;
        ExternalHooks.OnEnterOrLeaveRoom.forEach(e => e(false));


        openWebSocket();
    }
    ws.onmessage = (msg) => {
        let obj: { cmd: string, content: object } = JSON.parse(msg.data);
        console.log(obj);

        switch (obj.cmd) {
            case "connection accepted":
                isConnected = true;
                ExternalHooks.OnConnectOrDisconnect.forEach(e => e(true));
                break;
            case "room accepted":
                isInRoom = true;
                let content_ra = obj.content as { indexInRoom: number, roomNumber: number }
                auth_room = content_ra.roomNumber;
                auth_inRoomIndex = content_ra.indexInRoom;
                ExternalHooks.OnEnterOrLeaveRoom.forEach(e => e(true));
                break;
            case "message recived":
                let content_mr = obj.content as { sender: string, message: string }
                ExternalHooks.OnMessageRecived.forEach(e => e(content_mr.sender, content_mr.message))
                break;
            case "scoreboard sync":
                let content_ss = obj.content as { teams: (-1 | 0 | 1)[], users: string[], scores: number[], currentPlayerIndex: number }
                auth_inRoomIndex = content_ss.users.indexOf(auth_username);                
                nameboard = content_ss.users;
                ExternalHooks.OnSyncScoreboard.forEach(e => e(content_ss.teams, content_ss.users, content_ss.scores, content_ss.currentPlayerIndex));
                if (ExternalHooks.OnSyncScoreboard.length == 0)
                    setTimeout(() => { ExternalHooks.OnSyncScoreboard.forEach(e => e(content_ss.teams, content_ss.users, content_ss.scores, content_ss.currentPlayerIndex)); }, 100);
                break;
            case "hand sync":
                let content_hs = obj.content as { hand: Deck }
                ExternalHooks.OnSyncHand.forEach((e) => e(content_hs.hand));
                if (ExternalHooks.OnSyncHand.length == 0)
                    setTimeout(() => { ExternalHooks.OnSyncHand.forEach((e) => e(content_hs.hand)); }, 100);
                break;
            case "bid sync":
                let content_bs = obj.content as { bid: Bid }
                ExternalHooks.OnSyncBid.forEach((e) => e(content_bs.bid));
                if (ExternalHooks.OnSyncBid.length == 0)
                    setTimeout(() => { ExternalHooks.OnSyncBid.forEach((e) => e(content_bs.bid)); }, 100);
                break;
            case "table sync":
                let content_ts = obj.content as { deck: Card[] }
                ExternalHooks.OnSyncTable.forEach((e) => e(content_ts.deck));
                if (ExternalHooks.OnSyncTable.length == 0)
                    setTimeout(() => { ExternalHooks.OnSyncTable.forEach((e) => e(content_ts.deck)); }, 100);
                break;

            default:
                break;
        }

    }
}
openWebSocket();

export function RequestConnect(username: string, password: string): void {
    let hpassword = xorHash(new TextEncoder().encode(password));
    auth_username = username;
    auth_pw = hpassword;
    ws.send(JSON.stringify({ cmd: "connection request", content: { username: username, password: hpassword } }));
}

export function RequestRoom(type: "create" | "join" | "auto", roomNumber: number): void {
    ws.send(JSON.stringify(
        {
            cmd: "room request",
            auth: { username: auth_username, password: auth_pw },
            content: { roomType: type, roomNumber: roomNumber }
        }
    ))
}

export function RequestMessage(message: string): void {
    ws.send(JSON.stringify(
        {
            cmd: "message request",
            auth: { username: auth_username, password: auth_pw },
            content: { message: message }
        }
    ))
}

export function RequestBid(bid: Bid): void {
    ws.send(JSON.stringify(
        {
            cmd: "bid request",
            auth: { username: auth_username, password: auth_pw },
            content: { bid: bid }
        }
    ))
}

export function RequestPlay(card: Card) {
    ws.send(JSON.stringify(
        {
            cmd: "play request",
            auth: { username: auth_username, password: auth_pw },
            content: { card: card }
        }
    ))
}

function xorHash(bytes: Uint8Array): number {
    let hash = 0;
    let offset = 0;
    for (let i = 0; i < bytes.length; i++) {
        hash ^= bytes[i] << offset;
        offset = (offset + 8) % 32;
    }
    return hash;
}