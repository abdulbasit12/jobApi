const express = require('express');
const router = express.Router();

//Bring in Model
let Building = require('../models/building');

//Submit Form
router.post('/add', (req,res) => {
    let building = new Building(req.body);
    building.save((err, building) => {
        if(err){
            res.json({err})
        } else {
            res.json({message: 'success', building})
        }
    })
})

//load edit form
router.get('/edit/:id', (req, res) => {
    Building.findById(req.params.id, (err, building) => {
        if(err) {
            res.json({err})
        } else {
            res.json({message: 'success', building})
        }
    })
})

//update record
router.post('/edit/:id', (req, res) => {
    let query = {_id: req.params.id}
    let building = req.body
    Building.updateOne(query, building, (err) => {
        if(err) {
            res.json({err})
        } else {
            res.json({message:'success'})
        }
    })
})

//delete record
router.delete('/:id', (req, res) => {
    let query = {_id: req.params.id}
    Building.deleteOne(query, (err) => {
        if(err) {
            res.json({err})
        } else {
            res.json({message: 'success'})
        }
    })
})

//List Buildings
router.get('/', (req, res) => {
    Building.find({}, (err, building) => {
        if (err) {
            res.json({ err })
        } else {
            res.json({ message: 'success', building })
        }
    })
})


module.exports = router;