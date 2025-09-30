import express, { Express, Request, Response } from 'express';
import cors from "cors"
import { WebSocketServer } from 'ws';
import { OnBidRequest, OnMessageRequest, OnPlayRequest, OnRequestConnectOrReconnect, OnRequestRoom } from './Server';
import { Bid } from 'shared/src/Bid';
import { Card } from 'shared/src/Card';

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
    ws.on('error', console.error);
    ws.on('message', (msg: string) => {
        try {
            let obj: { cmd: string, auth: { username: string, password: number }, content: object } = JSON.parse(msg);

            let content;
            switch (obj.cmd) {
                case "connection request":
                    content = obj.content as { username: string, password: number }
                    OnRequestConnectOrReconnect(content.username, content.password, ws);
                    break;
                case "room request":
                    content = obj.content as { roomType: "create" | "join" | "auto", roomNumber: number }
                    OnRequestRoom(obj.auth, content)
                    break;
                case "message request":
                    content = obj.content as { message: string }
                    OnMessageRequest(obj.auth, content);
                    break;
                case "bid request":
                    content = obj.content as { bid: Bid }
                    OnBidRequest(obj.auth, content);
                    break;
                case "play request":
                    content = obj.content as { card: Card }
                    OnPlayRequest(obj.auth, content);
                    break;
                default: break;
            }
        }
        catch (e) { console.error(e); }
    });
});