// import React from 'react';

// import { PrettyChatWindow } from 'react-chat-engine-pretty';
// import Cookies from 'js-cookie';

// export function ChatPage({user}) {
//   return (
//     <div className='main-content' style={{padding: 0 }}>
//     <PrettyChatWindow
//       projectId={'21c6024d-d8fc-4e38-8e8c-cca627809719'}
//       username={Cookies.get('userName')} 
//       secret={Cookies.get('UID')}
//     />
//   </div>
//   );
// }

// export default ChatPage

import React from 'react'
import Cookies from 'js-cookie';
import {MultiChatSocket, MultiChatWindow, useMultiChatLogic} from 'react-chat-engine-advanced'

function ChatPage() {

  const chatProps = useMultiChatLogic('21c6024d-d8fc-4e38-8e8c-cca627809719', Cookies.get('userName'), Cookies.get('UID'))


  return (
    <div className='main-content' style={{padding: '2px', borderRadius: '10px' }}>
      <MultiChatWindow {...chatProps} />
      <MultiChatSocket {...chatProps} />
  </div>
  );
}

export default ChatPage