import React, { useState } from 'react'
import SideNav from '../../components/SideNav/SideNav'
import MainContent from './MainContent/MainContent'
import { Route, Routes } from 'react-router-dom'
import Tasks from './../Tasks/Tasks'
import { useSelector } from 'react-redux'
import Loading from '../../components/Loading'

function Dashboard() {

  const [projectModalOpen, setProjectModalOpen] = useState(false)

  const loading = useSelector(state => state.projects.loading)

  return (
    <div
    className='bg-[#eee] dark:bg-[#2b2c37]'
    >
      <SideNav />
      {loading && <Loading/>}
      <Routes>
      <Route path='/' element={<MainContent modalOpen = {projectModalOpen} setModalOpen = {setProjectModalOpen} />} />
      <Route path='/Tasks' element={<Tasks projectModalOpen = {projectModalOpen} setProjectModalOpen = {setProjectModalOpen}  />} />
      </Routes>
    </div>
  )
}

export default Dashboard