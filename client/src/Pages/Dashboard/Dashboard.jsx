import React, { useEffect, useState } from 'react';
import SideNav from '../../components/SideNav/SideNav';
import MainContent from './MainContent/MainContent';
import { Route, Routes } from 'react-router-dom';
import Tasks from './../Tasks/Tasks';
import { useSelector } from 'react-redux';
import Loading from '../../components/Loading';
import ChatPage from '../Chat/ChatPage';
import Cookies from 'js-cookie';
import axios from 'axios';

// 
import io from "socket.io-client";
// 

function Dashboard() {
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const loading = useSelector((state) => state.projects.loading);
  const [chatUser, setChatUser] = useState(null);
  const [user, setUser] = useState("");
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    !socket && setSocket(io("http://localhost:5001"));
  }, []);

  useEffect(() => {
    socket?.emit("newUser", Cookies.get("userName"));
  }, [socket]);

  useEffect(() => {
    const userName = Cookies.get("userName");
    const UID = Cookies.get("UID");
    if (socket && userName && UID) {
      socket.emit("checkUnreads", { username: userName, secret: UID }); 
    };
  }, [socket]);

  useEffect(() => {
      setTimeout(()=>{
        socket && socket.on("unreads", ({count, data}) => {
          setNotification({count : count, data : data});
          console.log(count, data);
        });
      },1000)
  }, [socket]);

  useEffect(() => {
    const getChatUser = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_api_uri}/chat/getUser`,
          {}, // You can send an empty object if there's no data to post
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
            },
          }
        );
        setChatUser(res.data.chatData);
        Cookies.set("UID", res.data.secret, { expires: 1 / 24 }); 
      } catch (err) {
        console.error(err);
      }
    };

    if (!chatUser) {
      getChatUser();
    }
  }, [chatUser]);

  useEffect(() => {
    if (chatUser) {
      console.log(chatUser);
    }
  }, [chatUser]);

  return (
    <div className='bg-[#eee] dark:bg-[#2b2c37]'>
      <SideNav />
      {loading && <Loading />}
      <Routes>
        <Route
          path='/'
          element={
            <MainContent modalOpen={projectModalOpen} setModalOpen={setProjectModalOpen} notification={notification} setNotification={setNotification}/>
          }
        />
        <Route
          path='/Tasks'
          element={
            <Tasks projectModalOpen={projectModalOpen} setProjectModalOpen={setProjectModalOpen} />
          }
        />
        <Route path='/Chats' element={<ChatPage />}/>
      </Routes>
    </div>
  );
}

export default Dashboard;
