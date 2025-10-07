import { io } from "../../../server.js";

export class SocketService {

  static emitToUser(userId, event, data) {
    try {
      io.to(`user-${userId}`).emit(event, data);
      // console.log(`>> Emitted ${event} to user ${userId}`);
    } catch (error) {
      console.error(`❌ Failed to emit to user ${userId}:`, error);
    }
  }


  static emitToOrganization(organizationId, event, data) {
    try {
      io.to(`org-${organizationId}`).emit(event, data);
      // console.log(`>> Emitted ${event} to organization ${organizationId}`);
    } catch (error) {
      console.error(`❌ Failed to emit to organization ${organizationId}:`, error);
    }
  }


}