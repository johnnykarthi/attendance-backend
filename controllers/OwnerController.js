const OwnerModel = require('../model/ownerModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const ownerModel = require('../model/ownerModel')
const nodemailer = require('nodemailer')

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET)
}

const signup = async (req, res) => {
    const { email, password, fullname, mobile } = req.body
    try {
        const response = await OwnerModel.createOwner(email, password, fullname, mobile)


        res.status(200).json(response)
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const response = await OwnerModel.loginOwner(email, password)
        const token = createToken(response._id)
        res.status(200).json({ fullname: response.fullname, email: response.email, token })
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}



const changepassword = async (req, res) => {
    const { email, oldpassword, newpassword } = req.body
    try {
        const owner = await OwnerModel.findOne({ email })
        const match = await bcrypt.compare(oldpassword, owner.password)

        if (!match) {
            return res.status(400).json({ err: 'Incorrect old password' })
        }

        if (!validator.isStrongPassword(newpassword)) {
            return res.status(400).json({ err: 'New password is not strong' })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newpassword, salt)

        const response = await OwnerModel.findByIdAndUpdate({ _id: owner._id }, { password: hash })
        res.status(200).json({ msg: "Password changed successfully" })
    }
    catch (e) {
        res.status(400).json({ err: e.message })
    }
}


const resetpassword = async (req, res) => {
    const { token } = req.params
    
    const { password } = req.body

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ err: 'New password is not strong' })
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRET)
        const owner = await ownerModel.findById({ _id: id })

        const match = await bcrypt.compare(password,owner.password)

        if(match){
            return res.status(400).json({err:'Password already exits'})
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const response = await OwnerModel.findByIdAndUpdate({ _id: owner._id }, { password: hash })

        if(response)
        {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSKEY
                }
            })
    
            const mailOptions = {
                from: process.env.EMAIL,
                to: owner.email,
                subject: 'Sending Email using Node.js',
                text: "password reset successfully"
            };
    
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        res.status(200).json({ msg: "Password reset successfully" })
    }
    catch (e) {
        res.status(400).json({ msg: 'Unable to reset the password' })
    }
}


const deactivateAccount = async(req,res)=>{
    const {email} = req.body

    try{
        const owner = await OwnerModel.findOneAndDelete({email})
        res.status(200).json({msg:'Your account has been deleted successfully'})
    }
    catch{
        res.json({err:'Something went wrong'})
    }
}   


const forgotpassword = async (req, res) => {
    const { email } = req.body

    try {
        const owner = await OwnerModel.findOne({ email })

        if(!owner){
            return res.status(404).json({msg:'No owner found'})
        }
        
        const token = createToken(owner._id)

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
            subject: 'Sending Email using Node.js',
            text: `https://attendance-management-v1.netlify.app/reset-password/${token}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.json({ msg: "check your mail" })
            }
        });






    }
    catch (e) {
        res.json({err:e.message})
    }



}

module.exports = { signup, login, changepassword, resetpassword, forgotpassword,deactivateAccount }