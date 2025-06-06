import { Socket } from "socket.io";
import { RoomManagar } from "./RoomMananger";

let GLOBAL_ROOM_ID=1;

export interface User{
    socket:Socket;
    name:string;

}



export class UserManager{
    private users:User[]
    private queue:string[]
    private roomManager:RoomManagar
    constructor(){
        this.users=[]
        this.queue=[]
        this.roomManager=  new RoomManagar()


    }

    addUser(name:string,socket:Socket){
        this.users.push({
            name,
            socket
        })
        this.queue.push(socket.id)
        socket.emit("lobby")
        this.clearQueue()
        this.initHandlers(socket)


    }

    removeUser(socketId:string){
        const user= this.users.find(x=>x.socket.id===socketId)
        if( !user){

        }
        this.users= this.users.filter(x=>x.socket.id===socketId)
        this.queue= this.queue.filter(x=>x===socketId)


    }

    clearQueue(){

        console.log("inside clear Queues")
        console.log(this.queue.length)
        if(this.queue.length<2){
            return;
        }


        
        
        const id1 = this.queue.pop();
        const id2 = this.queue.pop()

        const user1=this.users.find(x=>x.socket.id === id1)
        const user2 = this.users.find(x=>x.socket.id===id2)

        

        if(!user1||!user2){
            return;

        }

        console.log("creating room ")


        const room =  this.roomManager.createRoom(user1,user2)
        this.clearQueue()

        // const roomId = this.generate()

       


    }

    initHandlers(socket:Socket){
        socket.on("offer",({sdp,roomId}:{sdp:string,roomId:string})=>{

            console.log("offer recieved")
            console.log(roomId)

            this.roomManager.onOffer(roomId,sdp,socket.id) 

        })

        socket.on("answer",({sdp,roomId}:{sdp:string,roomId:string})=>{

            console.log("answer recieved")

            this.roomManager.onAnswer(roomId,sdp,socket.id) 

        })

        socket.on("add-ice-candidate",({candidate,roomId,type})=>{

            this.roomManager.onIceCanditate(roomId,socket.id,candidate,type)






        })
    }


   
}