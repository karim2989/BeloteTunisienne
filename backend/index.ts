import express, { Express, Request, Response } from 'express';
import { WebSocket, WebSocketServer } from 'ws'
import cors from "cors"
import { ObjectType } from 'shared/src/OverTheNetworkObject';
import { OnPing, OnRequestBid, OnRequestConnectOrReconnect, OnRequestMessage, OnRequestRoom } from './Server';
const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors());

// serving the client
app.use(express.static('../client/dist'));
app.get('/', (req: Request, res: Response) => { res.sendFile("index.html", { root: '../client/dist' }); });

const s = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// running the websocket server
let wss = new WebSocketServer({ server: s });
wss.on('connection', function connection(ws) {
    ws.binaryType = 'arraybuffer';
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        try {
            let dv = new DataView(data as ArrayBuffer);
            switch (dv.getUint8(0)) {
                case ObjectType.Ping: OnPing(data as ArrayBuffer); break;
                case ObjectType.RequestConnectOrReconnect: OnRequestConnectOrReconnect(data as ArrayBuffer, ws); break;
                case ObjectType.RequestRoom: OnRequestRoom(data as ArrayBuffer, ws); break;
                case ObjectType.RequestMessage: OnRequestMessage(data as ArrayBuffer, ws); break;
                case ObjectType.RequestBid: OnRequestBid(data as ArrayBuffer, ws); break;
                default:
                    break;
            }
        }
        catch (e) { console.error(e); }
    });
});