//Load all env
import dotenv from "dotenv";
dotenv.config();

//Server Imports
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";

//Routes Imports
import userRouter from "./routes/user.routes.js";
import medicineRouter from "./routes/medicine.routes.js";
import pharmacyRouter from "./routes/pharmacy.routes.js";

//Web Socket Imports
import { config } from "./config/server.config.js";
import { QueueService } from "./services/queue.service.js";
import { SessionService } from "./services/session.service.js";
import { MatchingService } from "./services/matching.service.js";
import { ConnectionHandler } from "./handlers/connection.handler.js";
import { WebRTCHandler } from "./handlers/webrtc.handler.js";
import { SocketManager } from "./socket/socket.manager.js";
import { createApiRoutes } from "./routes/api.routes.js";

//required setups
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: config.cors });
app.use(cors(config.cors));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Initialize services
const queueService = new QueueService();
const sessionService = new SessionService();
const matchingService = new MatchingService(queueService, sessionService);

// Initialize handlers
const connectionHandler = new ConnectionHandler(
  queueService,
  sessionService,
  matchingService,
  io
);
const webrtcHandler = new WebRTCHandler(sessionService);

// Initialize socket manager
const socketManager = new SocketManager(io, connectionHandler, webrtcHandler);
socketManager.initialize();

// Setup routes

const apiRoutes = createApiRoutes(queueService, sessionService);
app.use("/", apiRoutes);

// User Routes

app.use("/user", userRouter);

// Medicine Route
app.use("/medicine", medicineRouter);

// Pharmacy Route
app.use("/pharmacy", pharmacyRouter);

server.listen(config.port, () => {
  console.log(`server is running on localhost:${config.port}`);
});
