const User = require('../models/auth.model')
const expressJwt = require('express-jwt')

exports.readController = (req, res) => {
    const userId = req.params.Id
    User.findById(userId).exec((err, user) => {
        if (err || !user) {
            return res.status.json({ error:'User not found' });
        }
        user.hash_password = undefined;
        user.salt = undefined;
        res.json(user);
    });
}

exports.updateController = (req, res)=>{
    const {name, password} = req.body;
    User.findOne({_id: req.user._id}, (err, user) =>{
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            })
        } else {
            user.name = name
        }
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be minimum 6 characters'
                })
            } else {
                user.password = password
            }
        }
        user.save((err, updateUser) => {
            if (err) {
                console.log('User update error', err);
                return res.status(400).json({
                    error: 'User update failed'
                })
            }
        })
        updateUser.hash_password = undefined;
        updateUser.salt = undefined
        res.json(updateUser)
    })
}