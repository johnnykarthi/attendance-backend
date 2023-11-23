const OwnerModel = require('../model/ownerModel')
const jwt  = require('jsonwebtoken')


const createToken = (id)=>{
    return jwt.sign({id},process.env.SECRET)
}

const signup = async(req,res)=>{
    const {email,password} = req.body
    try{
        const response = await OwnerModel.createOwner(email,password)

       
        res.status(200).json(response)
    }
    catch(err){
        res.status(400).json({error:err.message})
    }
}

const login = async(req,res)=>{
    const {email,password} = req.body
    try{
        const response = await OwnerModel.loginOwner(email,password)
        const token = createToken(response._id)
        res.status(200).json({email:response.email,token})
    }
    catch(err){
        res.status(400).json({error:err.message})
    }
}

module.exports = {signup,login}