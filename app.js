const express = require('express');
var cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database')
const async = require('async')
const lodash = require('lodash');



//mongodb connection
mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;

//Check connection
db.once('open', function () {
    console.log('DB connected');
})

//Check for DB errors
db.on('error', function (err) {
    console.log(err);
})

// Init App
const app = express();

//Allow access
app.use(cors())

//static folder
app.use(express.static('./public'))


//Bring in Model
let Job = require('./models/job');
let Department = require('./models/department');
let User = require('./models/user');
let Feedback = require('./models/feedback');

// Load View Engine
// app.engine('html', consolidate.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

//Express Messages Midleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))

//Passprot Config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
})

//Home Route
app.get('/', function (req, res, next) {
    var locals = [];
    var tasks = [
        (callback) => {
            Job.find({}, function (err, jobs) {
                if (err) {
                    res.send(err);
                } else {
                    var pending = lodash.filter(jobs, x => x.filestatus === 'pending')
                    var completed = lodash.filter(jobs, x => x.filestatus === 'completed')
                    locals.jobs = jobs;
                    locals.pending = pending;
                    locals.completed = completed
                    callback();
                }
            })
        },
        (callback) => {
            Department.find({}, function (err, dept) {
                if (err) {
                    res.send(err);
                } else {
                    locals.dept = dept;
                    callback();
                }
            })
        },
        (callback) => {
            User.find({}, (err, user) => {
                if (err) {
                    res.send(err);
                } else {
                    locals.user = user;
                    callback();
                }
            })
        },
        (callback) => {
            Feedback.find({}, (err, feed) => {
                if (err) {
                    res.send(err)
                } else {
                    locals.feed = feed;
                    callback();
                }
            })
        }
    ];
    async.parallel(tasks, function (err) {
        if (err) {
            res.send(err);
        } else {
            // res.render('index', {
            //     title: 'Jobs',
            //     title_dept: 'Departments',
            //     jobs: locals.jobs,
            //     dept: locals.dept,
            // });
            res.json({
                jobs: locals.jobs,
                dept: locals.dept,
                user: locals.user,
                feed: locals.feed,
                pending: locals.pending,
                completed: locals.completed
            })
        }
    });
});



//route files
let users = require('./routes/users');
let jobs = require('./routes/jobs');
let departments = require('./routes/departments');
let feedbacks = require('./routes/feedbacks');
app.use('/users', users);
app.use('/jobs', jobs);
app.use('/departments', departments);
app.use('/feedbacks', feedbacks);

// Start Server
app.listen(5000, function () {
    console.log('its port 5000');
})