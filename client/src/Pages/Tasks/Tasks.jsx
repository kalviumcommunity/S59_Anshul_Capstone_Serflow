import React from 'react'
import TaskHeader from './TaskHeader'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import projectSlice from '../../redux/projectSlice'
import EmptyProject from '../../components/EmptyProject'
import TaskMain from './TaskMain'
import { fetchProjects } from '../../redux/thunk'
function Tasks({projectModalOpen, setProjectModalOpen}) {
  const dispatch = useDispatch()
  const projects = useSelector((state) => state.projects.projects)
  const activeProject = projects.find((project) => project.isActive)

  useEffect(() => {
    if(!projects.length) {
      dispatch(fetchProjects())
    }
  }, [dispatch]);

  useEffect(() => {
    if (!activeProject && projects.length > 0) {
      dispatch(projectSlice.actions.setProjectActive({ index: projects.length - 1}));
    }
  }, [activeProject, projects, dispatch]);


  return (
    <div className='main-content transition-all ease-in-out dark:bg-[#2b2c37]'>


      {activeProject && projects.length > 0 
      
      ? 
        (
          <>
             {/* Header Section */}

             <TaskHeader projectModalOpen = {projectModalOpen} setProjectModalOpen = {setProjectModalOpen} />
             <TaskMain projectModalOpen = {projectModalOpen} setProjectModalOpen = {setProjectModalOpen} />
          </>
        ) : 
          (
              <>
              <EmptyProject type={'add'} />
              </>
          )
        }
     
    
    
    
    </div>
  )
}

export default Tasks