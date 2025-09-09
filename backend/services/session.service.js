export class SessionService {
  constructor() {
    this.activeSessions = new Map();
  }

  createSession(roomId, userA, userB) {
    this.activeSessions.set(roomId, {
      userA: userA,
      userB: userB,
      userAType: 'A',
      userBType: 'B'
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
      if (session.userA === socketId || session.userB === socketId) {
        return true;
      }
    }
    return false;
  }

  findSessionByUser(socketId) {
    for (const [roomId, session] of this.activeSessions.entries()) {
      if (session.userA === socketId || session.userB === socketId) {
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
}
