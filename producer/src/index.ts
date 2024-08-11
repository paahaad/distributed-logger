import express, {Express, Request, Response} from 'express';
import http from "http";
import bodyParser from "body-parser";

import { producer } from './kafka/index.js';


const PORT:number = 3000;
const app:Express = express();

// use of middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routers and controller
app.post('/', async (req: Request, res: Response)=>{
  console.log("🚀 Request Data: ",req.body)
  try{
    await producer.connect();
    console.log("✅ connected successfully")
    const respose = await producer.send({
      topic:"logger",
      messages:[{
        key:"data",
        value: JSON.stringify(req.body)
      }]
    })
    console.log("🚀 resposne from kafka send",respose)
    await producer.disconnect()
    res.status(200).json({status:'200', message: "Successfully Logged"})
  }catch{
    res.status(500).json({status:'500', message: "Internal Server Error"})
  }
  
})


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