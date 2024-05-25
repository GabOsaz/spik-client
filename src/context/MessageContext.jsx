import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import socketIO, { Manager } from 'socket.io-client';

export const MessageContext = createContext();

const { Provider } = MessageContext;

const MessageProvider = ({ children }) => {
    const { 
        pathname,
      } = useLocation();
      const companyId = pathname.split('/')[2];
      console.log(companyId);
    // const manager = new Manager('http://localhost:8080');
    // const socket = manager.socket(`/${companyId}`);
    const socket = socketIO('http://localhost:8080', {
        auth: {
            token: 'abc',
            roomName: companyId,
            userName: 'Omo',
        }
    });
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        socket.on('messageQueue', (data) => setChatMessages([...chatMessages, data]));

        return () => {}
    }, [socket, chatMessages]);

    return (
        <Provider
            value={{
                chatMessages,
                setChatMessages,
                socket,
                companyId,
            }}
        >
            {children}
        </Provider>
    )
};

export default MessageProvider;
