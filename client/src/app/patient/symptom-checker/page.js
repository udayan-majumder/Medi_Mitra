import { ArrowLeft, SendHorizontal, Mic   } from "lucide-react"
import MobileNavbarComponent from "@/Components/mobilenavbar.components"


export default function Symptom() {
  return (
    //main div
  <div className="h-screen w-full bg-gray-300 flex flex-col justify-start items-center poppins">
    {/* sub-main div left space for navbar */}
  <div className="h-[90%] w-full flex flex-col justify-between">
    {/* upper navbar div */}
   <div className="h-[10%] w-full bg-white flex justify-between items-center">
    <div className="h-full w-[20%] flex justify-center items-center">
    <button> <ArrowLeft className="text-black" size={"35px"}/> </button>
    </div>
    <div>
      <img src="/logo.png" className="w-[150px] mr-2.5"/>
    </div>
   </div>

   {/* middle div jekhane chat hobe lol */}
  <div className="h-[75%] w-full bg-fuchsia-400 flex flex-col justify-center items-center overflow-y-auto">
    {/* default text jeta chat box dile hidden hoejbe hihi */}
   <div className="h-[10%] w-full text-gray-950 text-2xl flex flex-col justify-center items-center font-semibold"> How can I assist you today? </div>

   <div className="h-[7%] w-full flex justify-start items-center rounded-3xl text-xl pl-4">
    <div className="h-full w-auto bg-amber-300 flex justify-start items-center p-5 rounded-[20px]">
    hello
    </div>
   </div>
  </div>
  {/* chat input div */}
  <div className="h-[10%] w-full flex flex-row justify-center items-center gap-3.5 ">
  <input className="h-[60%] w-[65%] p-5 border-none  rounded-4xl bg-gray-100 text-gray-900 text-lg shadow-md shadow-gray-800" placeholder="Ask me anything">
  </input>
  {/* send button */}
  <button className="bg-black h-10 w-10 rounded-4xl flex justify-center items-center">
    <SendHorizontal strokeWidth={"1.5px"}/>
  </button>
  {/* voice button */}
  <button className="bg-black h-10 w-10 rounded-4xl flex justify-center items-center">
    <Mic strokeWidth={"1.5px"}/>
  </button>
  
  </div>
  
  </div>
  <MobileNavbarComponent height={10} width={100}/>
  </div>
  )
}
