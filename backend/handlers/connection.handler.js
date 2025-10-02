export class ConnectionHandler {
  constructor(queueService, sessionService, matchingService, io) {
    this.queueService = queueService;
    this.sessionService = sessionService;
    this.matchingService = matchingService;
    this.io = io;
  }

  handleJoinAsA(socket, data = {}) {
    console.log(`User ${socket.id} joined as Patient (User A)`);
    console.log("Data received:", data);
    
    // Store user info in socket for later use
    socket.userInfo = data.userInfo;
    console.log("Stored userInfo in socket:", socket.userInfo);

    if (this.queueService.isPatientConsumed(socket.id)) {
      socket.emit("error", { message: "Patient can only connect once per session" });
      return;
    }

    const { inPatientQueue, inDoctorQueue } = this.queueService.findUserInQueues(socket.id);
    const inSession = this.sessionService.isInActiveSession(socket.id);

    if (inPatientQueue || inDoctorQueue || inSession) {
      socket.emit("error", { message: "User already in queue" });
      return;12
    }

    // Extract user tier and specialization from data
    const userTier = data.userInfo.userTier || 'regular';
    const requestedSpecialization = data.userInfo.specialization || 'General Physician';
    
    // Regular users can only access General Physician
    const specialization = userTier === 'regular' ? 'General Physician' : requestedSpecialization;
    
    console.log(`Patient tier: ${userTier}, requested: ${requestedSpecialization}, assigned: ${specialization}`);

    const position = this.queueService.addPatient(socket.id, socket, specialization, userTier);
    socket.emit("queued", { 
      userType: "patient", 
      position, 
      specialization,
      userTier 
    });

    this.matchingService.matchUsers();
  }

  handleJoinAsB(socket, data = {}) {
    console.log(`User ${socket.id} joined as Doctor (User B)`);
    
    // Store user info in socket for later use
    socket.userInfo = data.userInfo;
    
    // Extract doctor's specialization from data
    const specialization = data.userInfo.specialization || 'General Physician';
    console.log(`Doctor specialization: ${specialization}`);

    const { inPatientQueue, inDoctorQueue } = this.queueService.findUserInQueues(socket.id);
    const inSession = this.sessionService.isInActiveSession(socket.id);

    if (inPatientQueue || inDoctorQueue || inSession) {
      socket.emit("error", { message: "User already in queue" });
      return;
    }

    const position = this.queueService.addDoctor(socket.id, socket, specialization);
    socket.emit("queued", { 
      userType: "doctor", 
      position, 
      specialization 
    });

    this.matchingService.matchUsers();
  }

  handleSkipUser(socket, data) {
    const { roomId } = data;
    const session = this.sessionService.getSession(roomId);

    if (!session || session.doctor !== socket.id) {
      socket.emit("error", { message: "Invalid session or not authorized" });
      return;
    }

    console.log(
      `Doctor (${socket.id}) skipping Patient (${session.patient}) in room ${roomId} for ${session.specialization}`
    );

    const patientSocket = this.io.sockets.sockets.get(session.patient);
    if (patientSocket) {
      patientSocket.emit("skipped");
      patientSocket.leave(roomId);
    }

    socket.leave(roomId);
    const specialization = session.specialization;
    this.sessionService.deleteSession(roomId);

    setTimeout(() => {
      const position = this.queueService.addDoctor(socket.id, socket, specialization);
      socket.emit("queued", { userType: "doctor", position, specialization });

      const matched = this.matchingService.matchUsers();
      console.log(
        `Doctor re-queued for ${specialization}, match attempt result: ${
          matched ? "success" : "no match"
        }`
      );
    }, 100);
  }

  handleEndSession(socket, data) {
    const { roomId } = data;
    const session = this.sessionService.getSession(roomId);

    if (!session || session.doctor !== socket.id) {
      socket.emit("error", { message: "Invalid session or not authorized" });
      return;
    }

    console.log(
      `Doctor (${socket.id}) ending session with Patient (${session.patient}) in room ${roomId} for ${session.specialization}`
    );

    const patientSocket = this.io.sockets.sockets.get(session.patient);
    if (patientSocket) {
      patientSocket.emit("session-ended");
      patientSocket.leave(roomId);
    }

    socket.leave(roomId);
    const specialization = session.specialization;
    this.sessionService.deleteSession(roomId);

    // When doctor ends session, they should be removed from queue, not re-queued
    // This is the "Exit" functionality - doctor leaves the queue completely
    console.log(`Doctor (${socket.id}) exiting queue for ${specialization}`);
    socket.emit("exited-queue", { message: "Successfully exited the queue" });
  }

  handleLeaveQueue(socket) {
    console.log(`User ${socket.id} leaving queue`);
    
    // Remove from both patient and doctor queues
    const removedPatient = this.queueService.removePatient(socket.id);
    const removedDoctor = this.queueService.removeDoctor(socket.id);
    
    if (removedPatient) {
      console.log(`Removed ${socket.id} from Patient queue (${removedPatient.specialization})`);
    }
    if (removedDoctor) {
      console.log(`Removed ${socket.id} from Doctor queue (${removedDoctor.specialization})`);
    }
    
    // Check if user is in an active session
    const sessionInfo = this.sessionService.findSessionByUser(socket.id);
    if (sessionInfo) {
      const { roomId, session } = sessionInfo;
      console.log(`Cleaning up session ${roomId} due to leaving queue`);
      
      const otherUserId = session.patient === socket.id ? session.doctor : session.patient;
      const otherUserSocket = this.io.sockets.sockets.get(otherUserId);
      
      if (otherUserSocket) {
        otherUserSocket.emit("partner-disconnected");
        otherUserSocket.leave(roomId);
      }
      
      this.sessionService.deleteSession(roomId);
    }
    
    socket.emit("left-queue", { message: "Successfully left the queue" });
  }

  handleDisconnect(socket) {
    console.log(`User disconnected: ${socket.id}`);

    const removedPatient = this.queueService.removePatient(socket.id);
    const removedDoctor = this.queueService.removeDoctor(socket.id);

    if (removedPatient) console.log(`Removed ${socket.id} from Patient queue (${removedPatient.specialization})`);
    if (removedDoctor) console.log(`Removed ${socket.id} from Doctor queue (${removedDoctor.specialization})`);

    const sessionInfo = this.sessionService.findSessionByUser(socket.id);

    if (sessionInfo) {
      const { roomId, session } = sessionInfo;
      console.log(`Cleaning up session ${roomId} due to disconnection`);

      const otherUserId =
        session.patient === socket.id ? session.doctor : session.patient;
      const otherUserSocket = this.io.sockets.sockets.get(otherUserId);

      if (otherUserSocket) {
        otherUserSocket.emit("partner-disconnected");
        otherUserSocket.leave(roomId);
      }

      const specialization = session.specialization;
      this.sessionService.deleteSession(roomId);

      // If patient disconnected, re-queue the doctor
      if (session.patient === socket.id && otherUserSocket) {
        setTimeout(() => {
          const position = this.queueService.addDoctor(
            otherUserId,
            otherUserSocket,
            specialization
          );
          otherUserSocket.emit("queued", { userType: "doctor", position, specialization });
          this.matchingService.matchUsers();
        }, 100);
      }
    }
  }
}
