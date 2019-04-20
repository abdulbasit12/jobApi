const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')
const lodash = require('lodash');
const async = require('async');
const firebase = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey');
var fs = require('file-system');

//Bring in Model
let Job = require('../models/job');
let Department = require('../models/department');
let User = require('../models/user');

//set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
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
// .single('myImage');
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

router.post('/upload', upload.single('img'), (req, res) => {
    // upload(req, res, (err) => {
    //     if(err){
    //         res.send(err)
    //     } else if(req.file == undefined){
    //         res.send({message: 'select image'});
    //     } else{
    //         console.log(req.file.path)
    //         res.send({message: 'success', file : `uploads/${req.file.filename}`})
    //     }
    // })
    res.json({ file: req.file.path })
    console.log(req.file.path);

})

//Init Firebase
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://jobapi-ae2a1.firebaseio.com"
});

router.get('/job', function (req, res) {
    Department.find({}, function (err, dept) {
        if (err) {
            res.send(err);
        } else {
            res.render('addjob', {
                title: 'Create Job',
                dept: dept,
                // user: user
            })
        }
    })
});


//Submit Form
router.post('/job', upload.single('img'), function (req, res) {
    // req.checkBody('jobname', 'Job Name is required').notEmpty();
    // req.checkBody('departmentId', 'Department is required').notEmpty();
    // req.checkBody('building', 'Building is required').notEmpty();
    // req.checkBody('floor', 'Floor is required').notEmpty();
    // req.checkBody('room', 'Room is required').notEmpty();
    // req.checkBody('instructions', 'Specific info is required').notEmpty();
    // req.checkBody('priority', 'Priority is required').notEmpty();
    // req.checkBody('deadline', 'Deadline is required').notEmpty();
    // req.checkBody('filestatus', 'File Status is required').notEmpty();
    // req.checkBody('creatername', 'Creater Name is required').notEmpty();
    // req.checkBody('workername', 'Worker Name is required').notEmpty();

    //let errors = req.validationErrors();
    // if (errors) {
    //     res.render('addjob', {
    //         title: 'Create Job',
    //         errors: errors
    //     })
    // } else {}
    let job = new Job({ ...req.body, imgpath: req.file.path });
    job.save(function (err, postedJob) {
        if (err) {
            console.log(err);
            return;
        } else {
            var JobId = postedJob._id + '';
            var topic = 'job_posted';
            var message = {
                notification: {
                    title: 'New Job Posted',
                    body: 'Admin posted the new job'
                },
                data: {
                    'jobId': JobId
                },
                topic: topic
            };
            firebase.messaging().send(message)
                .then((res) => {
                    console.log('success:', res);
                })
                .catch((err) => {
                    console.log('error:', err);
                });
            res.send({ message: 'success', jobId: postedJob })
        }
    })
});

//Load Edit Job form
router.get('/edit/:id', function (req, res) {
    Job.findById(req.params.id, function (err, job) {
        if (err) {
            res.send(err);
        } else {
            res.send({ message: 'success', job: job })
        }
    })
})

//Update Job
router.post('/edit/:id', function (req, res) {
    let job = req.body;
    let query = { _id: req.params.id }
    Job.updateOne(query, job, function (err) {
        Job.findById(req.params.id, (err, getJob) => {
            var JobId = req.params.id + '';
            if (getJob.filestatus === 'accepted') {
                console.log(getJob.filestatus)
                var topic = 'job_accepted_' + JobId;
                console.log(topic);
                var message = {
                    notification: {
                        title: 'Job Accepted',
                        body: 'Worker Accepted your job'
                    },
                    data: {
                        'jobId': JobId
                    },
                    topic: topic
                };
                firebase.messaging().send(message)
                    .then((res) => {
                        console.log('success:', res);
                    })
                    .catch((err) => {
                        console.log('error:', err);
                    });
            }
            if (getJob.filestatus === 'completed') {
                console.log(getJob.filestatus)
                var topic = 'job_completed_' + JobId;
                var message = {
                    notification: {
                        title: 'Job Completed',
                        body: 'Job has been completed'
                    },
                    data: {
                        'jobId': JobId
                    },
                    topic: topic
                };
                firebase.messaging().send(message)
                    .then((res) => {
                        console.log('success:', res);
                    })
                    .catch((err) => {
                        console.log('error:', err);
                    });
            }
            if (getJob.filestatus === 'canceled') {
                console.log(getJob.filestatus)
                var topic = 'job_canceled_' + JobId;
                var message = {
                    notification: {
                        title: 'Job canceled',
                        body: 'Job has been canceled'
                    },
                    data: {
                        'jobId': JobId
                    },
                    topic: topic
                };
                firebase.messaging().send(message)
                    .then((res) => {
                        console.log('success:', res);
                    })
                    .catch((err) => {
                        console.log('error:', err);
                    });
            }
            if (getJob.filestatus === 'started') {
                console.log(getJob.filestatus)
                var topic = 'job_started_' + JobId;
                var message = {
                    notification: {
                        title: 'Job Started',
                        body: 'Job has been Started'
                    },
                    data: {
                        'jobId': JobId
                    },
                    topic: topic
                };
                firebase.messaging().send(message)
                    .then((res) => {
                        console.log('success:', res);
                    })
                    .catch((err) => {
                        console.log('error:', err);
                    });
            }
        })
        if (err) {
            res.send(err)
        } else {
            res.send({ message: 'success', job })
        }
    })
})

//Delete Job
router.delete('/:id', function (req, res) {
    let query = { _id: req.params.id }
    Job.findById(req.params.id, function () {
        Job.remove(query, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send({ message: 'success' });
            }
        })
    })
})

//View Job
router.get('/:id', function (req, res) {
    Job.findById(req.params.id, function (err, jobs) {
        if (err) {
            res.send(err);
        } else {
            const query = { 'name': jobs.workername }
            User.findOne(query, { phone: true, email: true, profession: true }, (err, user) => {
                res.json({ user, jobs })
            })
        }
    });
})


//view pending, completed, started, accepted, canceled jobs
router.get('/', (req, res) => {
    Job.find({}).sort({ deadline: 1 }).exec((err, pendingJob) => {
        if (err) {
            res.send({ message: 'failed' })
        } else {
            var pending = lodash.filter(pendingJob, x => x.filestatus === 'pending')
            var completed = lodash.filter(pendingJob, x => x.filestatus === 'completed')
            var open = lodash.filter(pendingJob, x => x.filestatus === 'started' || x.filestatus === 'accepted')
            var canceled = lodash.filter(pendingJob, x => x.filestatus === 'canceled')
            res.send({ pending, completed, open, canceled })
        }
    })
})

module.exports = router;