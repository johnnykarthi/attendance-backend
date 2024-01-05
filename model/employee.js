const mongoose =require('mongoose');

const Schema = mongoose.Schema


const employeeModel = new Schema({
    employeeName:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    workDates:{
        type:Array,
        default:[]
    },
    dept:{
        type:Number,
        default:0
    },
    ownerId:{
        type:String,
        required:true
    }
},{timestamps:true})

employeeModel.statics.createEmployee = async function(employeeName,email,mobile,role){

    if(!employeeName || !email|| !mobile || !role)
    {
        throw Error("All field must be filled")
    }

    const exists = await this.findOne({email})

    const mobileexists = await this.findOne({mobile})

    if(exists)
    {
        throw Error("Email already in use")
    }

    if(mobileexists)
    {
        throw Error("Mobile number already in use")
    }

    const response = await this.create({employeeName,email,mobile,role})

    return response
} 


module.exports = mongoose.model('Employee',employeeModel);