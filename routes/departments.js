const express = require('express');
const router = express.Router();

//Bring in Model
let Department = require('../models/department');

//Load Add Form
router.get('/add', function(req, res){
    res.render('add_dept', {
        title:'Add Department'
    })
})

//Submit Form
router.post('/add', function(req, res){
    req.checkBody('deptId', 'Department ID is required').notEmpty();
    req.checkBody('deptname', 'Department Name is required').notEmpty();
    let department = new Department(req.body);
    department.save(function(err){
        if(err){
            res.send(err);
        } else{
            req.flash('success', 'Department added successfully');
            res.send({message: 'success'})
        }
    })
})

//Load Edit Form
router.get('/edit/:id', function(req, res){
    Department.findById(req.params.id, function(err, dept){
        if(err){
            res.send(err);
        } else{
            // res.render('edit_dept', {
            //     title: 'Edit Department',
            //     dept: dept
            // })
            res.send({message: 'success', dept : dept})
        }
    })
});

//Update Department
router.post('/edit/:id', function(req, res){
    let dept = req.body;
    let query = {_id:req.params.id}
    Department.updateOne(query, dept, function(err){
        if(err){
            req.send(err)
        } else{
            req.flash('success', 'deparment updated Successfully');
            res.send({message: 'success'})
        }
    })
})

//Delete Department
router.delete('/:id', function(req,res){
    let query = {_id:req.params.id}
    Department.findById(req.params.id, function(){
        Department.remove(query, function(err){
            if(err){
                res.send(err);
            } else{
                res.send({message: 'success'})
            }
        })
    })
})

//View Departments
router.get('/:id', function(req, res){
    Department.findById(req.params.id, function(err, dept){
        if(err){
            res.send(err);
        } else{
            // res.render('department', {
            //     dept: dept
            // })
            res.send({dept: dept})
        }
    })
});



module.exports = router;