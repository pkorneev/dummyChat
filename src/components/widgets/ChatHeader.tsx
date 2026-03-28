import { CardDescription, CardHeader, CardTitle } from "../ui/card";

type ChatHeaderProps = {
  isConnected: boolean;
};

const ChatHeader = ({ isConnected }: ChatHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>My Chat</CardTitle>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            isConnected
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
      <CardDescription>Dummy chat app utilizing websockets</CardDescription>
    </CardHeader>
  );
};

export default ChatHeader;
