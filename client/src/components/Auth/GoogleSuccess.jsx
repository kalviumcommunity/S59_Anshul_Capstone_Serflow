import { useEffect, useState } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Triangle } from 'react-loader-spinner'
import Cookies from 'js-cookie'

function GoogleSuccess() {

  const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userName = decodeURIComponent(params.get('userName') || '');
    let profileImage = (window.location.search).split("profileImage=")[1]
    // console.log(params, "token: ",token,"username:", userName)
    // console.log(params..split("profileImage=")[1])
    useEffect(() => {
      if (token && userName) {
        Cookies.set('token', token, { expires: 1 });
        Cookies.set('userName', userName, { expires: 1 }); 
        Cookies.set('profileImage', profileImage, { expires: 1 })
        // console.log("Token:", token, "Username:", userName, "Profile Image:", profileImage)
  
       
        navigate('/dashboard');
      } else {
       
        navigate('/auth');
      }
    },[navigate])

  

  return (
    <div className='h-screen dark:bg-black flex justify-center items-center'>
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

export default GoogleSuccess