export class ConnectionHandler {
  constructor(queueService, sessionService, matchingService, io) {
    this.queueService = queueService;
    this.sessionService = sessionService;
    this.matchingService = matchingService;
    this.io = io;
  }

  handleJoinAsA(socket) {
    console.log(`User ${socket.id} joined as User A`);

    if (this.queueService.isUserAConsumed(socket.id)) {
      socket.emit("error", { message: "User A can only connect once" });
      return;
    }

    const { inA, inB } = this.queueService.findUserInQueues(socket.id);
    const inSession = this.sessionService.isInActiveSession(socket.id);

    if (inA || inB || inSession) {
      socket.emit("error", { message: "User already in queue" });
      return;
    }

    const position = this.queueService.addUserA(socket.id, socket);
    socket.emit("queued", { userType: "A", position });

    this.matchingService.matchUsers();
  }

  handleJoinAsB(socket) {
    console.log(`User ${socket.id} joined as User B`);

    const { inA, inB } = this.queueService.findUserInQueues(socket.id);
    const inSession = this.sessionService.isInActiveSession(socket.id);

    if (inA || inB || inSession) {
      socket.emit("error", { message: "User already in queue" });
      return;
    }

    const position = this.queueService.addUserB(socket.id, socket);
    socket.emit("queued", { userType: "B", position });

    this.matchingService.matchUsers();
  }

  handleSkipUser(socket, data) {
    const { roomId } = data;
    const session = this.sessionService.getSession(roomId);

    if (!session || session.userB !== socket.id) {
      socket.emit("error", { message: "Invalid session or not authorized" });
      return;
    }

    console.log(
      `User B (${socket.id}) skipping User A (${session.userA}) in room ${roomId}`
    );

    const userASocket = this.io.sockets.sockets.get(session.userA);
    if (userASocket) {
      userASocket.emit("skipped");
      userASocket.leave(roomId);
    }

    socket.leave(roomId);
    this.sessionService.deleteSession(roomId);

    setTimeout(() => {
      const position = this.queueService.addUserB(socket.id, socket);
      socket.emit("queued", { userType: "B", position });

      const matched = this.matchingService.matchUsers();
      console.log(
        `User B re-queued, match attempt result: ${
          matched ? "success" : "no match"
        }`
      );
    }, 100);
  }

  handleEndSession(socket, data) {
    const { roomId } = data;
    const session = this.sessionService.getSession(roomId);

    if (!session || session.userB !== socket.id) {
      socket.emit("error", { message: "Invalid session or not authorized" });
      return;
    }

    console.log(
      `User B (${socket.id}) ending session with User A (${session.userA}) in room ${roomId}`
    );

    const userASocket = this.io.sockets.sockets.get(session.userA);
    if (userASocket) {
      userASocket.emit("session-ended");
      userASocket.leave(roomId);
    }

    socket.leave(roomId);
    this.sessionService.deleteSession(roomId);

    setTimeout(() => {
      const position = this.queueService.addUserB(socket.id, socket);
      socket.emit("queued", { userType: "B", position });

      setTimeout(() => {
        const matched = this.matchingService.matchUsers();
        console.log(
          `User B re-queued after session end, match attempt result: ${
            matched ? "success" : "no match"
          }`
        );
      }, 200);
    }, 100);
  }

  handleDisconnect(socket) {
    console.log(`User disconnected: ${socket.id}`);

    const removedFromA = this.queueService.removeUserA(socket.id);
    const removedFromB = this.queueService.removeUserB(socket.id);

    if (removedFromA) console.log(`Removed ${socket.id} from User A queue`);
    if (removedFromB) console.log(`Removed ${socket.id} from User B queue`);

    const sessionInfo = this.sessionService.findSessionByUser(socket.id);

    if (sessionInfo) {
      const { roomId, session } = sessionInfo;
      console.log(`Cleaning up session ${roomId} due to disconnection`);

      const otherUserId =
        session.userA === socket.id ? session.userB : session.userA;
      const otherUserSocket = this.io.sockets.sockets.get(otherUserId);

      if (otherUserSocket) {
        otherUserSocket.emit("partner-disconnected");
        otherUserSocket.leave(roomId);
      }

      this.sessionService.deleteSession(roomId);

      if (session.userA === socket.id && otherUserSocket) {
        setTimeout(() => {
          const position = this.queueService.addUserB(
            otherUserId,
            otherUserSocket
          );
          otherUserSocket.emit("queued", { userType: "B", position });
          this.matchingService.matchUsers();
        }, 100);
      }
    }
  }
}
