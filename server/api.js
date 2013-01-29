var jsondb = require('./jsondb');

var JsonHandler = function() {
    console.log("Initialized JSON API handler");
};

JsonHandler.prototype.GetDocument = function(request, response) {
    var result = {status:"error"};
    if (typeof request.params.id != 'undefined') {
        var query = { _id: request.params.id };
        jsondb.JsonDbModel.find(query, function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                result = {status : "ok", result : docs[0] };
            }
            response.send(result);
        });
    }
};

JsonHandler.prototype.SaveDocument = function(request, response) {
    var doc = {
        title : request.body.title,
        body : request.body.body
    };
    var instance = new jsondb.JsonDbModel(doc);
    instance.save();
    response.send({status:"ok"});
};


module.exports = new JsonHandler();