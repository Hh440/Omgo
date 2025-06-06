import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {io, Socket } from "socket.io-client"


 const URL= "http://localhost:3000"


export const Room = ({
    name,
    localAudioTrack,
    localVideoTrack
}:{
    name:string,
    localAudioTrack:MediaStreamTrack,
    localVideoTrack:MediaStreamTrack 
})=>{

    const [searachPramas , setSearchParamas]= useSearchParams()
    //const name = searachPramas.get("name")
    const [socket,setSocket]= useState<null|Socket>(null)
    const [connected,setConnected]= useState(false)
    const [lobby,setLobby]=useState(true)
    const [sendingPc,setSendingPc] = useState<null|RTCPeerConnection>(null)
    const [receivingPc,setReceivingPc] = useState<null|RTCPeerConnection>(null)
    const [remoteVideoTrack,setRemoteVideoTrack]= useState<MediaStreamTrack|null>(null)
    
    const [remotedAudioTrack,setRemoteAudioTrack]= useState<MediaStreamTrack|null>(null)
    const [remoteMediaStream,setRemoteMediaStream]= useState<MediaStream|null>(null)
    const remoteVideoRef= useRef<HTMLVideoElement | null>(null)
    const localVideoRef =  useRef<HTMLVideoElement|null>(null)
    
    useEffect(()=>{

        //logic to init user to the room 
        const socket= io(URL,{
            autoConnect:true
        })

        socket.on("send-offer",async ({roomId})=>{
            //setConnected(true)
            alert("send offer ")

            setLobby(false)
            const pc= new RTCPeerConnection()
            setSendingPc(pc)

            if(localAudioTrack){

                 pc.addTrack(localVideoTrack)

            }

            if(localVideoTrack){
                pc.addTrack(localAudioTrack)
            }

            //pc.addTrack(localAudioTrack)



            pc.onicecandidate = async(e) =>{

                console.log("receiving ice candidate locally")

                socket.emit("add-ice-candidate",{
                    candidate:e.candidate,
                    type:"sender",
                    roomId

                })
            }
            

           

            

           

            pc.onnegotiationneeded = async()=>{

             console.log("on negotiation needed, sending offer")
                    const sdp= await pc.createOffer() 

                 //@ts-ignore

                 pc.setLocalDescription(sdp)
                
                socket.emit("offer",{
                    sdp,
                    roomId
            })

                
                 
            }
 
            
        })

        socket.on("offer",async({roomId,sdp:remoteSdp})=>{

            console.log("recevied offer")

            alert("send answer please")
            setLobby(false)

            const pc= new RTCPeerConnection()
            pc.setRemoteDescription(remoteSdp)

            const sdp = await pc.createAnswer();

            //@ts-ignore

            pc.setLocalDescription(sdp)

            const stream = new MediaStream()

            if(remoteVideoRef.current){

                 remoteVideoRef.current.srcObject= stream

            }

        
            setRemoteMediaStream(stream)
            setReceivingPc(pc)

             pc.onicecandidate = async(e) =>{

                 console.log("on ice candidate on receving side")

                socket.emit("add-ice-candidate",{
                    candidate:e.candidate,
                    type:"receiver",
                    roomId
                })
            }


            pc.ontrack=(({track,type})=>{

                console.error("inside ontrack")
                if(type=='audio'){
                  //  setRemoteAudioTrack(track)

                  // @ts-ignore

                  remoteVideoRef.current?.srcObject.addTrack(track)
                }else{
                   // setRemoteVideoTrack(track)

                   // @ts-ignore

                   remoteVideoRef.current?.srcObject.addTrack(track)
                }

                //@ts-ignore

                remoteVideoRef.current.play()
            })


            
            socket.emit("answer",{
                sdp:sdp,
                roomId
            })

        })

        socket.on("answer",({roomId,sdp:remoteSdp})=>{
            setLobby(false)
            alert("connection done")
            setSendingPc(pc =>{
                pc?.setRemoteDescription(remoteSdp)

                return pc 
            })

            console.log("loop closed")
            

        })


        socket.on("lobby",()=>{
            setLobby(true)
        
        })


        socket.on("add-ice-candidate",({candidate,type})=>{

            console.log("add ice candidate from remote")
            console.log({candidate,type})
            if(type=='sender'){

                setReceivingPc(pc =>{


                    pc?.addIceCandidate(candidate)


                    return pc
                })

            }else{

                setSendingPc(pc =>{


                    pc?.addIceCandidate(candidate)


                    return pc
                })

            }



        })

        setSocket(socket)

    },[name])


    useEffect(()=>{
         if(localVideoRef.current){

            localVideoRef.current.srcObject = new MediaStream([localVideoTrack])

            localVideoRef.current.play()

         }
         
    },[localVideoRef])



    // if(lobby){
    //     return(
    //         <div>
    //             Waiting to connect you to someone
    //         </div>
    //     )
    // }
    return(
        <div>
            Hi {name}

              {lobby?"waiting to connect you to someone" : null}


            <div>

             <video autoPlay width={400} height={400} ref={localVideoRef}/>
           
            <video autoPlay width={400} height={400} ref={remoteVideoRef}/>

            </div>

            
        </div>
    )
}