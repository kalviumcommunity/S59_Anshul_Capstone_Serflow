import React, { useEffect, useState } from 'react'
import { shuffle } from "lodash";
import { useDispatch, useSelector } from 'react-redux';
import TaskComponent from './TaskComponent'
import projectSlice from '../redux/projectSlice'
import { dragTaskAsync } from './../redux/thunk';

function Column({colIndex}) {

    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-blue-500",
        "bg-purple-500",
        "bg-green-500",
        "bg-indigo-500",
        "bg-yellow-500",
        "bg-pink-500",
        "bg-sky-500",
      ];

      const [color, setColor] = useState(null)
      const dispatch = useDispatch()

    const project = useSelector(state => state.projects.projects.find((project)=> project.isActive))
    const col = project.columns.find((col, index) => index === colIndex)

    useEffect(()=>{
        setColor(shuffle(colors).pop())
    },[dispatch])
    
    const handleOnDragOver = (e) => {
      e.preventDefault();
      
    }

    const handleOnDrop = (e) => {
      const { prevColIndex, taskIndex} = JSON.parse(
        e.dataTransfer.getData("text")
    )

    if (colIndex !== prevColIndex) {
      // dispatch(
      //   projectSlice.actions.dragTask({
      //   colIndex, 
      //   prevColIndex,
      //   taskIndex
      //   })
      // );
      dispatch(dragTaskAsync({ colIndex, prevColIndex, taskIndex}))
    }
  }


  return (
    <div
    onDrop = {handleOnDrop}
    onDragOver = {handleOnDragOver}

    className='scrollbar-hide mx-5  pt-[40px] min-w-[280px]'
    >
        <p
        className='font-semibold flex  items-center  gap-2 tracking-widest md:tracking-[.2em] text-[#828fa3]'
        >
          <span className={`rounded-full w-4 h-4 ${color}`} />
            {col.name} {col.tasks ? col.tasks.length : 0 }
        </p>

          {
            col.tasks &&  col.tasks.map((task, index)=>{
              return (<TaskComponent key={index} taskIndex={index} colIndex={colIndex} />)
            })
          }

    </div>
  )
}

export default Column
