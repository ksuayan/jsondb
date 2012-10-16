var express = require('express');
var conf = require('./conf');
var jsondb = require('./jsondb');
var path = require('path');

var PORT = 80;

function getJsonDb(req, res) {
    jsondb.getJsonDb(req, function(result) {
        console.log("result", result);
        res.render('form', {jsondb : result });
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

app.get('/jsondb', getJsonDb);
app.get('/jsondb/:id', getJsonDb);
app.post('/jsondb', function(req, res) {
    jsondb.save({
        title : req.body.title,
        body : req.body.body
    });
    res.render('processForm');
});

app.get('/doc', jsondb.getDocument);
app.get('/doc/:id', jsondb.getDocument);
app.post('/doc', jsondb.saveDocument);

app.listen(PORT);
console.log('Go to http://localhost:' + PORT);
console.log('path: ', __dirname);
module.exports = app;
