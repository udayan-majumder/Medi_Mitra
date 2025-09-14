export class SocketManager {
  constructor(io, connectionHandler, webrtcHandler) {
    this.io = io;
    this.connectionHandler = connectionHandler;
    this.webrtcHandler = webrtcHandler;
  }

  initialize() {
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("join-as-A", (data) =>
        this.connectionHandler.handleJoinAsA(socket, data)
      );
      socket.on("join-as-B", (data) =>
        this.connectionHandler.handleJoinAsB(socket, data)
      );
      socket.on("skip-user", (data) =>
        this.connectionHandler.handleSkipUser(socket, data)
      );
      socket.on("end-session", (data) =>
        this.connectionHandler.handleEndSession(socket, data)
      );
      socket.on("disconnect", () =>
        this.connectionHandler.handleDisconnect(socket)
      );

      socket.on("webrtc-offer", (data) =>
        this.webrtcHandler.handleOffer(socket, data)
      );
      socket.on("webrtc-answer", (data) =>
        this.webrtcHandler.handleAnswer(socket, data)
      );
      socket.on("webrtc-ice-candidate", (data) =>
        this.webrtcHandler.handleIceCandidate(socket, data)
      );
    });
  }
}
