import { generateRoomId } from "../utils/helpers.js";
import { GetCompletePatientInfo } from "../models/user.models.js";

export class MatchingService {
  constructor(queueService, sessionService) {
    this.queueService = queueService;
    this.sessionService = sessionService;
  }

  async matchUsers() {
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

    // Get patient data if userA is a patient
    let patientData = null;
    console.log("UserA socket userInfo:", userA.socket.userInfo);
    if (userA.socket.userInfo && userA.socket.userInfo.id) {
      try {
        patientData = await GetCompletePatientInfo(userA.socket.userInfo.id);
        console.log("Patient data retrieved:", patientData);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    } else {
      console.log("No userInfo found for userA or missing ID");
    }

    // Notify both users about the match
    userA.socket.emit("matched", { 
      roomId, 
      userType: "A", 
      partnerType: "B",
      patientData: patientData 
    });
    userB.socket.emit("matched", { 
      roomId, 
      userType: "B", 
      partnerType: "A",
      patientData: patientData 
    });

    // Mark User A as consumed
    this.queueService.markUserAConsumed(userA.socketId);

    console.log(
      `Matched User A (${userA.socketId}) with User B (${userB.socketId}) in room ${roomId}`
    );

    return { userA: userA.socketId, userB: userB.socketId, roomId };
  }
}
