import React, { useState } from 'react'
import {BarLoader} from 'react-spinners'
function loader() {

    const [theme, setTheme] = useState('dark')

    
  return (
    <div className={`flex flex-col justify-center items-center h-screen ${theme != 'light' ? "bg-black" : null}`} >
        <img src={`${theme != 'light' ? "logo-white.svg" : "logo-no-background.svg"}`} style={{width : '400px'}} className='mb-5' alt="" />
        <br />
        <BarLoader color="rgba(248, 0, 0, 1)" width={'300px'} />
    </div>
  )
}

export default loader