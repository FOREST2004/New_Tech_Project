import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();


export const getMembersByOrganization = async (organizationId, page = 1, limit = 10, filters = {}) => {
  try {
    const { email, fullName } = filters;
    const skip = (page - 1) * limit;
    
    const where = {
      organizationId: organizationId,
      isActive: true
    };
    
    if (email) {
      where.email = {
        contains: email,
        mode: 'insensitive'
      };
    }
    
    if (fullName) {
      where.fullName = {
        contains: fullName,
        mode: 'insensitive'
      };
    }
    
    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          phoneNumber: true,
          createdAt: true
        },
        orderBy: {
          fullName: 'asc'
        },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);
    
    return {
      members,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw error;
  }
};

