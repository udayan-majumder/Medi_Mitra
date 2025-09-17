"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { useWebRTC } from "../hooks/useWebRTC";
import { UserStore } from "@/hooks/userauth.hooks";
import Image from "next/image";
import BeforeMatchDoctor from "./BeforeMatchDoctor";

const VideoCallDoctor = () => {
  // Get user info from UserStore
  const { User } = UserStore();
  
  // State for patient information
  const [patientInfo, setPatientInfo] = useState({
    name: "Loading...",
    age: "",
    location: "",
    email: "",
    medicalConditions: [],
    prescriptions: []
  });

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
      console.log("Matched event received:", data);
      initializeWebRTC(data.roomId, data.userType, socketRef.current);
      
      // Update patient info if available
      if (data.patientData) {
        console.log("Patient data received:", data.patientData);
        setPatientInfo({
          name: data.patientData.name || "Unknown",
          age: data.patientData.age || "",
          location: data.patientData.location || "",
          email: data.patientData.email || "",
          medicalConditions: data.patientData.medicalConditions || [],
          prescriptions: data.patientData.prescriptions || []
        });
      } else {
        console.log("No patient data received");
        setPatientInfo({
          name: "No patient data available",
          age: "",
          location: "",
          email: "",
          medicalConditions: [],
          prescriptions: []
        });
      }
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
    console.log("Doctor joining with User:", User);
    if (!User) {
      console.error("No user data available for doctor");
      alert("Please log in first");
      return;
    }
    joinAsUserB();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="h-screen">
        {/* Before Match */}
        {!userState.isMatched ? (
          <BeforeMatchDoctor 
            userState={userState}
            error={error}
            status={status}
            onJoin={handleJoin}
            onDisconnect={disconnect}
          />
        ) : (
          // After Match - Video Call Interface
          <div className="flex h-screen">
            {/* Main Video Area */}
            <div className="flex-1 bg-green-900 relative">
              {/* Header with Logo */}
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <div>
                    <h1 className="text-green-500 font-bold text-lg">MEDIMITRA</h1>
                    <p className="text-white text-xs">YOUR HEALTH COMPANION</p>
                  </div>
                </div>
              </div>

              {/* Patient Video Feed - Full Area */}
              <div className="w-full h-full">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Doctor's Video Feed (Small) - Bottom Left Corner */}
              <div className="absolute bottom-20 left-6">
                <div className="w-32 h-24 bg-gray-300 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Control Bar */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                
                <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>

                <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors" onClick={skipUser}>
                  Next
                </button>

                <button 
                  onClick={endSession}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Exit
                </button>
              </div>
            </div>

            {/* Patient Info Sidebar */}
            <div className="w-80 bg-white p-6 overflow-y-auto">
              <h2 className="text-xl font-bold text-black mb-6">Patient Info:</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-semibold text-black">Name: </span>
                  <span className="text-gray-700">{patientInfo.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-black">Age: </span>
                  <span className="text-gray-700">{patientInfo.age}</span>
                </div>
                <div>
                  <span className="font-semibold text-black">Location: </span>
                  <span className="text-gray-700">{patientInfo.location}</span>
                </div>
                <div>
                  <span className="font-semibold text-black">Email: </span>
                  <span className="text-gray-700">{patientInfo.email}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-black mb-4">Medical Condition:</h3>
              <ul className="space-y-2 mb-6">
                {patientInfo.medicalConditions.length > 0 ? (
                  patientInfo.medicalConditions.map((condition, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                      <span className="text-gray-700">{condition}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No medical conditions recorded</li>
                )}
              </ul>

              <h3 className="text-xl font-bold text-black mb-4">Prescription:</h3>
              <div className="grid grid-cols-2 gap-3">
                {patientInfo.prescriptions.length > 0 ? (
                  patientInfo.prescriptions.map((prescriptionImage, index) => (
                    <div 
                      key={index} 
                      className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                      onClick={() => window.open(prescriptionImage, '_blank')}
                      title="Click to view full size"
                    >
                      {prescriptionImage ? (
                        <Image
                          src={prescriptionImage} 
                          alt={`Prescription ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-gray-500 italic text-center py-4">
                    No prescriptions available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default VideoCallDoctor;
