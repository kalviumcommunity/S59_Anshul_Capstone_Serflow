import React from 'react'
import AuthHeader from '../components/Auth/AuthHeader'
import LoginComponent from '../components/Auth/LoginComponent'

export default function LoginPage(){
    return(
        <div className='flex h-screen flex-col w-full justify-center items-center'> 
             <AuthHeader
                heading="Login to your account"
                paragraph="Don't have an account yet? "
                linkName="Signup"
                linkUrl="/signup"
                />
                <LoginComponent />
        </div>
    )
}