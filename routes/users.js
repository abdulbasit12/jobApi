const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Bring User Model
let User = require('../models/user');
let Job = require('../models/job');
let Department = require('../models/department');


// Register Form
router.get('/register', function(req, res){
    Department.find({}, function (err, dept) {
        if (err) {
            res.send(err);
        } else {
            res.render('register', {
                dept: dept,
                // user: user
            })
        }
    })
});

// Register Process
router.post('/register', function(req, res){
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not Valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('gender', 'Gender is required').notEmpty();
    req.checkBody('phone', 'Phone No is required').notEmpty();
    req.checkBody('profession', 'Profession is required').notEmpty();
    req.checkBody('role', 'Role is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Confirm password is required').notEmpty();
    req.checkBody('password2', 'Confirm password do not matche to password').equals(req.body.password);

    let errors = req.validationErrors();
    if(errors){
        res.send({errors: errors});
    } else {
        let newUser = new User(req.body);
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    } else{
                        req.flash('success', 'You are now registered and can login');
                        // res.redirect('/users/login')
                        res.send({message: 'you are registered'});
                    }
                });
            });
        });
    }
});

// Login form
router.get('/login', function(req, res){
    res.render('login');
});

// get users
router.get('/userList', (req,res,next) => {
    User.find({}, (err, user) => {
        if(err){
            res.send(err)
        } else {
            res.send({message: 'success', user:user})
        }
    })
})

//load edit form
router.get('/edit/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err){
            res.send(err);
        } else {
            res.send({message: 'success', user: user})
        }
    })
})

//update edit form
router.post('/edit/:id', (req,res) => {
    let user = req.body;
    let query = {_id: req.params.id}
    User.updateOne(query, user, (err) => {
        if(err){
            res.send(err)
        } else{
            res.send({message: 'success'})
        }
    })

})

//Delete user
router.delete('/:id', (req, res) => {
    let query = {_id:req.params.id}
    User.findById(req.params.id, () =>{
        User.remove(query, (err) => {
            if(err){
                res.send({message: 'failed'})
            } else{
                res.send({message: 'success'})
            }
        })
    })
})

//Login Process
router.post('/login', function(req, res, next){
    passport.authenticate('local', (err, user) => {
        if(err) {
            return next(err);
        }
        if(!user) {
            return res.send({message: 'Not a user'});
        }
        req.logIn(user, function(err){
            if(err) {
                return res.send({message: 'fail'});
            }
            return res.send({message:'success', role: user.role, userId: user._id, profession: user.profession})
        })
    })(req, res, next);
})

// passport.authenticate('local', 
//     {
//         successRedirect: '/',
//         failureRedirect: '/login',
//         failureFlash: true
//     })(req, res, next);

// router.post('/', verifyToken, (req, res) =>{
//     jwt.verify(req.token, 'secretkey', (err, authData) => {
//         if(err){
//             res.sendStatus(403);
//         } else{
//             res.json({
//                 message: 'post created',
//                 authData
//             })
//         }
//     })
// })

// router.post('/login', function(req, res){
//     User.find({}, (err, user) => {
//         if(err){
//             res.sendStatus(403);
//         } else{
//             jwt.sign({user}, 'secretkey', (err, token) => {
//                 console.log(user);
//                 res.render('index');
//             })
//         }
//     })
// });

//Logout
router.get('/logout', function(req, res){
    req.logout();
    //req.flash('success', 'You are logged out');
    res.send({message: 'success'})
})

// View user profile
router.get('/:id', function(req, res){
    Job.find({}, function(err, createdjobs){
        res.render('user_profile',{
            job_created:'Your Created Jobs',
            task:'Your Tasks',
            createdjobs: createdjobs
        });
    })
})

// function verifyToken(req, res, next){
//     const bearerHeader = req.headers['authorization'];
//     if(typeof bearerHeader !== 'undefined'){
//         const bearer = bearerHeader.split(' ');
//         const bearerToken = bearer[1];
//         req.token = bearerToken;
//         next();
//     } else{
//         res.sendStatus(403);
//     }
// }
module.exports = router;