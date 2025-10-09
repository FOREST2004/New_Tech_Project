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
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, fullName: true, email: true, phoneNumber: true, role: true, organizationId: true }
    });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  }

  static async changePasswordMember(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedNewPassword }
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
        avatarUrl: true,
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
    const member = await prisma.user.findUnique({
      where: { id: memberId }
    });

    if (!member) {
      throw new Error("Member not found");
    }

    if (!member.isActive) {
      throw new Error("Member is already locked");
    }

    const updatedMember = await prisma.user.update({
      where: { id: memberId },
      data: { isActive: false }
    });

    return updatedMember;
  }

  static async unlockMember(memberId) {
    const member = await prisma.user.findUnique({
      where: { id: memberId }
    });

    if (!member) {
      throw new Error("Member not found");
    }

    if (member.isActive) {
      throw new Error("Member is already active");
    }

    const updatedMember = await prisma.user.update({
      where: { id: memberId },
      data: { isActive: true }
    });

    return updatedMember;
  }

  static async resetPassword(memberId, newPassword) {
    const member = await prisma.user.findUnique({
      where: { id: memberId }
    });

    if (!member) {
      throw new Error("Member not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedMember = await prisma.user.update({
      where: { id: memberId },
      data: { passwordHash: hashedPassword }
    });

    return updatedMember;
  }
}