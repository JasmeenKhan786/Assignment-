//Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MmRhNTAyYTg0ZDU1YzgwOGU5NmRiYzIiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2NTg0NzYwMTYsImV4cCI6MTY1ODQ3OTYxNn0.Ti3RX9QXdfXetVJsr_PAoed-MFaC_ufqx4_JplaZ_n8
const jwt = require('jsonwebtoken');

const isAuth =(req,res,next)=>{
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error("User not logged in");
        error.statusCode = 422;
        error.success = false;
        error.message = "User not logged in";
        error.result = [];
        next(error); 
    }
    const token = authHeader.split(" ")[1];
    if(token){

        const decodedToken = jwt.verify(token, "MySecretKey" ,function(err, decodedToken) {
            if(err){
            const error = new Error("Invalid Token");
            error.statusCode = 422;
            error.success = false;
            error.message = err.message
            error.result = [];
            next(error); 
            }
 
            if(decodedToken){
                req.uid = decodedToken.userId;
                req.email = decodedToken.email
                next()
    
            }else{
                const error = new Error("Unable to authenticate");
                error.statusCode = 422;
                error.success = false;
                error.message = "Unable to authenticate";
                error.result = [];
                next(error); 
    
            }
          });
       

    }
   

}

module.exports = isAuth;


