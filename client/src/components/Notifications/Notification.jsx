import React, { useState } from 'react';
// Ensure Tailwind CSS and FontAwesome are imported in your main project file
// import 'tailwindcss/tailwind.css'; 
// import '@fortawesome/fontawesome-free/css/all.min.css'; 
import './Notification'

const Notifications = ({notification, setNotification, isNotificaionsVisible, setNotificaionsVisible}) => {
  // const [isVisible, setIsVisible] = useState(true);

  const handleToggle = () => {
    
    setNotification(null)
    
  };
  const handleClose = () => {
    setNotificaionsVisible(false);
  };

  if (!isNotificaionsVisible) return null;

  return (
      <div 
      style={{right : '0'}}
      className="absolute  z-10 mt-5 flex w-screen max-w-md px-4 py-4">
        <div className="w-full flex-auto overflow-hidden rounded-3xl text-sm leading-4 shadow-lg ring-2 ring-gray-900/6 bg-gradient-to-r from-gray-50 to-blue-100">
          <div className="p-4">
            <button
              type="button"
              className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
              aria-expanded="false"
            >
              <i className="fa-solid fa-bell fa-shake"></i> <span>Notifications</span>
              <i className="fa-solid fa-chevron-down text-gray-600 group-hover:text-indigo-600 animate-bounce"></i>
            </button>
            <div id="messages" className='p-2'>
             {notification?.count != null ? notification.data.map((item, index) => {
              return (
                <NotificationItem
                  key={index}
                  icon={'chat'}
                  title={'New Message'}
                  // time={item.time}
                  message={`You have a new Message from ${item}`}
                />
              )
             }) : 
              <NotificationItem
                icon="trello"
                title="No Notifications"
                // time="8:24AM"
                message="You have no new messages"
              />
             }
              
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-100">
              <button
                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-blue-200"
                onClick={handleToggle}
              >
                <i className="fa-solid fa-broom"></i> Clear
              </button>
              <button
                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-blue-200"
                onClick={handleClose}
              >
                <i className="fa-regular fa-circle-xmark"></i> Close
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

const NotificationItem = ({ icon, title, time, message }) => {
  return (
    <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-200">
      <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
        <i className={`bx bxs-${icon} fa-xl text-gray-600 group-hover:text-indigo-600`}></i>
      </div>
      <div>
        <a href="#" className="font-semibold text-gray-900">
          {title} <span className="text-xs text-gray-400 animate-pulse">{time}</span>
          <span className="absolute inset-0"></span>
        </a>
        <p className="mt-1 text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Notifications;
