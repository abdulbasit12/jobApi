let mongoose = require('mongoose');

//Job schema

let jobSchema = mongoose.Schema({
    jobname:{
        type: String,
        required: true
    },
    departmentId:{
        type: String,
        required: true
    },
    building:{
        type: String,
        required: true
    },
    room:{
        type: String,
        required: true
    },
    floor:{
        type: String,
        required: true
    },
    instructions:{
        type: String,
        required: true
    },
    deadline:{
        type: String,
        required: true
    },
    priority:{
        type: String,
        required: true
    },
    filestatus:{
        type: String,
        required: true
    },
    creatername:{
        type: String,
        required: true
    },
    workername:{
        type: String,
    },
    imgpath: {
        type: String,
    },
    createrId:{
        type: String,
        required: true
    }
});
let Job = mongoose.model('Job', jobSchema);
module.exports = Job;