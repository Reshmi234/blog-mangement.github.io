const jwt = require('jsonwebtoken');

class AuthJwt{
    
    async authJWT(req,res,next){
       try{
        if(req.cookies && req.cookies.user_token){
            jwt.verify(req.cookies.user_token,'RPAWEE12SH3',(err,data)=>{
                if(!err){
                    
                    req.user = data; 
                    //console.log("Rk",req.user);
                    next();
                }else{
                    console.log(err);
                    next();
                    
                }
            })
        }else{
            next();
        }
    }catch(err){
        throw err
    }
       }
       /**
        * @Method front user
        * @description front user
        */
       async authfrontJWT(req,res,next){
        try{
         if(req.cookies && req.cookies.front_user_token){
             jwt.verify(req.cookies.front_user_token,'TTEH0E@YZ',(err,data)=>{
                 if(!err){
                     
                     req.user = data; 
                     //console.log("pawan",  req.front_user);
                     next();
                 }else{
                     console.log(err);
                     next();
                     
                 }
             })
         }else{
             next();
         }
     }catch(err){
         throw err
     }
        }
     
    
}

module.exports = new AuthJwt()


