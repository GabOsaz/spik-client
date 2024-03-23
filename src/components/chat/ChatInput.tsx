import { useEffect, useState } from "react";

export interface IMessage {
    content: string;
    author?: string;
    timestamp: number;
};

interface ITyping { 
    user: string, isTyping: boolean
}

export const ChatInput: React.FC<{ userId: string, socket: any }> = ({ userId, socket }) => {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState<ITyping>(
        {
            user: '', isTyping: false 
        }
    );
    const sendMessage = () => {
        const messageData: IMessage = {
            content: message,
            timestamp: new Date().getTime(),
            author: userId,
        };
        console.log(messageData);

        socket.emit("message", messageData);
    }

    const handleIndicateTyping = (isTyping: boolean) => {
        isTyping ? socket.emit('isTyping', {
            user: userId,
            isTyping: true,
        }) : socket.emit('isTyping', {
            user: userId,
            isTyping: false,
        });
    };

    useEffect(() => {
        socket.on('isTyping', (data: ITyping) =>  setIsTyping(data))
    }, [socket])

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                    setMessage("");
                }}
            >
                {isTyping?.user !== userId && isTyping?.isTyping && <p className="text-xs italic"> Typing </p>}
                <div className="flex mt-4">
                    <textarea
                        className="border rounded"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        onKeyDown={() => handleIndicateTyping(true)}
                        onBlur={() => handleIndicateTyping(false)}
                    />
                    <button
                        // testId="send-msg-button"
                        type="submit"
                        className="bg-rose-400 p-4 mx-2 rounded-lg text-xl hover:bg-rose-600 text-white"
                    >
                        <svg
                            style={{ transform: "rotate(90deg)" }}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};
