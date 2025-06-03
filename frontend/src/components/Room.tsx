import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"


export const Room = ()=>{

    const [searachPramas , setSearchParamas]= useSearchParams()
    const name = searachPramas.get("name")
    useEffect(()=>{

        //logic to init user to the room 

    },[name])
    return(
        <div>
            Hi {name}
        </div>
    )
}