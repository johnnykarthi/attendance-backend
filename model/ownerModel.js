const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema;

const ownerModel = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})




ownerModel.statics.createOwner = async function(email,password){
    if(!email || !password)
    {
        throw Error("All field must be filed")
    }

    if(!validator.isEmail(email)){
        throw Error('Email is Invaild')
    }

    if(!validator.isStrongPassword(password)){
        throw Error('Password is not Strong')
    }

    const exists = await this.findOne({email})

    if(exists)
    {
        throw Error("Email already exists")
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password,salt)

    const response = await this.create({email,password:hash})

    return response

}

ownerModel.statics.loginOwner = async function(email,password){
    if(!email || !password)
    {
        throw Error("All field must be filed")
    }

    if(!validator.isEmail(email)){
        throw Error('Email is Invaild')
    }

    const owner = await this.findOne({email})

    if(!owner)
    {
        throw Error("Email does not exists")
    }

    const match = await bcrypt.compare(password,owner.password)

    if(!match)
    {
        throw Error("Incorrect password")
    }

    return owner

}

module.exports = mongoose.model("Owner",ownerModel)