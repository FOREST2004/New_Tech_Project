import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AdminStatsService {
  static async getDashboardStats(adminId) {
    try {
      const admin = await prisma.user.findUnique({
        where: { id: adminId },
        select: { organizationId: true }
      });

      if (!admin || !admin.organizationId) {
        throw new Error("Admin not found or not associated with organization");
      }

      const totalEvents = await prisma.event.count({
        where: { organizationId: admin.organizationId }
      });

      const totalMembers = await prisma.user.count({
        where: { 
          organizationId: admin.organizationId,
          role: "MEMBER"
        }
      });

      return {
        totalEvents,
        totalMembers
      };
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      throw error;
    }
  }
}