"use client"
import { ClipboardPen,House,Store} from "lucide-react"

 export default function  MobileNavbarComponent ({height , width }) {
  return (
    <div className="bg-green-700 flex justify-around items-center" style={{height:`${height}%`, width:`${width}%`}}>
      <button className="h-[70%] w-[15%] bg-black rounded-4xl flex justify-center items-center">
        <ClipboardPen size={33} color="white" strokeWidth={1.5}/>
      </button>
      <button className="h-[70%] w-[15%] bg-black rounded-4xl flex justify-center items-center">
        <House size={33} color="white" strokeWidth={1.5}/>
      </button>
      <button className="h-[70%] w-[15%] bg-black rounded-4xl flex justify-center items-center">
        <Store size={33} color="white" strokeWidth={1.5}/>
      </button>
    </div>
  )
}

