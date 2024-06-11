import React from 'react'
import { LineWave } from "react-loader-spinner";

function Loading() {
  return (
    <div
    style={{zIndex: 100}}
    className='main-content z-50 absolute flex justify-center items-center h-screen bg-[#eee] dark:bg-[#2b2c37'
    >
        <LineWave
        color='red'
        firstLineColor="violet"
        middleLineColor="red"
        lastLineColor="violet"
        />
    </div>
  )
}

export default Loading