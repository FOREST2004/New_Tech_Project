import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getProfile = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        organizationId: true,
        isActive: true,
        avatarUrl: true,  
        organization: {
          select: {
            name: true
          }
        }
      }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (userId, updateData) => {
  try {
    const { fullName, phoneNumber, avatarUrl } = updateData;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        phoneNumber,
        ...(avatarUrl !== undefined && { avatarUrl })
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        avatarUrl: true,  
        organizationId: true,
        isActive: true,
        organization: {
          select: {
            name: true
          }
        }
      }
    });
    
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash
      }
    });
    
    return { message: 'Password updated successfully' };
  } catch (error) {
    throw error;
  }
};