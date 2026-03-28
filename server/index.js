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

  let activeStream = null;

  const cancelActiveStream = () => {
    if (activeStream) {
      clearTimeout(activeStream.timeout);
      clearInterval(activeStream.interval);
      activeStream = null;
    }
  };

  socket.on("stream:stop", () => {
    const id = activeStream?.id;
    cancelActiveStream();
    if (id != null) {
      socket.emit("stream:end", { streamId: id });
    }
  });

  socket.on("message", (data) => {
    const userMessage = typeof data === "string" ? data : data.text;
    console.log("Received:", userMessage);

    cancelActiveStream();

    const streamId = data.streamId;
    const chars = [...userMessage];
    let index = 0;
    const stream = { id: streamId, timeout: null, interval: null };
    activeStream = stream;

    stream.timeout = setTimeout(() => {
      if (activeStream !== stream) return;

      socket.emit("stream:start", { streamId });

      stream.interval = setInterval(
        () => {
          if (activeStream !== stream) {
            clearInterval(stream.interval);
            return;
          }
          if (index < chars.length) {
            socket.emit("stream:chunk", { char: chars[index], streamId });
            index++;
          } else {
            clearInterval(stream.interval);
            socket.emit("stream:end", { streamId });
            if (activeStream === stream) activeStream = null;
          }
        },
        5 + Math.random() * 5,
      );
    }, 1500);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
