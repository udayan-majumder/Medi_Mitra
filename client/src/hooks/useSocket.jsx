import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (handlers = {}, userInfo = null) => {
  const [userState, setUserState] = useState({
    type: null,
    isConnected: false,
    isMatched: false,
    roomId: null,
    position: null,
  });

  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Disconnected');
  const socketRef = useRef(null);
  const handlersRef = useRef(handlers);

  // Update handlers ref when handlers change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SERVER_URL;
    socketRef.current = io(url, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      setUserState((prev) => ({ ...prev, isConnected: true }));
      setStatus('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      setUserState((prev) => ({ ...prev, isConnected: false }));
      setStatus('Disconnected from server');
    });

    socketRef.current.on('queued', (data) => {
      setUserState((prev) => ({
        ...prev,
        position: data.position,
        isMatched: false,
        roomId: null,
      }));
      setStatus(`Queued as ${data.userType==='A' ? 'Patient' : 'Doctor'} (Position: ${data.position})`);
    });

    socketRef.current.on('matched', (data) => {
      console.log('Matched event received:', data);
      
      setUserState((prev) => ({
        ...prev,
        isMatched: true,
        roomId: data.roomId,
      }));
      
      setStatus(`Matched! Starting video call...`);
      handlersRef.current.onMatched?.(data);
    });

    socketRef.current.on('skipped', () => {
      setStatus('You were skipped by your partner');
      setUserState((prev) => ({
        ...prev,
        isMatched: false,
        roomId: null,
      }));
      handlersRef.current.onSkipped?.();
    });

    socketRef.current.on('session-ended', () => {
      setStatus('Session ended by your partner');
      setUserState((prev) => ({
        ...prev,
        isMatched: false,
        roomId: null,
      }));
      handlersRef.current.onSessionEnded?.();
    });

    socketRef.current.on('partner-disconnected', () => {
      setStatus('Your partner disconnected');
      setUserState((prev) => ({
        ...prev,
        isMatched: false,
        roomId: null,
      }));
      handlersRef.current.onPartnerDisconnected?.();
    });

    socketRef.current.on('error', (data) => {
      setError(data.message);
    });

    // WebRTC signaling events
    socketRef.current.on('webrtc-offer', (data) => handlersRef.current.onWebRTCOffer?.(data));
    socketRef.current.on('webrtc-answer', (data) => handlersRef.current.onWebRTCAnswer?.(data));
    socketRef.current.on('webrtc-ice-candidate', (data) => handlersRef.current.onWebRTCIceCandidate?.(data));

    return () => {
      socketRef.current?.disconnect();
    };
  }, []); 

  const joinAsUserA = useCallback(() => {
    console.log("Joining as User A with userInfo:", userInfo);
    socketRef.current?.emit('join-as-A', { userInfo });
    setUserState((prev) => ({ ...prev, type: 'A' }));
    setStatus('Joining as User A...');
  }, [userInfo]);

  const joinAsUserB = useCallback(() => {
    console.log("Joining as User B with userInfo:", userInfo);
    socketRef.current?.emit('join-as-B', { userInfo });
    setUserState((prev) => ({ ...prev, type: 'B' }));
    setStatus('Joining as User B...');
  }, [userInfo]);

  const skipUser = useCallback(() => {
    if (socketRef.current && userState.roomId) {
      socketRef.current.emit('skip-user', { roomId: userState.roomId });
    }
  }, [userState.roomId]);

  const endSession = useCallback(() => {
    if (socketRef.current && userState.roomId) {
      socketRef.current.emit('end-session', { roomId: userState.roomId });
    }
  }, [userState.roomId]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    setUserState({
      type: null,
      isConnected: false,
      isMatched: false,
      roomId: null,
      position: null,
    });
    setStatus('Disconnected');
  }, []);

  return {
    userState,
    error,
    status,
    socket: socketRef.current,
    joinAsUserA,
    joinAsUserB,
    skipUser,
    endSession,
    disconnect,
  };
};