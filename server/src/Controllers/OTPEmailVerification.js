require('dotenv').config();
const nodemailer = require('nodemailer');
const OTP = require('../Models/otpSchema');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (to, user) => {
  try {

    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    
   const mailOptions = {
    from : process.env.SMTP_USER,
    to : to,
    subject : 'OTP for Email Verification',
    html : `<div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px;">
    <div style="background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1>Your OTP Code</h1>
    </div>
    <div style="padding: 20px;">
        <p>Hello ${user.username},</p>
        <p>Thank you for using our service. Your One-Time Password (OTP) to proceed is:</p>
        <div style="font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0; letter-spacing: 2px;">${otp}</div>
        <p>Please use this OTP within the next 5 minutes. If you did not request this code, please ignore this email.</p>
        <a href="${process.env.FRONTEND_URL}/auth/verify?email=${user.email}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Now</a>
    </div>
    <div style="text-align: center; padding: 10px; font-size: 12px; color: #777777; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; background-color: #f4f4f4;">
        <p>&copy; 2024 Serflow. All rights reserved.</p>
    </div>
</div>`

   }

   let otpCode = await OTP.findOne({userID : user._id});
   if(otpCode){
    await otpCode.setOTP(otp);
   }else{
        otpCode = new OTP({userID : user._id});
        await otpCode.setOTP(otp);
   }

   await otpCode.save();

   const emailSent =  await transporter.sendMail(mailOptions);

   
    return otp;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = sendEmail;