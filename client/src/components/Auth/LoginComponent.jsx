import { useState } from 'react';
import { loginFields } from './FormFields';
import FormAction from './FormAction';
import FormExtra from './FormExtra';
import Input from './Input';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
import {InfinitySpin} from 'react-loader-spinner'
import GoogleButton from 'react-google-button'

const fields=loginFields;
let fieldsState = {};
fields.forEach(field=>fieldsState[field.id]='');



const API_URI = 'https://serverk.onrender.com/auth/login';

export default function Login(){
    const [loginState,setLoginState]=useState(fieldsState);
    const [loading,setLoading]=useState(false);
    const navigate = useNavigate();

    const handleChange=(e)=>{
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        authenticateUser();
    }

    //Handle Login API Integration here
    const authenticateUser = async () => {
        try {
          setLoading(true);
    
          // Your authentication API endpoint
          const response = await fetch(API_URI, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: loginState.email,
              password: loginState.password,
            }),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to authenticate. Please check your credentials.');
          }
    
          const {token, userName, userId} = await response.json();
          console.log('Authentication successful:', token);
          toast.success('Authentication successful');
        
          if(token){
            document.cookie = `token=${token}; max-age=3600; path=/`;
            document.cookie = `userName=${userName}; max-age=3600; path=/`;
            setTimeout (() => {
              setLoading(false)
              window.location.href = '/';
            }
            , 2000);
          }

        } catch (error) {
          console.error('Authentication error:', error);
          toast.error(error.message || 'An unexpected error occurred during authentication');
        } finally {
          // setLoading(false);
        }
      };
    
    const googleAuth=()=>{
      window.open('https://serverk.onrender.com/auth/google/callback',
      // window.open('http://localhost:5000/auth/google/callback',
      "_self"
      )
    }

    return(
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
        <div className="-space-y-px">
            {
                fields.map(field=>
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={loginState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                    />
                
                )
            }
        </div>

        <FormExtra/>
        
        
        
        {loading ? <div className='flex justify-center items-center'>
          <InfinitySpin
          visible={true}
          width="200"
          color="#9333EA"
          ariaLabel="infinity-spin-loading"
        />
        </div> : <FormAction handleSubmit={handleSubmit} text="Login"/> }
        <br />
        <div className='flex justify-center items-center'>
          <GoogleButton onClick={googleAuth}/>
        </div>

        <ToastContainer />
      </form>
    )
}