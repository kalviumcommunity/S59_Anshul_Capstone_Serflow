import React from 'react';

import { PrettyChatWindow } from 'react-chat-engine-pretty';
import Cookies from 'js-cookie';

export function ChatPage({user}) {
  return (
    <div className='main-content' style={{padding: 0 }}>
    <PrettyChatWindow
      projectId={import.meta.env.VITE_CHAT_ENGINE_PROJECT_ID }
      username={Cookies.get('userName')} 
      secret={Cookies.get('UID')}
    />
  </div>
  );
}

export default ChatPage

