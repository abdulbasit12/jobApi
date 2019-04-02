const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const multer = require('multer');
const path = require('path')
const lodash = require('lodash');
const async = require('async');

//Bring in Model
let Job = require('../models/job');
let Department = require('../models/department');
let User = require('../models/user');

//Add Job form
// function getuser(){
//     User.find({}, (err, user) => {
//         if(err){
//             res.send(err);
//         } else{
//             return user;
//         }
//         console.log(user);
//     })
// }

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

    // var locals = {}
    // var getdata = [
    // function(callback){
    //     Department.find({}, function (err, dept) {
    //         if (err) {
    //             res.send(err);
    //         } else {
    //             locals.dept = dept;
    //             callback();
    //         }
    //     })
    // },
    // function(callback){
    //     User.find({}, function(err, user){
    //         if(err){
    //             res.send(err);
    //         } else{
    //                 locals.user = user;
    //                 callback();
    //             }
    //         })
    //     }
    // ];
    // async.parallel(getdata, function(err){
    //     if(err){
    //         res.send(err);
    //     } else{
    //     res.render('addjob', {
    //             title:'Create Job',
    //             dept: locals.dept,
    //             user: locals.user
    //         })
    //     }
    // })
});

//Submit Form
router.post('/job', function (req, res) {
    req.checkBody('jobname', 'Job Name is required').notEmpty();
    req.checkBody('departmentId', 'Department is required').notEmpty();
    req.checkBody('building', 'Building is required').notEmpty();
    req.checkBody('floor', 'Floor is required').notEmpty();
    req.checkBody('room', 'Room is required').notEmpty();
    req.checkBody('instructions', 'Specific info is required').notEmpty();
    req.checkBody('priority', 'Priority is required').notEmpty();
    req.checkBody('deadline', 'Deadline is required').notEmpty();
    req.checkBody('filestatus', 'File Status is required').notEmpty();
    req.checkBody('creatername', 'Creater Name is required').notEmpty();
    req.checkBody('workername', 'Worker Name is required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        res.render('addjob', {
            title: 'Create Job',
            errors: errors
        })
    } else {
        let job = new Job(req.body);
        job.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Job added successfully');
                res.send({ message: 'job posted' })
            }
        })
    }
    // let job = new Job(req.body);
    // console.log(job);
    // res.redirect('/');
});

//Load Edit Job form
router.get('/edit/:id', function (req, res) {
    Job.findById(req.params.id, function (err, job) {
        if (err) {
            res.send(err);
        } else {
            // res.render('edit_job', {
            //     title: 'Edit Job',
            //     job: job
            // });
            res.send({ message: 'success', job: job })
        }
    })
})

//Update Job
router.post('/edit/:id', function (req, res) {
    let job = req.body;
    let query = { _id: req.params.id }
    Job.updateOne(query, job, function (err) {
        if (err) {
            res.send(err)
        } else {
            //req.flash('success', 'Job updated successfully');
            res.send({ message: 'success' });
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
        console.log(jobs);
        if (err) {
            res.send(err);
        } else {
            res.render('job', {
                jobs: jobs
            });
        }
    });
})


//view pending and completed jobs
router.get('/', (req, res) => {
    var locals = [];
    var jobStatus = [
        (callback) => {
            Job.find({}, (err, pendingJob) => {
                if (err) {
                    res.send({ message: 'failed' })
                } else {
                    var pending = lodash.filter(pendingJob, x => x.filestatus === 'pending')
                    locals.pending = pending;
                    callback();
                }
            })
        },
        (callback) => {
            Job.find({}, (err, completedJob) => {
                if (err) {
                    res.send(err)
                } else {
                    var completed = lodash.filter(completedJob, x => x.filestatus === 'completed')
                    locals.completed = completed;
                    callback();
                }
            })
        }
    ];
    async.parallel(jobStatus, (err) => {
        if (err) {
            res.send(err)
        } else {
            res.send({ pending: locals.pending , completed: locals.completed })
        }
    })
})

//Update job Status
router.post(':id', (req, res) => {

})

module.exports = router;