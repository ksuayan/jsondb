var express = require('express');
var conf = require('./conf');
var jsondb = require('./jsondb');
var view = require('./view');
var api = require('./api');
var trackdb = require('./itunes');
var path = require('path');

var app = express();

console.log(conf);

app.configure(function(){
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');
    app.locals({config:conf.app});
    app.use(express.bodyParser({uploadDir: '/tmp/test'}));
    app.use(express.static(path.join(__dirname,"../public")));
    app.use(express.favicon());
    app.use(express.cookieParser());
    app.use(express.session({secret : 'booyakasha'}));
    app.use(express.errorHandler({ 
        dumpExceptions : false,
        showStack : false}));
});

app.all("/", function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    next();
});

app.get('/', function(req, res) {
    res.render('home');
});

// SVG View
app.get('/vector', view.NewVector);
app.get('/vector/:id', view.ViewVector);

// Web View
app.get('/jsondb', view.ListVectors);
app.get('/jsondb/:id', view.ListVectors);
app.post('/jsondb', view.SaveVector);
app.delete('/jsondb/:id', view.DeleteVector);

// API
app.get('/doc', api.GetDocument);
app.get('/doc/:id', api.GetDocument);
app.post('/doc', api.SaveDocument);

app.get('/genre', trackdb.GetGenre);
app.get('/search/:term', trackdb.SearchTerm);
app.get('/track', trackdb.GetTrackList);
app.get('/track/:id', trackdb.GetTrack);


app.listen(conf.app.port);
console.log('Go to http://localhost:' + conf.app.port);
console.log('path: ', __dirname);
module.exports = app;
