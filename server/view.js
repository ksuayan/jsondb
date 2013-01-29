var jsondb = require('./jsondb');


var ViewHandler = function() {
    console.log("Initialized WebView handler");
};

ViewHandler.prototype.NewVector = function(req, res) {
    res.render('viewVector');
}

ViewHandler.prototype.ListVectors = function(req, res) {
    jsondb.getJsonDb(req, function(result) {
        res.render('listVectors', {jsondb : result });
    });
};

ViewHandler.prototype.ViewVector = function(req, res) {
    if (!req.params.id) {
       res.render('viewVector');
    } else {
        jsondb.getJsonDb(req, function(result) {
            res.render('viewVector', {doc : result[0] });
        });
    }
};

ViewHandler.prototype.SaveVector = function(req, res) {
    jsondb.save({
        title : req.body.title,
        body : req.body.body
    });
    res.render('processForm');
}

ViewHandler.prototype.DeleteVector = function(req, res) {
    jsondb.JsonDbModel.findByIdAndRemove(req.params.id, function() {
        res.render('processForm'); 
    });
}

module.exports = new ViewHandler();