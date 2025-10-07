// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  await prisma.notification.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const org = await prisma.organization.create({
    data: { name: "UIT Cybersecurity Club", slug: "uit-cyber" },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      fullName: "Admin User",
      phoneNumber: "0901234567",
      passwordHash: await bcrypt.hash("password123", 10),
      role: "ADMIN",
      organizationId: org.id,
    },
  });

  const member = await prisma.user.create({
    data: {
      email: "member@example.com",
      fullName: "Member User",
      phoneNumber: "0909876543",
      passwordHash: await bcrypt.hash("password123", 10),
      role: "MEMBER",
      organizationId: org.id,
    },
  });

  const event = await prisma.event.create({
    data: {
      title: "Tech Conference 2025",
      description: "Sự kiện công nghệ tại UIT",
      location: "HCMC",
      minAttendees: 10,
      maxAttendees: 100,
      startAt: new Date("2025-09-20T09:00:00Z"),
      endAt: new Date("2025-09-20T17:00:00Z"),
      status: "REGISTRATION",
      organizationId: org.id,
      createdById: admin.id,
    },
  });

  await prisma.registration.create({
    data: {
      eventId: event.id,
      userId: member.id,
      status: "REGISTERED",
      attendance: false,
    },
  });

  await prisma.notification.create({
    data: {
      title: "Welcome",
      message: "Bạn đã đăng ký thành công sự kiện Tech Conference 2025",
      type: "EVENT",
      recipientId: member.id,
    },
  });

  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
