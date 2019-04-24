const express = require('express');
const router = express.Router();

//Bring in Model
let Floor = require('../models/floor');

//Submit form
router.post('/add', (req, res) => {
    let floor = new Floor(req.body)
    floor.save((err, floor) => {
        if (err) {
            res.json({ err })
        } else {
            res.json({ message: 'success', floor })
        }
    })
})

// get floor
router.get('/edit/:id', (req, res) => {
    Floor.findById(req.params.id, (err, floor) => {
        if (err) {
            res.json({ err })
        } else {
            res.json({ message: 'success', floor })
        }
    })
})

//update floor
router.post('/edit/:id', (req, res) => {
    let query = { _id: req.params.id }
    let floor = req.body
    Floor.updateOne(query, floor, (err) => {
        if (err) {
            res.json({ err })
        } else {
            res.json({ message: 'success' })
        }
    })
})

//delete floor
router.delete('/:id', (req, res) => {
    let query = { _id: req.params.id }
    Floor.deleteOne(query, (err) => {
        if (err) {
            res.json({ err })
        } else {
            res.json({ message: 'success' })
        }
    })
})

//List Floors
router.get('/', (req, res) => {
    Floor.find({}, (err, floor) => {
        if (err) {
            res.json({ err })
        } else {
            res.json({ message: 'success', floor })
        }
    })
})

module.exports = router;