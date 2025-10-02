import { generateRoomId } from "../utils/helpers.js";
import { GetCompletePatientInfo } from "../models/user.models.js";

export class MatchingService {
  constructor(queueService, sessionService) {
    this.queueService = queueService;
    this.sessionService = sessionService;
  }

  // Match users for a specific specialization
  async matchUsersForSpecialization(specialization) {
    if (!this.queueService.hasAvailableUsers(specialization)) {
      return null;
    }

    const patient = this.queueService.getRandomPatient(specialization);
    const doctor = this.queueService.getNextDoctor(specialization);

    if (!patient || !doctor) return null;

    const roomId = generateRoomId();

    // Create session with specialization info
    this.sessionService.createSession(
      roomId, 
      patient.socketId, 
      doctor.socketId,
      specialization
    );

    // Join both users to the room
    patient.socket.join(roomId);
    doctor.socket.join(roomId);

    // Get patient data
    let patientData = null;
    console.log("Patient socket userInfo:", patient.socket.userInfo);
    if (patient.socket.userInfo && patient.socket.userInfo.profileId) {
      try {
        patientData = await GetCompletePatientInfo(patient.socket.userInfo.profileId);
        console.log("Patient data retrieved:", patientData);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    } else {
      console.log("No userInfo found for patient or missing profileId");
    }

    // Notify both users about the match
    patient.socket.emit("matched", { 
      roomId, 
      userType: "patient", 
      partnerType: "doctor",
      specialization,
      patientData: patientData 
    });
    doctor.socket.emit("matched", { 
      roomId, 
      userType: "doctor", 
      partnerType: "patient",
      specialization,
      patientData: patientData 
    });

    // Mark patient as consumed
    this.queueService.markPatientConsumed(patient.socketId);

    console.log(
      `Matched Patient (${patient.socketId}) with Doctor (${doctor.socketId}) for ${specialization} in room ${roomId}`
    );

    return { patient: patient.socketId, doctor: doctor.socketId, roomId, specialization };
  }

  // Attempt to match users across all specializations
  async matchUsers() {
    const availableSpecializations = this.queueService.getAvailableSpecializations();
    
    if (availableSpecializations.length === 0) {
      return null;
    }

    // Try to match for each available specialization
    for (const specialization of availableSpecializations) {
      const result = await this.matchUsersForSpecialization(specialization);
      if (result) {
        return result;
      }
    }

    return null;
  }
}
