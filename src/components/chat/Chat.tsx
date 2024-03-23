import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

export interface IMessage {
    content: string;
    author?: string;
    timestamp: number;
};
export interface IMessages {
        message: {content: string;
        author?: string;
        timestamp: number;}
};

export const Chat = ({ messages, userId, socket }: any) => {

    return (
        <div
            className="flex flex-col h-full justify-between"
            data-testid="chat"
        >
            <div>
                {messages?.map((message: IMessage) => (
                    <ChatBubble
                        message={message}
                        userId={userId}
                        key={
                            message.timestamp + (message?.author || "anonymous")
                        }
                    />
                ))}
            </div>
            <ChatInput socket={socket} userId={userId} />
        </div>
    );
};
