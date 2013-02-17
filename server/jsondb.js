var mongoose = require('mongoose');
    
var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var Comment = new Schema({
    title     : {type: String, default: ""},
    body      : {type: String, default: ""},
    date      : {type: Date, default: Date.now}
});

var JsonDb = new Schema({
    title     : {type: String, default: "Untitled"},
    body      : {type: String, default: ""},
    comments  : [Comment],
    date      : {type: Date, default: Date.now}
});

var DocumentDB = function(){
    console.log("Initialized DocumentDB.");
    this.db = mongoose.createConnection('mongodb://itunes:itunes@linus.mongohq.com:10095/app12013897');
    this.JsonDbModel = this.db.model('JsonDb', JsonDb);
};

DocumentDB.prototype.getJsonDb = function(request, callback) {
    var result = null;
    var query = {};
    
    if (request.params.id) 
        query._id = request.params.id;
    
    this.JsonDbModel.find(query, function(err,docs){
        if (err) {
            console.log(err);
            return;
        }
        if (callback && typeof callback ==='function') {
            callback(docs);
        }
    });
};

DocumentDB.prototype.save = function(doc) {
    var instance = new this.JsonDbModel(doc);
    instance.save();
};

DocumentDB.prototype.close = function(){
    this.db.close(function() {
        console.log("DB Closed.");
    });
};

var jsondb = new DocumentDB();
module.exports = jsondb;
