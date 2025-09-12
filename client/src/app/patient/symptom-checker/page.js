import { ArrowLeft } from "lucide-react"



export default function Symptom() {
  return (
    //main div
  <div className="h-screen w-full bg-gray-400 flex flex-col justify-start items-center">
    {/* sub-main div left space for navbar */}
  <div className="h-[90%] w-full bg-amber-300 flex flex-col justify-between">
    {/* upper navbar div */}
   <div className="h-[10%] w-full bg-white flex justify-between items-center">
    <div className="h-full w-[20%] flex justify-center items-center">
    <button> <ArrowLeft className="text-black" size={"35px"}/> </button>
    </div>
    <div>
      <img src="/logo.png" className="w-[150px] mr-2.5"/>
    </div>
   </div>


  <div className="h-[75%] w-full bg-fuchsia-400">

  </div>
  <div className="h-[10%] w-full bg-blue-400 flex flex-row justify-center items-center">
  <input className="h-[70%] w-[70%] p-5 border rounded-4xl bg-gray-100 text-gray-900 text-lg shadow-md shadow-gray-800">
  </input>
  <button></button>
  </div>
  </div>
  </div>
  )
}
