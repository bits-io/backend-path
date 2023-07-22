const jwt = require('jsonwebtoken');
require('dotenv').config()

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const auth = (req, res, next)=>{

    try {
        
        let token = req.headers.authorization;
        
        if (token) {
            token = token.split(" ")[1];

            let user = jwt.verify(token, SECRET_KEY);
            
            req.userId = user.sub;       
        } else {
            return res.status(401).json({
                message: "Unauthorized User"
            });
        }

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Unauthorized User"
        });
        
    }
};

module.exports = auth;