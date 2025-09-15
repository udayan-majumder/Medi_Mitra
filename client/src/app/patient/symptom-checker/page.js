"use client";
import { SendHorizontal, Mic, Trash2, MicOff } from "lucide-react";
import {
  AddToChatHistory,
  ModelSymptompAnalysis,
  GetChatHistory,
  DeleteChatHistory,
} from "@/services/model.services";
import { useState, useEffect, useRef } from "react";
import { UserStore } from "@/hooks/userauth.hooks";

export default function Symptom() {
  const [UserInput, setUserInput] = useState("");
  const [language, setlanguage] = useState("english");
  const [tempchat, settempchat] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
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

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === "hindi" ? "hi-IN" : "en-US";

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setUserInput((prev) => prev + (prev ? " " : "") + transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          alert(`Speech recognition error: ${event.error}`);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

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

  const handleDeleteChat = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all chat history? This action cannot be undone."
      )
    ) {
      try {
        const result = await DeleteChatHistory(User?.id);
        if (result) {
          settempchat([]);
          alert("Chat history deleted successfully!");
        } else {
          alert("Failed to delete chat history. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting chat history:", error);
        alert("An error occurred while deleting chat history.");
      }
    }
  };

  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    //main div
    <div className="h-screen w-full bg-gray-800 flex flex-col justify-start items-center poppins">
      {/* sub-main div left space for navbar */}
      <div className="h-[90%] w-full flex flex-col justify-between">
        {/* upper navbar div */}
        <div className="h-[10%] w-full bg-white flex justify-between items-center mt-15">
          <div className="h-full w-[20%] flex justify-center items-center">
            <button
              className="bg-red-500 hover:bg-red-600 h-10 w-10 rounded-full flex justify-center items-center transition-colors duration-200"
              onClick={handleDeleteChat}
              title="Delete Chat History"
            >
              <Trash2 className="text-white" size={"20px"} />
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
          <button
            className={`h-10 w-10 rounded-4xl flex justify-center items-center transition-colors duration-200 ${
              isListening
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-black hover:bg-gray-800"
            }`}
            onClick={toggleSpeechRecognition}
            title={isListening ? "Stop listening" : "Start voice input"}
            disabled={!speechSupported}
          >
            {isListening ? (
              <MicOff className="text-white" strokeWidth={"1.5px"} />
            ) : (
              <Mic className="text-white" strokeWidth={"1.5px"} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
