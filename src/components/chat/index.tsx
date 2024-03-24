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
        {/* <div className="w-[90%]">
            <div className="flex space-x-4 items-center">
                <input
                    name="chat_input"
                    value={chatMsg}
                    onChange={handleOnchange}
                    className=""
                />
            </div>
        </div> */}
        <div className="cursor-pointer">
            <Image src={chatIcon} className="w-8 absolute bottom-12 right-5" />
        </div>
    </div>
  )
}

export default ChatComp;
