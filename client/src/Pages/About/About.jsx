import React, { useState } from 'react';
import axios from "axios";
import { Avatar } from "@readyplayerme/visage";
import './About.css';
import HomeNav from './../../components/Navbar/HomeNav';

function About() {

    async function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    async function displayRazorpay(amount) {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // creating a new order
        const result = await axios.post("http://localhost:5000/payment/orders", { amount: amount * 100 });

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }

        // Getting the order details back
        const { amount: orderAmount, id: order_id, currency } = result.data;

        const options = {
            key: import.meta.env.VITE_RAZOR_ID, // Enter the Key ID generated from the Dashboard
            amount: orderAmount.toString(),
            currency: currency,
            name: "Serflow.",
            description: "Donate to Dev.",
            image: '/logo-color.png',
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                const result = await axios.post("http://localhost:5000/payment/success", data);

                alert(result.data.msg);
            },
            prefill: {
                name: "Serflow",
                email: "Serflow580@gmail.com",
                contact: "9999999999",
            },
            notes: {
                address: "Soumya Dey Corporate Office",
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    const [amount, setAmount] = useState(); // Default donation amount

    return (
        <>
            <div className="bg-gray-100 min-h-screen">
                <HomeNav />
                <div className="pt-16 w-full h-[600px] flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-blue-500 to-teal-400 p-10">
                    <div className="text-white md:ml-10 animate-fadeIn">
                        <div className="text-[25px]">Hello,</div>
                        <div className="text-[75px] font-bold">I'm Anshul</div>
                        <div className="text-[40px] text-yellow-300">A Budding FullStack Developer</div>
                    </div>
                    <div className="h-full w-2/5">
                        <Avatar modelSrc={'https://models.readyplayer.me/6673184277a449e24d19722b.glb'} />
                    </div>
                </div>
                <div className="text-center w-full mt-10 p-10">
                    <span className="aboutme">About Me</span>
                    <div className="w-full flex flex-col md:flex-row justify-around items-center mt-8 px-10">
                        <img src="/profileMe.jpg" className="rounded-full h-96 md:h-64 lg:h-80" alt="" />
                        <div className='md:w-2/5 mt-8 md:mt-0 md:ml-8 mr-14 leading-relaxed'>
                            <p className="text-justify text-gray-500 ">
                                I am a Full Stack Developer with a passion for creating and developing web applications. I have experience in working with various technologies and frameworks. I have a strong foundation in computer science and programming. I am a quick learner and always eager to learn new technologies and frameworks.
                            </p>
                            <p className="text-gray-700 mt-2 mb-4">If you enjoy my work, consider supporting me:</p>
                            <div className="flex items-center justify-center space-x-4 ">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="p-2 border-none rounded-md outline-none bg-none bg-transparent border-b-2 border-red-500 w-fit"
                                    min="1"
                                    step="1"
                                    placeholder='Amount'
                                />
                                <button
                                    className="bg-red-600 rounded-xl text-white py-2 px-8 hover:bg-red-800 transition duration-300"
                                    onClick={() => displayRazorpay(amount)}
                                >
                                    Donate(INR)
                                </button>
                            </div>
                            <div
                            className='line'
                            ></div>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-12">
                </div>
            </div>
        </>
    );
}

export default About;
