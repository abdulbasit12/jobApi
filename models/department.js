let mongoose = require('mongoose');

const deptSchema = mongoose.Schema({
    deptId:{
        type: Number,
        required: true
    },
    deptname: {
        type: String,
        required: true
    },
})

let Department = mongoose.model('Department', deptSchema);
module.exports = Department;