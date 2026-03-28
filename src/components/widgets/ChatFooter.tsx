import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { Textarea } from "../ui/textarea";

type ChatFooterProps = {
  onInputChange: (value: string) => void;
  inputValue: string;
  onSend: () => void;
};

const ChatFooter = ({ onInputChange, inputValue, onSend }: ChatFooterProps) => {
  return (
    <CardFooter className="flex items-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
      <Textarea
        placeholder="Type your message here..."
        className="flex-1 resize-none max-h-[96px] overflow-y-auto"
        rows={1}
        value={inputValue}
        onChange={(e) => {
          onInputChange(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <Button type="button" onClick={onSend}>
        Send
      </Button>
    </CardFooter>
  );
};

export default ChatFooter;
