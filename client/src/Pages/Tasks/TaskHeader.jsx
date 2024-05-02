import React from 'react'
import LineHeader from '../../components/LineHeader/LineHeader'
import { useSelector } from 'react-redux'

function TaskHeader({projectModalOpen, setProjectModalOpen}) {

  const projects = useSelector((state) => state.projects.projects)
  const activeProject = projects.find((project) => project.isActive)
  return (
    <div>
      <LineHeader location={"Dashboard / Tasks"} type={"task"} projectModalOpen = {projectModalOpen} setProjectModalOpen = {setProjectModalOpen} />
      <h3
      className='text-blue-500 text-2xl font-bold'
      >
        {activeProject.name}
      </h3>
    </div>
  )
}

export default TaskHeader