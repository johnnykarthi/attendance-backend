
const otpGenerator = require('otp-generator')
const OTP = require('../model/OTP')

const nodemailer = require('nodemailer')
const ownerModel = require('../model/ownerModel')


const generateOTP  = async(req,res)=>{
    const {email} = req.body
    const otpgenerated = otpGenerator.generate(4, {lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
    try{
        const owner = await OTP.findOne({email})
        const ownerExits = await ownerModel.findOne({email})
        if(ownerExits){
            return res.status(400).json({err:"Email already exits"})
        }
        if(!owner){
            await OTP.create({email,otpgenerated})
        }
        else{
            await OTP.findOneAndUpdate({email},{otpgenerated})
        }
    
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSKEY
            }
        })
    
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for Attendance Management',
            text: `Your OTP:${otpgenerated}`
        }
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          })
         res.json({msg:'Otp has been generated'})
    }
    catch(e){
        res.status(400).json({err:e.message})
    }
}


const validateOTP = async(req,res)=>{
    const {email,otp} = req.body
    try{
        const owner = await OTP.findOne({email})

        if(owner.otpgenerated == otp){
            res.status(200).json({msg:'Otp verified successfully'})
        }
        else{
            res.status(400).json({err:'Invalid OTP'})
        }

    }catch(e){
        res.status(400).json({err:e.message})
    }
}



module.exports = {generateOTP,validateOTP}