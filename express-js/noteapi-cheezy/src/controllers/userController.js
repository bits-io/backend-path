const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res) => {

    // Existing User Check
    // Hashed Password
    // User Creation
    // Token Generate
    const { username, email, password } = req.body;
    try {
        
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await userModel.create({
            email: email,
            password: hashedPassword,
            username: username
        });

        // const token = jwt.sign({ 
        //     email: result.email,
        //     id: result._id },
        //     JWT_SECRET_KEY
        // );
        const token = jwt.sign({ 
                sub: result._id,
                exp: Math.floor(Date.now() / 1000) + (60 * 60)
            },
            JWT_SECRET_KEY,
            {
                algorithm: 'HS256'
            }
        );
        res.status(201).json({user: result, token: token});

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong'
        });
    }

}

const signin = async (req, res) => {

    
    const { email, password } = req.body;

    try {
        
        const existingUser = await userModel.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        } 

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        } 

        const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                sub: existingUser._id,
            },
            JWT_SECRET_KEY
        );
        res.status(201).json({
            user: existingUser,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong'
        });
    }

}

const decodeToken = (req, res)=>{
    let token = req.headers.authorization;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    let user = jwt.verify(token, JWT_SECRET_KEY);
    res.json({
        base64,
        user
    })
}

module.exports = { signup, signin, decodeToken };