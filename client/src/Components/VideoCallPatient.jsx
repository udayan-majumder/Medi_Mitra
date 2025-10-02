"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { useWebRTC } from "../hooks/useWebRTC";
import { UserStore } from "@/hooks/userauth.hooks";
import Image from "next/image";
import { LanguageStore } from "@/store/Dictionary.store";
import { useRouter } from "next/navigation";
import { usePatientStore } from "@/hooks/usePatient.hooks";
import { SpecializationSelector } from "./SpecializationSelector";
import { GetUserTier } from "@/services/usertier.services";

const VideoCallPatient = () => {
  // Get user info from UserStore
  const { User } = UserStore();
  const  {PatientProfile} = usePatientStore();
  
  // User tier and specialization state
  const [userTier, setUserTier] = useState('regular');
  const [selectedSpecialization, setSelectedSpecialization] = useState('General Physician');
  const [isLoadingTier, setIsLoadingTier] = useState(true);
  
  // Fetch user tier on component mount
  useEffect(() => {
    const fetchUserTier = async () => {
      try {
        const tierData = await GetUserTier();
        setUserTier(tierData.userTier || 'regular');
      } catch (error) {
        console.error("Error fetching user tier:", error);
        setUserTier('regular');
      } finally {
        setIsLoadingTier(false);
      }
    };
    
    if (User) {
      fetchUserTier();
    } else {
      setIsLoadingTier(false);
    }
  }, [User]);
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
    onDisconnect: cleanupWebRTC,
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
    console.log("Patient Profile:", PatientProfile);
    console.log("User Tier:", userTier);
    console.log("Selected Specialization:", selectedSpecialization);
    
    if (!User) {
      console.error("No user data available for patient");
      alert("Please log in first");
      return;
    }
    if (!PatientProfile) {
      console.error("No patient profile selected");
      alert("Please select a patient profile first");
      return;
    }
    
    const userInfoWithProfile = {
      ...User,
      profileId: PatientProfile.profileid,
      userTier: userTier,
      specialization: selectedSpecialization
    };
    
    console.log("Joining with profile ID:", PatientProfile.profileid);
    console.log("Joining queue for:", selectedSpecialization);
    joinAsUserA(userInfoWithProfile);
  };
  
  const router = useRouter()
  const { LanguageType } = UserStore();
  const {Language} = LanguageStore()
  // Patient UI
  return (
    <div className="min-h-screen bg-gray-800 poppins">
      {/* User Profile Section */}
      <div className="px-4 py-4 sticky top-0 bg-gray-800 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-lg">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-white truncate">
              {Language?.[LanguageType]?.hello}, {PatientProfile?.name}
            </h1>
            <p className="text-gray-300 text-sm truncate">{User?.location}</p>
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
      <div className="px-4 pb-6">
        {/* Need Help Section */}
        {!userState.isMatched ? (
          <div className="space-y-4">
            {!userState.type ? (
              <div
                className="bg-green-100 rounded-2xl p-4"
                style={{ backgroundColor: "#9CDB6C", opacity: 0.6 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {Language?.[LanguageType]?.headinghelp}
                </h2>
                <p className="text-gray-700 mb-4 text-sm">
                  {Language?.[LanguageType]?.headinghomepatient}
                </p>

                {/* User tier badge */}
                {!isLoadingTier && (
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      userTier === 'premium' 
                        ? 'bg-yellow-400 text-gray-900' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {userTier === 'premium' ? '⭐ Premium User' : '👤 Regular User'}
                    </span>
                  </div>
                )}

                {/* Specialization Selector for Premium Users */}
                {!isLoadingTier && userTier === 'premium' && (
                  <SpecializationSelector
                    selectedSpecialization={selectedSpecialization}
                    onSpecializationChange={setSelectedSpecialization}
                    disabled={!userState.isConnected}
                  />
                )}

                {/* Regular users info */}
                {!isLoadingTier && userTier === 'regular' && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      You will be connected with a General Physician. Upgrade to Premium to access specialized doctors.
                    </p>
                  </div>
                )}

                {/* Medical Consultation Illustration */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <Image
                      src="/doctor-consulting-vector.png"
                      alt="doctor-consulting"
                      width={80}
                      height={80}
                      className="w-20 h-20"
                    />
                  </div>
                </div>

                <button
                  onClick={handleJoin}
                  disabled={!userState.isConnected || isLoadingTier}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-colors touch-manipulation"
                  style={{ backgroundColor: "#378E31" }}
                >
                  {isLoadingTier ? 'Loading...' : Language?.[LanguageType]?.connectnowbtn}
                </button>
              </div>
            ) : (
              <div
                className="bg-green-100 rounded-2xl p-4"
                style={{ backgroundColor: "#9CDB6C", opacity: 0.6 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                 {Language?.[LanguageType]?.Connecting}
                </h2>
                <p className="text-gray-700 mb-4 text-sm">
                 {Language?.[LanguageType]?.FindingDoctor}
                </p>

                {userState.position && (
                  <p className="text-gray-600 mb-4 text-sm">
                   {Language?.[LanguageType]?.PositionInQueue} : {userState.position}
                  </p>
                )}

                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                </div>

                <button
                  onClick={disconnect}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors touch-manipulation"
                >
                  {Language?.[LanguageType]?.Cancel}
                </button>
              </div>
            )}
          </div>
        ) : (
          // Video Call Interface for Patient
          <div className="space-y-2">
            <div className="bg-green-100 rounded-2xl p-4 relative">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Connected with Doctor
              </h2>

              <div className="grid grid-cols-1 gap-3 mb-4">
                <div className="bg-white rounded-xl p-3">
                  <h3 className="text-xs font-medium text-gray-600 mb-2">
                    You (Patient)
                  </h3>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-32 bg-gray-100 rounded-lg"
                  />
                </div>

                <div className="bg-white rounded-xl p-3">
                  <h3 className="text-xs font-medium text-gray-600 mb-2">
                    Doctor
                  </h3>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    muted={false}
                    className="w-full h-32 bg-gray-100 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-center">
               <button 
                onClick={disconnect}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm touch-manipulation"
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
