import React from 'react'
import SideNav from '../../components/SideNav/SideNav'
import MainContent from './MainContent/MainContent'
import { Route, Routes } from 'react-router-dom'
import Tasks from './../Tasks/Tasks'
function Dashboard() {
  return (
    <div style={{
      background : '#eee'
    }}>
      <SideNav />
      <Routes>
      <Route path='/' element={<MainContent />} />
        <Route path='/Tasks' element={<Tasks />} />

      </Routes>
    </div>
  )
}

export default Dashboard