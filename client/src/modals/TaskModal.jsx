import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ElipseMenu from "../components/LineHeader/ElipseMenu";
import Subtask from "../components/Subtask";
import projectSlice from "../redux/projectSlice";
import DeleteModal from "./DeleteModal";
import AddEditTaskModal from "./AddEditTaskModal"
import { deleteTaskAsync, setTaskStatusAsync } from "../redux/thunk";


function TaskModal({ colIndex, taskIndex, setIsTaskModalOpen }) {
  const dispatch = useDispatch();
  const project = useSelector((state) =>
    state.projects.projects.find((project) => project.isActive)
  );

  const columns = project.columns;
  const col = columns.find((column, index) => index === colIndex);

  const task = col.tasks.find((task, index) => index === taskIndex);
  const subtasks = task.subtasks;
  
  let completed = 0;
  subtasks &&
    subtasks.forEach((subtask) => {
      if (subtask.isCompleted) {
        completed++;
      }
    });

  const [status, setStatus] = useState(task.status);
  const [newColIndex, setNewColIndex] = useState(columns.indexOf(col));
  const [elispseOpen, setElipseOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  
  const setOpenEditModal = () => {
    setElipseOpen(false);
    setIsAddTaskModalOpen(true);
  };

  const setOpenDeleteModal = () => {
    setElipseOpen(false);
    setIsDeleteModalOpen(true);
  };

  const onChange = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const onDeleteBtnClicked = (e) => {
    if (e.target.textContent === "Delete") {
      // dispatch(projectSlice.actions.deleteTask({ taskIndex, colIndex }));
      dispatch(deleteTaskAsync({taskIndex, colIndex}))
      setIsTaskModalOpen(false);
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target != e.currentTarget) {
          return;
        }
        // dispatch(
        //   projectSlice.actions.setTaskStatus({
        //     taskIndex,
        //     colIndex,
        //     newColIndex,
        //     status,
        //   })
        // );
        dispatch(setTaskStatusAsync({taskIndex, colIndex, newColIndex, status}))
        setIsTaskModalOpen(false);
      }}
      className="fixed right-0 left-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 bottom-0 jsutify-center items-center flex bg-[#00000080]"
    >
      {/* Modal Section */}

      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
        <div className="relative flex justify-between w-full items-center ">
          <h1 className="text-lg">{task.title}</h1>
          <i
            onClick={() => {
              setElipseOpen((prevState) => !prevState);
            }}
            className="bx bx-dots-vertical-rounded text-3xl cursor-pointer dark:text-white"
          ></i>

          {elispseOpen && (
            <ElipseMenu
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
              type={"task"}
            />
          )}
        </div>

        <p className="text-gray-500 font-semibold tracking-wide text-sm pt-6 ">
          {task.description}
        </p>

        <p className="pt-6 text-gray-500 tracking-widest text-sm">
          {subtasks.length > 0
            ? `${completed} of ${subtasks.length} Subtasks Completed`
            : "No Subtasks"}
        </p>
        {/* SubTasks Section  */}

        <div className="mt-3 space-y-2">
   
          {subtasks.length > 0 ? subtasks.map((subtask, index) => {
            return (
              <Subtask
                index={index}
                taskIndex={taskIndex}
                colIndex={colIndex}
                key={index}
              />
            );
          }) : null}
        </div>

        {/* Current Status */}
        <div className="mt-8 flex flex-col space-y-3 ">
          <label className="text-sm dark:text-white text-gray-500 ">
            Current Status
          </label>

          <select
            className="select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0 border border-gray-300 focus:outline-[#635fc7] outline-none"
            value={status}
            onChange={onChange}
          >
            {columns.map((column, index) => {
              return (
                <option key={index} className="status-option dark:text-black ">
                  {column.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        onDeleteBtnClicked={onDeleteBtnClicked}
        title={task.title}
        type={"task"}
        />
      )}

      {
        isAddTaskModalOpen && (
        <AddEditTaskModal
        type='edit'
        setIsTaskModalOpen={setIsTaskModalOpen}
        setOpenTask={setIsTaskModalOpen}
        taskIndex={taskIndex} 
        prevColIndex={colIndex}
        />
        )
      }
    </div>
  );
}

export default TaskModal;
