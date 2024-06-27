const axios = require("axios");

async function createChatUser(username, secret, email, first_name) {
  console.log(username, secret, email, first_name)
    try {
      const response = await axios.post(
        "https://api.chatengine.io/users/",
        { username, secret, email, first_name},
        { headers: { "Private-Key": process.env.CHAT_ENGINE_PRIVATE_KEY } }
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      return { status: error.response.status, data: error.response.data };
    }
  }



  async function checkIfUnread(projectID, userName, secret) {
    console.log(projectID, userName, secret)
    try {
      const response = await axios.get(
        'https://api.chatengine.io/chats',
        { headers: { "Project-ID": projectID, "User-Name": userName, "User-Secret": secret } }
      );
  
      let unread = 0;
      let chatNames = [];
      const chats = response.data;
  
      chats.forEach((chat) => {
        let lastRead = chat.last_message.id ? chat.last_message.id : null
        // console.log(lastRead)
        chat.people.forEach((person) => {
          if (person.person.username === userName && lastRead !== null) {
            // console.log("??>>",person.last_read)
            if(person.last_read !== lastRead){
              unread += 1;
              chatNames.push(chat.title);
            }
          }
        });
      });
  
      return {count : unread, data : chatNames};
    } catch (error) {
      // console.log(error.response.status, error.response)
      return { status: error.response?.status, data: error.response?.data };
    }
  }
  

module.exports = {createChatUser, checkIfUnread};