
import { Socket } from "socket.io";
import { Server } from "socket.io";
import express from "express"
import http from "http"

import {join} from "node:path"


const app = express()
const server = http.createServer(app)

const io= new Server(app)



