import React, { useEffect, useState } from 'react'
import Column from '../../components/Column'
import { useSelector } from 'react-redux'

function TaskMain({projectModalOpen, setProjectModalOpen}) {

    // const [windowSize, setWindowSize] = useState(
    //     [
    //         window.innerWidth,
    //         window.innerHeight
    //     ]
    // ) 

    // useEffect(()=>{
    //     const handleWindowResize = () => {
    //         setWindowSize([
    //             window.innerWidth,
    //             window.innerHeight
    //         ])
    //     }
    //     window.addEventListener('resize', handleWindowResize)
    //     return () => window.removeEventListener('resize', handleWindowResize)
    // })

    const project = useSelector(state => state.projects.projects.find((project)=> project.isActive))
    const columns = project.columns
  return (
    <div
    
    >

        {/* column Section */}

        {
            columns.map((col, index)=>{
                <Column key={index} colIndex={index} />
            })
        }

    </div>
  )
}

export default TaskMain