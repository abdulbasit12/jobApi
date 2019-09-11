const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')

//Bring in Model
let Floor = require('../models/floor');

//set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/floormaps',
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

//Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 3000000 },
    fileFilter: (req, file, callback) => {
        checkPDFFileType(file, callback)
    }
})
checkPDFFileType = (file, callback) => {
    const fileType = /pdf/;
    const extname = fileType.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileType.test(file.mimetype);
    if (mimetype && extname) {
        return callback(null, true)
    } else {
        callback('Error: PDF Only!')
    }
}

//Submit form
router.post('/add', upload.single('siteMap'), (req, res) => {
    var floor;
    if (req.file) {
        var path = req.file.destination + '/' + req.file.filename
        floor = new Floor({ ...req.body, siteMap: path })
    } else {
        floor = new Floor({...req.body, path: ''})
    }
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