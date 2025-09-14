"use client";
import React, { useCallback } from "react";
import { useSocket } from "../hooks/useSocket";
import { useWebRTC } from "../hooks/useWebRTC";
import { UserStore } from "@/hooks/userauth.hooks";
import Image from "next/image";
import { LanguageStore } from "@/store/Dictionary.store";
import { useRouter } from "next/navigation";
const VideoCallPatient = () => {
  const {
    localVideoRef,
    remoteVideoRef,
    initializeWebRTC,
    handleWebRTCOffer,
    handleWebRTCAnswer,
    handleWebRTCIceCandidate,
    cleanupWebRTC,
  } = useWebRTC();

  // Memoize handlers to prevent socket reconnections
  const onMatched = useCallback(
    (data) => {
      initializeWebRTC(data.roomId, data.userType, socketRef.current);
    },
    [initializeWebRTC]
  );

  const onWebRTCOfferHandler = useCallback(
    (data) => {
      handleWebRTCOffer(data, socketRef.current);
    },
    [handleWebRTCOffer]
  );

  const {
    userState,
    error,
    status,
    socket,
    joinAsUserA,
    joinAsUserB,
    skipUser,
    endSession,
    disconnect,
  } = useSocket({
    onMatched,
    onSkipped: cleanupWebRTC,
    onSessionEnded: () => {
      cleanupWebRTC();
      disconnect();
    },
    onPartnerDisconnected: cleanupWebRTC,
    onWebRTCOffer: onWebRTCOfferHandler,
    onWebRTCAnswer: handleWebRTCAnswer,
    onWebRTCIceCandidate: handleWebRTCIceCandidate,
  });

  // Store socket reference for use in callbacks
  const socketRef = React.useRef(socket);
  React.useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  const handleJoin = () => {
      joinAsUserA();
  };
  
  const router = useRouter()
  const { User,LanguageType } = UserStore();
  const {Language} = LanguageStore()
  // Patient UI
  return (
    <div className="min-h-screen bg-white poppins">
      {/* User Profile Section */}
      <div className="px-1 py-4">
        <div className="flex justify-center items-center space-x-6">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-lg">👤</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {Language?.[LanguageType]?.hello}, {User?.username}
            </h1>
            <p className="text-gray-500">{User?.location}</p>
          </div>
          <div className="h-full w-[40%] flex justify-center items-center">
            <button className="border border-green-500 text-gray-400 p-1 rounded-lg active:bg-green-500 active:text-white" onClick={()=>{
              router.push("/patient/profile")
            }}>{Language?.[LanguageType]?.checkprofile}</button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {status && (
        <div className="px-4 mb-4">
          <p className="text-center text-gray-600">{status}</p>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>
      )}

      {/* Main Content */}
      <div className="px-4">
        {/* Need Help Section */}
        {!userState.isMatched ? (
          <div className="space-y-6">
            {!userState.type ? (
              <div
                className="bg-green-100 rounded-2xl p-6"
                style={{ backgroundColor: "#9CDB6C", opacity: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {Language?.[LanguageType]?.headinghelp}
                </h2>
                <p className="text-gray-700 mb-6">
                  {Language?.[LanguageType]?.headinghomepatient}
                </p>

                {/* Medical Consultation Illustration */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <Image
                      src="/doctor-consulting-vector.png"
                      alt="doctor-consulting"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>

                <button
                  onClick={handleJoin}
                  disabled={!userState.isConnected}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-colors"
                  style={{ backgroundColor: "#378E31" }}
                >
                  {Language?.[LanguageType]?.connectnowbtn}
                </button>
              </div>
            ) : (
              <div
                className="bg-green-100 rounded-2xl p-6"
                style={{ backgroundColor: "#9CDB6C", opacity: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Connecting...
                </h2>
                <p className="text-gray-700 mb-6">
                  Finding a doctor for you...
                </p>

                {userState.position && (
                  <p className="text-gray-600 mb-4">
                    Position in queue: {userState.position}
                  </p>
                )}

                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>

                <button
                  onClick={disconnect}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          // Video Call Interface for Patient
          <div className="space-y-6">
            <div className="bg-green-100 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Connected with Doctor
              </h2>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    You (Patient)
                  </h3>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-48 bg-gray-100 rounded-lg"
                  />
                </div>

                <div className="bg-white rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Doctor
                  </h3>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-48 bg-gray-100 rounded-lg"
                  />
                </div>
              </div>

              <button
                onClick={disconnect}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                End Call
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallPatient;
