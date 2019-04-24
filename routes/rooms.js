const express = require('express');
const router = express.Router();

//Bring in Model
let Room = require('../models/room');

//Submit form
router.post('/add', (req, res) => {
    let room = new Room(req.body)
    room.save((err, room) => {
        if (err) {
            res.json({ err })
        } else {
            res.json({ message: 'success', room })
        }
    })
})

// get room
router.get('/edit/:id', (req, res) => {
    Room.findById(req.params.id, (err, room) => {
        if (err) {
            res.json({ err })
        } else {
            res.json({ message: 'success', room })
        }
    })
})

//update room
router.post('/edit/:id', (req, res) => {
    let query = { _id: req.params.id }
    let room = req.body
    Room.updateOne(query, room, (err) => {
        if (err) {
            res.json({ err })
        } else {
            res.json({ message: 'success' })
        }
    })
})

//delete room
router.delete('/:id', (req, res) => {
    let query = { _id: req.params.id }
    Room.deleteOne(query, (err) => {
        if (err) {
            res.json({ err })
        } else {
            res.json({ message: 'success' })
        }
    })
})

//List Floors
router.get('/', (req, res) => {
    Room.find({}, (err, room) => {
        if (err) {
            res.json({ err })
        } else {
            res.json({ message: 'success', room })
        }
    })
})

module.exports = router;