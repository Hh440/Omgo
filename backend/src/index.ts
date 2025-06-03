
import { Socket } from "socket.io";
import { Server } from "socket.io";
import express from "express"
import http from "http"

import {join} from "node:path"


const app = express()
const server = http.createServer(app)

const io= new Server(server)

io.on("connection",(scoket:Socket)=>{
    console.log("User connected")

})

server.listen(3000, () => {
  console.log('listening on *:3000');
});



