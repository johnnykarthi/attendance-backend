const Employee =  require('../model/employee')
const mongoose = require('mongoose')
const createEmployee = async(req,res)=>{
    const emp = req.body
    const id = req.owner
    console.log(id)
    try{
        const response = await Employee.create({...emp,ownerId:id})
        res.status(200).json({msg:"Employee has been created",response})
    }
    catch(err){
        res.status(400).json({error:err.message})
    }
}

const getEmployee = async(req,res)=>{
    const id = req.owner
    try{
        const response = await Employee.find({ownerId:id}).sort({employeeName:-1})
        res.status(200).json(response)
    }catch(err){
        res.status(400).json({msg:err.message})
    }
}

const updateEmployee = async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
       return res.status(400).json({msg:"Employee Id is invalid"})
    }
    try{
        const response = await Employee.findOneAndUpdate({_id:id},{...req.body})

        res.status(200).json({msg:"Employee has been updated",response})
    }catch(err){
        res.status(400).json({error:err.message})
    }
}


const saveWorkDates = async(req,res)=>{
    const employees = req.body;
    try{
        employees.map(async(emp)=>{
            await Employee.findOneAndUpdate({_id:emp._id},{workDates:emp.workDates})
        })
    }
    catch(err){
        res.status(400).json({error:err.message})
    }
    res.status(200).json({msg:"All Work dates has been updated"})
    
}



const generateReport = async(req,res)=>{
    const {startDate,endDate} = req.body;
    if(!startDate || !endDate){
       return res.status(400).json({msg:"Interval must be selected"})
    }
    const employees = await Employee.find({})
    const report = [];

    const calculateNumberofDays = (start, end, dates) => {
        const tempStart = new Date(start);
        const tempEnd = new Date(end);
       
        const filtered = dates.filter(date => {
          const currentDate = new Date(date);
          return tempStart <= currentDate && tempEnd >= currentDate;
        });
        return filtered.length;
    }
    
    const salaryForRoles = (role)=>{
        switch(role){
            case 'PAT':
                return 100
            case 'PA':
                return 200
            case 'A':
                return 300
            case 'SA':
                return 400
            case 'M':
                return 500
            default:
                return 0
        }
    }

    for(let i =0;i<employees.length;i++)
    {
        const empName = employees[i].employeeName
        const workdays = calculateNumberofDays(startDate,endDate,employees[i].workDates)
        const salaryRole = salaryForRoles(employees[i].role)
        const salary = salaryRole*workdays
        const dept = employees[i].dept
        report.push({empName,workdays,salary,dept})
    }
    res.status(200).json(report)
}


const deleteEmployee = async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
       return res.status(400).json({msg:"Employee Id is invalid"})
    }
    try{
        const response = await Employee.findOneAndDelete({_id:id})

        res.status(200).json({msg:"Employee has been Deleted",response})
    }catch(err){
        res.status(400).json({error:err.message})
    }
}

module.exports = {createEmployee,getEmployee,updateEmployee,deleteEmployee,saveWorkDates,generateReport}