-- -------------------------------------------------------------
-- TablePlus 6.7.1(636)
--
-- https://tableplus.com/
--
-- Database: event_management
-- Generation Time: 2025-10-07 12:08:54.0440
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."Event";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS "Event_id_seq";
DROP TYPE IF EXISTS "public"."EventStatus";
CREATE TYPE "public"."EventStatus" AS ENUM ('DRAFT', 'REGISTRATION', 'READY', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- Table Definition
CREATE TABLE "public"."Event" (
    "id" int4 NOT NULL DEFAULT nextval('"Event_id_seq"'::regclass),
    "title" text NOT NULL,
    "description" text,
    "location" text,
    "minAttendees" int4,
    "maxAttendees" int4,
    "startAt" timestamptz,
    "endAt" timestamptz,
    "registrationStartAt" timestamptz,
    "registrationEndAt" timestamptz,
    "deposit" numeric(65,30) NOT NULL DEFAULT 0.0,
    "status" "public"."EventStatus" NOT NULL DEFAULT 'DRAFT'::"EventStatus",
    "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamptz NOT NULL,
    "organizationId" int4 NOT NULL,
    "createdById" int4 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."Notification";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS "Notification_id_seq";
DROP TYPE IF EXISTS "public"."NotificationType";
CREATE TYPE "public"."NotificationType" AS ENUM ('GENERAL', 'EVENT', 'SYSTEM');

-- Table Definition
CREATE TABLE "public"."Notification" (
    "id" int4 NOT NULL DEFAULT nextval('"Notification_id_seq"'::regclass),
    "title" text NOT NULL,
    "message" text NOT NULL,
    "type" "public"."NotificationType" NOT NULL DEFAULT 'GENERAL'::"NotificationType",
    "isRead" bool NOT NULL DEFAULT false,
    "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipientId" int4,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."User";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS "User_id_seq";
DROP TYPE IF EXISTS "public"."Role";
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MEMBER');

-- Table Definition
CREATE TABLE "public"."User" (
    "id" int4 NOT NULL DEFAULT nextval('"User_id_seq"'::regclass),
    "email" text NOT NULL,
    "fullName" text,
    "phoneNumber" text,
    "passwordHash" text NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'MEMBER'::"Role",
    "isActive" bool NOT NULL DEFAULT true,
    "avatarUrl" text,
    "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamptz NOT NULL,
    "organizationId" int4 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."Registration";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS "Registration_id_seq";

-- Table Definition
CREATE TABLE "public"."Registration" (
    "id" int4 NOT NULL DEFAULT nextval('"Registration_id_seq"'::regclass),
    "status" text NOT NULL DEFAULT 'REGISTERED'::text,
    "attendance" bool NOT NULL DEFAULT false,
    "depositPaid" bool NOT NULL DEFAULT false,
    "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamptz NOT NULL,
    "eventId" int4 NOT NULL,
    "userId" int4 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."Attachment";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS "Attachment_id_seq";

-- Table Definition
CREATE TABLE "public"."Attachment" (
    "id" int4 NOT NULL DEFAULT nextval('"Attachment_id_seq"'::regclass),
    "filename" text,
    "url" text NOT NULL,
    "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" int4 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."Organization";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS "Organization_id_seq";

-- Table Definition
CREATE TABLE "public"."Organization" (
    "id" int4 NOT NULL DEFAULT nextval('"Organization_id_seq"'::regclass),
    "name" text NOT NULL,
    "slug" text NOT NULL,
    "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamptz NOT NULL,
    PRIMARY KEY ("id")
);

INSERT INTO "public"."Event" ("id", "title", "description", "location", "minAttendees", "maxAttendees", "startAt", "endAt", "registrationStartAt", "registrationEndAt", "deposit", "status", "createdAt", "updatedAt", "organizationId", "createdById") VALUES
(1, 'Event 1', 'Description for event 1', 'Location A', 5, 50, '2025-10-08 12:23:36+07', '2025-10-09 12:23:36+07', '2025-10-01 12:23:36+07', '2025-10-03 12:23:36+07', 100.000000000000000000000000000000, 'CANCELLED', '2025-10-01 12:23:36.617093+07', '2025-10-06 11:58:13.013+07', 1, 1),
(3, 'Event 3', 'Description for event 3', 'Location C', 5, 30, '2025-10-04 12:23:36.617093+07', '2025-10-05 12:23:36.617093+07', '2025-10-01 12:23:36.617093+07', '2025-10-03 12:23:36.617093+07', 150.000000000000000000000000000000, 'COMPLETED', '2025-10-01 12:23:36.617093+07', '2025-10-05 13:55:08.94+07', 1, 1),
(4, 'Event 4', 'Description for event 4', 'Location D', 8, 60, '2025-10-05 12:23:36+07', '2025-10-06 11:23:36+07', '2025-10-01 12:23:36+07', '2025-10-04 12:23:36+07', 300.000000000000000000000000000000, 'COMPLETED', '2025-10-01 12:23:36.617093+07', '2025-10-06 12:06:37.718+07', 1, 1),
(5, 'Event 5', 'Description for event 5.', 'Location E', 20, 200, '2025-10-21 12:23:36+07', '2025-10-22 12:23:36+07', '2025-10-01 12:23:36+07', '2025-10-20 12:23:36+07', 500.000000000000000000000000000000, 'CANCELLED', '2025-10-01 12:23:36.617093+07', '2025-10-06 10:40:24.524+07', 1, 1),
(6, 'event cuoi nam', 'hoa dong', 'thu duc', 1, 13, '2025-10-04 21:54:00+07', '2025-10-05 21:54:00+07', '2025-10-01 21:54:00+07', '2025-10-02 21:54:00+07', 100000.000000000000000000000000000000, 'COMPLETED', '2025-10-04 21:55:16.442+07', '2025-10-06 10:39:59.781+07', 1, 1),
(7, 'runny cafe', 'mo ta kcj', 'dong nai', 3, 89, '2025-10-18 21:55:00+07', '2025-10-19 21:55:00+07', '2025-10-01 21:55:00+07', '2025-10-07 21:55:00+07', 30000.000000000000000000000000000000, 'REGISTRATION', '2025-10-04 21:55:51.729+07', '2025-10-05 15:54:23.683+07', 1, 1),
(8, 'su kien team building', 'vui ve', 'Địa điểm 1', 3, 14, '2025-10-23 09:43:00+07', '2025-10-26 09:43:00+07', '2025-10-04 09:44:00+07', '2025-10-11 09:44:00+07', 400000.000000000000000000000000000000, 'REGISTRATION', '2025-10-06 09:44:25.924+07', '2025-10-06 09:44:56.336+07', 1, 1),
(9, 'su kien da banh', 'vui ve', 'q2', 1, 4, '2025-10-18 10:14:00+07', '2025-10-19 10:15:00+07', '2025-10-04 10:15:00+07', '2025-10-05 10:15:00+07', 100000.000000000000000000000000000000, 'CANCELLED', '2025-10-06 10:15:12.697+07', '2025-10-06 10:39:43.686+07', 1, 1),
(12, '1345', 'gg', '2345', 1, 4, '2025-10-06 10:00:00+07', '2025-10-12 12:00:00+07', '2025-10-04 12:00:00+07', '2025-10-05 12:00:00+07', 60000.000000000000000000000000000000, 'ONGOING', '2025-10-06 12:00:32.312+07', '2025-10-06 12:24:51.379+07', 1, 1);

INSERT INTO "public"."Notification" ("id", "title", "message", "type", "isRead", "createdAt", "recipientId") VALUES
(1, 'Welcome!', 'Welcome to the system, User 1!', 'GENERAL', 't', '2025-10-06 15:58:10.189772+07', 1),
(2, 'Event Reminder', 'Don’t forget your upcoming event tomorrow.', 'EVENT', 't', '2025-10-06 15:58:10.189772+07', 1),
(3, 'System Update', 'The system will undergo maintenance tonight.', 'SYSTEM', 't', '2025-10-06 15:58:10.189772+07', 1),
(4, 'Profile Updated', 'Your profile information has been updated.', 'GENERAL', 't', '2025-10-06 15:58:10.189772+07', 1),
(21, 'Welcome!', 'Welcome to the system, User 2!', 'GENERAL', 't', '2025-10-06 15:58:10.189772+07', 2),
(22, 'Event Notification', 'A new event has been created for your team.', 'EVENT', 't', '2025-10-06 15:58:10.189772+07', 2),
(23, 'System Alert', 'Unusual activity detected in your account.', 'SYSTEM', 't', '2025-10-06 15:58:10.189772+07', 2),
(24, 'General Notice', 'Your profile is now verified.', 'GENERAL', 't', '2025-10-06 15:58:10.189772+07', 2),
(41, '🎉 Sự kiện mới: tao de test noti', 'Có sự kiện mới được tạo!

📅 Sự kiện: tao de test noti
📝 Mô tả: vfsd
📍 Địa điểm: a

⏰ Thời gian:
• Bắt đầu: 16:01 10/10/2025
• Kết thúc: 16:01 12/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:01 07/10/2025
• Đóng đăng ký: 16:01 08/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:01:20.371+07', 3),
(42, '🎉 Sự kiện mới: tao de test noti', 'Có sự kiện mới được tạo!

📅 Sự kiện: tao de test noti
📝 Mô tả: vfsd
📍 Địa điểm: a

⏰ Thời gian:
• Bắt đầu: 16:01 10/10/2025
• Kết thúc: 16:01 12/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:01 07/10/2025
• Đóng đăng ký: 16:01 08/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:01:20.371+07', 5),
(43, '🎉 Sự kiện mới: tao de test noti', 'Có sự kiện mới được tạo!

📅 Sự kiện: tao de test noti
📝 Mô tả: vfsd
📍 Địa điểm: a

⏰ Thời gian:
• Bắt đầu: 16:01 10/10/2025
• Kết thúc: 16:01 12/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:01 07/10/2025
• Đóng đăng ký: 16:01 08/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-06 16:01:20.371+07', 2),
(44, '🎉 Sự kiện mới: tao de test noti', 'Có sự kiện mới được tạo!

📅 Sự kiện: tao de test noti
📝 Mô tả: vfsd
📍 Địa điểm: a

⏰ Thời gian:
• Bắt đầu: 16:01 10/10/2025
• Kết thúc: 16:01 12/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:01 07/10/2025
• Đóng đăng ký: 16:01 08/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:01:20.371+07', 7),
(45, '🎉 Sự kiện mới: tao de test noti', 'Có sự kiện mới được tạo!

📅 Sự kiện: tao de test noti
📝 Mô tả: vfsd
📍 Địa điểm: a

⏰ Thời gian:
• Bắt đầu: 16:01 10/10/2025
• Kết thúc: 16:01 12/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:01 07/10/2025
• Đóng đăng ký: 16:01 08/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:01:20.371+07', 6),
(46, '🎉 Sự kiện mới: t', 'Có sự kiện mới được tạo!

📅 Sự kiện: t
📝 Mô tả: gggg
📍 Địa điểm: t

⏰ Thời gian:
• Bắt đầu: 16:41 18/10/2025
• Kết thúc: 16:41 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:41 08/10/2025
• Đóng đăng ký: 16:41 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:41:27.301+07', 5),
(47, '🎉 Sự kiện mới: t', 'Có sự kiện mới được tạo!

📅 Sự kiện: t
📝 Mô tả: gggg
📍 Địa điểm: t

⏰ Thời gian:
• Bắt đầu: 16:41 18/10/2025
• Kết thúc: 16:41 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:41 08/10/2025
• Đóng đăng ký: 16:41 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:41:27.301+07', 6),
(48, '🎉 Sự kiện mới: t', 'Có sự kiện mới được tạo!

📅 Sự kiện: t
📝 Mô tả: gggg
📍 Địa điểm: t

⏰ Thời gian:
• Bắt đầu: 16:41 18/10/2025
• Kết thúc: 16:41 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:41 08/10/2025
• Đóng đăng ký: 16:41 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-06 16:41:27.301+07', 2),
(49, '🎉 Sự kiện mới: t', 'Có sự kiện mới được tạo!

📅 Sự kiện: t
📝 Mô tả: gggg
📍 Địa điểm: t

⏰ Thời gian:
• Bắt đầu: 16:41 18/10/2025
• Kết thúc: 16:41 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:41 08/10/2025
• Đóng đăng ký: 16:41 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:41:27.301+07', 7),
(50, '🎉 Sự kiện mới: t', 'Có sự kiện mới được tạo!

📅 Sự kiện: t
📝 Mô tả: gggg
📍 Địa điểm: t

⏰ Thời gian:
• Bắt đầu: 16:41 18/10/2025
• Kết thúc: 16:41 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:41 08/10/2025
• Đóng đăng ký: 16:41 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:41:27.301+07', 3),
(51, '🎉 Sự kiện mới: tẻtwẻt', 'Có sự kiện mới được tạo!

📅 Sự kiện: tẻtwẻt
📝 Mô tả: 2
📍 Địa điểm: ửeeewê

⏰ Thời gian:
• Bắt đầu: 16:43 24/10/2025
• Kết thúc: 16:43 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:43 09/10/2025
• Đóng đăng ký: 16:43 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:43:36.584+07', 6),
(52, '🎉 Sự kiện mới: tẻtwẻt', 'Có sự kiện mới được tạo!

📅 Sự kiện: tẻtwẻt
📝 Mô tả: 2
📍 Địa điểm: ửeeewê

⏰ Thời gian:
• Bắt đầu: 16:43 24/10/2025
• Kết thúc: 16:43 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:43 09/10/2025
• Đóng đăng ký: 16:43 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:43:36.584+07', 5),
(53, '🎉 Sự kiện mới: tẻtwẻt', 'Có sự kiện mới được tạo!

📅 Sự kiện: tẻtwẻt
📝 Mô tả: 2
📍 Địa điểm: ửeeewê

⏰ Thời gian:
• Bắt đầu: 16:43 24/10/2025
• Kết thúc: 16:43 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:43 09/10/2025
• Đóng đăng ký: 16:43 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:43:36.584+07', 3),
(54, '🎉 Sự kiện mới: tẻtwẻt', 'Có sự kiện mới được tạo!

📅 Sự kiện: tẻtwẻt
📝 Mô tả: 2
📍 Địa điểm: ửeeewê

⏰ Thời gian:
• Bắt đầu: 16:43 24/10/2025
• Kết thúc: 16:43 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:43 09/10/2025
• Đóng đăng ký: 16:43 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:43:36.584+07', 7),
(55, '🎉 Sự kiện mới: tẻtwẻt', 'Có sự kiện mới được tạo!

📅 Sự kiện: tẻtwẻt
📝 Mô tả: 2
📍 Địa điểm: ửeeewê

⏰ Thời gian:
• Bắt đầu: 16:43 24/10/2025
• Kết thúc: 16:43 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:43 09/10/2025
• Đóng đăng ký: 16:43 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-06 16:43:36.584+07', 2),
(56, '🎉 Sự kiện mới: uia', 'Có sự kiện mới được tạo!

📅 Sự kiện: uia
📝 Mô tả: nnn
📍 Địa điểm: uia

⏰ Thời gian:
• Bắt đầu: 16:45 25/10/2025
• Kết thúc: 16:45 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:45 08/10/2025
• Đóng đăng ký: 16:46 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:46:08.758+07', 6),
(57, '🎉 Sự kiện mới: uia', 'Có sự kiện mới được tạo!

📅 Sự kiện: uia
📝 Mô tả: nnn
📍 Địa điểm: uia

⏰ Thời gian:
• Bắt đầu: 16:45 25/10/2025
• Kết thúc: 16:45 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:45 08/10/2025
• Đóng đăng ký: 16:46 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:46:08.758+07', 7),
(58, '🎉 Sự kiện mới: uia', 'Có sự kiện mới được tạo!

📅 Sự kiện: uia
📝 Mô tả: nnn
📍 Địa điểm: uia

⏰ Thời gian:
• Bắt đầu: 16:45 25/10/2025
• Kết thúc: 16:45 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:45 08/10/2025
• Đóng đăng ký: 16:46 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:46:08.758+07', 5),
(59, '🎉 Sự kiện mới: uia', 'Có sự kiện mới được tạo!

📅 Sự kiện: uia
📝 Mô tả: nnn
📍 Địa điểm: uia

⏰ Thời gian:
• Bắt đầu: 16:45 25/10/2025
• Kết thúc: 16:45 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:45 08/10/2025
• Đóng đăng ký: 16:46 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:46:08.758+07', 3),
(60, '🎉 Sự kiện mới: uia', 'Có sự kiện mới được tạo!

📅 Sự kiện: uia
📝 Mô tả: nnn
📍 Địa điểm: uia

⏰ Thời gian:
• Bắt đầu: 16:45 25/10/2025
• Kết thúc: 16:45 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:45 08/10/2025
• Đóng đăng ký: 16:46 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-06 16:46:08.758+07', 2),
(61, '🎉 Sự kiện mới: 123123123123123', 'Có sự kiện mới được tạo!

📅 Sự kiện: 123123123123123
📝 Mô tả: fdbb
📍 Địa điểm: 123123123

⏰ Thời gian:
• Bắt đầu: 16:49 31/10/2025
• Kết thúc: 16:49 02/11/2025

📝 Đăng ký:
• Mở đăng ký: 16:49 15/10/2025
• Đóng đăng ký: 16:49 17/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:49:45.402+07', 7),
(62, '🎉 Sự kiện mới: 123123123123123', 'Có sự kiện mới được tạo!

📅 Sự kiện: 123123123123123
📝 Mô tả: fdbb
📍 Địa điểm: 123123123

⏰ Thời gian:
• Bắt đầu: 16:49 31/10/2025
• Kết thúc: 16:49 02/11/2025

📝 Đăng ký:
• Mở đăng ký: 16:49 15/10/2025
• Đóng đăng ký: 16:49 17/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-06 16:49:45.402+07', 2),
(63, '🎉 Sự kiện mới: 123123123123123', 'Có sự kiện mới được tạo!

📅 Sự kiện: 123123123123123
📝 Mô tả: fdbb
📍 Địa điểm: 123123123

⏰ Thời gian:
• Bắt đầu: 16:49 31/10/2025
• Kết thúc: 16:49 02/11/2025

📝 Đăng ký:
• Mở đăng ký: 16:49 15/10/2025
• Đóng đăng ký: 16:49 17/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:49:45.402+07', 3),
(64, '🎉 Sự kiện mới: 123123123123123', 'Có sự kiện mới được tạo!

📅 Sự kiện: 123123123123123
📝 Mô tả: fdbb
📍 Địa điểm: 123123123

⏰ Thời gian:
• Bắt đầu: 16:49 31/10/2025
• Kết thúc: 16:49 02/11/2025

📝 Đăng ký:
• Mở đăng ký: 16:49 15/10/2025
• Đóng đăng ký: 16:49 17/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:49:45.402+07', 5),
(65, '🎉 Sự kiện mới: 123123123123123', 'Có sự kiện mới được tạo!

📅 Sự kiện: 123123123123123
📝 Mô tả: fdbb
📍 Địa điểm: 123123123

⏰ Thời gian:
• Bắt đầu: 16:49 31/10/2025
• Kết thúc: 16:49 02/11/2025

📝 Đăng ký:
• Mở đăng ký: 16:49 15/10/2025
• Đóng đăng ký: 16:49 17/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:49:45.402+07', 6),
(66, '🎉 Sự kiện mới: hmgxc', 'Có sự kiện mới được tạo!

📅 Sự kiện: hmgxc
📝 Mô tả: 88
📍 Địa điểm: hxgm

⏰ Thời gian:
• Bắt đầu: 16:50 18/10/2025
• Kết thúc: 16:50 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:50 08/10/2025
• Đóng đăng ký: 16:50 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:50:18.045+07', 7),
(67, '🎉 Sự kiện mới: hmgxc', 'Có sự kiện mới được tạo!

📅 Sự kiện: hmgxc
📝 Mô tả: 88
📍 Địa điểm: hxgm

⏰ Thời gian:
• Bắt đầu: 16:50 18/10/2025
• Kết thúc: 16:50 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:50 08/10/2025
• Đóng đăng ký: 16:50 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:50:18.045+07', 6),
(68, '🎉 Sự kiện mới: hmgxc', 'Có sự kiện mới được tạo!

📅 Sự kiện: hmgxc
📝 Mô tả: 88
📍 Địa điểm: hxgm

⏰ Thời gian:
• Bắt đầu: 16:50 18/10/2025
• Kết thúc: 16:50 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:50 08/10/2025
• Đóng đăng ký: 16:50 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:50:18.046+07', 5),
(69, '🎉 Sự kiện mới: hmgxc', 'Có sự kiện mới được tạo!

📅 Sự kiện: hmgxc
📝 Mô tả: 88
📍 Địa điểm: hxgm

⏰ Thời gian:
• Bắt đầu: 16:50 18/10/2025
• Kết thúc: 16:50 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:50 08/10/2025
• Đóng đăng ký: 16:50 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-06 16:50:18.046+07', 2),
(70, '🎉 Sự kiện mới: hmgxc', 'Có sự kiện mới được tạo!

📅 Sự kiện: hmgxc
📝 Mô tả: 88
📍 Địa điểm: hxgm

⏰ Thời gian:
• Bắt đầu: 16:50 18/10/2025
• Kết thúc: 16:50 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:50 08/10/2025
• Đóng đăng ký: 16:50 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:50:18.046+07', 3),
(71, '🎉 Sự kiện mới: reA', 'Có sự kiện mới được tạo!

📅 Sự kiện: reA
📝 Mô tả: 432
📍 Địa điểm: ẺGA

⏰ Thời gian:
• Bắt đầu: 16:52 24/10/2025
• Kết thúc: 16:52 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:52 17/10/2025
• Đóng đăng ký: 16:52 18/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:52:58.102+07', 6),
(72, '🎉 Sự kiện mới: reA', 'Có sự kiện mới được tạo!

📅 Sự kiện: reA
📝 Mô tả: 432
📍 Địa điểm: ẺGA

⏰ Thời gian:
• Bắt đầu: 16:52 24/10/2025
• Kết thúc: 16:52 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:52 17/10/2025
• Đóng đăng ký: 16:52 18/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:52:58.102+07', 5),
(73, '🎉 Sự kiện mới: reA', 'Có sự kiện mới được tạo!

📅 Sự kiện: reA
📝 Mô tả: 432
📍 Địa điểm: ẺGA

⏰ Thời gian:
• Bắt đầu: 16:52 24/10/2025
• Kết thúc: 16:52 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:52 17/10/2025
• Đóng đăng ký: 16:52 18/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-06 16:52:58.102+07', 2),
(74, '🎉 Sự kiện mới: reA', 'Có sự kiện mới được tạo!

📅 Sự kiện: reA
📝 Mô tả: 432
📍 Địa điểm: ẺGA

⏰ Thời gian:
• Bắt đầu: 16:52 24/10/2025
• Kết thúc: 16:52 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:52 17/10/2025
• Đóng đăng ký: 16:52 18/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:52:58.102+07', 3),
(75, '🎉 Sự kiện mới: reA', 'Có sự kiện mới được tạo!

📅 Sự kiện: reA
📝 Mô tả: 432
📍 Địa điểm: ẺGA

⏰ Thời gian:
• Bắt đầu: 16:52 24/10/2025
• Kết thúc: 16:52 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 16:52 17/10/2025
• Đóng đăng ký: 16:52 18/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:52:58.102+07', 7),
(76, '🎉 Sự kiện mới: trtretr', 'Có sự kiện mới được tạo!

📅 Sự kiện: trtretr
📝 Mô tả: 234
📍 Địa điểm: rtrtt

⏰ Thời gian:
• Bắt đầu: 16:54 01/11/2025
• Kết thúc: 16:54 02/11/2025

📝 Đăng ký:
• Mở đăng ký: 16:55 08/10/2025
• Đóng đăng ký: 16:55 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:55:10.764+07', 6),
(77, '🎉 Sự kiện mới: trtretr', 'Có sự kiện mới được tạo!

📅 Sự kiện: trtretr
📝 Mô tả: 234
📍 Địa điểm: rtrtt

⏰ Thời gian:
• Bắt đầu: 16:54 01/11/2025
• Kết thúc: 16:54 02/11/2025

📝 Đăng ký:
• Mở đăng ký: 16:55 08/10/2025
• Đóng đăng ký: 16:55 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:55:10.764+07', 7),
(78, '🎉 Sự kiện mới: trtretr', 'Có sự kiện mới được tạo!

📅 Sự kiện: trtretr
📝 Mô tả: 234
📍 Địa điểm: rtrtt

⏰ Thời gian:
• Bắt đầu: 16:54 01/11/2025
• Kết thúc: 16:54 02/11/2025

📝 Đăng ký:
• Mở đăng ký: 16:55 08/10/2025
• Đóng đăng ký: 16:55 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:55:10.764+07', 5),
(79, '🎉 Sự kiện mới: trtretr', 'Có sự kiện mới được tạo!

📅 Sự kiện: trtretr
📝 Mô tả: 234
📍 Địa điểm: rtrtt

⏰ Thời gian:
• Bắt đầu: 16:54 01/11/2025
• Kết thúc: 16:54 02/11/2025

📝 Đăng ký:
• Mở đăng ký: 16:55 08/10/2025
• Đóng đăng ký: 16:55 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-06 16:55:10.764+07', 2),
(80, '🎉 Sự kiện mới: trtretr', 'Có sự kiện mới được tạo!

📅 Sự kiện: trtretr
📝 Mô tả: 234
📍 Địa điểm: rtrtt

⏰ Thời gian:
• Bắt đầu: 16:54 01/11/2025
• Kết thúc: 16:54 02/11/2025

📝 Đăng ký:
• Mở đăng ký: 16:55 08/10/2025
• Đóng đăng ký: 16:55 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 16:55:10.764+07', 3),
(81, '🎉 Sự kiện mới: yh5ttthrrt', 'Có sự kiện mới được tạo!

📅 Sự kiện: yh5ttthrrt
📝 Mô tả: 134
📍 Địa điểm: rthtrrt

⏰ Thời gian:
• Bắt đầu: 17:28 17/10/2025
• Kết thúc: 17:28 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 17:28 09/10/2025
• Đóng đăng ký: 17:28 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 17:28:24.405+07', 6),
(82, '🎉 Sự kiện mới: yh5ttthrrt', 'Có sự kiện mới được tạo!

📅 Sự kiện: yh5ttthrrt
📝 Mô tả: 134
📍 Địa điểm: rthtrrt

⏰ Thời gian:
• Bắt đầu: 17:28 17/10/2025
• Kết thúc: 17:28 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 17:28 09/10/2025
• Đóng đăng ký: 17:28 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 17:28:24.405+07', 3),
(83, '🎉 Sự kiện mới: yh5ttthrrt', 'Có sự kiện mới được tạo!

📅 Sự kiện: yh5ttthrrt
📝 Mô tả: 134
📍 Địa điểm: rthtrrt

⏰ Thời gian:
• Bắt đầu: 17:28 17/10/2025
• Kết thúc: 17:28 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 17:28 09/10/2025
• Đóng đăng ký: 17:28 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-06 17:28:24.405+07', 2),
(84, '🎉 Sự kiện mới: yh5ttthrrt', 'Có sự kiện mới được tạo!

📅 Sự kiện: yh5ttthrrt
📝 Mô tả: 134
📍 Địa điểm: rthtrrt

⏰ Thời gian:
• Bắt đầu: 17:28 17/10/2025
• Kết thúc: 17:28 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 17:28 09/10/2025
• Đóng đăng ký: 17:28 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 17:28:24.405+07', 7),
(85, '🎉 Sự kiện mới: yh5ttthrrt', 'Có sự kiện mới được tạo!

📅 Sự kiện: yh5ttthrrt
📝 Mô tả: 134
📍 Địa điểm: rthtrrt

⏰ Thời gian:
• Bắt đầu: 17:28 17/10/2025
• Kết thúc: 17:28 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 17:28 09/10/2025
• Đóng đăng ký: 17:28 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-06 17:28:24.405+07', 5),
(86, '🎉 Sự kiện mới: 111', 'Có sự kiện mới được tạo!

📅 Sự kiện: 111
📝 Mô tả: dđ
📍 Địa điểm: 111

⏰ Thời gian:
• Bắt đầu: 01:29 23/10/2025
• Kết thúc: 01:29 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 01:29 09/10/2025
• Đóng đăng ký: 01:29 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 01:30:06.654+07', 5),
(87, '🎉 Sự kiện mới: 111', 'Có sự kiện mới được tạo!

📅 Sự kiện: 111
📝 Mô tả: dđ
📍 Địa điểm: 111

⏰ Thời gian:
• Bắt đầu: 01:29 23/10/2025
• Kết thúc: 01:29 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 01:29 09/10/2025
• Đóng đăng ký: 01:29 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 01:30:06.654+07', 6),
(88, '🎉 Sự kiện mới: 111', 'Có sự kiện mới được tạo!

📅 Sự kiện: 111
📝 Mô tả: dđ
📍 Địa điểm: 111

⏰ Thời gian:
• Bắt đầu: 01:29 23/10/2025
• Kết thúc: 01:29 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 01:29 09/10/2025
• Đóng đăng ký: 01:29 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 01:30:06.654+07', 3),
(89, '🎉 Sự kiện mới: 111', 'Có sự kiện mới được tạo!

📅 Sự kiện: 111
📝 Mô tả: dđ
📍 Địa điểm: 111

⏰ Thời gian:
• Bắt đầu: 01:29 23/10/2025
• Kết thúc: 01:29 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 01:29 09/10/2025
• Đóng đăng ký: 01:29 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 01:30:06.654+07', 7),
(90, '🎉 Sự kiện mới: 111', 'Có sự kiện mới được tạo!

📅 Sự kiện: 111
📝 Mô tả: dđ
📍 Địa điểm: 111

⏰ Thời gian:
• Bắt đầu: 01:29 23/10/2025
• Kết thúc: 01:29 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 01:29 09/10/2025
• Đóng đăng ký: 01:29 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-07 01:30:06.654+07', 2),
(91, '🎉 Sự kiện mới: ghthrtghrstfghrtfgrsth', 'Có sự kiện mới được tạo!

📅 Sự kiện: ghthrtghrstfghrtfgrsth
📝 Mô tả: 23324
📍 Địa điểm: dfgdfgsdfgdfgsdfghs

⏰ Thời gian:
• Bắt đầu: 01:57 31/10/2025
• Kết thúc: 01:57 01/11/2025

📝 Đăng ký:
• Mở đăng ký: 01:57 10/10/2025
• Đóng đăng ký: 01:57 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 01:57:44.056+07', 3),
(92, '🎉 Sự kiện mới: ghthrtghrstfghrtfgrsth', 'Có sự kiện mới được tạo!

📅 Sự kiện: ghthrtghrstfghrtfgrsth
📝 Mô tả: 23324
📍 Địa điểm: dfgdfgsdfgdfgsdfghs

⏰ Thời gian:
• Bắt đầu: 01:57 31/10/2025
• Kết thúc: 01:57 01/11/2025

📝 Đăng ký:
• Mở đăng ký: 01:57 10/10/2025
• Đóng đăng ký: 01:57 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 01:57:44.056+07', 5),
(93, '🎉 Sự kiện mới: ghthrtghrstfghrtfgrsth', 'Có sự kiện mới được tạo!

📅 Sự kiện: ghthrtghrstfghrtfgrsth
📝 Mô tả: 23324
📍 Địa điểm: dfgdfgsdfgdfgsdfghs

⏰ Thời gian:
• Bắt đầu: 01:57 31/10/2025
• Kết thúc: 01:57 01/11/2025

📝 Đăng ký:
• Mở đăng ký: 01:57 10/10/2025
• Đóng đăng ký: 01:57 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 01:57:44.056+07', 7),
(94, '🎉 Sự kiện mới: ghthrtghrstfghrtfgrsth', 'Có sự kiện mới được tạo!

📅 Sự kiện: ghthrtghrstfghrtfgrsth
📝 Mô tả: 23324
📍 Địa điểm: dfgdfgsdfgdfgsdfghs

⏰ Thời gian:
• Bắt đầu: 01:57 31/10/2025
• Kết thúc: 01:57 01/11/2025

📝 Đăng ký:
• Mở đăng ký: 01:57 10/10/2025
• Đóng đăng ký: 01:57 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 01:57:44.056+07', 6),
(95, '🎉 Sự kiện mới: ghthrtghrstfghrtfgrsth', 'Có sự kiện mới được tạo!

📅 Sự kiện: ghthrtghrstfghrtfgrsth
📝 Mô tả: 23324
📍 Địa điểm: dfgdfgsdfgdfgsdfghs

⏰ Thời gian:
• Bắt đầu: 01:57 31/10/2025
• Kết thúc: 01:57 01/11/2025

📝 Đăng ký:
• Mở đăng ký: 01:57 10/10/2025
• Đóng đăng ký: 01:57 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-07 01:57:44.056+07', 2),
(96, '🎉 Sự kiện mới: ........', 'Có sự kiện mới được tạo!

📅 Sự kiện: ........
📝 Mô tả: dfsdfgsbfg
📍 Địa điểm: .......

⏰ Thời gian:
• Bắt đầu: 02:06 29/10/2025
• Kết thúc: 02:07 30/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:07 10/10/2025
• Đóng đăng ký: 02:07 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:07:31.289+07', 5),
(97, '🎉 Sự kiện mới: ........', 'Có sự kiện mới được tạo!

📅 Sự kiện: ........
📝 Mô tả: dfsdfgsbfg
📍 Địa điểm: .......

⏰ Thời gian:
• Bắt đầu: 02:06 29/10/2025
• Kết thúc: 02:07 30/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:07 10/10/2025
• Đóng đăng ký: 02:07 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:07:31.289+07', 7),
(98, '🎉 Sự kiện mới: ........', 'Có sự kiện mới được tạo!

📅 Sự kiện: ........
📝 Mô tả: dfsdfgsbfg
📍 Địa điểm: .......

⏰ Thời gian:
• Bắt đầu: 02:06 29/10/2025
• Kết thúc: 02:07 30/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:07 10/10/2025
• Đóng đăng ký: 02:07 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-07 02:07:31.289+07', 2),
(99, '🎉 Sự kiện mới: ........', 'Có sự kiện mới được tạo!

📅 Sự kiện: ........
📝 Mô tả: dfsdfgsbfg
📍 Địa điểm: .......

⏰ Thời gian:
• Bắt đầu: 02:06 29/10/2025
• Kết thúc: 02:07 30/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:07 10/10/2025
• Đóng đăng ký: 02:07 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:07:31.289+07', 6),
(100, '🎉 Sự kiện mới: ........', 'Có sự kiện mới được tạo!

📅 Sự kiện: ........
📝 Mô tả: dfsdfgsbfg
📍 Địa điểm: .......

⏰ Thời gian:
• Bắt đầu: 02:06 29/10/2025
• Kết thúc: 02:07 30/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:07 10/10/2025
• Đóng đăng ký: 02:07 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:07:31.289+07', 3),
(101, '🎉 Sự kiện mới: riom', 'Có sự kiện mới được tạo!

📅 Sự kiện: riom
📝 Mô tả: 1311
📍 Địa điểm: er

⏰ Thời gian:
• Bắt đầu: 02:10 23/10/2025
• Kết thúc: 02:10 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:10 10/10/2025
• Đóng đăng ký: 02:10 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:10:36.431+07', 7),
(102, '🎉 Sự kiện mới: riom', 'Có sự kiện mới được tạo!

📅 Sự kiện: riom
📝 Mô tả: 1311
📍 Địa điểm: er

⏰ Thời gian:
• Bắt đầu: 02:10 23/10/2025
• Kết thúc: 02:10 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:10 10/10/2025
• Đóng đăng ký: 02:10 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-07 02:10:36.431+07', 2),
(103, '🎉 Sự kiện mới: riom', 'Có sự kiện mới được tạo!

📅 Sự kiện: riom
📝 Mô tả: 1311
📍 Địa điểm: er

⏰ Thời gian:
• Bắt đầu: 02:10 23/10/2025
• Kết thúc: 02:10 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:10 10/10/2025
• Đóng đăng ký: 02:10 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:10:36.431+07', 6),
(104, '🎉 Sự kiện mới: riom', 'Có sự kiện mới được tạo!

📅 Sự kiện: riom
📝 Mô tả: 1311
📍 Địa điểm: er

⏰ Thời gian:
• Bắt đầu: 02:10 23/10/2025
• Kết thúc: 02:10 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:10 10/10/2025
• Đóng đăng ký: 02:10 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:10:36.431+07', 3),
(105, '🎉 Sự kiện mới: riom', 'Có sự kiện mới được tạo!

📅 Sự kiện: riom
📝 Mô tả: 1311
📍 Địa điểm: er

⏰ Thời gian:
• Bắt đầu: 02:10 23/10/2025
• Kết thúc: 02:10 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:10 10/10/2025
• Đóng đăng ký: 02:10 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:10:36.431+07', 5),
(106, '🎉 Sự kiện mới: cc', 'Có sự kiện mới được tạo!

📅 Sự kiện: cc
📝 Mô tả: 222
📍 Địa điểm: cc

⏰ Thời gian:
• Bắt đầu: 02:13 23/10/2025
• Kết thúc: 02:13 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:13 10/10/2025
• Đóng đăng ký: 02:13 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:13:42.113+07', 7),
(107, '🎉 Sự kiện mới: cc', 'Có sự kiện mới được tạo!

📅 Sự kiện: cc
📝 Mô tả: 222
📍 Địa điểm: cc

⏰ Thời gian:
• Bắt đầu: 02:13 23/10/2025
• Kết thúc: 02:13 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:13 10/10/2025
• Đóng đăng ký: 02:13 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:13:42.113+07', 6),
(108, '🎉 Sự kiện mới: cc', 'Có sự kiện mới được tạo!

📅 Sự kiện: cc
📝 Mô tả: 222
📍 Địa điểm: cc

⏰ Thời gian:
• Bắt đầu: 02:13 23/10/2025
• Kết thúc: 02:13 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:13 10/10/2025
• Đóng đăng ký: 02:13 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:13:42.113+07', 3),
(109, '🎉 Sự kiện mới: cc', 'Có sự kiện mới được tạo!

📅 Sự kiện: cc
📝 Mô tả: 222
📍 Địa điểm: cc

⏰ Thời gian:
• Bắt đầu: 02:13 23/10/2025
• Kết thúc: 02:13 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:13 10/10/2025
• Đóng đăng ký: 02:13 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-07 02:13:42.113+07', 2),
(110, '🎉 Sự kiện mới: cc', 'Có sự kiện mới được tạo!

📅 Sự kiện: cc
📝 Mô tả: 222
📍 Địa điểm: cc

⏰ Thời gian:
• Bắt đầu: 02:13 23/10/2025
• Kết thúc: 02:13 25/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:13 10/10/2025
• Đóng đăng ký: 02:13 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:13:42.113+07', 5),
(111, '🎉 Sự kiện mới: caigithe', 'Có sự kiện mới được tạo!

📅 Sự kiện: caigithe
📝 Mô tả: fffff
📍 Địa điểm: fgff

⏰ Thời gian:
• Bắt đầu: 02:17 23/10/2025
• Kết thúc: 02:17 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:17 10/10/2025
• Đóng đăng ký: 02:17 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:17:52.819+07', 6),
(112, '🎉 Sự kiện mới: caigithe', 'Có sự kiện mới được tạo!

📅 Sự kiện: caigithe
📝 Mô tả: fffff
📍 Địa điểm: fgff

⏰ Thời gian:
• Bắt đầu: 02:17 23/10/2025
• Kết thúc: 02:17 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:17 10/10/2025
• Đóng đăng ký: 02:17 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:17:52.819+07', 7),
(113, '🎉 Sự kiện mới: caigithe', 'Có sự kiện mới được tạo!

📅 Sự kiện: caigithe
📝 Mô tả: fffff
📍 Địa điểm: fgff

⏰ Thời gian:
• Bắt đầu: 02:17 23/10/2025
• Kết thúc: 02:17 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:17 10/10/2025
• Đóng đăng ký: 02:17 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-07 02:17:52.819+07', 2),
(114, '🎉 Sự kiện mới: caigithe', 'Có sự kiện mới được tạo!

📅 Sự kiện: caigithe
📝 Mô tả: fffff
📍 Địa điểm: fgff

⏰ Thời gian:
• Bắt đầu: 02:17 23/10/2025
• Kết thúc: 02:17 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:17 10/10/2025
• Đóng đăng ký: 02:17 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:17:52.819+07', 3),
(115, '🎉 Sự kiện mới: caigithe', 'Có sự kiện mới được tạo!

📅 Sự kiện: caigithe
📝 Mô tả: fffff
📍 Địa điểm: fgff

⏰ Thời gian:
• Bắt đầu: 02:17 23/10/2025
• Kết thúc: 02:17 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:17 10/10/2025
• Đóng đăng ký: 02:17 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:17:52.819+07', 5),
(116, '🎉 Sự kiện mới: 99999', 'Có sự kiện mới được tạo!

📅 Sự kiện: 99999
📝 Mô tả: 234234234
📍 Địa điểm: 12312312342345

⏰ Thời gian:
• Bắt đầu: 02:19 24/10/2025
• Kết thúc: 02:19 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:19 10/10/2025
• Đóng đăng ký: 02:19 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:20:01.516+07', 6),
(117, '🎉 Sự kiện mới: 99999', 'Có sự kiện mới được tạo!

📅 Sự kiện: 99999
📝 Mô tả: 234234234
📍 Địa điểm: 12312312342345

⏰ Thời gian:
• Bắt đầu: 02:19 24/10/2025
• Kết thúc: 02:19 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:19 10/10/2025
• Đóng đăng ký: 02:19 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:20:01.516+07', 7),
(118, '🎉 Sự kiện mới: 99999', 'Có sự kiện mới được tạo!

📅 Sự kiện: 99999
📝 Mô tả: 234234234
📍 Địa điểm: 12312312342345

⏰ Thời gian:
• Bắt đầu: 02:19 24/10/2025
• Kết thúc: 02:19 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:19 10/10/2025
• Đóng đăng ký: 02:19 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:20:01.516+07', 5),
(119, '🎉 Sự kiện mới: 99999', 'Có sự kiện mới được tạo!

📅 Sự kiện: 99999
📝 Mô tả: 234234234
📍 Địa điểm: 12312312342345

⏰ Thời gian:
• Bắt đầu: 02:19 24/10/2025
• Kết thúc: 02:19 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:19 10/10/2025
• Đóng đăng ký: 02:19 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-07 02:20:01.516+07', 2),
(120, '🎉 Sự kiện mới: 99999', 'Có sự kiện mới được tạo!

📅 Sự kiện: 99999
📝 Mô tả: 234234234
📍 Địa điểm: 12312312342345

⏰ Thời gian:
• Bắt đầu: 02:19 24/10/2025
• Kết thúc: 02:19 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:19 10/10/2025
• Đóng đăng ký: 02:19 11/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:20:01.516+07', 3),
(121, '🎉 Sự kiện mới: á', 'Có sự kiện mới được tạo!

📅 Sự kiện: á
📝 Mô tả: 1
📍 Địa điểm: s

⏰ Thời gian:
• Bắt đầu: 02:20 17/10/2025
• Kết thúc: 02:20 18/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:20 10/10/2025
• Đóng đăng ký: 02:20 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:20:23.574+07', 6),
(122, '🎉 Sự kiện mới: á', 'Có sự kiện mới được tạo!

📅 Sự kiện: á
📝 Mô tả: 1
📍 Địa điểm: s

⏰ Thời gian:
• Bắt đầu: 02:20 17/10/2025
• Kết thúc: 02:20 18/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:20 10/10/2025
• Đóng đăng ký: 02:20 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:20:23.574+07', 7),
(123, '🎉 Sự kiện mới: á', 'Có sự kiện mới được tạo!

📅 Sự kiện: á
📝 Mô tả: 1
📍 Địa điểm: s

⏰ Thời gian:
• Bắt đầu: 02:20 17/10/2025
• Kết thúc: 02:20 18/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:20 10/10/2025
• Đóng đăng ký: 02:20 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:20:23.574+07', 3),
(124, '🎉 Sự kiện mới: á', 'Có sự kiện mới được tạo!

📅 Sự kiện: á
📝 Mô tả: 1
📍 Địa điểm: s

⏰ Thời gian:
• Bắt đầu: 02:20 17/10/2025
• Kết thúc: 02:20 18/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:20 10/10/2025
• Đóng đăng ký: 02:20 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-07 02:20:23.574+07', 2),
(125, '🎉 Sự kiện mới: á', 'Có sự kiện mới được tạo!

📅 Sự kiện: á
📝 Mô tả: 1
📍 Địa điểm: s

⏰ Thời gian:
• Bắt đầu: 02:20 17/10/2025
• Kết thúc: 02:20 18/10/2025

📝 Đăng ký:
• Mở đăng ký: 02:20 10/10/2025
• Đóng đăng ký: 02:20 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 02:20:23.574+07', 5),
(126, '🎉 Sự kiện mới: uuuuuu', 'Có sự kiện mới được tạo!

📅 Sự kiện: uuuuuu
📝 Mô tả: 123123
📍 Địa điểm: uuuuu

⏰ Thời gian:
• Bắt đầu: 11:02 17/10/2025
• Kết thúc: 11:02 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:02 10/10/2025
• Đóng đăng ký: 11:02 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:02:20.906+07', 7),
(127, '🎉 Sự kiện mới: uuuuuu', 'Có sự kiện mới được tạo!

📅 Sự kiện: uuuuuu
📝 Mô tả: 123123
📍 Địa điểm: uuuuu

⏰ Thời gian:
• Bắt đầu: 11:02 17/10/2025
• Kết thúc: 11:02 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:02 10/10/2025
• Đóng đăng ký: 11:02 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:02:20.906+07', 3),
(128, '🎉 Sự kiện mới: uuuuuu', 'Có sự kiện mới được tạo!

📅 Sự kiện: uuuuuu
📝 Mô tả: 123123
📍 Địa điểm: uuuuu

⏰ Thời gian:
• Bắt đầu: 11:02 17/10/2025
• Kết thúc: 11:02 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:02 10/10/2025
• Đóng đăng ký: 11:02 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-07 11:02:20.906+07', 2),
(129, '🎉 Sự kiện mới: uuuuuu', 'Có sự kiện mới được tạo!

📅 Sự kiện: uuuuuu
📝 Mô tả: 123123
📍 Địa điểm: uuuuu

⏰ Thời gian:
• Bắt đầu: 11:02 17/10/2025
• Kết thúc: 11:02 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:02 10/10/2025
• Đóng đăng ký: 11:02 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:02:20.906+07', 5),
(130, '🎉 Sự kiện mới: uuuuuu', 'Có sự kiện mới được tạo!

📅 Sự kiện: uuuuuu
📝 Mô tả: 123123
📍 Địa điểm: uuuuu

⏰ Thời gian:
• Bắt đầu: 11:02 17/10/2025
• Kết thúc: 11:02 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:02 10/10/2025
• Đóng đăng ký: 11:02 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:02:20.906+07', 6),
(131, '🎉 Sự kiện mới: áđá', 'Có sự kiện mới được tạo!

📅 Sự kiện: áđá
📝 Mô tả: 123123
📍 Địa điểm: áđá

⏰ Thời gian:
• Bắt đầu: 11:10 30/10/2025
• Kết thúc: 11:11 31/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:11 09/10/2025
• Đóng đăng ký: 11:11 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:11:13.307+07', 6),
(132, '🎉 Sự kiện mới: áđá', 'Có sự kiện mới được tạo!

📅 Sự kiện: áđá
📝 Mô tả: 123123
📍 Địa điểm: áđá

⏰ Thời gian:
• Bắt đầu: 11:10 30/10/2025
• Kết thúc: 11:11 31/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:11 09/10/2025
• Đóng đăng ký: 11:11 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:11:13.307+07', 5),
(133, '🎉 Sự kiện mới: áđá', 'Có sự kiện mới được tạo!

📅 Sự kiện: áđá
📝 Mô tả: 123123
📍 Địa điểm: áđá

⏰ Thời gian:
• Bắt đầu: 11:10 30/10/2025
• Kết thúc: 11:11 31/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:11 09/10/2025
• Đóng đăng ký: 11:11 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-07 11:11:13.307+07', 2),
(134, '🎉 Sự kiện mới: áđá', 'Có sự kiện mới được tạo!

📅 Sự kiện: áđá
📝 Mô tả: 123123
📍 Địa điểm: áđá

⏰ Thời gian:
• Bắt đầu: 11:10 30/10/2025
• Kết thúc: 11:11 31/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:11 09/10/2025
• Đóng đăng ký: 11:11 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:11:13.307+07', 3),
(135, '🎉 Sự kiện mới: áđá', 'Có sự kiện mới được tạo!

📅 Sự kiện: áđá
📝 Mô tả: 123123
📍 Địa điểm: áđá

⏰ Thời gian:
• Bắt đầu: 11:10 30/10/2025
• Kết thúc: 11:11 31/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:11 09/10/2025
• Đóng đăng ký: 11:11 10/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:11:13.307+07', 7),
(136, '🎉 Sự kiện mới: 123123', 'Có sự kiện mới được tạo!

📅 Sự kiện: 123123
📝 Mô tả: 123123
📍 Địa điểm: 123123

⏰ Thời gian:
• Bắt đầu: 11:11 24/10/2025
• Kết thúc: 11:11 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:11 11/10/2025
• Đóng đăng ký: 11:11 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:11:47.43+07', 7),
(137, '🎉 Sự kiện mới: 123123', 'Có sự kiện mới được tạo!

📅 Sự kiện: 123123
📝 Mô tả: 123123
📍 Địa điểm: 123123

⏰ Thời gian:
• Bắt đầu: 11:11 24/10/2025
• Kết thúc: 11:11 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:11 11/10/2025
• Đóng đăng ký: 11:11 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:11:47.43+07', 5),
(138, '🎉 Sự kiện mới: 123123', 'Có sự kiện mới được tạo!

📅 Sự kiện: 123123
📝 Mô tả: 123123
📍 Địa điểm: 123123

⏰ Thời gian:
• Bắt đầu: 11:11 24/10/2025
• Kết thúc: 11:11 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:11 11/10/2025
• Đóng đăng ký: 11:11 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:11:47.43+07', 3),
(139, '🎉 Sự kiện mới: 123123', 'Có sự kiện mới được tạo!

📅 Sự kiện: 123123
📝 Mô tả: 123123
📍 Địa điểm: 123123

⏰ Thời gian:
• Bắt đầu: 11:11 24/10/2025
• Kết thúc: 11:11 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:11 11/10/2025
• Đóng đăng ký: 11:11 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-07 11:11:47.43+07', 2),
(140, '🎉 Sự kiện mới: 123123', 'Có sự kiện mới được tạo!

📅 Sự kiện: 123123
📝 Mô tả: 123123
📍 Địa điểm: 123123

⏰ Thời gian:
• Bắt đầu: 11:11 24/10/2025
• Kết thúc: 11:11 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:11 11/10/2025
• Đóng đăng ký: 11:11 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:11:47.43+07', 6),
(141, '🎉 Sự kiện mới: tochuc', 'Có sự kiện mới được tạo!

📅 Sự kiện: tochuc
📝 Mô tả: 123123
📍 Địa điểm: asdasd

⏰ Thời gian:
• Bắt đầu: 11:15 24/10/2025
• Kết thúc: 11:15 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:15 10/10/2025
• Đóng đăng ký: 11:15 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:15:27.311+07', 6),
(142, '🎉 Sự kiện mới: tochuc', 'Có sự kiện mới được tạo!

📅 Sự kiện: tochuc
📝 Mô tả: 123123
📍 Địa điểm: asdasd

⏰ Thời gian:
• Bắt đầu: 11:15 24/10/2025
• Kết thúc: 11:15 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:15 10/10/2025
• Đóng đăng ký: 11:15 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 't', '2025-10-07 11:15:27.311+07', 2),
(143, '🎉 Sự kiện mới: tochuc', 'Có sự kiện mới được tạo!

📅 Sự kiện: tochuc
📝 Mô tả: 123123
📍 Địa điểm: asdasd

⏰ Thời gian:
• Bắt đầu: 11:15 24/10/2025
• Kết thúc: 11:15 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:15 10/10/2025
• Đóng đăng ký: 11:15 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:15:27.311+07', 7),
(144, '🎉 Sự kiện mới: tochuc', 'Có sự kiện mới được tạo!

📅 Sự kiện: tochuc
📝 Mô tả: 123123
📍 Địa điểm: asdasd

⏰ Thời gian:
• Bắt đầu: 11:15 24/10/2025
• Kết thúc: 11:15 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:15 10/10/2025
• Đóng đăng ký: 11:15 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:15:27.311+07', 3),
(145, '🎉 Sự kiện mới: tochuc', 'Có sự kiện mới được tạo!

📅 Sự kiện: tochuc
📝 Mô tả: 123123
📍 Địa điểm: asdasd

⏰ Thời gian:
• Bắt đầu: 11:15 24/10/2025
• Kết thúc: 11:15 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:15 10/10/2025
• Đóng đăng ký: 11:15 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:15:27.311+07', 5),
(146, '🎉 Sự kiện mới: sdfsdf', 'Có sự kiện mới được tạo!

📅 Sự kiện: sdfsdf
📝 Mô tả: 234234
📍 Địa điểm: sdfsdf

⏰ Thời gian:
• Bắt đầu: 11:15 24/10/2025
• Kết thúc: 11:15 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:15 10/10/2025
• Đóng đăng ký: 11:15 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:16:08.368+07', 6),
(147, '🎉 Sự kiện mới: sdfsdf', 'Có sự kiện mới được tạo!

📅 Sự kiện: sdfsdf
📝 Mô tả: 234234
📍 Địa điểm: sdfsdf

⏰ Thời gian:
• Bắt đầu: 11:15 24/10/2025
• Kết thúc: 11:15 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:15 10/10/2025
• Đóng đăng ký: 11:15 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:16:08.369+07', 2),
(148, '🎉 Sự kiện mới: sdfsdf', 'Có sự kiện mới được tạo!

📅 Sự kiện: sdfsdf
📝 Mô tả: 234234
📍 Địa điểm: sdfsdf

⏰ Thời gian:
• Bắt đầu: 11:15 24/10/2025
• Kết thúc: 11:15 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:15 10/10/2025
• Đóng đăng ký: 11:15 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:16:08.369+07', 3),
(149, '🎉 Sự kiện mới: sdfsdf', 'Có sự kiện mới được tạo!

📅 Sự kiện: sdfsdf
📝 Mô tả: 234234
📍 Địa điểm: sdfsdf

⏰ Thời gian:
• Bắt đầu: 11:15 24/10/2025
• Kết thúc: 11:15 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:15 10/10/2025
• Đóng đăng ký: 11:15 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:16:08.368+07', 5),
(150, '🎉 Sự kiện mới: sdfsdf', 'Có sự kiện mới được tạo!

📅 Sự kiện: sdfsdf
📝 Mô tả: 234234
📍 Địa điểm: sdfsdf

⏰ Thời gian:
• Bắt đầu: 11:15 24/10/2025
• Kết thúc: 11:15 26/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:15 10/10/2025
• Đóng đăng ký: 11:15 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:16:08.368+07', 7),
(151, '🎉 Sự kiện mới: qw', 'Có sự kiện mới được tạo!

📅 Sự kiện: qw
📝 Mô tả: 123
📍 Địa điểm: qw

⏰ Thời gian:
• Bắt đầu: 11:16 18/10/2025
• Kết thúc: 11:16 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:16 10/10/2025
• Đóng đăng ký: 11:16 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:16:28.9+07', 7),
(152, '🎉 Sự kiện mới: qw', 'Có sự kiện mới được tạo!

📅 Sự kiện: qw
📝 Mô tả: 123
📍 Địa điểm: qw

⏰ Thời gian:
• Bắt đầu: 11:16 18/10/2025
• Kết thúc: 11:16 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:16 10/10/2025
• Đóng đăng ký: 11:16 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:16:28.9+07', 6),
(153, '🎉 Sự kiện mới: qw', 'Có sự kiện mới được tạo!

📅 Sự kiện: qw
📝 Mô tả: 123
📍 Địa điểm: qw

⏰ Thời gian:
• Bắt đầu: 11:16 18/10/2025
• Kết thúc: 11:16 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:16 10/10/2025
• Đóng đăng ký: 11:16 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:16:28.9+07', 5),
(154, '🎉 Sự kiện mới: qw', 'Có sự kiện mới được tạo!

📅 Sự kiện: qw
📝 Mô tả: 123
📍 Địa điểm: qw

⏰ Thời gian:
• Bắt đầu: 11:16 18/10/2025
• Kết thúc: 11:16 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:16 10/10/2025
• Đóng đăng ký: 11:16 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:16:28.9+07', 3),
(155, '🎉 Sự kiện mới: qw', 'Có sự kiện mới được tạo!

📅 Sự kiện: qw
📝 Mô tả: 123
📍 Địa điểm: qw

⏰ Thời gian:
• Bắt đầu: 11:16 18/10/2025
• Kết thúc: 11:16 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:16 10/10/2025
• Đóng đăng ký: 11:16 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:16:28.9+07', 2),
(156, '🎉 Sự kiện mới: 676', 'Có sự kiện mới được tạo!

📅 Sự kiện: 676
📝 Mô tả: 123123
📍 Địa điểm: 12312

⏰ Thời gian:
• Bắt đầu: 11:16 18/10/2025
• Kết thúc: 11:16 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:16 12/10/2025
• Đóng đăng ký: 11:16 13/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:17:05.882+07', 7),
(157, '🎉 Sự kiện mới: 676', 'Có sự kiện mới được tạo!

📅 Sự kiện: 676
📝 Mô tả: 123123
📍 Địa điểm: 12312

⏰ Thời gian:
• Bắt đầu: 11:16 18/10/2025
• Kết thúc: 11:16 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:16 12/10/2025
• Đóng đăng ký: 11:16 13/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:17:05.882+07', 6),
(158, '🎉 Sự kiện mới: 676', 'Có sự kiện mới được tạo!

📅 Sự kiện: 676
📝 Mô tả: 123123
📍 Địa điểm: 12312

⏰ Thời gian:
• Bắt đầu: 11:16 18/10/2025
• Kết thúc: 11:16 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:16 12/10/2025
• Đóng đăng ký: 11:16 13/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:17:05.882+07', 2),
(159, '🎉 Sự kiện mới: 676', 'Có sự kiện mới được tạo!

📅 Sự kiện: 676
📝 Mô tả: 123123
📍 Địa điểm: 12312

⏰ Thời gian:
• Bắt đầu: 11:16 18/10/2025
• Kết thúc: 11:16 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:16 12/10/2025
• Đóng đăng ký: 11:16 13/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:17:05.882+07', 3),
(160, '🎉 Sự kiện mới: 676', 'Có sự kiện mới được tạo!

📅 Sự kiện: 676
📝 Mô tả: 123123
📍 Địa điểm: 12312

⏰ Thời gian:
• Bắt đầu: 11:16 18/10/2025
• Kết thúc: 11:16 19/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:16 12/10/2025
• Đóng đăng ký: 11:16 13/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:17:05.882+07', 5),
(161, '🎉 Sự kiện mới: 12111', 'Có sự kiện mới được tạo!

📅 Sự kiện: 12111
📝 Mô tả: 123123
📍 Địa điểm: 111

⏰ Thời gian:
• Bắt đầu: 11:17 30/10/2025
• Kết thúc: 11:17 31/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:17 10/10/2025
• Đóng đăng ký: 11:17 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:17:34.147+07', 7),
(162, '🎉 Sự kiện mới: 12111', 'Có sự kiện mới được tạo!

📅 Sự kiện: 12111
📝 Mô tả: 123123
📍 Địa điểm: 111

⏰ Thời gian:
• Bắt đầu: 11:17 30/10/2025
• Kết thúc: 11:17 31/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:17 10/10/2025
• Đóng đăng ký: 11:17 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:17:34.147+07', 5),
(163, '🎉 Sự kiện mới: 12111', 'Có sự kiện mới được tạo!

📅 Sự kiện: 12111
📝 Mô tả: 123123
📍 Địa điểm: 111

⏰ Thời gian:
• Bắt đầu: 11:17 30/10/2025
• Kết thúc: 11:17 31/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:17 10/10/2025
• Đóng đăng ký: 11:17 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:17:34.147+07', 2),
(164, '🎉 Sự kiện mới: 12111', 'Có sự kiện mới được tạo!

📅 Sự kiện: 12111
📝 Mô tả: 123123
📍 Địa điểm: 111

⏰ Thời gian:
• Bắt đầu: 11:17 30/10/2025
• Kết thúc: 11:17 31/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:17 10/10/2025
• Đóng đăng ký: 11:17 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:17:34.147+07', 3),
(165, '🎉 Sự kiện mới: 12111', 'Có sự kiện mới được tạo!

📅 Sự kiện: 12111
📝 Mô tả: 123123
📍 Địa điểm: 111

⏰ Thời gian:
• Bắt đầu: 11:17 30/10/2025
• Kết thúc: 11:17 31/10/2025

📝 Đăng ký:
• Mở đăng ký: 11:17 10/10/2025
• Đóng đăng ký: 11:17 12/10/2025

🚀 Hãy đăng ký ngay để không bỏ lỡ cơ hội tham gia!', 'EVENT', 'f', '2025-10-07 11:17:34.147+07', 6);

INSERT INTO "public"."User" ("id", "email", "fullName", "phoneNumber", "passwordHash", "role", "isActive", "avatarUrl", "createdAt", "updatedAt", "organizationId") VALUES
(1, 'admin@org1.com', 'Admin1plus', '0123456789', '$2a$10$h.gWIsBrgW/hbNhFuM7Zg.exvvNBSKjzaTt4bOeHt1kQADrxg9fSy', 'ADMIN', 't', 'image_3.jpg', '2025-10-01 12:23:36.600979+07', '2025-10-05 16:47:07.988+07', 1),
(2, 'member1@org1.com', 'Member1one', '0123456781', '$2a$10$05BG9uOgO/JUj5KbiYOxCeAzWk3OENojSb7DrZSJrwqaZuc.7T0DK', 'MEMBER', 'f', 'image_1.jpg', '2025-10-01 12:23:36.600979+07', '2025-10-07 11:25:10.653+07', 1),
(3, 'member2@org1.com', 'Member Two', '0123456782', '$2a$10$6PNra4VIRMtDea3au87p3OIVn0koNTnxNkvG9gBGCYGZrC/858VyW', 'MEMBER', 't', 'image_1.jpg', '2025-10-01 12:23:36.600979+07', '2025-10-05 16:29:56.449+07', 1),
(4, 'member3@org1.com', 'Member Three', '0123456783', '$2a$10$6PNra4VIRMtDea3au87p3OIVn0koNTnxNkvG9gBGCYGZrC/858VyW', 'MEMBER', 't', 'image_3.jpg', '2025-10-01 12:23:36.600979+07', '2025-10-05 16:23:26.569+07', 2),
(5, 'member4@org1.com', 'Member Four', '0123456784', '$2a$10$6PNra4VIRMtDea3au87p3OIVn0koNTnxNkvG9gBGCYGZrC/858VyW', 'MEMBER', 't', 'image_1.jpg', '2025-10-01 12:23:36.600979+07', '2025-10-06 09:57:46.656+07', 1),
(6, '22110073@student.hcmute.edu.vn', 'abc', NULL, '$2a$10$ruXA6FgjMCHlZraynP48hedlVUHgqcY9rES3Otzvq5MVs0PzFSDiC', 'MEMBER', 't', NULL, '2025-10-05 16:54:07.889+07', '2025-10-05 16:54:07.889+07', 1),
(7, 'thuan@gmail.com', 'congthuan', '123456789', '$2a$10$jOWlCnROLmoCYLi6bkJkv.3LKD3aMt8mK/ypxC3zP0iQ8mocV1QRu', 'MEMBER', 't', 'image_3.jpg', '2025-10-06 09:39:54.729+07', '2025-10-06 09:40:51.351+07', 1);

INSERT INTO "public"."Registration" ("id", "status", "attendance", "depositPaid", "createdAt", "updatedAt", "eventId", "userId") VALUES
(30, 'REGISTERED', 'f', 'f', '2025-10-06 11:53:02.103+07', '2025-10-06 11:53:02.103+07', 1, 2),
(31, 'CANCELLED', 'f', 'f', '2025-10-06 11:53:16.98+07', '2025-10-06 12:11:54.262+07', 7, 2),
(32, 'REGISTERED', 'f', 'f', '2025-10-06 11:56:17.474+07', '2025-10-06 11:56:17.474+07', 4, 2),
(33, 'REGISTERED', 'f', 'f', '2025-10-06 11:56:18.423+07', '2025-10-06 11:56:18.423+07', 8, 2),
(34, 'REGISTERED', 'f', 'f', '2025-10-06 12:00:35.381+07', '2025-10-06 12:00:35.381+07', 12, 2),
(35, 'CANCELLED', 'f', 'f', '2025-10-07 11:14:16.494+07', '2025-10-07 11:14:25.941+07', 7, 1);

INSERT INTO "public"."Organization" ("id", "name", "slug", "createdAt", "updatedAt") VALUES
(1, 'Organization One', 'org-one', '2025-10-01 12:23:36.59482+07', '2025-10-01 12:23:36.59482+07'),
(2, 'or 2', 'org-two', '2025-10-01 12:23:36.59482+07', '2025-10-01 12:23:36.59482+07');

ALTER TABLE "public"."Event" ADD FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."Event" ADD FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."Notification" ADD FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."User" ADD FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Indices
CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);
ALTER TABLE "public"."Registration" ADD FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."Registration" ADD FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Indices
CREATE UNIQUE INDEX "Registration_eventId_userId_key" ON public."Registration" USING btree ("eventId", "userId");
ALTER TABLE "public"."Attachment" ADD FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Indices
CREATE UNIQUE INDEX "Organization_slug_key" ON public."Organization" USING btree (slug);
