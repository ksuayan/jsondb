var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var conf = require('./conf');
var jsondb = require('./jsondb');
var view = require('./view');
var api = require('./api');
var itunes = require('./itunes');
var path = require('path');

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

app.get('/ws', function(req, res) { res.render('ws'); });

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

// LocationsDB
app.get('/geo', api.GetLocations);
app.post('/geo', api.SaveLocation);


app.get('/search/:term', itunes.SearchTerm);
app.get('/multi-search/:term', itunes.SearchMultiCriteria);
app.get('/track', itunes.GetTrackList);
app.get('/track/:id', itunes.GetTrack);

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('boom', function (data) {
        console.log(data);
    });
});

server.listen(conf.app.port);
console.log('Go to http://localhost:' + conf.app.port);
console.log('path: ', __dirname);
module.exports = app;
