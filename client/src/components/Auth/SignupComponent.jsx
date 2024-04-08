import { useState } from 'react';
import { signupFields } from './FormFields';
import FormAction from './FormAction';
import Input from './Input';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleButton from 'react-google-button';

const fields=signupFields;
let fieldsState={};

fields.forEach(field => fieldsState[field.id]='');

const API_URI = 'https://serverk.onrender.com/auth/signup';
// const API_URI = 'http://localhost:5000/auth/signup';

export default function Signup(){
  const [signupState,setSignupState]=useState(fieldsState);

  const handleChange=(e)=>setSignupState({...signupState,[e.target.id]:e.target.value});

  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log(signupState)
    createAccount()
  }


  const createAccount = async () => {
    try {
      const response = await fetch(API_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupState),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
         toast.success(responseData.success || 'Account created successfully!');
      } else {
         toast.error(responseData.error || 'Failed to create account. Please try again later.');
      }
  
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  const googleAuth=()=>{
    // window.open('https://serverk.onrender.com/auth/google/callback',"_self")
    window.open('http://localhost:5000/auth/google/callback',"_self")
  }

    return(
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="">
        {
                fields.map(field=>
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={signupState[field.id]}
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
          <FormAction handleSubmit={handleSubmit} text="Signup" />
          <ToastContainer />
        </div>

        <div className='flex justify-center items-center'>
          <GoogleButton onClick={googleAuth}/>
        </div>

      </form>
    )
}