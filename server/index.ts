import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;