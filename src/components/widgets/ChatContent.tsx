import { useEffect, useRef } from "react";
import type { Message } from "../../hooks/useSocket";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

type ChatContentProps = {
  messages: Message[];
  isStreaming: boolean;
  onStop: () => void;
};

const ChatContent = ({ messages, isStreaming, onStop }: ChatContentProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <CardContent className="flex-1 p-4 overflow-hidden">
      <Card className="relative h-full w-full p-4">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col gap-3 min-w-0">
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Send a message to start the conversation.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={`${msg.timestamp}-${i}`}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                  style={{ overflowWrap: "anywhere" }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
        {isStreaming && (
          <Button
            variant="outline"
            size="sm"
            onClick={onStop}
            className="absolute bottom-3 right-3"
          >
            Stop
          </Button>
        )}
      </Card>
    </CardContent>
  );
};

export default ChatContent;
