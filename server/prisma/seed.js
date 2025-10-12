// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Create organizations
  const uitOrg = await prisma.organization.create({
    data: { name: "UIT Cybersecurity Club", slug: "uit-cyber" },
  });

  const techOrg = await prisma.organization.create({
    data: { name: "Tech Innovation Hub", slug: "tech-hub" },
  });

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: "admin@uit.edu.vn",
      fullName: "Nguyễn Văn Admin",
      phoneNumber: "0901234567",
      passwordHash: await bcrypt.hash("123", 10),
      role: "ADMIN",
      organizationId: uitOrg.id,
    },
  });

  const organizer1 = await prisma.user.create({
    data: {
      email: "organizer1@uit.edu.vn",
      fullName: "Trần Thị Lan",
      phoneNumber: "0902345678",
      passwordHash: await bcrypt.hash("123", 10),
      role: "ADMIN",
      organizationId: uitOrg.id,
    },
  });

  const organizer2 = await prisma.user.create({
    data: {
      email: "organizer2@tech.com",
      fullName: "Lê Văn Minh",
      phoneNumber: "0903456789",
      passwordHash: await bcrypt.hash("password123", 10),
      role: "ADMIN",
      organizationId: techOrg.id,
    },
  });

  const members = [];
  for (let i = 1; i <= 15; i++) {
    const member = await prisma.user.create({
      data: {
        email: `member${i}@student.uit.edu.vn`,
        fullName: `Sinh viên ${i}`,
        phoneNumber: `090${1000000 + i}`,
        passwordHash: await bcrypt.hash("password123", 10),
        role: "MEMBER",
        organizationId: i <= 10 ? uitOrg.id : techOrg.id,
      },
    });
    members.push(member);
  }

  // Create events with diverse topics
  const events = [];

  // Cybersecurity events
  const cyberEvent1 = await prisma.event.create({
    data: {
      title: "Workshop An toàn thông tin cơ bản",
      description: "Học về các kỹ thuật bảo mật cơ bản, phòng chống malware và bảo vệ dữ liệu cá nhân. Sự kiện dành cho người mới bắt đầu.",
      location: "Phòng A1.101, UIT",
      minAttendees: 5,
      maxAttendees: 30,
      startAt: new Date("2024-12-25T14:00:00Z"),
      endAt: new Date("2024-12-25T17:00:00Z"),
      status: "REGISTRATION",
      organizationId: uitOrg.id,
      createdById: organizer1.id,
    },
  });
  events.push(cyberEvent1);

  const cyberEvent2 = await prisma.event.create({
    data: {
      title: "Hội thảo Ethical Hacking",
      description: "Tìm hiểu về penetration testing, vulnerability assessment và các công cụ hacking đạo đức. Yêu cầu có kiến thức cơ bản về mạng.",
      location: "Hội trường B, UIT",
      minAttendees: 10,
      maxAttendees: 50,
      startAt: new Date("2025-01-15T09:00:00Z"),
      endAt: new Date("2025-01-15T16:00:00Z"),
      status: "REGISTRATION",
      organizationId: uitOrg.id,
      createdById: admin.id,
    },
  });
  events.push(cyberEvent2);

  // Tech events
  const techEvent1 = await prisma.event.create({
    data: {
      title: "AI và Machine Learning trong thực tế",
      description: "Khám phá ứng dụng AI/ML trong các dự án thực tế, từ computer vision đến natural language processing. Có demo và hands-on.",
      location: "Tech Innovation Hub, Q1",
      minAttendees: 15,
      maxAttendees: 80,
      startAt: new Date("2025-01-20T13:00:00Z"),
      endAt: new Date("2025-01-20T18:00:00Z"),
      status: "REGISTRATION",
      organizationId: techOrg.id,
      createdById: organizer2.id,
    },
  });
  events.push(techEvent1);

  const techEvent2 = await prisma.event.create({
    data: {
      title: "Blockchain và Web3 Development",
      description: "Học cách phát triển smart contracts, DApps và hiểu về ecosystem Web3. Bao gồm Solidity, React và Web3.js.",
      location: "Online via Zoom",
      minAttendees: 20,
      maxAttendees: 100,
      startAt: new Date("2025-02-01T19:00:00Z"),
      endAt: new Date("2025-02-01T21:30:00Z"),
      status: "REGISTRATION",
      organizationId: techOrg.id,
      createdById: organizer2.id,
    },
  });
  events.push(techEvent2);

  // Past events
  const pastEvent = await prisma.event.create({
    data: {
      title: "DevOps và Cloud Computing",
      description: "Workshop về Docker, Kubernetes, AWS và CI/CD pipelines. Đã hoàn thành với 45 người tham gia.",
      location: "UIT Lab 3",
      minAttendees: 10,
      maxAttendees: 50,
      startAt: new Date("2024-11-15T09:00:00Z"),
      endAt: new Date("2024-11-15T17:00:00Z"),
      status: "COMPLETED",
      organizationId: uitOrg.id,
      createdById: organizer1.id,
    },
  });
  events.push(pastEvent);

  // Create registrations
  const registrations = [];
  
  // Cyber event 1 registrations (20 people)
  for (let i = 0; i < 12; i++) {
    const registration = await prisma.registration.create({
      data: {
        eventId: cyberEvent1.id,
        userId: members[i].id,
        status: "REGISTERED",
        attendance: false,
      },
    });
    registrations.push(registration);
  }

  // Cyber event 2 registrations (35 people)
  for (let i = 0; i < 15; i++) {
    const registration = await prisma.registration.create({
      data: {
        eventId: cyberEvent2.id,
        userId: members[i].id,
        status: "REGISTERED",
        attendance: false,
      },
    });
    registrations.push(registration);
  }

  // Tech event 1 registrations (60 people)
  for (let i = 5; i < 15; i++) {
    const registration = await prisma.registration.create({
      data: {
        eventId: techEvent1.id,
        userId: members[i].id,
        status: "REGISTERED",
        attendance: false,
      },
    });
    registrations.push(registration);
  }

  // Past event registrations (with attendance)
  for (let i = 0; i < 10; i++) {
    const registration = await prisma.registration.create({
      data: {
        eventId: pastEvent.id,
        userId: members[i].id,
        status: "REGISTERED",
        attendance: i < 8, // 8/10 attended
      },
    });
    registrations.push(registration);
  }

  // Create notifications
  const notifications = [];

  // Welcome notifications
  for (let i = 0; i < 5; i++) {
    const notification = await prisma.notification.create({
      data: {
        title: "Chào mừng bạn đến với UIT Cybersecurity Club!",
        message: "Cảm ơn bạn đã tham gia cộng đồng. Hãy theo dõi các sự kiện sắp tới!",
        type: "GENERAL",
        recipientId: members[i].id,
        isRead: i < 3,
      },
    });
    notifications.push(notification);
  }

  // Event notifications
  for (let i = 0; i < 8; i++) {
    const notification = await prisma.notification.create({
      data: {
        title: "Đăng ký thành công!",
        message: `Bạn đã đăng ký thành công sự kiện "${cyberEvent1.title}". Vui lòng có mặt đúng giờ.`,
        type: "EVENT",
        recipientId: members[i].id,
        isRead: i < 4,
      },
    });
    notifications.push(notification);
  }

  // System notifications
  for (let i = 0; i < 6; i++) {
    const notification = await prisma.notification.create({
      data: {
        title: "Nhắc nhở sự kiện",
        message: `Sự kiện "${cyberEvent2.title}" sẽ diễn ra vào ngày mai. Đừng quên tham gia!`,
        type: "SYSTEM",
        recipientId: members[i].id,
        isRead: false,
      },
    });
    notifications.push(notification);
  }

  console.log("✅ Seeding finished.");
  console.log(`📊 Created:`);
  console.log(`   - 2 organizations`);
  console.log(`   - ${3 + members.length} users (3 staff + ${members.length} members)`);
  console.log(`   - ${events.length} events`);
  console.log(`   - ${registrations.length} registrations`);
  console.log(`   - ${notifications.length} notifications`);
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
