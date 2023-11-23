
const jwt = require('jsonwebtoken')

const requireAuth = (req,res,next)=>{
    const {authorization} = req.headers 

    if(!authorization)
    {
        return res.status(401).json({msg:"Authorization is required"})
    }
    const token = authorization.split(' ')[1]

    try{
        const {id} = jwt.verify(token,process.env.SECRET)
        req.owner = id
        next()
    }catch(err){
        res.status(401).json({msg:"Authorization is failed"})
    }
}

module.exports = {requireAuth}