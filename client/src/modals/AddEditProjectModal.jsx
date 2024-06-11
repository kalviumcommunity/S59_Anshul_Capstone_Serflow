import React, { useEffect, useState } from "react";
import {v4 as uuidv4, validate} from 'uuid';
import {useDispatch, useSelector} from "react-redux";
import projectSlice from "./../redux/projectSlice";
import { addProjectsAsync, editProjectsAsync } from "../redux/thunk";

function AddEditProjectModal({ setModalOpen, type }) {

  const dispatch = useDispatch()

  const [name, setName] = useState("");

  const [newColumns, setNewColumns] = useState(
    [{
      name: "Todo", tasks : [], id : uuidv4()
    },
    {
      name: "Doing", tasks : [], id : uuidv4()
    }]
  );

  const project = useSelector(state => state.projects.projects.find((project)=> project.isActive))

  const [isFirstLoad,setIsFirstLoad] = useState(true)

  if (type !="add" && isFirstLoad){
    setNewColumns(
      project.columns.map((col)=>{
        return {...col, id : uuidv4()}
      })
    )
    setName(project.name)
    setIsFirstLoad(false)
  }

  const [isValid, setIsValid] = useState(true)


  const onchange = (id, newValue) => {
    setNewColumns((prev)=>{
      const newState = [...prev]
      const column = newState.find((col)=> col.id === id)
      column.name = newValue
      return newState
    })
  }

  const onDelete = (id) => {
    setNewColumns((prev)=> prev.filter((col) => col.id !== id))
  }

  const validate = () =>{
    setIsValid(false)
    if(!name.trim()){
      return false 
    }

    for(let i=0; i<newColumns.length; i++){
      if(!newColumns[i].name.trim()){
        return false
      }
    }
    setIsValid(true)
    return true
  }

  const onSubmit = (type) => {
    setModalOpen(false)
    if(type == 'add'){
      //console.log(newColumn)
      // dispatch
      // console.log({name, newColumns})
      dispatch(addProjectsAsync({name, newColumns}))
      // dispatch(projectSlice.actions.addProject({name, newColumns}))
    }else{
      // dispatch
      // console.log({name, newColumns})
      // dispatch(projectSlice.actions.editProject({name, newColumns})) 
      dispatch(editProjectsAsync({name, newColumns}))
    }
  }



  return (
    <div
      onClick={(e) => {
        if (e.target != e.currentTarget) {
          return;
        }
        setModalOpen(false);
      }}
      className="fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex dropdown bg-[#00000080]"
    >
      {/* MODAL SECTION */}
      <div
        className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8  py-8 rounded-xl"
      >

        <h3 className="text-lg ">
          {type === "edit" ? "Edit" : "Add new"} Project
        </h3>

        {/* {Task Name}  */}

        <div className="mt-8 flex flex-col space-y-3">
          <label
            className="text-sm dark:text-white text-gray-500"
          >
            Project Columns
          </label>

          <input 
            className="bg-transparent px-4 py-2 rounded-md text-sm border border-gray-600 focus:outline-[#635fc7] outline-1 ring-0"
            placeholder="e.g Game Dev"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="project-name-input"
          />
        </div>

        {/* Project Columns */}

        <div
        className="mt-8 flex flex-col space-y-3"
        >
          <label 
          className="text-sm dark:text-white text-gray-500 "
          >
            Project Columns
          </label>

          {
            newColumns.map((column, index)=>{
             return(
              <div key={index} className="flex items-center w-full"> 
                <input 
                className="bg-transparent flex-grow px-4  py-2 rounded-md text-sm border border-gray-600 outline-none focus:outline-[#735fc7] "
                onChange={(e)=>{
                  onchange(column.id, e.target.value)
                }}
                value={column.name}
                type="text" />
                <i 
                className='bx bx-x cursor-pointer m-1 text-2xl' 
                onClick={()=>{
                  onDelete(column.id)
                }} 
                ></i>
              </div>
             )
            })
          }
        </div>

        <div>
          <button
          className="w-full items-center hover:opacity-75 dark:text-[#635fc7] dark:bg-white text-white bg-[#635fc7] py-2 rounded-full mt-2 "
          onClick={()=>{
            setNewColumns((state)=>{
              return [...state, {name: "", tasks: [], id: uuidv4()}]
            })
          }}
          >
            + Add new column
          </button>

          <button
          className="w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative  text-white bg-[#635fc7] py-2 rounded-full"
          onClick={()=>{
            const isValid = validate()
            if(isValid){
              onSubmit(type)
            }
          }}
          >
            {type == 'add' ? 'Create New Project' : 'Save Changes'}
          </button>

        </div>

      </div>
    </div>
  );
}

export default AddEditProjectModal;
