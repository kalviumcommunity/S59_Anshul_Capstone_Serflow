import React, { useEffect, useState } from 'react';
import { InfinitySpin } from "react-loader-spinner";
import LoaderScreen from './LoaderScreen';

function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpResend, setOtpResend] = useState(false);
  const [email, setEmail] = useState('');
  const [serverResponse, setServerResponse] = useState({
    type: '',
    message: ''
  });

  const setResponse = (type, message) => {
    setServerResponse({
      type,
      message
    });
    setTimeout(() => {
      setServerResponse({
        type: '',
        message: ''
      });
    }, 5000);
  };

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOTP();
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          otp
        })
      });
      const data = await response.json();
      if (response.ok) {
        setResponse('success', data.message);
        setTimeout(() => {
          window.location.href = '/auth';
        },1000);
      } else {
        // console.log(data, data.error)
        throw new Error(data.error)
      }
    } catch (error) {

      console.log('Error verifying OTP:', error.message);
      setResponse('error', error.message );
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setOtpResend(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setResponse('success', data.message);
      } else {
        throw new Error(data.error || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setResponse('error', error.message);
    } finally {
      setOtpResend(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get('email') || '');
  }, []);

  return (
    <div className="h-screen relative flex justify-center items-center profile-container">
      <img src="/Buildings.png" className="h-2/5 bg-red-200 top-0 absolute w-full object-cover" alt="Background" />

      <div className="relative z-10 bg-white rounded-2xl mb-20 w-full max-w-[400px] mt-20 min-h-[370px] h-fit shadow-xl p-6">
        <div
        className='flex justify-center'
        >
        <img src="/logo-color.png" className='h-20 cursor-pointer' onClick={()=>{window.location.href = '/'}}  alt="" />
        </div>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">OTP Verification</h1>
          <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
          <p className="text-blue-600">{email}</p>

          <form onSubmit={handleSubmit} className="mt-6">
            <input
              type="text"
              value={otp}
              onChange={handleChange}
              maxLength="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-lg tracking-widest focus:outline-none focus:border-gray-500"
              placeholder="Enter OTP"
            />
            <div className="flex justify-center mt-4 w-full">
              {loading ? (
                <div className="mr-10">
                  <InfinitySpin
                    visible={true}
                    width="120"
                    color="green"
                    ariaLabel="infinity-spin-loading"
                  />
                </div>
              ) : (
                <div>
                  <button
                    type="submit"
                    className="mt-4 w-fit p-10 outline outline-green-600 bg-green-300 text-black hover:text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Verify OTP
                  </button>
                  <p className="mt-5">
                    Didn't get the code?{" "}
                    <span
                      onClick={resendOTP}
                      className="text-red-400 cursor-pointer"
                    >
                      Resend OTP
                    </span>
                  </p>
                </div>
              )}
            </div>
          </form>
          <div
            style={{ wordWrap: 'break-word' }}
            className={`mt-4 rounded-lg h-fit w-full ${serverResponse.message.length > 0 ? serverResponse.type === 'success' ? 'text-green-600 outline outline-green-600' : 'text-red-600 outline outline-red-600' : null}`}
          >
            {serverResponse.message}
          </div>
        </div>
      </div>
      {otpResend && <LoaderScreen />}
    </div>
  );
}

export default OTPVerification;
