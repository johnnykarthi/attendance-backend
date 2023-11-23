require('dotenv').config()
const express = require('express')
const mongoose= require('mongoose')
const app  = express();
const PORT = process.env.PORT || 5000


// MiddleWare
app.use((req,res,next)=>{
    console.log(req.method,req.url)
    next();
})

app.use(express.json());

// Router

app.use('/api/employee',require('./routes/employeeRoute'))

app.use('/api/owner',require('./routes/ownerRoute'))


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(PORT,()=> console.log("Database connected and server is running on port: "+PORT))
})
.catch((err)=>{
    console.log(err);
})
