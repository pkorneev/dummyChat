import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export type Message = {
  role: "user" | "assistant";
  text: string;
  timestamp: number;
};

const SERVER_URL = "http://localhost:3001";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const activeStreamIdRef = useRef<number | null>(null);
  const streamIdCounterRef = useRef(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const socket = io(SERVER_URL);
    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("stream:start", ({ streamId }: { streamId: number }) => {
      if (activeStreamIdRef.current !== streamId) return;
      setIsLoading(false);
      setIsStreaming(true);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "", timestamp: Date.now() },
      ]);
    });

    socket.on(
      "stream:chunk",
      ({ char, streamId }: { char: string; streamId: number }) => {
        if (activeStreamIdRef.current !== streamId) return;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant") {
            updated[updated.length - 1] = { ...last, text: last.text + char };
          }
          return updated;
        });
      },
    );

    socket.on("stream:end", ({ streamId }: { streamId: number }) => {
      if (activeStreamIdRef.current !== streamId) return;
      activeStreamIdRef.current = null;
      setIsStreaming(false);
      setIsLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    const streamId = ++streamIdCounterRef.current;
    activeStreamIdRef.current = streamId;
    socketRef.current?.emit("message", { text, streamId });
  }, []);

  const stopStreaming = useCallback(() => {
    activeStreamIdRef.current = null;
    socketRef.current?.emit("stream:stop");
    setIsStreaming(false);
    setIsLoading(false);
  }, []);

  return {
    messages,
    sendMessage,
    isConnected,
    isStreaming,
    isLoading,
    stopStreaming,
  };
};
