require('dotenv').config()
const express = require('express')
const mongoose= require('mongoose')
const app  = express();
const cors = require('cors')
const PORT = process.env.PORT || 5000


// MiddleWare
app.use((req,res,next)=>{
    console.log(req.method,req.url)
    next();
})

app.use(express.json());


const whitelist  = ['https://attendance-management-v1.netlify.app/',undefined];

const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1){
            callback(null, true);
        }
        else{
            callback(new Error('Not allowed by Cors'));
        }
    },
    optionSuccessStatus:200
}

// Third-party middleware

app.use(cors());



// Router

app.use('/api/employee',require('./routes/employeeRoute'))

app.use('/api/owner',require('./routes/ownerRoute'))

app.use('/api/otp',require('./routes/otpRoute'))


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(PORT,()=> console.log("Database connected and server is running on port: "+PORT))
})
.catch((err)=>{
    console.log(err);
})
