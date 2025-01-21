import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());


// serving the client
app.use(express.static('../client/dist'));
app.get('/', (req: Request, res: Response) => { res.sendFile("index.html", { root: '../client/dist' }); });

//running the websocket server

// bind to port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;