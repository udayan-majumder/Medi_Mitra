export class WebRTCHandler {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  handleOffer(socket, data) {
    const { roomId, offer } = data;
    const session = this.sessionService.getSession(roomId);

    if (
      session &&
      (session.userA === socket.id || session.userB === socket.id)
    ) {
      console.log(`Relaying WebRTC offer in room ${roomId}`);
      socket.to(roomId).emit("webrtc-offer", { roomId, offer });
    } else {
      console.log(
        `Invalid WebRTC offer attempt for room ${roomId} by ${socket.id}`
      );
    }
  }

  handleAnswer(socket, data) {
    const { roomId, answer } = data;
    const session = this.sessionService.getSession(roomId);

    if (
      session &&
      (session.userA === socket.id || session.userB === socket.id)
    ) {
      console.log(`Relaying WebRTC answer in room ${roomId}`);
      socket.to(roomId).emit("webrtc-answer", { roomId, answer });
    } else {
      console.log(
        `Invalid WebRTC answer attempt for room ${roomId} by ${socket.id}`
      );
    }
  }

  handleIceCandidate(socket, data) {
    const { roomId, candidate } = data;
    const session = this.sessionService.getSession(roomId);

    if (
      session &&
      (session.userA === socket.id || session.userB === socket.id)
    ) {
      socket.to(roomId).emit("webrtc-ice-candidate", { roomId, candidate });
    }
  }
}
