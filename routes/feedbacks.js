const express = require('express');
const router = express.Router();

let Feedback = require('../models/feedback');

//view form
router.get('/add', function (req, res) {
    res.render('add_feedback', {
        title:'Feedback',
    })
});

router.post('/add', function(req, res){
    req.checkBody('username', 'User name is required').notEmpty();
    req.checkBody('feedback', 'Feedback is required').notEmpty();
    let feedback = new Feedback(req.body);
    feedback.save(function(err){
        if(err){
            res.send(err);
        } else{
            req.flash('success', 'Feedback Submitted successfully');
            res.redirect('/')
        }
    })
})

router.get('/feedbackList', (req,res,next) => {
    Feedback.find({}, (err, feeds) => {
        if(err){
            res.send(err);
        } else {
            res.send({message: 'success', feeds: feeds})
        }
    })
})

router.delete('/:id', (req, res, next) => {
    let query = {_id:req.params.id}
    Feedback.findById(req.params.id, () => {
        Feedback.remove(query, (err) => {
            if(err){
                res.send(err)
            } else {
                res.send({message: 'success'})
            }
        })
    })
})

module.exports = router;