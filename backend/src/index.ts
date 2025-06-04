
import { Socket } from "socket.io";
import { Server } from "socket.io";
import express from "express"
import http from "http"

import {join} from "node:path"
import { UserManager } from "./managers/UserManager";


const app = express()
const server = http.createServer(app)

const io= new Server(server,{
  cors: {
    origin: "*"
  }
})



const userManager = new UserManager() 

io.on("connection",(socket:Socket)=>{
    console.log("User connected")

    userManager.addUser("random_name",socket)

    socket.on("disconnect",()=>{
      userManager.removeUser(socket.id)

    })


})

server.listen(3000, () => {
  console.log('listening on *:3000');
});



