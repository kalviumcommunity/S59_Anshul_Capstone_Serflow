import React from 'react'
import {useState, useEffect} from 'react'
import HomeNav from '../../components/Navbar/HomeNav'
import Main from './MainContent'
function Home() {
  return (
    <div style={{background : 'rgb(245,245,245)'}}>
        <HomeNav />
        <Main />
    </div>
  )
}

export default Home