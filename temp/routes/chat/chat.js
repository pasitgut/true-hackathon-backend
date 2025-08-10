import path from "path";
import { fileURLToPath } from "url";

import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`a user connected`);

  socket.on("chat:message", (msg) => {
    console.log("message: " + JSON.stringify(msg));

    io.emit("chat:message", msg);
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "index.html"));
});

server.listen(3000, () => {
  console.log(`App running on port 3000`);
});
