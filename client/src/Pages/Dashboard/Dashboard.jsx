import React from 'react'
import SideNav from './SideNav/SideNav'
import MainContent from './MainContent/MainContent'
function Dashboard() {
  return (
    <div style={{
      background : '#eee'
    }}>
      <SideNav />
      <MainContent />
    </div>
  )
}

export default Dashboard