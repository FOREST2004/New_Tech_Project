// server/services/common/auth/oauth.service.js
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class OAuthService {
  static async findOrCreateUser(profile, provider) {
    try {
      // Try to find user by provider ID
      let user = await prisma.user.findFirst({
        where: {
          provider,
          providerId: profile.id
        },
        include: { organization: true }
      });

      // If user not found, try to find by email
      if (!user && profile.emails && profile.emails[0]) {
        user = await prisma.user.findFirst({
          where: {
            email: profile.emails[0].value
          },
          include: { organization: true }
        });

        // If user exists but doesn't have OAuth info, update it
        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              provider,
              providerId: profile.id,
              avatarUrl: profile.photos?.[0]?.value || user.avatarUrl
            },
            include: { organization: true }
          });
        }
      }

      // If user still not found, create a new one
      if (!user) {
        // Always use organization ID = 1 as default
        let organization = await prisma.organization.findUnique({
          where: { id: 1 }
        });
        
        // If organization with ID 1 doesn't exist, get the first one or create default
        if (!organization) {
          organization = await prisma.organization.findFirst();
          if (!organization) {
            organization = await prisma.organization.create({
              data: {
                name: "Default Organization",
                slug: "default-org"
              }
            });
          }
        }

        user = await prisma.user.create({
          data: {
            email: profile.emails?.[0]?.value || `${profile.id}@${provider}.com`,
            fullName: profile.displayName || profile.username,
            avatarUrl: profile.photos?.[0]?.value,
            provider,
            providerId: profile.id,
            organizationId: 1  // Explicitly set organization ID to 1
          },
          include: { organization: true }
        });
      }

      // Generate JWT token
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
      console.error('OAuth error:', error);
      throw new Error('OAuth authentication failed');
    }
  }
}