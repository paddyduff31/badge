const express = require('express');
const router = express.Router();
const User = require('../models/user')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const baseURL = 'http://localhost:3000'

// Register User
router.post('http://localhost:3000/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg: 'Failed to register user'});
        } else {
            res.json({success: true, msg: 'User registered'});
        }
    })
});

// Authenticate
router.post('http://localhost:3000/authenticate', (req, res, next) => {
    
    const email = req.body.email
    const password = req.body.password

    User.getUserByEmail(email, (err, user) => {
        if (err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'})
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign(user.toJSON(), config.jwtSecret, {
                    expiresIn: 604800 // One Week
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user.__id,
                        name: user.name,
                        email: user.email,

                    }
                })

            } else {
                return res.json({success: false, msg: 'Wrong Password'})
            }
        })
    })
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user})
});


module.exports = router;