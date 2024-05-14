import React from "react";
import { useState } from "react";
import AddEditTaskModal from "../../modals/AddEditTaskModal";
import AddEditProjectModal from "../../modals/AddEditProjectModal";
import ElipseMenu from "./ElipseMenu";
import DeleteModal from "../../modals/DeleteModal";
import { useSelector, useDispatch } from "react-redux";
import projectSlice from "../../redux/projectSlice";

function LineHeader({location, type, setProjectModalOpen, projectModalOpen}) {
  const dispatch = useDispatch(); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [isElipseOpen, setIsElipseOpen] = useState(false);
  const [boardType, setBoardType] = useState("add");
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
      dispatch(projectSlice.actions.deleteProject());
      dispatch(projectSlice.actions.setProjectActive({ index: 0 }));
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  }

  return (
    <div>
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
        <i className="bx bxs-user-circle"></i>
        <i className="bx bxs-cog"></i>
        <i className="bx bxs-bell"></i>
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
