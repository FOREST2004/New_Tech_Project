import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export class MemberService {
  static async getProfileMember(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, phoneNumber: true, role: true, organizationId: true }
    });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  }

  static async updateProfileMember(userId, data) {
    const { fullName, phoneNumber } = data;
    
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { fullName, phoneNumber },
      select: { id: true, fullName: true, email: true, phoneNumber: true }
    });
    
    return updated;
  }

  static async changePasswordMember(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new Error("Current password is incorrect");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword }
    });
  }

  static async registerEventMember(userId, eventId) {
    throw new Error("Event registration not implemented yet");
  }

  static async getMembersList(filters) {
    const { email, fullName, isActive, page = 1, limit = 10, organizationId } = filters;
    const where = { organizationId};
  
    if (email) where.email = { contains: email, mode: "insensitive" };
    if (fullName) where.fullName = { contains: fullName, mode: "insensitive" };
    if (isActive !== undefined) where.isActive = isActive === "true";
  
    const members = await prisma.user.findMany({
      where,
      orderBy: { id: "asc" },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        isActive: true,
        role: true,
        createdAt: true
      }
    });
  
    const total = await prisma.user.count({ where });
  
    return {
      members,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  static async getMemberById(memberId, organizationId) {
    const member = await prisma.user.findFirst({
      where: {
        id: memberId,
        organizationId: organizationId,
        
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        organizationId: true,
        organization: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    return member;
  }

  static async createMember(memberData) {
    const { fullName, email, password, organizationId } = memberData;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      throw new Error("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const member = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: "MEMBER",
        isActive: true,
        organizationId,
      },
    });

    return member;
  }

  static async lockMember(memberId) {

    const targetMember = await prisma.user.findUnique({
      where: { id: memberId },
      select: { role: true, fullName: true }
    });

    if (!targetMember) {
      throw new Error("Member not found");
    }

    if (targetMember.role === "ADMIN") {
      throw new Error("Cannot lock admin users");
    }

    const member = await prisma.user.update({
      where: { id: memberId },
      data: { isActive: false },
    });

    return member;
  }

  static async unlockMember(memberId) {
    const targetMember = await prisma.user.findUnique({
      where: { id: memberId },
      select: { role: true, fullName: true }
    });

    if (!targetMember) {
      throw new Error("Member not found");
    }

    if (targetMember.role === "ADMIN") {
      throw new Error("Cannot unlock admin users");
    }

    const member = await prisma.user.update({
      where: { id: memberId },
      data: { isActive: true },
    });

    return member;
  }

  static async resetPassword(memberId, newPassword) {
    const targetMember = await prisma.user.findUnique({
      where: { id: memberId },
      select: { role: true, fullName: true }
    });

    if (!targetMember) {
      throw new Error("Member not found");
    }

    if (targetMember.role === "ADMIN") {
      throw new Error("Cannot reset password for admin users");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: memberId },
      data: { passwordHash },
    });
  }
}