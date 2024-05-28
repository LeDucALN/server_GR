import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
import morgan from 'morgan';
import http from 'http';
import jwt from 'jsonwebtoken';
import { initDb } from "./config";
const route = require('./routes/index');

dotenv.config();
const app = express();
const port = 5000;
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());
app.use(cookieParser());
route(app);
initDb();

io.use((socket: any, next) => {
  const token = socket.handshake.auth.token;
  console.log('token', token)
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, decoded: any) => {
      if (err) return next(new Error('Authentication error'));
      socket.user = decoded;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket: any) => {
  console.log('A user connected:', socket.user);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user);
  });

  socket.on('exampleEvent', (data: any) => {
    console.log('Received exampleEvent:', data);
    // Xử lý dữ liệu nhận được từ client
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
