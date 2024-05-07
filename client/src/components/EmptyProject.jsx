import React, { useState } from 'react'
import AddEditProjectModal from '../modals/AddEditProjectModal'

function EmptyProject({type}) {


    const[ isProjectModalOpen, setIsProjectModalOpen] = useState(false)


  return (
    <div
    className=' bg-white dark:bg-[#2b2c37] h-full w-full flex flex-col items-center justify-center'
    >
        <h3
        className='text-gray-500 font-bold'
        >
            {
                type == 'edit' ? "This Project is Empty, create a new Column to get started" : "There are no  projects available. Create a new Project to get started."
            }
        </h3>
        <button
        onClick={()=>{
            setIsProjectModalOpen(true)
        }}
        className=' w-full items-center max-w-xs font-bold hover:opacity-70 dark:text-white dark:bg-[#635fc7]  mt-8 relative text-white bg-[#635fc7] py-2 rounded-full'
        >
            {type == "edit" ? "Add new Column" : "Add new Project"}
        </button>

        {
            isProjectModalOpen && (
                <AddEditProjectModal
                type={type}
                setModalOpen={setIsProjectModalOpen}
                />
            )
        }
    </div>
  )
}

export default EmptyProject