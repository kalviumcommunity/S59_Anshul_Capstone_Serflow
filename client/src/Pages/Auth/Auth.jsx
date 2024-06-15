import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Login from  './../Login'
import Signup from './../Signup'
import Logout from './../Logout'
import OTPVerification from './OTPVerification'

function Auth() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path={'/logout'} element={<Logout/>} />
      <Route path={'verify'} element={<OTPVerification />} />
      </Routes>
  )
}

export default Auth