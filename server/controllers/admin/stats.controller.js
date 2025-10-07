import { AdminStatsService } from "../../services/admin/stats.service.js";

export class AdminStatsController {
  static async getDashboardStats(req, res) {
    try {
      const adminId = req.user.id;
      
      const stats = await AdminStatsService.getDashboardStats(adminId);
      
      res.json(stats);
    } catch (error) {
      console.error("Error in getDashboardStats:", error);
      res.status(500).json({ 
        message: "Failed to get dashboard statistics",
        error: error.message 
      });
    }
  }
}