import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Room } from "./Room"


export const Landing = ()=>{

    const [name,setName] =useState("")

    const [joined,setJoined]= useState(false)
    const [localAudioTrack,setLocalAudioTrack]= useState<MediaStreamTrack|null>(null)
    const [localVideoTrack,setLocalVideoTrack] = useState<MediaStreamTrack|null>(null)
    const videoRef = useRef<HTMLVideoElement|null>(null)



    const getCam = async()=>{

       const stream = await window.navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        })

        const audioTrack =  stream.getAudioTracks()[0]
        const videoTrack =  stream.getVideoTracks()[0]

        setLocalAudioTrack(audioTrack)
        setLocalVideoTrack(videoTrack)
        if(!videoRef.current){
            return
        }

        // const stream2 = new MediaStream()
       // stream2.addTrack(videoTrack)
        videoRef.current.srcObject= new MediaStream([videoTrack])
        videoRef.current.play()
    }
    useEffect(()=>{

        if(videoRef && videoRef.current){
             getCam()
        }
         
    },[videoRef])


    if(!joined){

        return(
        <div>
            <video autoPlay ref={videoRef}></video>
           <input type="text" placeholder="Name" onChange={(e)=>{
            setName(e.target.value)
           }}/>

           <button  onClick={()=>{
            //join room logic
            setJoined(true)
           }}>

            Join room 

           </button>
        </div>
    )
    }


    return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack}/>

    
}