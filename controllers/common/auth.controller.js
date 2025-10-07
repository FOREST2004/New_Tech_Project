import { AuthService } from '../../services/common/auth/auth.service.js';



export class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Email và password là bắt buộc" 
        });
      }

      const result = await AuthService.login(email, password);
      
      if (!result.success) {
        return res.status(401).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi server" 
      });
    }
  }
}