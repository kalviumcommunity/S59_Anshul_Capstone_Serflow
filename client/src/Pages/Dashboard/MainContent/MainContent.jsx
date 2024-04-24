import React from 'react'
import './MainContent.css'
function MainContent() {
  return (
    <div className='main-content transition-all ease-in-out'>
        <div className=''>
            <div className='top-bar'>
                <div className='tp-left'>
                    <div className='pageTile-top'>
                        <i className='bx bxs-home text-gray-600' ></i>
                        <span className='text-gray-600'> / Dashboard</span>
                    </div>
                    <div className='pageTile-bottom'>
                      <span className='pageName'>Dashboard</span>
                    </div>
                </div>
                <div className='tp-right'>
                  <i className='bx bxs-user-circle' ></i>
                  <i className='bx bxs-cog' ></i>
                  <i className='bx bxs-bell' ></i>
                </div>
            </div>
            <div className='cards-box'>
                <div className='card'>
                    <div className='card icon'>
                      <i className='bx bx-signal-5 progress-icon text-white'></i>
                    </div>
                    <div className='card-text'>
                      <h3>Tasks in Progress</h3>
                      <h1>15</h1>
                    </div>
                    <div className='card-footer'>
                      <h1>Card footer</h1>
                    </div>
                </div>
               
                <div className='card'>
                    <div className='card icon'>
                    <i className='bx bx-revision progress-icon text-white' ></i>
                    </div>
                    <div className='card-text'>
                      <h3>Tasks in Review</h3>
                      <h1>15</h1>
                    </div>
                    <div className='card-footer'>
                      <h1>Card footer</h1>
                    </div>
                </div> <div className='card'>
                    <div className='card icon'>
                    <i className='bx bx-command progress-icon text-white' ></i>
                    </div>
                    <div className='card-text'>
                      <h3>Tasks Done</h3>
                      <h1>15</h1>
                    </div>
                    <div className='card-footer'>
                      <h1>Card footer</h1>
                    </div>
                </div> <div className='card'>
                    <div className='card icon'>
                    <i className='bx bx-layer progress-icon text-white'></i>
                    </div>
                    <div className='card-text'>
                      <h3>Tasks Pending</h3>
                      <h1>15</h1>
                    </div>
                    <div className='card-footer'>
                      <h1>Card footer</h1>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default MainContent