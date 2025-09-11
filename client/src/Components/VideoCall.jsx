'use client';
import React, { useCallback } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useWebRTC } from '../hooks/useWebRTC';

const VideoCall = ({ userType }) => {
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
  const onMatched = useCallback((data) => {
    initializeWebRTC(data.roomId, data.userType, socketRef.current);
  }, [initializeWebRTC]);

  const onWebRTCOfferHandler = useCallback((data) => {
    handleWebRTCOffer(data, socketRef.current);
  }, [handleWebRTCOffer]);

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
    onSessionEnded: cleanupWebRTC,
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
    if (userType === 'A') {
      joinAsUserA();
    } else {
      joinAsUserB();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Status */}
        <div className="text-center mb-6">
          <p className="text-lg">{status}</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Before Match */}
        {!userState.isMatched ? (
          <div className="max-w-md mx-auto">
            {!userState.type ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-center mb-6">
                  Join as {userType==='A' ? 'Patient' : 'Doctor'}
                </h2>
                <button
                  onClick={handleJoin}
                  disabled={!userState.isConnected}
                  className={`w-full ${
                    userType === 'A' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors`}
                >
                  Join as User {userType==='A' ? 'Patient' : 'Doctor'}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg mb-4">
                  Waiting for a match as {userState.type === 'A' ? 'Patient' : 'Doctor'}...
                </p>
                {userState.position && (
                  <p className="text-gray-400">
                    Position in queue: {userState.position}
                  </p>
                )}
                <button
                  onClick={disconnect}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          // After Match
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">
                  You ({userState.type === 'A' ? 'Patient' : 'Doctor'})
                </h3>
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-64 bg-gray-700 rounded-lg"
                />
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Partner</h3>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-gray-700 rounded-lg"
                />
              </div>
            </div>

            <div className="text-center space-x-4">
              {userState.type === 'B' && (
                <>
                  <button
                    onClick={skipUser}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    Skip User
                  </button>
                  <button
                    onClick={endSession}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    End Session
                  </button>
                </>
              )}
              <button
                onClick={disconnect}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;