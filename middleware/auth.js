const jwt = require('jsonwebtoken')

const checkAuthentication = (req, res, next) => {
    try{
        const token = req.headers['authorization']

        if(!token){
            return res.status(401).send({ status : 0, message : "No token Provided, Login & Enter the Token!" })
        }
        
        const verify = jwt.verify(token, process.env.SECRET)
        req.user = verify
        console.log("Token Data : ", req.user);
        
        next()

    } catch(err){
        res.status(400).send({ status : 0, message : "Invalid Token or Token Expired!" })
    }
}

const checkRole = (allowRole) => {
    return (req, res, next) => {
        try{
            if(allowRole.includes(req.user.role)){
                next();
            } else{
                return res.status(403).json({ status : 0, message: "you are not allow for this operation, Access denied" });
            }   
        } catch(err){
            console.log(err);
            return res.status(500).json({ status : 0, message : "error while checkROle" })
        }
    }
};

module.exports = { checkAuthentication, checkRole }