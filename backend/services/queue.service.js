export class QueueService {
  constructor() {
    // Patient queues organized by specialization
    // Key: specialization name, Value: array of patient objects
    this.patientQueues = {
      'General Physician': [],
      'Nephrologist': [],
      'Dermatologist': [],
      'Pediatrician': [],
      'Cardiologist': []
    };
    
    // Doctor queues organized by specialization
    // Key: specialization name, Value: array of doctor objects
    this.doctorQueues = {
      'General Physician': [],
      'Nephrologist': [],
      'Dermatologist': [],
      'Pediatrician': [],
      'Cardiologist': []
    };
    
    this.consumedPatients = new Set();
  }

  // Add patient to a specific specialization queue
  addPatient(socketId, socket, specialization = 'General Physician', userTier = 'regular') {
    // Regular users can only join General Physician queue
    const targetSpecialization = userTier === 'regular' ? 'General Physician' : specialization;
    
    if (!this.patientQueues[targetSpecialization]) {
      this.patientQueues[targetSpecialization] = [];
    }
    
    this.patientQueues[targetSpecialization].push({ 
      socketId, 
      socket, 
      specialization: targetSpecialization,
      userTier 
    });
    return this.patientQueues[targetSpecialization].length;
  }

  // Add doctor to their specialization queue
  addDoctor(socketId, socket, specialization = 'General Physician') {
    if (!this.doctorQueues[specialization]) {
      this.doctorQueues[specialization] = [];
    }
    
    this.doctorQueues[specialization].push({ 
      socketId, 
      socket, 
      specialization 
    });
    return this.doctorQueues[specialization].length;
  }

  // Remove patient from all queues
  removePatient(socketId) {
    for (const specialization in this.patientQueues) {
      const index = this.patientQueues[specialization].findIndex(
        (user) => user.socketId === socketId
      );
      if (index !== -1) {
        return this.patientQueues[specialization].splice(index, 1)[0];
      }
    }
    return null;
  }

  // Remove doctor from all queues
  removeDoctor(socketId) {
    for (const specialization in this.doctorQueues) {
      const index = this.doctorQueues[specialization].findIndex(
        (user) => user.socketId === socketId
      );
      if (index !== -1) {
        return this.doctorQueues[specialization].splice(index, 1)[0];
      }
    }
    return null;
  }

  // Find user in any queue
  findUserInQueues(socketId) {
    let inPatientQueue = null;
    let inDoctorQueue = null;
    
    for (const specialization in this.patientQueues) {
      const found = this.patientQueues[specialization].find(
        (user) => user.socketId === socketId
      );
      if (found) {
        inPatientQueue = found;
        break;
      }
    }
    
    for (const specialization in this.doctorQueues) {
      const found = this.doctorQueues[specialization].find(
        (user) => user.socketId === socketId
      );
      if (found) {
        inDoctorQueue = found;
        break;
      }
    }
    
    return { inPatientQueue, inDoctorQueue };
  }

  markPatientConsumed(socketId) {
    this.consumedPatients.add(socketId);
  }

  isPatientConsumed(socketId) {
    return this.consumedPatients.has(socketId);
  }

  // Get a random patient from a specific specialization queue
  getRandomPatient(specialization) {
    const queue = this.patientQueues[specialization];
    if (!queue || queue.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * queue.length);
    return queue.splice(randomIndex, 1)[0];
  }

  // Get next doctor from a specific specialization queue (FIFO)
  getNextDoctor(specialization) {
    const queue = this.doctorQueues[specialization];
    if (!queue || queue.length === 0) return null;
    
    return queue.shift();
  }

  // Check if there are available users for a specific specialization
  hasAvailableUsers(specialization) {
    return (
      this.patientQueues[specialization]?.length > 0 && 
      this.doctorQueues[specialization]?.length > 0
    );
  }

  // Get all specializations that have both patients and doctors waiting
  getAvailableSpecializations() {
    const available = [];
    for (const specialization in this.patientQueues) {
      if (this.hasAvailableUsers(specialization)) {
        available.push(specialization);
      }
    }
    return available;
  }

  getQueueStats() {
    const patientStats = {};
    const doctorStats = {};
    
    for (const spec in this.patientQueues) {
      patientStats[spec] = this.patientQueues[spec].length;
    }
    
    for (const spec in this.doctorQueues) {
      doctorStats[spec] = this.doctorQueues[spec].length;
    }
    
    return {
      patientQueues: patientStats,
      doctorQueues: doctorStats,
      consumedPatients: this.consumedPatients.size,
    };
  }

  getDebugInfo() {
    const patientDebug = {};
    const doctorDebug = {};
    
    for (const spec in this.patientQueues) {
      patientDebug[spec] = this.patientQueues[spec].map((u) => ({
        socketId: u.socketId,
        userTier: u.userTier
      }));
    }
    
    for (const spec in this.doctorQueues) {
      doctorDebug[spec] = this.doctorQueues[spec].map((u) => u.socketId);
    }
    
    return {
      patientQueues: patientDebug,
      doctorQueues: doctorDebug,
      consumedPatients: Array.from(this.consumedPatients),
    };
  }

  // Backward compatibility methods
  addUserA(socketId, socket, specialization = 'General Physician', userTier = 'regular') {
    return this.addPatient(socketId, socket, specialization, userTier);
  }

  addUserB(socketId, socket, specialization = 'General Physician') {
    return this.addDoctor(socketId, socket, specialization);
  }

  removeUserA(socketId) {
    return this.removePatient(socketId);
  }

  removeUserB(socketId) {
    return this.removeDoctor(socketId);
  }

  isUserAConsumed(socketId) {
    return this.isPatientConsumed(socketId);
  }

  markUserAConsumed(socketId) {
    this.markPatientConsumed(socketId);
  }
}
