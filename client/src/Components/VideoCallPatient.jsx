"use client";
import React, { useCallback } from "react";
import { useSocket } from "../hooks/useSocket";
import { useWebRTC } from "../hooks/useWebRTC";
import { UserStore } from "@/hooks/userauth.hooks";
import Image from "next/image";
import { LanguageStore } from "@/store/Dictionary.store";
import { useRouter } from "next/navigation";
const VideoCallPatient = () => {
  // Get user info from UserStore
  const { User } = UserStore();
  
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
  }, User);

  // Store socket reference for use in callbacks
  const socketRef = React.useRef(socket);
  React.useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  const handleJoin = () => {
    console.log("Patient joining with User:", User);
    if (!User) {
      console.error("No user data available for patient");
      alert("Please log in first");
      return;
    }
    joinAsUserA();
  };
  
  const router = useRouter()
  const { LanguageType } = UserStore();
  const {Language} = LanguageStore()
  // Patient UI
  return (
    <div className="min-h-screen bg-gray-800 poppins py-12">
      {/* User Profile Section */}
      <div className="px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-lg">👤</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white-800">
              {Language?.[LanguageType]?.hello}, {User?.username}
            </h1>
            <p className="text-gray-300">{User?.location}</p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {status && (
        <div className="px-4 mb-4">
          <p className="text-center text-gray-300">{status}</p>
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
                 {Language?.[LanguageType]?.Connecting}
                </h2>
                <p className="text-gray-700 mb-6">
                 {Language?.[LanguageType]?.FindingDoctor}
                </p>

                {userState.position && (
                  <p className="text-gray-600 mb-4">
                   {Language?.[LanguageType]?.PositionInQueue} : {userState.position}
                  </p>
                )}

                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>

                <button
                  onClick={disconnect}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  {Language?.[LanguageType]?.Cancel}
                </button>
              </div>
            )}
          </div>
        ) : (
          // Video Call Interface for Patient
          <div className="space-y-1">
            <div className="bg-green-100 max-h-145 rounded-2xl p-3 relative">
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
                    className="w-full h-44 bg-gray-100 rounded-lg"
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
                    className="w-full h-44 bg-gray-100 rounded-lg"
                  />
                </div>
              </div>

              <div
               
                className="absolute bottom-0 left-0 h-10 w-full flex justify-center items-end p-1"
              >
               <button 
                onClick={disconnect}
                className="w-30 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-1 rounded-lg transition-colors text-sm"
               >
                End Call
               </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallPatient;
