import React, { useEffect, useState } from 'react'
import Column from './../../components/Column'
import { useSelector } from 'react-redux'

function TaskMain({projectModalOpen, setProjectModalOpen}) {


    const project = useSelector(state => state.projects.projects.find((project)=> project.isActive))
    const columns = project.columns
    // console.log(columns)

  return (
    <div
    className='bg-[#f4f7fd]  scrollbar-hide flex dark:bg-[#20212c]  overflow-x-scroll gap-6 rounded-[10px] mt-5 '
    >

        {/* column Section */}

        {
            columns.map((col, index)=>{
               return( <Column key={index} colIndex={index} />)
            })
        }

    </div>
  )
}

export default TaskMain