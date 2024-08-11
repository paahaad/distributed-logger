import express, {Express, Request, Response} from 'express';
import http from "http";
import bodyParser from "body-parser";

import { startBatchConsumer } from './kafka/index.js'

const PORT:number = 3001;
const app:Express = express();

// use of middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routers and controller
app.post('/', (req: Request, res: Response)=>{
  res.status(200).json({status:200, message: "consumer-service is running fine"})
})

await startBatchConsumer()

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Gracefully handle server closure
const closeServer = () => {
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};
process.on('unhandledRejection', closeServer)
process.on('SIGTERM', closeServer);
process.on('SIGINT', closeServer);