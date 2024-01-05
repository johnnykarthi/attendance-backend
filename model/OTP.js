

const moongoose = require('mongoose')
const Schema = moongoose.Schema


const OTP = new Schema({
    email:{
        type:String,
        required:true

    },
    otpgenerated:{
        type:Number,
        required:true
    }
},{timestamps:true})


module.exports = moongoose.model('otp',OTP)