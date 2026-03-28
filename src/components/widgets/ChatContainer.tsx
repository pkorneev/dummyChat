import { useState } from "react";
import { Card } from "../ui/card";
import { useSocket } from "../../hooks/useSocket";
import ChatContent from "./ChatContent";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";

const ChatContainer = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const { messages, sendMessage, isConnected, isStreaming, stopStreaming } =
    useSocket();

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSend = () => {
    if (!inputValue.trim()) {
      return;
    }
    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <Card className="flex flex-col w-full max-w-[1200px] h-[calc(100vh-4rem)]">
        <ChatHeader isConnected={isConnected} />
        <ChatContent
          messages={messages}
          isStreaming={isStreaming}
          onStop={stopStreaming}
        />
        <ChatFooter
          onInputChange={handleInputChange}
          onSend={handleSend}
          inputValue={inputValue}
        />
      </Card>
    </div>
  );
};

export default ChatContainer;
