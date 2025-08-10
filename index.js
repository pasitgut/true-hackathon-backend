// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import path from "path";

// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// app.use(express.static(path.join(__dirname, "../public")));

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });

//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//     io.emit("chat message", msg);
//   });
// });

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public", "index.html"));
// });

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// const messageRoutes = require("./routes/messageRoutes");
// const familyRoutes = require("./routes/familyRoutes");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// app.use(express.json());
// app.use("/api/message", messageRoutes);
// app.use("/api/family", familyRoutes);

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("chatMessage", async ({ username, message }) => {
//     try {
//       const savedMessage = await messageService.saveMessage(username, message);

//       io.emit("chatMessage", savedMessage);
//     } catch (err) {
//       console.error(err);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



import express from 'express';
import http from 'http'
// import socketio from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/authRoutes.js'
import familyRouter from './routes/familyRoutes.js'
import initDatabase from './initDatabase.js';
import pool from './db.js';
import checkUrlRouter from './routes/checkUrlRoutes.js';

const app = express();
const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST']
//   }
// })

initDatabase();

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter);
app.use('/api/family', familyRouter);
app.use('/api/check-url', checkUrlRouter)

app.get('/', (req, res) => {
  return res.json({ message: "hello world"});
})

app.get('/test-query', async (req, res) => {
  try {
    console.log('Pool object', pool);
    console.log('Pool query function: ', typeof pool.query);

    const result = await pool.query('SELECT * FROM NOW()');
    console.log(result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Query error: ', error);
  }
})

// io.use(authenticateSocket);

// io.on('connection', (socket) => {
//   console.log(`User ${socket.userId} connected`);

//   socket.on('join-family-rooms', async () => {
//     try {
//       const pool = require('./db');
//       const familyRooms = await pool.query(`
//         SELECT cr.id as room_id FROM chat_rooms cr
//         JOIN users ON cr.family_id = users.user_id
//         WHERE users.user_id = $1`, [socket.userId]);

//         socket.join(`room_${familyRooms.rows[0].room_id}`);
//     } catch (error) {
//       console.error('Error joining family rooms: ', error);
//     }
//   })
// })

app.listen(8080, () => {
  console.log('Server running on port 8080')
})