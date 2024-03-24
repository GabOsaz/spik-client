import React, { useState } from 'react'
import { Image, Input } from '@chakra-ui/react'
import chatIcon from '../../assets/chatIcon.png';

function ChatComp() {
  const [chatMsg, setChatMsg] = useState('');
  const handleOnchange = (e: { target: { value: string }; }) => {
    setChatMsg(e.target.value);
  }
  return (
    <div className="">
        <div className="w-[100%] ring-2 absolute bottom-12 right-0">
          <div className="bg-blue">
            <div className="w-full h-64 bg-transparent">

            </div>
            <div className="flex justify-center mt-4 px-4 w-full ring-1 space-x-4 items-center">
              <input
                name="chat_input"
                value={chatMsg}
                onChange={handleOnchange}
                className="w-full rounded-3xl border-blue-200 text-black px-4 py-2 text-sm"
              />
            </div>
          </div>
        </div>
        <div className="cursor-pointer">
            <Image src={chatIcon} className="w-8" />
        </div>
    </div>
  )
}

export default ChatComp;
