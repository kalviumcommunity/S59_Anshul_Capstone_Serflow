require('dotenv').config();
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const User = require('../Models/userSchema');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
});

const sendRemainderEmail = async (to, user) => {
    try {

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: to,
        subject: 'Email Verification Reminder',
        html: `<div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px;">
          <div style="background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
              <h1>Email Verification Reminder</h1>
          </div>
          <div style="padding: 20px;">
              <h3>Hello ${user.username},</h3>
              <p>We noticed that you haven't verified your email address yet. Please verify your email to continue using our services.</p>
              <a href="${process.env.FRONTEND_URL}/auth/verify?email=${user.email}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Now</a>
              <p>If you did not sign up for this account, you can ignore this email.</p>
          </div>
          <div style="text-align: center; padding: 10px; font-size: 12px; color: #777777; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; background-color: #f4f4f4;">
              <p>&copy; 2024 Serflow. All rights reserved.</p>
          </div>
      </div>`
      };
     const emailSent =  await transporter.sendMail(mailOptions);
    //  console.log(emailSent);
     return
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };
  
  const sendMainToAllUnVerifiedUsers = async () => {
    try {
        const users = await User.find({ isVerified: false });
        const emailPromises = users.map(user => sendRemainderEmail(user.email, user));
        await Promise.allSettled(emailPromises);
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  }


    const scheduleEmailVerification = () => {
        schedule.scheduleJob(process.env.EMAIL_VERIFICATION_CRON || '0 10 * * 0',()=>{
            sendMainToAllUnVerifiedUsers()
            console.log('Email Verification Reminder Scheduled');
        })
    }

module.exports = scheduleEmailVerification;