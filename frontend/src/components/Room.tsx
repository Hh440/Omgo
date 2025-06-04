import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {io, Socket } from "socket.io-client"


 const URL= "http://localhost:3000"


export const Room = ()=>{

    const [searachPramas , setSearchParamas]= useSearchParams()
    const name = searachPramas.get("name")
    const [socket,setSocket]= useState<null|Socket>(null)
    const [connected,setConnected]= useState(false)
    const [lobby,setLobby]=useState(true)
   
    useEffect(()=>{

        //logic to init user to the room 
        const socket= io(URL,{
            autoConnect:true
        })

        socket.on("send-offer",({roomId})=>{
            //setConnected(true)
            alert("send offer ")

            setLobby(false)

            socket.emit("offer",{
                    sdp:"",
                    roomId
            })
        })

        socket.on("offer",({roomId,offer})=>{

            alert("send answer please")
            setLobby(false)
            socket.emit("answer",{
                sdp:"",
                roomId
            })

        })

        socket.on("answer",({roomId,answer})=>{
            setLobby(false)
            alert("connection done")
            

        })


        socket.on("lobby",()=>{
            setLobby(true)
        
        })

        setSocket(socket)

    },[name])



    if(lobby){
        return(
            <div>
                Waiting to connect you to someone
            </div>
        )
    }
    return(
        <div>
            Hi {name}


            <div>

              <video width={400} height={400}/>
               <video width={400} height={400}/>

            </div>

            <video width={400} height={400}/>
            <video width={400} height={400}/>
        </div>
    )
}