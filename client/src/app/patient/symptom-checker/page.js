"use client";
import { ArrowLeft, SendHorizontal, Mic } from "lucide-react";
import {
  AddToChatHistory,
  ModelSymptompAnalysis,
  GetChatHistory,
} from "@/services/model.services";
import { useState, useEffect, useRef } from "react";
import { UserStore } from "@/hooks/userauth.hooks";

export default function Symptom() {
  const [UserInput, setUserInput] = useState("");
  const [language, setlanguage] = useState("english");
  const [tempchat, settempchat] = useState([]);
  const messagesEndRef = useRef(null);
  const { User } = UserStore();

  const loadChatHistory = async () => {
    if (User?.id) {
      try {
        const chatData = await GetChatHistory(User.id);
        if (chatData?.chat && chatData.chat.length > 0) {
          const formattedChat = chatData.chat.map((chat) => ({
            type: chat.sender,
            message: chat.message,
          }));
          settempchat(formattedChat);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tempchat]);

  useEffect(() => {
    loadChatHistory();
  }, [User?.id]);

  const AddChat = async () => {
    tempchat.length > 0
      ? settempchat((prev) => [...prev, { type: "user", message: UserInput }])
      : settempchat([{ type: "user", message: UserInput }]);
    await AddToChatHistory(User?.id, "user", UserInput);
    ChatFlow();
  };

  const ChatFlow = async () => {
    const res = await ModelSymptompAnalysis(UserInput, language);
    if (res?.response) {
      await AddToChatHistory(User?.id, "model", res?.response);
      settempchat((prev) => [
        ...prev,
        { type: "model", message: res?.response },
      ]);
    }
  };

  return (
    //main div
    <div className="h-screen w-full bg-gray-300 flex flex-col justify-start items-center poppins">
      {/* sub-main div left space for navbar */}
      <div className="h-[90%] w-full flex flex-col justify-between">
        {/* upper navbar div */}
        <div className="h-[10%] w-full bg-white flex justify-between items-center">
          <div className="h-full w-[20%] flex justify-center items-center">
            <button>
              {" "}
              <ArrowLeft className="text-black" size={"35px"} />{" "}
            </button>
          </div>
          <div className="h-[40%] w-[30%] text-black flex justify-center items-center bg-gray-300 rounded-lg">
            <button
              className={
                language === "english"
                  ? "h-full w-[50%] flex justify-center items-center bg-green-500 text-white rounded-lg"
                  : "h-full w-[50%] flex justify-center items-center none text-white rounded-lg"
              }
              onClick={() => setlanguage("english")}
            >
              EN
            </button>
            <button
              className={
                language === "hindi"
                  ? "h-full w-[50%] flex justify-center items-center bg-green-500 text-white rounded-lg"
                  : "h-full w-[50%] flex justify-center items-center none text-white rounded-lg"
              }
              onClick={() => setlanguage("hindi")}
            >
              हि
            </button>
          </div>
          <div>
            <img src="/logo.png" className="w-[150px] mr-2.5" />
          </div>
        </div>

        {/* middle div jekhane chat hobe lol */}
        <div className="h-[75%] w-full  flex flex-col justify-start items-center overflow-y-auto space-y-3 p-3">
          {/* default text jeta chat box dile hidden hoejbe hihi */}

          {tempchat?.length > 0 ? (
            tempchat?.map((items, index) => (
              <div
                key={index}
                className={
                  items?.type === "model"
                    ? "h-auto w-full flex justify-start items-center rounded-3xl text-xl pl-4"
                    : "h-auto w-full flex justify-end items-center rounded-3xl text-xl pl-4"
                }
              >
                <div
                  className={
                    items?.type === "model"
                      ? "h-auto w-[70%] bg-black flex justify-start items-center p-2 rounded-[20px]"
                      : "h-auto w-[70%] bg-blue-500 flex justify-start items-center p-2 rounded-[20px]"
                  }
                >
                  {items?.message}
                </div>
              </div>
            ))
          ) : (
            <div className="h-[100%] w-full text-gray-950 text-2xl flex flex-col justify-center items-center font-semibold">
              {" "}
              How can I assist you today?{" "}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* chat input div */}
        <div className="h-[10%] w-full flex flex-row justify-center items-center gap-3.5 ">
          <input
            className="h-[60%] w-[65%] p-5 border-none  rounded-4xl bg-gray-100 text-gray-900 text-lg shadow-md shadow-gray-800 focus:outline-green-400"
            placeholder="Ask me anything"
            onChange={(e) => setUserInput(e.target.value)}
            value={UserInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                AddChat();
                setUserInput("");
              }
            }}
          ></input>
          {/* send button */}
          <button
            className="bg-black h-10 w-10 rounded-4xl flex justify-center items-center"
            onClick={() => {
              AddChat();
              setUserInput("");
            }}
          >
            <SendHorizontal strokeWidth={"1.5px"} />
          </button>
          {/* voice button */}
          <button className="bg-black h-10 w-10 rounded-4xl flex justify-center items-center">
            <Mic strokeWidth={"1.5px"} />
          </button>
        </div>
      </div>
    </div>
  );
}
