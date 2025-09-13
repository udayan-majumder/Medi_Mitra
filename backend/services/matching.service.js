import { generateRoomId } from "../utils/helpers.js";

export class MatchingService {
  constructor(queueService, sessionService) {
    this.queueService = queueService;
    this.sessionService = sessionService;
  }

  matchUsers() {
    if (!this.queueService.hasAvailableUsers()) {
      return null;
    }

    const userA = this.queueService.getRandomUserA();
    const userB = this.queueService.getNextUserB();

    if (!userA || !userB) return null;

    const roomId = generateRoomId();

    // Create session
    this.sessionService.createSession(roomId, userA.socketId, userB.socketId);

    // Join both users to the room
    userA.socket.join(roomId);
    userB.socket.join(roomId);

    // Notify both users about the match
    userA.socket.emit("matched", { roomId, userType: "A", partnerType: "B" });
    userB.socket.emit("matched", { roomId, userType: "B", partnerType: "A" });

    // Mark User A as consumed
    this.queueService.markUserAConsumed(userA.socketId);

    console.log(
      `Matched User A (${userA.socketId}) with User B (${userB.socketId}) in room ${roomId}`
    );

    return { userA: userA.socketId, userB: userB.socketId, roomId };
  }
}
