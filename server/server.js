import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import authRoutes from "./routes/common/auth.route.js";
import adminRoutes from "./routes/admin/admin.route.js";
import memberRoutes from "./routes/member/member.route.js";
import commonProfileRoutes from "./routes/common/profile.route.js";
import commonEventRoutes from "./routes/common/event.route.js";
import notificationRoutes from "./routes/common/notification.route.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3210"],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT;

app.set("etag", false);

app.use(
  cors({
    origin: ["http://localhost:3210"],
    // credentials: true
  })
);

app.use((req, res, next) => {
  res.set({
    // 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    // 'Pragma': 'no-cache',
    // 'Expires': '0',
    // 'Surrogate-Control': 'no-store'
    "Content-Type": "application/json",
  });
  next();
});

app.use(express.json());

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/member", memberRoutes);
app.use("/profile", commonProfileRoutes);
app.use("/event", commonEventRoutes);
app.use("/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Event Management API is running!" });
});

io.on("connection", (socket) => {
  console.log("💰 User connected:", socket.id);



  socket.on("join-user", (userId) => {
    socket.join(`user-${userId}`);
    // console.log(`👤 User ${socket.id} joined personal room ${userId}`);

  });


    socket.on("join-organization", (organizationId) => {
    socket.join(`org-${organizationId}`);
    // console.log(`🏢 User ${socket.id} joined organization ${organizationId}`);

    
    // console.log("🏠 ALL ROOMS (after all):");
    // io.sockets.adapter.rooms.forEach((sockets, roomName) => {
    //   console.log(
    //     `  +   Room "${roomName}": ${sockets.size} users - [${Array.from(
    //       sockets
    //     ).join(", ")}]`
    //   );
    // });
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ User disconnected:", socket.id, "Reason:", reason);
  });
});


export { io };

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
