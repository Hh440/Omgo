import { User } from "./UserManager";


let GLOBAL_ROOM_ID=1;
interface Room{
    user1:User;
    user2:User;
   

}



export class RoomManagar{
    private rooms:Map<string,Room>

    constructor(){
        this.rooms=new Map<string,Room>()

    }

    createRoom(user1:User ,user2:User){
        const roomId= this.generate().toString()
        this.rooms.set(roomId.toString(),{
            user1,
            user2,
             
        })


         user1.socket.emit("send-offer",{
            // type:"send_offer",
            roomId
        })
    
    }



    // userLeft(roomId){
    //     const room= this.rooms.find(x=>x.roomId==roomId)

    // }





    onOffer(roomId:string,sdp:string,senderSocketid:string){


        const room = this.rooms.get(roomId)

        if(!room){
            return
        }

       const recevingUser =  room.user1.socket.id===senderSocketid?room.user2:room.user1

        const user2 = this.rooms.get(roomId)?.user2
        // console.log("on offer")
        // console.log("user2 is "+ user2)


        recevingUser?.socket.emit("offer",{
           sdp,
           roomId

        })

    }

    onAnswer(roomId:string,sdp:string,senderSocketid:string){


        const room = this.rooms.get(roomId)

        if(!room){
            return
        }


        const user1 = this.rooms.get(roomId)?.user1

        const receivingUser =  room.user1.socket.id === senderSocketid ?room.user2 :room.user1
        // console.log("onAnswer ")
        // console.log("user1 is "+user1)
        receivingUser?.socket.emit("answer",{
            sdp,
            roomId
        })

    }


    onIceCanditate(roomId:string,senderSocketid:string,candidate:any,type:"sender"|"receiver"){
       console.log("---------------------------------------------------")
       console.log(roomId)
       console.log(senderSocketid)
       console.log(candidate)
       console.log(type)




        const room = this.rooms.get(roomId)

        if(!room){
            return
        }

        const recievingUser= room.user1.socket.id === senderSocketid ? room.user2:room.user1
        recievingUser.socket.emit("add-ice-candidate",({candidate}))


    }

     generate(){
        return GLOBAL_ROOM_ID++;
    }
}