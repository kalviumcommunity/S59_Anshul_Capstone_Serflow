import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import TaskModal from './../modals/TaskModal'

function TaskComponent({taskIndex, colIndex}) {

  const project = useSelector(state => state.projects.projects.find((project)=> project.isActive))
  const col = project.columns.find((col, index) => index === colIndex)
  const task = col.tasks.find((task, i) => i === taskIndex);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  let completed = 0
  let subtasks = task.subtasks
  subtasks && subtasks.forEach(subtask => {
    if(subtask.isCompleted){
      completed++
    }
  });

  const handleOnDrag = (e) => {
    e.dataTransfer.setData("text", JSON.stringify({prevColIndex: colIndex, taskIndex}))
  }

  return (
    <div>
      <div
      onDragStart={handleOnDrag}
      draggable
      onClick={()=> setIsTaskModalOpen(true)}
      className='w-[280px] first:my-5 rounded-lg  bg-white  dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#635fc7] dark:text-white dark:hover:text-[#635fc7] cursor-pointer'
      >
        <p
        className='font-bold tracking-wide'
        >
          {task.title}
        </p>

        <p
        className='font-bold text-xs tracking-tighter mt-2 text-gray-500 '
        > 
          {subtasks ? `${completed} of ${subtasks.length} completed` : 'No subtasks'}
        </p>
      </div>

      {
        isTaskModalOpen && (
          <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
          />
        )
      }

    </div>
  )
}

export default TaskComponent
