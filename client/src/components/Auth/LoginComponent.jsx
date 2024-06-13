import { useState } from "react";
import { loginFields } from "./FormFields";
import FormAction from "./FormAction";
import FormExtra from "./FormExtra";
import Input from "./Input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import Cookies from 'js-cookie'
import GoogleButton from 'react-google-button'
const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const API_URI = `${import.meta.env.VITE_api_uri}/auth/login`;

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false)

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };

  const redirect = (path) => {
    setTimeout(() => {
      window.location.href = `${path}`
    }, 1000)
  }

  //Handle Login API Integration here
  const authenticateUser = async () => {
    try {
      setLoading(true);

      // Your authentication API endpoint
      const response = await fetch(API_URI, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginState.email,
          password: loginState.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
          "Failed to authenticate. Please check your credentials."
        );
      }

      const { token, userName, userId } = await response.json();
      Cookies.set('token', token, { expires: 1 })
      Cookies.set('userName', userName, { expires: 1 })
      setLoginSuccess(true);
      // console.log(document.cookie)
      redirect('/Dashboard')
      toast.success("Authentication successful");
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(
        error.message || "An unexpected error occurred during authentication"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {fields.map((field) => (
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
        ))}
      </div>

      <FormExtra />

      {loading ? (
        <div className="h-10 flex items-center justify-center">
          <div className="mr-10">
            <InfinitySpin
              visible={true}
              width="120"
              color="#000"
              ariaLabel="infinity-spin-loading"
            />
          </div>
        </div>
      ) : loginSuccess ? (
        <div className="text-white  text-center text-bold bg-green-600 p-2 rounded-lg w-full">
          Login Success!
        </div>
      ) : (
        <FormAction handleSubmit={handleSubmit} text="Login" />
      )}

        <div className="flex items-center justify-center">
            <GoogleButton
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_api_uri}/oauth/google`
              }}
            />
        </div>


      <br />
      <ToastContainer />
    </form>
  );
}
