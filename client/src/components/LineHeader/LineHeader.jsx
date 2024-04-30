import React from "react";
import { useState } from "react";
import AddEditTaskModal from "../../modals/AddEditTaskModal";

function LineHeader({location, type}) {

  const [openTask, setOpenTask] = useState(false);

  return (
    <div>
    <div className="top-bar">
      <div className="tp-left">
        <div className="pageTile-top">
          <i className="bx bxs-home text-gray-600"></i>
          <span className="text-gray-600"> / {location}</span>
        </div>
        <div className="pageTile-bottom">
          <span className="pageName">{location}</span>
        </div>
      </div>
      {type === "task" 
      ? 
      (
          <div className=" flex space-x-4items-center md:space-x-6 ">
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

    </div>
  );
}

export default LineHeader;
