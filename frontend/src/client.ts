let isOpen = false;
let isConnected = false;
let isInRoom = false;

export abstract class ExternalHooks {
    public static OnOpenOrClose: ((isOpen: boolean) => void)[] = [];
    public static OnConnectOrDisconnect: ((isConnected: boolean) => void)[] = [];
    public static OnEnterOrLeaveRoom: ((isInRoom: boolean) => void)[] = [];
    public static OnMessageRecived: ((sender: string, message: string) => void)[] = [];
}

let auth_username: string = ""
let auth_room: number = 0
let auth_pw: number = 0
let auth_inRoomIndex: number = -1

export function getUsername(): string { return auth_username; }
export function getRoomId(): number { return auth_room; }

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
        let content;
        console.log(obj);

        switch (obj.cmd) {
            case "connection accepted":
                isConnected = true;
                ExternalHooks.OnConnectOrDisconnect.forEach(e => e(true));
                break;
            case "room accepted":
                isInRoom = true;
                content = obj.content as { indexInRoom: number, roomNumber: number }
                auth_room = content.roomNumber;
                auth_inRoomIndex = content.indexInRoom;
                ExternalHooks.OnEnterOrLeaveRoom.forEach(e => e(true));
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

export function RequestMessage(message:string):void{
    ws.send(JSON.stringify(
        {
            cmd: "message request",
            auth: { username: auth_username, password: auth_pw },
            content: { message:message }
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