import React from "react";
import { useState, useEffect } from "react";
import AddEditTaskModal from "../../modals/AddEditTaskModal";
import AddEditProjectModal from "../../modals/AddEditProjectModal";
import ElipseMenu from "./ElipseMenu";
import DeleteModal from "../../modals/DeleteModal";
import { useSelector, useDispatch } from "react-redux";
import projectSlice from "../../redux/projectSlice";
import { deleteProjectsAsync } from "./../../redux/thunk";
import { useNavigate } from "react-router-dom";
import Notifications from './../Notifications/Notification'

function LineHeader({location, type, setProjectModalOpen, projectModalOpen, notification, setNotification}) {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [isElipseOpen, setIsElipseOpen] = useState(false);
  const [boardType, setBoardType] = useState("add");
  const [isNotificaionsVisible, setNotificaionsVisible] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const project = useSelector(state => state.projects.projects.find(project => project.isActive));

  const setOpenEditModal = () => {
    setProjectModalOpen(true);
    setIsElipseOpen(false)
  }

  const setOpenDeleteModal = () => {
    setIsDeleteModalOpen(true)
    setIsElipseOpen(false)
  }

  const onDeleteBtnClicked = (e) => {
    if (e.target.textContent === "Delete") {
      // dispatch(projectSlice.actions.deleteProject());
      dispatch(deleteProjectsAsync())
      const projectLength = useSelector(state => state.projects.projects.length);
      dispatch(projectSlice.actions.setProjectActive({ index: projectLength - 1}));
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  }

  useEffect(() => {
    // Simulate fetching notifications
    setTimeout(() => {
      setNotificationsLoading(false); // Set to false after notifications are loaded
    }, 10000); // Adjust the timeout as needed
  }, []);

  return (
    <div>
        <Notifications notification={notification} setNotification={setNotification} isNotificaionsVisible={isNotificaionsVisible} setNotificaionsVisible={setNotificaionsVisible} />

    <div className="top-bar">
      <div className="tp-left">
        <div className="pageTile-top">
          <i className="bx bxs-home text-gray-600 dark:text-white"></i>
          <span className="text-gray-600 dark:text-white"> / {location}</span>
        </div>
        {/* <div className="pageTile-bottom">
          <span className="pageName">{location}</span>
        </div> */}
      </div>
      {type === "task" 
      ? 
      (
          <div className=" flex space-x-4 items-center md:space-x-6 ">
          <button
            className=" button hidden md:block "
            onClick={() => {
              setOpenTask((prevState) => !prevState);
            }}
          >
            + Add New Task
          </button>
          <button
            onClick={() => {
              setOpenTask((prevState) => !prevState);
            }}
            className=" button py-1 px-3 md:hidden "
          >
            +
          </button>
          <i 
          onClick={()=>{
            setOpenTask(false)
            setBoardType('edit')
            setIsElipseOpen((state) => !state)
          }}
          className='bx bx-dots-vertical-rounded text-3xl cursor-pointer dark:text-white'></i>
        </div>
      ) 
      : 
      (<div className="tp-right">
        <i className="bx  bxs-user-circle text-gray-400 cursor-pointer hover:dark:text-white hover:text-black" 
        onClick={()=>{
          navigate('/profile')
        }}
        ></i>
        <i className="bx bxs-cog  text-gray-400 cursor-pointer hover:dark:text-white hover:text-black"></i>
        <div 
        className="flex justify-end"
        >
        {notificationsLoading ? <i className={` text-gray-400 bx bxs-bell  cursor-pointer hover:dark:text-white hover:text-black relative`}
        onClick={()=>{
          
          setNotificaionsVisible(prev => !prev)
        }}
        ></i> : <i className={`text-gray-400 bx bxs-${notification?.count != 0 ? 'bell-plus text-red-300' : 'bell'}  cursor-pointer hover:dark:text-white hover:text-black relative`}
        onClick={()=>{
          
          setNotificaionsVisible(prev => !prev)
        }}
        ></i>}
        </div>
      </div>)}
      
      </div>
      {
        openTask && <AddEditTaskModal setOpenTask={setOpenTask} device={''} type={'add'} />
      }
      {
        projectModalOpen && <AddEditProjectModal type={'edit'}  setModalOpen = {setProjectModalOpen} />
      }

      {
        isElipseOpen && <ElipseMenu 
        setOpenEditModal={setOpenEditModal}
        setOpenDeleteModal={setOpenDeleteModal}
        type={'projects'} />
      }

      {
        isDeleteModalOpen && <DeleteModal setIsDeleteModalOpen={setIsDeleteModalOpen} onDeleteBtnClicked={onDeleteBtnClicked} title={project.name} type={'project'} />
      }

    </div>
  );
}

export default LineHeader;
