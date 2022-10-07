import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getProvider } from "./clients/getProvider";

dotenv.config();

const app: Express = express();
const port = process.env['PORT'];
const provider = getProvider()

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
