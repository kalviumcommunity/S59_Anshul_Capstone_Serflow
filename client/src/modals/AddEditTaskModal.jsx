import React, { useState, useEffect } from 'react'
import { v4 as uuidv4, validate } from 'uuid';
import {useSelector, useDispatch} from 'react-redux'
import projectSlice from '../redux/projectSlice';
import { addTaskAsync, editTaskAsync } from '../redux/thunk';

function AddEditTaskModal({type, device, setOpenTask, taskIndex, setIsTaskModalOpen , prevColIndex = 0}) {
    const dispatch = useDispatch()
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isValid, setIsValid] = useState(true)
    const [Subtasks, setSubtasks] = useState(
            [
                {title: "", isCompleted: false, id: uuidv4()},
                {title: "", isCompleted: false, id: uuidv4()}
            ]
            );


    const projects = useSelector((state) => state.projects.projects).find((project)=>project.isActive);  
    const [isFirstLoad, setIsFirstLoad] = useState(true) 
    const columns = projects.columns;
    const col = columns.find((col, index) => index == prevColIndex)
    const task = col.tasks ? col.tasks.find((task, index) => index === taskIndex) : [];
    const [newColIndex, setNewColIndex] = useState(prevColIndex);
    const [status, setStatus] = useState(columns[prevColIndex].name)

    const onDelete = (id) => {
        setSubtasks((prev)=> prev.filter((col) => col.id !== id))
      }


    if(type == 'edit' && isFirstLoad){
        setSubtasks(
            task.subtasks ? task.subtasks.map((subtask)=>{
                return {...subtask, id: uuidv4()}
            }) : null
        )
        setTitle(task.title)
        setDescription(task.description)
        setIsFirstLoad(false)
    }
    
    const onChangeSubtasks = (id, newValue) => {
        setSubtasks((prev)=>{
            const newState = [...prev]
            const subtask = newState.find((subtask)=> subtask.id === id)
            subtask.title = newValue
            return newState
          })
    }

    const onChangeStatus = (e) => {
        setStatus(e.target.value);
        setNewColIndex(e.target.selectedIndex);
      };

      const validate = () => {
        setIsValid(false);
        if (!title.trim()) {
          return false;
        }
        for (let i = 0; i < Subtasks.length; i++) {
          if (!Subtasks[i].title.trim()) {
            return false;
          }
        }
        setIsValid(true);
        return true;
      };

    const onSubmit = (type) =>{
        if(type == "add"){
            // dispatch(projectSlice.actions.addTask({
            //     title,
            //     description,
            //     Subtasks,
            //     status,
            //     newColIndex
            // }))
            dispatch(addTaskAsync({title, description, Subtasks, status, newColIndex}))
        }else{
            // dispatch(projectSlice.actions.editTask({
            //     title,
            //     description,
            //     Subtasks,
            //     status,
            //     taskIndex,
            //     prevColIndex,
            //     newColIndex
            // }))
            dispatch(editTaskAsync({title, description, Subtasks, status, prevColIndex, newColIndex, taskIndex}))
        }
    }

      

  return (
    <div
    onClick={(e)=>{
        if(e.target !== e.currentTarget){
            return
        }
        setOpenTask(false);
    }}
    className={
        device === "mobile"
          ? "  py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-[-100vh] top-0 dropdown "
          : "  py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-0 top-0 dropdown  "
      }
    >
        {/* Modal Section */}
        
        <div
        className='scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl '
        >
            <h3
            className='text-lg'
            >
                {type == "edit" ? "Edit Task" : "Add New Task"}
            </h3>
            {/* Task Name */}
            <div
            className='mt-8 flex flex-col space-y-1'
            >
                <label
                className='text-sm dark:text-white text-gray-500'
                >
                    Task Name
                </label>
                <input 
                className='bg-transparent  px-4 py-2 outline-none focus:border-0 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g Design Meeting'
                type="text" />
            </div>
            {/* Description */}

            <div
            className='mt-8 flex flex-col space-y-1'
            >
                <label
                className='text-sm dark:text-white text-gray-500'
                >
                    Task Description
                </label>
                <textarea 
                className='bg-transparent outline-none min-h-[100px] focus:border-0 px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='e.g Plan a meeting around 4pm with the design team'
                type="text" />
            </div>

            {/* Subtasks Section */}
            <div
            className='mt-8 flex flex-col space-y-2'
            >
                <label
                className='text-sm dark:text-white text-gray-500'
                >
                    Subtasks
                </label>

                {Subtasks ? 
                    Subtasks.map((subtask, index)=>{
                        return(
                            <div key={index}
                            className='flex items-center w-full'
                            >
                                <input type="text"
                                value={subtask.title}
                                onChange={(e)=>{
                                    onChangeSubtasks(subtask.id, e.target.value);
                                }}
                                placeholder='e.g Call the client'
                                className='bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]'
                                />
                                <i 
                                className='bx bx-x cursor-pointer m-1 text-2xl' 
                                onClick={()=>{
                                  onDelete(subtask.id)
                                }} 
                                ></i>
                            </div>
                        )
                    }) 
                    : null
                }
                <button
                onClick={()=>{
                    setSubtasks((state)=> [...state, {title: "", isCompleted: false, id: uuidv4()}]
                    )
                }}
                className=" w-full items-center dark:text-[#635fc7] dark:bg-white  text-white bg-[#635fc7] py-2 rounded-full"
                >
                    + Add New Subtask
            </button>
            </div>

            {/* Current Status Section */}
            <div
            className='mt-8 flex flex-col space-y-3'
            >
                <label className=' text-sm dark:text-white text-gray-500'>
                    Current Status
                </label>
                <select
                className='select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none'
                value={status}
                onChange={(e)=> onChangeStatus(e)}
                >
                    {columns.map((col, index) => {
                        return(
                            <option 
                            className='dark:text-black'
                            value={col.name}
                            key={index}
                            >
                                {col.name}
                            </option>
                        )
                    })}
                </select>
                
                <button
                onClick={()=>{
                    const isValid = validate()
                    if(isValid){
                        onSubmit(type)
                        setOpenTask(false)
                    }
                }}
                className='w-full items-center text-white bg-[#635fc7] py-2 rounded-full'
                >
                    {type == "edit" ? "Update Task" : "Create Task"}
                </button>
            </div>
        </div>
    </div>
  )
}

export default AddEditTaskModal
