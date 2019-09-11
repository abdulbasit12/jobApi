const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const lodash = require('lodash');
const multer = require('multer');
const path = require('path')

//Bring User Model
let User = require('../models/user');
let Job = require('../models/job');
let Department = require('../models/department');


//set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/profile Pictures',
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

//Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback)
    }
})
checkFileType = (file, callback) => {
    const fileType = /jpeg|jpg|png|gif/;
    const extname = fileType.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileType.test(file.mimetype);
    if (mimetype && extname) {
        return callback(null, true)
    } else {
        callback('Error: Images Only!')
    }
}

// Register Process
router.post('/register', upload.single('profilePicture'), function (req, res) {
    const { email, name } = req.body;
    User.findOne({ email, name }, (err, user) => {
        if (err) {
            return res.status(422).json({ err })
        }
        if (user) {
            return res.json({ message: 'User Already Exists' })
        } else {
            var newUser
            if (req.file) {
                var path = req.file.destination + '/' + req.file.filename
                newUser = new User({ ...req.body, profilePicture: path });
            } else {
                newUser = new User(req.body);
            }
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) {
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save((err) => {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            res.send({ message: 'you are registered' });
                        }
                    });
                });
            });
        }
    })

});

// // Login form
// router.get('/login', function (req, res) {
//     res.render('login');
// });

// get users
router.get('/userList', (req, res, next) => {
    User.find({}, (err, user) => {
        if (err) {
            res.send(err)
        } else {
            var worker = lodash.filter(user, x => x.role == 'Worker')
            var deptAdmin = lodash.filter(user, x => x.role == 'Department Admin')
            var User = lodash.filter(user, x => x.role == 'User')
            res.json({ message: 'success', worker, deptAdmin, User })
        }
    })
})

//load edit form
router.get('/edit/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.send({ message: 'success', user: user })
        }
    })
})

//update edit form
router.post('/edit/:id', (req, res) => {
    let user = req.body;
    let query = { _id: req.params.id }
    User.updateOne(query, user, (err) => {
        if (err) {
            res.send(err)
        } else {
            res.send({ message: 'success' })
        }
    })

})

//Delete user
router.delete('/:id', (req, res) => {
    let query = { _id: req.params.id }
    User.findById(req.params.id, () => {
        User.deleteOne(query, (err) => {
            if (err) {
                res.send({ message: 'failed' })
            } else {
                res.send({ message: 'success' })
            }
        })
    })
})

//Login Process
router.post('/login', function (req, res, next) {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).send({ message: 'Not a user' });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(422).send({ message: 'fail' });
            }
            return res.send({ message: 'success', role: user.role, userId: user._id, profession: user.profession })
        })
    })(req, res, next);
})

//Logout
router.get('/logout', function (req, res) {
    req.logout();
    res.send({ message: 'success' })
})

// View user profile
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        res.send({ user })
    })
})

//Change Password
router.post('/changePass/:id', (req, res) => {
    const { curPassword } = req.body;
    User.findById(req.params.id, (err, user) => {
        if (err) {
            return res.json({ err })
        } else {
            bcrypt.compare(curPassword, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.json({ message: 'Current Password is not Correct' })
                    } else {
                        let user = new User(req.body);
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(user.password, salt, (err, hash) => {
                                if (err) {
                                    res.json({ err })
                                } else {
                                    user.password = hash;
                                    let query = { _id: req.params.id }
                                    User.updateOne(query, { password: hash }, (err, test) => {
                                        if (err) {
                                            res.json({ err })
                                        } else {
                                            res.json({ message: 'Password Updated Successfully', test })
                                        }
                                    })
                                }
                            })
                        })
                    }
                })
        }
    })
})

//reset password
router.post('/resetPass/:id', (req, res) => {
    User.findById(req.params.id, (err) => {
        if (err) {
            res.json({ err })
        } else {
            var resetPass = '12345'
            let user = new User(req.body)
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(resetPass, salt, (err, hash) => {
                    if (err) {
                        res.json({ err })
                    } else {
                        resetPass = hash
                        let query = { _id: req.params.id }
                        User.updateOne(query, { password: hash }, (err, test) => {
                            if (err) {
                                res.json({ err })
                            } else {
                                res.json({ message: 'Reset Success', test })
                            }
                        })
                    }
                })
            })
        }
    })
})

//view department users
router.get('/dept_users/:id', (req, res) => {
    User.find({}, (err, allUser) => {
        if (err) {
            res.sendStatus(404).json({ err })
        } else {
            User.findById(req.params.id, (err, loggedUser) => {
                if (err) {
                    res.sendStatus(404).json({ err })
                } else {
                    var deptWorker = lodash.filter(allUser, x => x.role == 'Worker' && x.profession == loggedUser.profession)
                    var users = lodash.filter(allUser, x => x.role == 'User')
                    res.json({ deptWorker, users })
                }
            })
        }
    })
})

module.exports = router;