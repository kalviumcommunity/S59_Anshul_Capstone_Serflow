import { useEffect, useState } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Triangle } from 'react-loader-spinner'

function GoogleSuccess() {
  // const API_URI = 'http://localhost:5000/auth/login/success/user'
  const API_URI = 'https://serverk.onrender.com/auth/login/success/user'
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("token=")
    );

    if (!tokenCookie){
      fetchSessionUser()
    }

  },[])

const fetchSessionUser = async() => {
  if(!token || !user){
    fetch(API_URI)
    .then((res) => res.json())
    .then((data) => {
      if(data.token && data.userName){
        setUser(data.userName)
        setToken(data.token)
      }
    });
  }
}

useEffect(() => {
  console.log(user, token)

  if(user && token){
    document.cookie = `token=${token}; max-age=3600; path=/`;
    document.cookie = `userName=${user}; max-age=3600; path=/`;
    setTimeout(() => {
      window.location.href = '/';
    }, 2000)
  }

},[user, token])

  return (
    <div className='h-screen flex justify-center items-center'>
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