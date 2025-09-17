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
import { LanguageStore } from "@/store/Dictionary.store";

export default function Symptom() {
  const [UserInput, setUserInput] = useState("");
  const [language, setlanguage] = useState("english");
  const [tempchat, settempchat] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const { User, LanguageType } = UserStore();
  const { Language } = LanguageStore();
  const [chatTriggered,setchatTrigger] = useState(false)

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

    if (!UserInput || !/[a-zA-Z0-9]/.test(UserInput.trim())) {
      return; // Exit if message is empty or contains no alphanumeric characters
    }
    
    setchatTrigger(true)
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
      setchatTrigger(false)
    }
  };

  const handleDeleteChat = async () => {
    if (
      window.confirm(Language?.[LanguageType]?.DeleteChatHistoryConfirmation)
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
      alert(Language?.[LanguageType]?.SpeechRecognitionNotSupported);
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
                className={`w-full flex items-center my-2 relative ${
                  items?.type === "model" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`h-auto max-w-[70%] px-4 py-2 rounded-2xl text-base shadow-md break-words tracking-wide
          ${
            items?.type === "model"
              ? "bg-green-100 text-green-800" // incoming
              : "bg-green-500 text-white" // outgoing
          }
        `}
                >
                  {items?.message}
                </div>

                {/* Loading indicator for last message */}
                {chatTriggered && index === tempchat.length - 1 && (
                  <div className="absolute -bottom-10 left-2 px-3 py-2 bg-green-600 text-white rounded flex space-x-1 items-center">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="h-[100%] w-full text-white text-xl flex flex-col justify-center items-center font-semibold">
              {Language?.[LanguageType]?.HowCanIAssistYouToday}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
        {/* chat input div */}
        <div className="h-[10%] w-full flex flex-row justify-center items-center gap-3.5 ">
          <input
            className="h-[60%] w-[65%] p-5 border-none  rounded-4xl bg-gray-100 text-gray-900 text-lg shadow-md shadow-gray-800 focus:outline-green-400"
            placeholder={Language?.[LanguageType]?.AskMeAnything}
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
