export class QueueService {
  constructor() {
    this.userAQueue = [];
    this.userBQueue = [];
    this.consumedUserA = new Set();
  }

  addUserA(socketId, socket) {
    this.userAQueue.push({ socketId, socket });
    return this.userAQueue.length;
  }

  addUserB(socketId, socket) {
    this.userBQueue.push({ socketId, socket });
    return this.userBQueue.length;
  }

  removeUserA(socketId) {
    const index = this.userAQueue.findIndex(user => user.socketId === socketId);
    if (index !== -1) {
      return this.userAQueue.splice(index, 1)[0];
    }
    return null;
  }

  removeUserB(socketId) {
    const index = this.userBQueue.findIndex(user => user.socketId === socketId);
    if (index !== -1) {
      return this.userBQueue.splice(index, 1)[0];
    }
    return null;
  }

  findUserInQueues(socketId) {
    const inA = this.userAQueue.find(user => user.socketId === socketId);
    const inB = this.userBQueue.find(user => user.socketId === socketId);
    return { inA, inB };
  }

  markUserAConsumed(socketId) {
    this.consumedUserA.add(socketId);
  }

  isUserAConsumed(socketId) {
    return this.consumedUserA.has(socketId);
  }

  getRandomUserA() {
    if (this.userAQueue.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.userAQueue.length);
    return this.userAQueue.splice(randomIndex, 1)[0];
  }

  getNextUserB() {
    return this.userBQueue.shift();
  }

  hasAvailableUsers() {
    return this.userAQueue.length > 0 && this.userBQueue.length > 0;
  }

  getQueueStats() {
    return {
      userAQueue: this.userAQueue.length,
      userBQueue: this.userBQueue.length,
      consumedUserA: this.consumedUserA.size
    };
  }

  getDebugInfo() {
    return {
      userAQueue: this.userAQueue.map(u => u.socketId),
      userBQueue: this.userBQueue.map(u => u.socketId),
      consumedUserA: Array.from(this.consumedUserA)
    };
  }
}