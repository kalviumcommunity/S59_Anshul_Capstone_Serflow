import React from 'react'
import Cookies from 'js-cookie';
import {MultiChatSocket, MultiChatWindow, useMultiChatLogic} from 'react-chat-engine-advanced'

function ChatPage() {

  const chatProps = useMultiChatLogic(import.meta.env.VITE_CHAT_ENGINE_PROJECT_ID, Cookies.get('userName'), Cookies.get('UID'))


  return (
    <div className='main-content' style={{padding: '2px', borderRadius: '10px' }}>
      <MultiChatWindow {...chatProps} />
      <MultiChatSocket {...chatProps} />
  </div>
  );
}

export default ChatPage 