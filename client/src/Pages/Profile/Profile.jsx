import React, { useEffect, useState } from 'react'
import './Profile.css';
import ImageUploadModal from '../../modals/ImageUploadModal';
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom'

function Profile() {
    const navigate = useNavigate()

    const [imageModalOpen, setImageModalOpen] = useState(false)
    const [showOverlay, setShowOverlay] = useState(false);
    const [user,setUser] = useState({})
    const [err, setErr] = useState(null)
    const getUserDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_api_uri}/auth/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                let expiration = new Date();
                expiration.setTime(expiration.getTime() + (5 * 60 * 1000));
                Cookies.set('data', JSON.stringify(data), { expires: expiration })
                console.log(data)
                setUser(data)
            }else{
                const data = await response.json()
                setErr(data.message)
            }
        } catch (error) {
            console.log(error)

        }
    }

    useEffect(() => {
        getUserDetails()
    }, [Cookies.get('data')])


    return (
        <div>
            <div
                className='h-screen relative flex justify-center items-center profile-container'
            >

            <img src="/Buildings.png" className='h-2/5 bg-red-200 top-0 absolute w-full' alt="" />


            <div className="relative z-10 bg-gray-100 rounded-2xl w-full max-w-[800px] mt-20 max-h-[600px] h-2/5 shadow-xl">
            <i
            onClick={()=>{
                navigate('/Dashboard')
            }}
            className='bx bx-arrow-back text-4xl m-2 absolute top-0 left-0 cursor-pointer' ></i>
                <div className="relative">
                    <img src={Cookies.get('profileImage')} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-lg bg-white border-2 border-white shadow-lg z-10" alt="" />
                    <div 
                    onClick={()=>{
                        setImageModalOpen(true)
                    }}
                    className="cursor-pointer flex justify-center items-center flex-col text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-40  w-40 rounded-lg border-2 border-white shadow-lg z-50 bg-transparent opacity-0 hover:opacity-100 hover:bg-gray-500 ease-in-out duration-300   " alt="Change Profile Picture">
                        <i className='bx bx-customize text-4xl text-white'></i>
                        <span className='text-white'>Change Profile Picture</span>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <h1 className="text-4xl font-medium mt-32 mb-1">{user.username}</h1>
                    <p className="text-gray-500">{user.email}</p>
                </div>
                
                {!err ? user.oauthId ? <div className="mt-8 text-green-600 text-center">
                    You are logged in with Google OAuth <br />
                </div> : <div className="mt-8 text-center text-red-600">
                    You are not logged in with Google OAuth <br />
                </div> : <div className="mt-8 text-center text-red-600">
                    {err} <br />
                </div> }

                
            </div>


            </div>


            {imageModalOpen && <ImageUploadModal setImageModalOpen={setImageModalOpen} />}
        </div>
    )
}

export default Profile