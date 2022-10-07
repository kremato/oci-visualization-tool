import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getProvider } from "./clients/getProvider";
import { listCompartments } from './listCompartments';
import { Clients } from './clients/clients';

dotenv.config();

const app: Express = express();
const port = process.env['PORT'];
const tenancyId = process.env['TENANCY_ID']!;
const clients = Clients.getInstance()

app.get('/compartments', (req: Request, res: Response) => {
  const compartments = listCompartments(tenancyId, clients.identityClient, true)
  res.status(100).send(JSON.stringify(compartments));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
