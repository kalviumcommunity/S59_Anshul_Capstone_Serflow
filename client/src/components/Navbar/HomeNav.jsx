import React from 'react'
import { Link } from 'react-router-dom'
import './HomeNav.css'

function HomeNav() {
  return (
    <div className='navbar w-full fixed z-10 flex flex-row justify-center shadow-sm' style={{background : 'rgb(245,245,245)'}}>
      <div className='HomeNav '>
        <nav className='flex justify-between items-center h-16  text-black relative  font-mono w-full ' role='navigation'>
          <Link to={'/'} className='pl-8'>
            <img src="logo-no-background.svg" className='h-10' alt="" />
          </Link>
          <div className='px-4 cursor-pointer md:hidden'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
          </div>
          <div className='pr-8 md:block hidden'>
            <Link to={'/about'} className='p-4'>About</Link>
            <Link to={'/faq'} className='p-4'>FAQ</Link>
            <Link to={'/contact'} className='p-4'>Contact</Link>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default HomeNav