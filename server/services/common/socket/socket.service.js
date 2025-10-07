import { io } from "../../../server.js";

export class SocketService {
  /**
   * Emit notification to specific user
   */
  static emitToUser(userId, event, data) {
    try {
      io.to(`user-${userId}`).emit(event, data);
      console.log(`✅ Emitted ${event} to user ${userId}`);
    } catch (error) {
      console.error(`❌ Failed to emit to user ${userId}:`, error);
    }
  }

  /**
   * Emit notification to all users in organization
   */
  static emitToOrganization(organizationId, event, data) {
    try {
      io.to(`org-${organizationId}`).emit(event, data);
      console.log(`✅ Emitted ${event} to organization ${organizationId}`);
    } catch (error) {
      console.error(`❌ Failed to emit to organization ${organizationId}:`, error);
    }
  }

  /**
   * Emit to all connected clients
   */
  static emitToAll(event, data) {
    try {
      io.emit(event, data);
      console.log(`✅ Emitted ${event} to all clients`);
    } catch (error) {
      console.error(`❌ Failed to emit to all clients:`, error);
    }
  }

  /**
   * Get connected clients count
   */
  static getConnectedClientsCount() {
    return io.engine.clientsCount;
  }

  /**
   * Get clients in specific room
   */
  static async getClientsInRoom(room) {
    try {
      const sockets = await io.in(room).fetchSockets();
      return sockets.length;
    } catch (error) {
      console.error(`❌ Failed to get clients in room ${room}:`, error);
      return 0;
    }
  }
}