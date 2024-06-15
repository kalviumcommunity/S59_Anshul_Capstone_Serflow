const mongoose = require('mongoose');
const crypto = require('crypto');

const otpSchema = new mongoose.Schema({
    userID: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required: true 
    },
    otp : {
        type : String,
        required : true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '5m' },
    },
},
    { timestamps: true }
)

otpSchema.methods.setOTP = async function (otp) {
    try {
      this.otp = crypto.createHash('sha256').update(otp).digest('hex');
      this.expireAt = new Date(Date.now() + 10 * 60 * 1000);
      
      await this.save();
    } catch (error) {
      throw new Error('Error setting OTP');
    }
  };
  
  otpSchema.methods.validateOTP = function (otp) {
    try {
      const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
      return this.otp === hashedOtp;
    } catch (error) {
      return false;
    }
  };

const OTP = mongoose.model('OTPCollections', otpSchema);

module.exports = OTP;