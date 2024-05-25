import { useContext, useState } from 'react'
import { Button } from '@chakra-ui/react';
import { MessageContext } from '../../context/MessageContext';

function Messages() {
  const [messageValue, setMessageValue] = useState('');
  // const [messages, setMessages] = useState<any>([]);
  const { chatMessages, setChatMessages, socket } = useContext(MessageContext);

  const handleMessageOnchange = (e: any) => {
    setMessageValue(e.target.value);
  };
  const handleMessageSubmit = (e: any) => {
    e.preventDefault();
    socket.emit('message', messageValue);
    setChatMessages((initMessage: any) => ([...initMessage, messageValue]));
    setMessageValue('');
  };

  return (
    <div>
        <div className="bottom-0 left-0 absolute">
            <div>
              {chatMessages.map((message: string) => (
                <p key={message}>{message}</p>
              ))}
            </div>
            <div className='mt-4 mb-3'>
                <form onSubmit={handleMessageSubmit} className="flex items-center">
                    <input className="text-black px-2 py-2" value={messageValue} onChange={handleMessageOnchange} />
                    <div>
                      <Button type="submit" className="px-4 py-2"> Send </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Messages;
