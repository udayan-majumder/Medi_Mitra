import { useState, useRef, useCallback, useEffect } from 'react';

const rtcConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTC = () => {
  const [webRTCState, setWebRTCState] = useState({
    localStream: null,
    remoteStream: null,
  });

  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const initializeWebRTC = useCallback(async (
    roomId, 
    userType, 
    socket
  ) => {
    try {
      console.log('Initializing WebRTC for room:', roomId, 'as user type:', userType);
      
      // Ensure we're starting fresh
      if (peerConnectionRef.current) {
        console.warn('Peer connection already exists, closing it first');
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setWebRTCState((prev) => ({ ...prev, localStream: stream }));
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log('Local video element updated with stream');
        localVideoRef.current
          .play()
          .then(() => console.log('Local video started playing'))
          .catch((err) => console.warn('Local video autoplay failed:', err));
      } else {
        console.warn('Local video ref not available');
      }

      const pc = new RTCPeerConnection(rtcConfiguration);
      peerConnectionRef.current = pc;
      console.log('Created new peer connection');

      // Add local stream tracks to peer connection
      stream.getTracks().forEach((track) => {
        console.log('Adding track to peer connection:', track.kind);
        pc.addTrack(track, stream);
      });

      // Set up remote stream handling BEFORE creating offer/answer
      pc.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);
        console.log('Remote streams:', event.streams);
        
        if (event.streams && event.streams[0]) {
          const remoteStream = event.streams[0];
          console.log('Setting remote stream with tracks:', remoteStream.getTracks().length);
          
          setWebRTCState((prev) => ({ ...prev, remoteStream }));
          
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            console.log('Remote video element updated with stream');
            remoteVideoRef.current
              .play()
              .then(() => console.log('Remote video started playing'))
              .catch((err) => console.warn('Autoplay failed:', err));
          } else {
            console.warn('Remote video ref not available');
          }
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate');
          socket?.emit('webrtc-ice-candidate', {
            roomId,
            candidate: event.candidate,
          });
        } else {
          console.log('ICE gathering complete');
        }
      };

      // Connection state monitoring
      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
        if (pc.connectionState === 'failed') {
          console.error('WebRTC connection failed - attempting to restart');
          // Attempt to restart the connection
          setTimeout(() => {
            if (peerConnectionRef.current && peerConnectionRef.current.connectionState === 'failed') {
              console.log('Restarting WebRTC connection...');
              initializeWebRTC(roomId, userType, socket);
            }
          }, 2000);
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', pc.iceConnectionState);
        if (pc.iceConnectionState === 'failed') {
          console.error('ICE connection failed - attempting to restart');
          // Attempt to restart the connection
          setTimeout(() => {
            if (peerConnectionRef.current && peerConnectionRef.current.iceConnectionState === 'failed') {
              console.log('Restarting ICE connection...');
              initializeWebRTC(roomId, userType, socket);
            }
          }, 2000);
        }
      };

      // Map user types: doctor creates offer, patient waits for offer
      if (userType === 'doctor') {
        console.log('Doctor creating offer...');
        // Small delay to ensure everything is set up
        setTimeout(async () => {
          try {
            const offer = await pc.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            });
            await pc.setLocalDescription(offer);
            console.log('Doctor sending offer');
            socket?.emit('webrtc-offer', {
              roomId,
              offer,
            });
          } catch (err) {
            console.error('Error creating offer:', err);
          }
        }, 100);
      } else {
        console.log('Patient waiting for offer...');
      }
    } catch (err) {
      console.error('Error initializing WebRTC:', err);
      throw new Error('Failed to access camera/microphone');
    }
  }, []);

  const handleWebRTCOffer = useCallback(async (data, socket) => {
    console.log('Received WebRTC offer');
    // Race-condition guard: ensure PC and local media exist before answering
    if (!peerConnectionRef.current) {
      await initializeWebRTC(data.roomId, 'patient', socket);
    }
    const pc = peerConnectionRef.current;
    if (!pc) {
      console.error('No peer connection available after init');
      return;
    }
    try {
      await pc.setRemoteDescription(data.offer);
      console.log('Set remote description (offer)');
      const answer = await pc.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(answer);
      console.log('Created and set local description (answer)');
      socket?.emit('webrtc-answer', {
        roomId: data.roomId,
        answer,
      });
    } catch (err) {
      console.error('Error handling WebRTC offer:', err);
    }
  }, [initializeWebRTC]);

  const handleWebRTCAnswer = useCallback(async (data) => {
    console.log('Received WebRTC answer');
    const pc = peerConnectionRef.current;
    if (!pc) {
      console.error('No peer connection available');
      return;
    }
    
    try {
      await pc.setRemoteDescription(data.answer);
      console.log('Set remote description (answer)');
    } catch (err) {
      console.error('Error handling WebRTC answer:', err);
    }
  }, []);

  const handleWebRTCIceCandidate = useCallback(async (data) => {
    console.log('Received ICE candidate');
    const pc = peerConnectionRef.current;
    if (!pc) {
      console.error('No peer connection available');
      return;
    }
    
    try {
      await pc.addIceCandidate(data.candidate);
      console.log('Added ICE candidate');
    } catch (err) {
      console.error('Error adding received ICE candidate', err);
    }
  }, []);

  const cleanupWebRTC = useCallback(() => {
    if (webRTCState.localStream) {
      webRTCState.localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    // Clear video element sources to avoid stale streams between sessions
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setWebRTCState({
      localStream: null,
      remoteStream: null,
    });
  }, [webRTCState.localStream]);

  // Monitor video elements and ensure streams are properly connected
  useEffect(() => {
    const checkVideoElements = () => {
      if (webRTCState.localStream && localVideoRef.current && !localVideoRef.current.srcObject) {
        console.log('Reconnecting local video stream');
        localVideoRef.current.srcObject = webRTCState.localStream;
      }
      if (webRTCState.remoteStream && remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
        console.log('Reconnecting remote video stream');
        remoteVideoRef.current.srcObject = webRTCState.remoteStream;
      }
    };

    const interval = setInterval(checkVideoElements, 1000);
    return () => clearInterval(interval);
  }, [webRTCState.localStream, webRTCState.remoteStream]);

  return {
    webRTCState,
    localVideoRef,
    remoteVideoRef,
    initializeWebRTC,
    handleWebRTCOffer,
    handleWebRTCAnswer,
    handleWebRTCIceCandidate,
    cleanupWebRTC,
  };
};