const express = require('express');
const router = express.Router();

//Bring in Model
let Department = require('../models/department');

//Load Add Form
// router.get('/add', function (req, res) {
//     res.render('add_dept', {
//         title: 'Add Department'
//     })
// })

//Submit Form
router.post('/add', function (req, res) {
    req.checkBody('deptname', 'Department Name is required').notEmpty();
    Department.find({})
        .then((deparment) => {
            var deptId = deparment.length + 1
            let department = new Department({ ...req.body, deptId: deptId });
            department.save(function (err) {
                if (err) {
                    res.status(422).json({ error: err });
                } else {
                    res.json({ message: 'success' })
                }
            })
        }).catch(err => {
            res.status(422).json({ error: err })
        })
})

//Load Edit Form
router.get('/edit/:id', function (req, res) {
    Department.findById(req.params.id, function (err, dept) {
        if (err) {
            res.send(err);
        } else {
            // res.render('edit_dept', {
            //     title: 'Edit Department',
            //     dept: dept
            // })
            res.send({ message: 'success', dept: dept })
        }
    })
});

//Update Department
router.post('/edit/:id', function (req, res) {
    let dept = req.body;
    let query = { _id: req.params.id }
    Department.updateOne(query, dept, function (err) {
        if (err) {
            req.send(err)
        } else {
            req.flash('success', 'deparment updated Successfully');
            res.send({ message: 'success' })
        }
    })
})

//Delete Department
router.delete('/:id', function (req, res) {
    let query = { _id: req.params.id }
    Department.findById(req.params.id, function () {
        Department.remove(query, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send({ message: 'success' })
            }
        })
    })
})

//View Departments
router.get('/:id', function (req, res) {
    Department.findById(req.params.id, function (err, dept) {
        if (err) {
            res.send(err);
        } else {
            // res.render('department', {
            //     dept: dept
            // })
            res.send({ dept: dept })
        }
    })
});



module.exports = router;