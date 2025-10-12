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
    data: { 
      id: 1,
      name: "UIT Cybersecurity Club", 
      slug: "uit-cyber",
      createdAt: new Date("2025-10-09T17:21:33.105Z"),
      updatedAt: new Date("2025-10-09T17:21:33.105Z")
    },
  });

  const techOrg = await prisma.organization.create({
    data: { 
      id: 2,
      name: "Tech Innovation Hub", 
      slug: "tech-hub",
      createdAt: new Date("2025-10-09T17:21:33.109Z"),
      updatedAt: new Date("2025-10-09T17:21:33.109Z")
    },
  });

  // Create users with exact data from SQL (but with dynamic password hashing)
  const users = [
    {
      id: 23,
      email: "admin1@uit.edu.vn",
      fullName: "admin1",
      phoneNumber: "0901234567",
      passwordHash: await bcrypt.hash("123", 10),
      role: "ADMIN",
      isActive: true,
      avatarUrl: "image_3.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:33.275Z"),
      updatedAt: new Date("2025-10-09T18:21:43.339Z"),
      organizationId: 1
    },
    {
      id: 24,
      email: "organizer1@uit.edu.vn",
      fullName: "Trần Thị Lan",
      phoneNumber: "0902345678",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_2.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:33.348Z"),
      updatedAt: new Date("2025-10-09T18:21:58.532Z"),
      organizationId: 1
    },
    {
      id: 25,
      email: "organizer2@tech.com",
      fullName: "Lê Văn Minh",
      phoneNumber: "0903456789",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:33.426Z"),
      updatedAt: new Date("2025-10-09T17:21:33.426Z"),
      organizationId: 1
    },
    {
      id: 26,
      email: "member1@student.uit.edu.vn",
      fullName: "Sinh viên 1",
      phoneNumber: "0901000001",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:33.499Z"),
      updatedAt: new Date("2025-10-09T17:21:33.499Z"),
      organizationId: 1
    },
    {
      id: 27,
      email: "member2@student.uit.edu.vn",
      fullName: "Sinh viên 2",
      phoneNumber: "0901000002",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:33.575Z"),
      updatedAt: new Date("2025-10-09T17:21:33.575Z"),
      organizationId: 1
    },
    {
      id: 28,
      email: "member3@student.uit.edu.vn",
      fullName: "Sinh viên 3",
      phoneNumber: "0901000003",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:33.656Z"),
      updatedAt: new Date("2025-10-09T17:21:33.656Z"),
      organizationId: 1
    },
    {
      id: 29,
      email: "member4@student.uit.edu.vn",
      fullName: "Sinh viên 4",
      phoneNumber: "0901000004",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:33.728Z"),
      updatedAt: new Date("2025-10-09T17:21:33.728Z"),
      organizationId: 1
    },
    {
      id: 30,
      email: "member5@student.uit.edu.vn",
      fullName: "Sinh viên 5",
      phoneNumber: "0901000005",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:33.800Z"),
      updatedAt: new Date("2025-10-09T17:21:33.800Z"),
      organizationId: 1
    },
    {
      id: 31,
      email: "admin2@student.uit.edu.vn",
      fullName: "admin2",
      phoneNumber: "0901000006",
      passwordHash: await bcrypt.hash("123", 10),
      role: "ADMIN",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:33.871Z"),
      updatedAt: new Date("2025-10-09T17:21:33.871Z"),
      organizationId: 2
    },
    {
      id: 32,
      email: "member7@student.uit.edu.vn",
      fullName: "Sinh viên 7",
      phoneNumber: "0901000007",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:33.943Z"),
      updatedAt: new Date("2025-10-09T17:21:33.943Z"),
      organizationId: 2
    },
    {
      id: 33,
      email: "member8@student.uit.edu.vn",
      fullName: "Sinh viên 8",
      phoneNumber: "0901000008",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:34.015Z"),
      updatedAt: new Date("2025-10-09T17:21:34.015Z"),
      organizationId: 2
    },
    {
      id: 34,
      email: "member9@student.uit.edu.vn",
      fullName: "Sinh viên 9",
      phoneNumber: "0901000009",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:34.086Z"),
      updatedAt: new Date("2025-10-09T17:21:34.086Z"),
      organizationId: 2
    },
    {
      id: 35,
      email: "member10@student.uit.edu.vn",
      fullName: "Sinh viên 10",
      phoneNumber: "0901000010",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:34.157Z"),
      updatedAt: new Date("2025-10-09T17:21:34.157Z"),
      organizationId: 2
    },
    {
      id: 36,
      email: "member11@student.uit.edu.vn",
      fullName: "Sinh viên 11",
      phoneNumber: "0901000011",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:34.234Z"),
      updatedAt: new Date("2025-10-09T17:21:34.234Z"),
      organizationId: 2
    },
    {
      id: 37,
      email: "member12@student.uit.edu.vn",
      fullName: "Sinh viên 12",
      phoneNumber: "0901000012",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:34.307Z"),
      updatedAt: new Date("2025-10-09T17:21:34.307Z"),
      organizationId: 2
    },
    {
      id: 38,
      email: "member13@student.uit.edu.vn",
      fullName: "Sinh viên 13",
      phoneNumber: "0901000013",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:34.380Z"),
      updatedAt: new Date("2025-10-09T17:21:34.380Z"),
      organizationId: 2
    },
    {
      id: 39,
      email: "member14@student.uit.edu.vn",
      fullName: "Sinh viên 14",
      phoneNumber: "0901000014",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:34.453Z"),
      updatedAt: new Date("2025-10-09T17:21:34.453Z"),
      organizationId: 2
    },
    {
      id: 40,
      email: "member15@student.uit.edu.vn",
      fullName: "Sinh viên 15",
      phoneNumber: "0901000015",
      passwordHash: await bcrypt.hash("123", 10),
      role: "MEMBER",
      isActive: true,
      avatarUrl: "image_1.jpg",
      provider: null,
      providerId: null,
      createdAt: new Date("2025-10-09T17:21:34.534Z"),
      updatedAt: new Date("2025-10-09T17:21:34.534Z"),
      organizationId: 2
    }
  ];

  // Create all users
  for (const userData of users) {
    await prisma.user.create({ data: userData });
  }

  // Create events with exact data from SQL
  const events = [
    {
      id: 11,
      title: "Workshop An toàn thông tin cơ bản",
      description: "Học về các kỹ thuật bảo mật cơ bản, phòng chống malware và bảo vệ dữ liệu cá nhân. Sự kiện dành cho người mới bắt đầu.",
      location: "Phòng A1.101, UIT",
      minAttendees: 5,
      maxAttendees: 30,
      startAt: new Date("2024-12-25T14:00:00Z"),
      endAt: new Date("2024-12-25T17:00:00Z"),
      registrationStartAt: null,
      registrationEndAt: null,
      deposit: 0.0,
      status: "COMPLETED",
      createdAt: new Date("2025-10-09T17:21:34.538Z"),
      updatedAt: new Date("2025-10-09T17:43:18.910Z"),
      organizationId: 1,
      createdById: 23
    },
    {
      id: 12,
      title: "Hội thảo Ethical Hacking",
      description: "Tìm hiểu về penetration testing, vulnerability assessment và các công cụ hacking đạo đức. Yêu cầu có kiến thức cơ bản về mạng.",
      location: "Hội trường B, UIT",
      minAttendees: 10,
      maxAttendees: 50,
      startAt: new Date("2025-01-15T09:00:00Z"),
      endAt: new Date("2025-01-15T16:00:00Z"),
      registrationStartAt: null,
      registrationEndAt: null,
      deposit: 0.0,
      status: "COMPLETED",
      createdAt: new Date("2025-10-09T17:21:34.544Z"),
      updatedAt: new Date("2025-10-09T17:43:18.910Z"),
      organizationId: 1,
      createdById: 23
    },
    {
      id: 13,
      title: "AI và Machine Learning trong thực tế",
      description: "Khám phá ứng dụng AI/ML trong các dự án thực tế, từ computer vision đến natural language processing. Có demo và hands-on.",
      location: "Tech Innovation Hub, Q1",
      minAttendees: 15,
      maxAttendees: 80,
      startAt: new Date("2025-01-20T13:00:00Z"),
      endAt: new Date("2025-01-20T18:00:00Z"),
      registrationStartAt: null,
      registrationEndAt: null,
      deposit: 0.0,
      status: "COMPLETED",
      createdAt: new Date("2025-10-09T17:21:34.546Z"),
      updatedAt: new Date("2025-10-09T17:45:13.409Z"),
      organizationId: 1,
      createdById: 23
    },
    {
      id: 14,
      title: "Blockchain và Web3 Development",
      description: "Học cách phát triển smart contracts, DApps và hiểu về ecosystem Web3. Bao gồm Solidity, React và Web3.js.",
      location: "Online via Zoom",
      minAttendees: 20,
      maxAttendees: 100,
      startAt: new Date("2025-10-21T19:00:00Z"),
      endAt: new Date("2025-11-20T21:30:00Z"),
      registrationStartAt: new Date("2025-10-06T17:46:04Z"),
      registrationEndAt: new Date("2025-10-11T17:46:08Z"),
      deposit: 0.0,
      status: "REGISTRATION",
      createdAt: new Date("2025-10-09T17:21:34.555Z"),
      updatedAt: new Date("2025-10-09T17:46:23.586Z"),
      organizationId: 1,
      createdById: 23
    },
    {
      id: 15,
      title: "DevOps và Cloud Computing",
      description: "Workshop về Docker, Kubernetes, AWS và CI/CD pipelines. Đã hoàn thành với 45 người tham gia.",
      location: "UIT Lab 3",
      minAttendees: 10,
      maxAttendees: 50,
      startAt: new Date("2025-10-15T09:00:00Z"),
      endAt: new Date("2025-10-18T17:00:00Z"),
      registrationStartAt: new Date("2025-10-07T17:45:34Z"),
      registrationEndAt: new Date("2025-10-11T17:45:36Z"),
      deposit: 0.0,
      status: "REGISTRATION",
      createdAt: new Date("2025-10-09T17:21:34.556Z"),
      updatedAt: new Date("2025-10-09T17:46:00.352Z"),
      organizationId: 1,
      createdById: 23
    },
    {
      id: 16,
      title: "Tech Workshop",
      description: "This is a sample event for testing purposes. A comprehensive workshop covering the latest technologies and best practices in software development.",
      location: "Conference Room A, Building 1",
      minAttendees: 10,
      maxAttendees: 60,
      startAt: new Date("2025-12-25T02:00:00Z"),
      endAt: new Date("2025-12-25T10:00:00Z"),
      registrationStartAt: new Date("2025-10-02T01:00:00Z"),
      registrationEndAt: new Date("2025-10-24T16:59:00Z"),
      deposit: 100000.0,
      status: "REGISTRATION",
      createdAt: new Date("2025-10-09T17:43:30.453Z"),
      updatedAt: new Date("2025-10-09T17:43:30.453Z"),
      organizationId: 2,
      createdById: 31
    },
    {
      id: 17,
      title: "Team Building",
      description: "fun",
      location: "2 district",
      minAttendees: 10,
      maxAttendees: 60,
      startAt: new Date("2025-12-25T02:00:00Z"),
      endAt: new Date("2025-12-25T10:00:00Z"),
      registrationStartAt: new Date("2025-10-02T01:00:00Z"),
      registrationEndAt: new Date("2025-10-24T16:59:00Z"),
      deposit: 100000.0,
      status: "REGISTRATION",
      createdAt: new Date("2025-10-09T17:43:54.400Z"),
      updatedAt: new Date("2025-10-09T17:43:54.400Z"),
      organizationId: 2,
      createdById: 31
    },
    {
      id: 18,
      title: "Tech Workshop",
      description: "This is a sample event for testing purposes. A comprehensive workshop covering the latest technologies and best practices in software development.",
      location: "Conference Room A, Building 1",
      minAttendees: 10,
      maxAttendees: 60,
      startAt: new Date("2025-12-25T02:00:00Z"),
      endAt: new Date("2025-12-25T10:00:00Z"),
      registrationStartAt: new Date("2025-10-20T01:00:00Z"),
      registrationEndAt: new Date("2025-10-24T16:59:00Z"),
      deposit: 100000.0,
      status: "DRAFT",
      createdAt: new Date("2025-10-09T18:17:52.518Z"),
      updatedAt: new Date("2025-10-09T18:17:52.518Z"),
      organizationId: 1,
      createdById: 23
    }
  ];

  // Create all events
  for (const eventData of events) {
    await prisma.event.create({ data: eventData });
  }

  // Create registrations with exact data from SQL
  const registrations = [
    { id: 49, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.557Z"), updatedAt: new Date("2025-10-09T17:21:34.557Z"), eventId: 11, userId: 26 },
    { id: 50, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.559Z"), updatedAt: new Date("2025-10-09T17:21:34.559Z"), eventId: 11, userId: 27 },
    { id: 51, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.560Z"), updatedAt: new Date("2025-10-09T17:21:34.560Z"), eventId: 11, userId: 28 },
    { id: 52, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.561Z"), updatedAt: new Date("2025-10-09T17:21:34.561Z"), eventId: 11, userId: 29 },
    { id: 53, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.561Z"), updatedAt: new Date("2025-10-09T17:21:34.561Z"), eventId: 11, userId: 30 },
    { id: 54, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.562Z"), updatedAt: new Date("2025-10-09T17:21:34.562Z"), eventId: 11, userId: 31 },
    { id: 55, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.563Z"), updatedAt: new Date("2025-10-09T17:21:34.563Z"), eventId: 11, userId: 32 },
    { id: 56, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.563Z"), updatedAt: new Date("2025-10-09T17:21:34.563Z"), eventId: 11, userId: 33 },
    { id: 57, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.564Z"), updatedAt: new Date("2025-10-09T17:21:34.564Z"), eventId: 11, userId: 34 },
    { id: 58, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.566Z"), updatedAt: new Date("2025-10-09T17:21:34.566Z"), eventId: 11, userId: 35 },
    { id: 59, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.567Z"), updatedAt: new Date("2025-10-09T17:21:34.567Z"), eventId: 11, userId: 36 },
    { id: 60, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.568Z"), updatedAt: new Date("2025-10-09T17:21:34.568Z"), eventId: 11, userId: 37 },
    // Event 12 registrations
    { id: 61, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.569Z"), updatedAt: new Date("2025-10-09T17:21:34.569Z"), eventId: 12, userId: 26 },
    { id: 62, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.569Z"), updatedAt: new Date("2025-10-09T17:21:34.569Z"), eventId: 12, userId: 27 },
    { id: 63, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.570Z"), updatedAt: new Date("2025-10-09T17:21:34.570Z"), eventId: 12, userId: 28 },
    { id: 64, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.570Z"), updatedAt: new Date("2025-10-09T17:21:34.570Z"), eventId: 12, userId: 29 },
    { id: 65, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.571Z"), updatedAt: new Date("2025-10-09T17:21:34.571Z"), eventId: 12, userId: 30 },
    { id: 66, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.594Z"), updatedAt: new Date("2025-10-09T17:21:34.594Z"), eventId: 12, userId: 31 },
    { id: 67, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.594Z"), updatedAt: new Date("2025-10-09T17:21:34.594Z"), eventId: 12, userId: 32 },
    { id: 68, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.595Z"), updatedAt: new Date("2025-10-09T17:21:34.595Z"), eventId: 12, userId: 33 },
    { id: 69, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.595Z"), updatedAt: new Date("2025-10-09T17:21:34.595Z"), eventId: 12, userId: 34 },
    { id: 70, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.596Z"), updatedAt: new Date("2025-10-09T17:21:34.596Z"), eventId: 12, userId: 35 },
    { id: 71, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.596Z"), updatedAt: new Date("2025-10-09T17:21:34.596Z"), eventId: 12, userId: 36 },
    { id: 72, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.597Z"), updatedAt: new Date("2025-10-09T17:21:34.597Z"), eventId: 12, userId: 37 },
    { id: 73, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.597Z"), updatedAt: new Date("2025-10-09T17:21:34.597Z"), eventId: 12, userId: 38 },
    { id: 74, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.598Z"), updatedAt: new Date("2025-10-09T17:21:34.598Z"), eventId: 12, userId: 39 },
    { id: 75, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.598Z"), updatedAt: new Date("2025-10-09T17:21:34.598Z"), eventId: 12, userId: 40 },
    // Event 13 registrations
    { id: 76, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.599Z"), updatedAt: new Date("2025-10-09T17:21:34.599Z"), eventId: 13, userId: 31 },
    { id: 77, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.600Z"), updatedAt: new Date("2025-10-09T17:21:34.600Z"), eventId: 13, userId: 32 },
    { id: 78, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.600Z"), updatedAt: new Date("2025-10-09T17:21:34.600Z"), eventId: 13, userId: 33 },
    { id: 79, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.601Z"), updatedAt: new Date("2025-10-09T17:21:34.601Z"), eventId: 13, userId: 34 },
    { id: 80, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.601Z"), updatedAt: new Date("2025-10-09T17:21:34.601Z"), eventId: 13, userId: 35 },
    { id: 81, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.602Z"), updatedAt: new Date("2025-10-09T17:21:34.602Z"), eventId: 13, userId: 36 },
    { id: 82, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.602Z"), updatedAt: new Date("2025-10-09T17:21:34.602Z"), eventId: 13, userId: 37 },
    { id: 83, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.603Z"), updatedAt: new Date("2025-10-09T17:21:34.603Z"), eventId: 13, userId: 38 },
    { id: 84, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.603Z"), updatedAt: new Date("2025-10-09T17:21:34.603Z"), eventId: 13, userId: 39 },
    { id: 85, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.604Z"), updatedAt: new Date("2025-10-09T17:21:34.604Z"), eventId: 13, userId: 40 },
    // Event 15 registrations (with some attendance)
    { id: 86, status: "REGISTERED", attendance: true, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.604Z"), updatedAt: new Date("2025-10-09T17:21:34.604Z"), eventId: 15, userId: 26 },
    { id: 87, status: "REGISTERED", attendance: true, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.604Z"), updatedAt: new Date("2025-10-09T17:21:34.604Z"), eventId: 15, userId: 27 },
    { id: 88, status: "REGISTERED", attendance: true, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.605Z"), updatedAt: new Date("2025-10-09T17:21:34.605Z"), eventId: 15, userId: 28 },
    { id: 89, status: "REGISTERED", attendance: true, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.606Z"), updatedAt: new Date("2025-10-09T17:21:34.606Z"), eventId: 15, userId: 29 },
    { id: 90, status: "REGISTERED", attendance: true, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.606Z"), updatedAt: new Date("2025-10-09T17:21:34.606Z"), eventId: 15, userId: 30 },
    { id: 91, status: "REGISTERED", attendance: true, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.607Z"), updatedAt: new Date("2025-10-09T17:21:34.607Z"), eventId: 15, userId: 31 },
    { id: 92, status: "REGISTERED", attendance: true, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.607Z"), updatedAt: new Date("2025-10-09T17:21:34.607Z"), eventId: 15, userId: 32 },
    { id: 93, status: "REGISTERED", attendance: true, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.608Z"), updatedAt: new Date("2025-10-09T17:21:34.608Z"), eventId: 15, userId: 33 },
    { id: 94, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.609Z"), updatedAt: new Date("2025-10-09T17:21:34.609Z"), eventId: 15, userId: 34 },
    { id: 95, status: "REGISTERED", attendance: false, depositPaid: false, createdAt: new Date("2025-10-09T17:21:34.610Z"), updatedAt: new Date("2025-10-09T17:21:34.610Z"), eventId: 15, userId: 35 }
  ];

  // Create all registrations
  for (const regData of registrations) {
    await prisma.registration.create({ data: regData });
  }

  // Create notifications with exact data from SQL
  const notifications = [
    // Welcome notifications
    { id: 27, title: "Chào mừng bạn đến với UIT Cybersecurity Club!", message: "Cảm ơn bạn đã tham gia cộng đồng. Hãy theo dõi các sự kiện sắp tới!", type: "GENERAL", isRead: true, createdAt: new Date("2025-10-09T17:21:34.611Z"), recipientId: 26 },
    { id: 28, title: "Chào mừng bạn đến với UIT Cybersecurity Club!", message: "Cảm ơn bạn đã tham gia cộng đồng. Hãy theo dõi các sự kiện sắp tới!", type: "GENERAL", isRead: true, createdAt: new Date("2025-10-09T17:21:34.612Z"), recipientId: 27 },
    { id: 29, title: "Chào mừng bạn đến với UIT Cybersecurity Club!", message: "Cảm ơn bạn đã tham gia cộng đồng. Hãy theo dõi các sự kiện sắp tới!", type: "GENERAL", isRead: true, createdAt: new Date("2025-10-09T17:21:34.613Z"), recipientId: 28 },
    { id: 30, title: "Chào mừng bạn đến với UIT Cybersecurity Club!", message: "Cảm ơn bạn đã tham gia cộng đồng. Hãy theo dõi các sự kiện sắp tới!", type: "GENERAL", isRead: false, createdAt: new Date("2025-10-09T17:21:34.613Z"), recipientId: 29 },
    { id: 31, title: "Chào mừng bạn đến với UIT Cybersecurity Club!", message: "Cảm ơn bạn đã tham gia cộng đồng. Hãy theo dõi các sự kiện sắp tới!", type: "GENERAL", isRead: false, createdAt: new Date("2025-10-09T17:21:34.614Z"), recipientId: 30 },
    // Registration success notifications
    { id: 32, title: "Đăng ký thành công!", message: 'Bạn đã đăng ký thành công sự kiện "Workshop An toàn thông tin cơ bản". Vui lòng có mặt đúng giờ.', type: "EVENT", isRead: true, createdAt: new Date("2025-10-09T17:21:34.615Z"), recipientId: 26 },
    { id: 33, title: "Đăng ký thành công!", message: 'Bạn đã đăng ký thành công sự kiện "Workshop An toàn thông tin cơ bản". Vui lòng có mặt đúng giờ.', type: "EVENT", isRead: true, createdAt: new Date("2025-10-09T17:21:34.615Z"), recipientId: 27 },
    { id: 34, title: "Đăng ký thành công!", message: 'Bạn đã đăng ký thành công sự kiện "Workshop An toàn thông tin cơ bản". Vui lòng có mặt đúng giờ.', type: "EVENT", isRead: true, createdAt: new Date("2025-10-09T17:21:34.616Z"), recipientId: 28 },
    { id: 35, title: "Đăng ký thành công!", message: 'Bạn đã đăng ký thành công sự kiện "Workshop An toàn thông tin cơ bản". Vui lòng có mặt đúng giờ.', type: "EVENT", isRead: true, createdAt: new Date("2025-10-09T17:21:34.616Z"), recipientId: 29 },
    { id: 36, title: "Đăng ký thành công!", message: 'Bạn đã đăng ký thành công sự kiện "Workshop An toàn thông tin cơ bản". Vui lòng có mặt đúng giờ.', type: "EVENT", isRead: false, createdAt: new Date("2025-10-09T17:21:34.617Z"), recipientId: 30 },
    { id: 37, title: "Đăng ký thành công!", message: 'Bạn đã đăng ký thành công sự kiện "Workshop An toàn thông tin cơ bản". Vui lòng có mặt đúng giờ.', type: "EVENT", isRead: false, createdAt: new Date("2025-10-09T17:21:34.617Z"), recipientId: 31 },
    { id: 38, title: "Đăng ký thành công!", message: 'Bạn đã đăng ký thành công sự kiện "Workshop An toàn thông tin cơ bản". Vui lòng có mặt đúng giờ.', type: "EVENT", isRead: false, createdAt: new Date("2025-10-09T17:21:34.617Z"), recipientId: 32 },
    { id: 39, title: "Đăng ký thành công!", message: 'Bạn đã đăng ký thành công sự kiện "Workshop An toàn thông tin cơ bản". Vui lòng có mặt đúng giờ.', type: "EVENT", isRead: false, createdAt: new Date("2025-10-09T17:21:34.640Z"), recipientId: 33 },
    // System reminder notifications
    { id: 40, title: "Nhắc nhở sự kiện", message: 'Sự kiện "Hội thảo Ethical Hacking" sẽ diễn ra vào ngày mai. Đừng quên tham gia!', type: "SYSTEM", isRead: false, createdAt: new Date("2025-10-09T17:21:34.640Z"), recipientId: 26 },
    { id: 41, title: "Nhắc nhở sự kiện", message: 'Sự kiện "Hội thảo Ethical Hacking" sẽ diễn ra vào ngày mai. Đừng quên tham gia!', type: "SYSTEM", isRead: false, createdAt: new Date("2025-10-09T17:21:34.641Z"), recipientId: 27 },
    { id: 42, title: "Nhắc nhở sự kiện", message: 'Sự kiện "Hội thảo Ethical Hacking" sẽ diễn ra vào ngày mai. Đừng quên tham gia!', type: "SYSTEM", isRead: false, createdAt: new Date("2025-10-09T17:21:34.642Z"), recipientId: 28 },
    { id: 43, title: "Nhắc nhở sự kiện", message: 'Sự kiện "Hội thảo Ethical Hacking" sẽ diễn ra vào ngày mai. Đừng quên tham gia!', type: "SYSTEM", isRead: false, createdAt: new Date("2025-10-09T17:21:34.642Z"), recipientId: 29 },
    { id: 44, title: "Nhắc nhở sự kiện", message: 'Sự kiện "Hội thảo Ethical Hacking" sẽ diễn ra vào ngày mai. Đừng quên tham gia!', type: "SYSTEM", isRead: false, createdAt: new Date("2025-10-09T17:21:34.644Z"), recipientId: 30 },
    { id: 45, title: "Nhắc nhở sự kiện", message: 'Sự kiện "Hội thảo Ethical Hacking" sẽ diễn ra vào ngày mai. Đừng quên tham gia!', type: "SYSTEM", isRead: false, createdAt: new Date("2025-10-09T17:21:34.644Z"), recipientId: 31 }
  ];

  // Create all notifications
  for (const notifData of notifications) {
    await prisma.notification.create({ data: notifData });
  }

  console.log("✅ Seeding finished.");
  console.log(`📊 Created:`);
  console.log(`   - 2 organizations`);
  console.log(`   - ${users.length} users`);
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