import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:4173"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("message", (data) => {
    const userMessage = typeof data === "string" ? data : data.text;
    console.log("Received:", userMessage);

    // Simulate typing delay, then echo the message back
    const delay = 500 + Math.random() * 1000;
    setTimeout(() => {
      socket.emit("message", {
        role: "assistant",
        text: userMessage,
        timestamp: Date.now(),
      });
    }, delay);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
