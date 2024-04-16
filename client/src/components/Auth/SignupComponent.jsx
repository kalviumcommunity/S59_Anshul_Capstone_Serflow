import { useState } from "react";
import { signupFields } from "./FormFields";
import FormAction from "./FormAction";
import Input from "./Input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InfinitySpin } from "react-loader-spinner";

const fields = signupFields;
let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ""));

const API_URI = `${import.meta.env.VITE_api_uri}/auth/signup`;

export default function Signup() {
  const [signupState, setSignupState] = useState(fieldsState);
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleChange = (e) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(signupState);
    createAccount();
  };

  const redirect = (path) => {
    setTimeout(() => {
      window.location.href = `${path}`;
    }, 1000);
  };

  const createAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupState),
      });
      console.log(signupState);

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.success || "Account created successfully!");
        setSignupSuccess(true);
        redirect("/login");
      } else {
        toast.error(
          responseData.error ||
            "Failed to create account. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false)
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        {fields.map((field) => (
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
        ))}

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
        ) : signupSuccess ? (
          <div className="text-white  text-center text-bold bg-green-500 p-2 rounded-lg w-full">
            Signup Success!
          </div>
        ) : (
          <FormAction handleSubmit={handleSubmit} text="Signup" />
        )}

        <ToastContainer />
      </div>
    </form>
  );
}
