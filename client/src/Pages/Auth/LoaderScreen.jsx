import React from 'react'
import { Triangle } from 'react-loader-spinner'

function LoaderScreen() {
    return (
        <div className='h-screen w-full absolute z-50 bg-black  bg-opacity-[0.8] flex justify-center items-center'>
            <Triangle
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}

export default LoaderScreen