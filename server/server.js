<<<<<<< HEAD
var express = require('express');
var conf = require('./conf');
var jsondb = require('./jsondb');
var view = require('./view');
var api = require('./api');
var path = require('path');
var PORT = 80;
var app = express();

console.log(conf);

app.configure(function(){
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');
    // app.set('view options', {config : conf.app});
    app.locals({config:conf.app});
    app.use(express.bodyParser({uploadDir: '/tmp/test'}));
    app.use(express.static(path.join(__dirname,"../public")));
    app.use(express.favicon());
    app.use(express.cookieParser());
    app.use(express.session({secret : 'boyakasha'}));
    app.use(express.errorHandler({ 
        dumpExceptions : true,
        showStack : true}));
});

app.all("/", function(req, res, next) {
    console.log("all() ...");
    next();
});
app.get('/', function(req, res) {
    console.log("get: /");
    res.render('home');
});

// SVG View
app.get('/vector', view.NewVector);
app.get('/vector/:id', view.ViewVector);

// Web View
app.get('/jsondb', view.ListVectors);
app.get('/jsondb/:id', view.ListVectors);
app.post('/jsondb', view.ProcessForm);
app.delete('/jsondb/:id', view.FindAndRemove);

// API
app.get('/doc', api.GetDocument);
app.get('/doc/:id', api.GetDocument);
app.post('/doc', api.SaveDocument);

app.listen(PORT);
console.log('Go to http://localhost:' + PORT);
console.log('path: ', __dirname);
module.exports = app;
=======
var express = require('express');
var conf = require('./conf');
var jsondb = require('./jsondb');
var trackdb = require('./itunes');
var path = require('path');

var PORT = 80;

function getJsonDb(req, res) {
    jsondb.getJsonDb(req, function(result) {
        // console.log("result", result);
        res.render('listVectors', {jsondb : result });
    });
};

var app = express();

console.log(conf);

app.configure(function(){
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');
    
    // app.set('view options', {config : conf.app});
    app.locals({config:conf.app});
    app.use(express.bodyParser({uploadDir: '/tmp/test'}));
    app.use(express.static(path.join(__dirname,"../public")));
    app.use(express.favicon());
    app.use(express.cookieParser());
    app.use(express.session({secret : 'boyakasha'}));
    app.use(express.errorHandler({ 
        dumpExceptions : true,
        showStack : true}));
});

app.all("/", function(req, res, next) {
    console.log("all() ...");
    next();
});

app.get('/', function(req, res) {
    console.log("get: /");
    res.render('home');
});

app.get('/vector', function(req, res) {
    res.render('viewVector');
});
app.get('/vector/:id', function(req, res) {
    if (!req.params.id) {
       res.render('viewVector');
    } else {
        jsondb.getJsonDb(req, function(result) {
            res.render('viewVector', {doc : result[0] });
        });
    }
});

/*
 * Form Edit View
 */
app.get('/jsondb', getJsonDb);
app.get('/jsondb/:id', getJsonDb);
app.post('/jsondb', function(req, res) {
    jsondb.save({
        title : req.body.title,
        body : req.body.body
    });
    res.render('processForm');
});

app.delete('/jsondb/:id', function(req, res) {
    jsondb.JsonDbModel.findByIdAndRemove(req.params.id, function() {
        res.render('processForm'); 
    });
});

/*
 * JSON Views
 */
app.get('/doc', jsondb.getDocument);
app.get('/doc/:id', jsondb.getDocument);
app.post('/doc', jsondb.saveDocument);

app.get('/track', trackdb.getTrackList);
app.get('/track/:id', trackdb.getTrack);

app.listen(PORT);
console.log('Go to http://localhost:' + PORT);
console.log('path: ', __dirname);
module.exports = app;
>>>>>>> itunes db
