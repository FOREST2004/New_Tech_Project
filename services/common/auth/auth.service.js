import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class AuthService {
  static async login(email, password) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { organization: true }
      });

      if (!user) {
        return {
          success: false,
          message: "Email does not exist"
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          message: "Account has been locked"
        };
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return {
          success: false,
          message: "Incorrect password"
        };
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return {
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          organizationId: user.organizationId,
          avatarUrl: user.avatarUrl,
          organization: user.organization
        }
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}