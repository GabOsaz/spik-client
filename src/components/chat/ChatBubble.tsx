import classNames from "classnames";

interface IMessage {
    content: string;
    author?: string;
    timestamp: number;
};

export const ChatBubble: React.FC<{ message: IMessage, userId: string }> = ({ message, userId }) => {
    const author = message.author;
    const userName = author || "Anonimus";
    const isSelf = message.author === userId;
    const time = new Date(message.timestamp).toLocaleTimeString();
    return (
        <div
            className={`m-2 flex, ${isSelf ? "pl-10 justify-end" : "pr-10 justify-start"}`}
        >
            <div className="flex flex-col">
                <div
                    className={classNames("inline-block py-2 px-4 rounded", {
                        "bg-red-200": isSelf,
                        "bg-red-300": !isSelf,
                    })}
                >
                    {message.content}
                    <div
                        className={classNames("text-xs opacity-50", {
                            "text-right": isSelf,
                            "text-left": !isSelf,
                        })}
                    >
                        {time}
                    </div>
                </div>
                <div
                    className={classNames("text-md", {
                        "text-right": isSelf,
                        "text-left": !isSelf,
                    })}
                >
                    {isSelf ? "You" : userName}
                </div>
            </div>
        </div>
    );
};
