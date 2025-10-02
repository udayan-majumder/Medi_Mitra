export class SessionService {
  constructor() {
    this.activeSessions = new Map();
  }

  createSession(roomId, patient, doctor, specialization = 'General Physician') {
    this.activeSessions.set(roomId, {
      patient: patient,
      doctor: doctor,
      userA: patient,
      userB: doctor,
      patientType: "patient",
      doctorType: "doctor",
      userAType: "A", 
      userBType: "B",  
      specialization: specialization,
    });
  }

  getSession(roomId) {
    return this.activeSessions.get(roomId);
  }

  deleteSession(roomId) {
    return this.activeSessions.delete(roomId);
  }

  isInActiveSession(socketId) {
    for (const session of this.activeSessions.values()) {
      if (session.patient === socketId || session.doctor === socketId) {
        return true;
      }
    }
    return false;
  }

  findSessionByUser(socketId) {
    for (const [roomId, session] of this.activeSessions.entries()) {
      if (session.patient === socketId || session.doctor === socketId) {
        return { roomId, session };
      }
    }
    return null;
  }

  getSessionCount() {
    return this.activeSessions.size;
  }

  getAllSessions() {
    return Object.fromEntries(this.activeSessions);
  }

  getSessionsBySpecialization(specialization) {
    const sessions = [];
    for (const [roomId, session] of this.activeSessions.entries()) {
      if (session.specialization === specialization) {
        sessions.push({ roomId, ...session });
      }
    }
    return sessions;
  }
}
