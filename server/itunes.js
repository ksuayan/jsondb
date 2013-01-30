var mongoose = require('mongoose');
    
var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var TrackItem = new Schema({
    "Track ID" : {type: Number},
    "Name" : {type: String},
    "Artist" : {type: String},
    "Genre" : {type: String},
    "Kind" : {type:String},
    "Size" : {type: Number},
    "Total Time" : {type: Number},
    "Date Modified" : {type: Date},
    "Date Added" : {type: Date},
    "Bit Rate" : {type: Number},
    "Sample Rate" : {type: Number},
    "Normalization" : {type: Number},
    "Persistent ID" : {type:String},
    "Track Type" : {type:String},
    "Location" : {type:String}
});

var TrackDB = function(){
    console.log("Initialized TrackDB.");
    this.db = mongoose.createConnection('mongodb://localhost/itunes');
    this.TrackDbModel = this.db.model('trackdbs', TrackItem);
};

TrackDB.prototype.getTrack = function(request, response) {
    var result = {status:"error"};
    if (typeof request.params.id != 'undefined') {
        var query = { _id: request.params.id };
        trackdb.TrackDbModel.find(query, function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                result = {status : "ok", result : docs[0] };
            }
            response.send(result);
        });
    }
};

TrackDB.prototype.getTrackList = function(request, response) {
    var result = {status:"error"};
    var query = { "Genre": "Alternative/Punk" };
    var fields = {"Name":1,"Artist":1,"Genre":1};
    var pagination = {skip:0, limit:20};
    
    console.log("getTrackList");
    
    trackdb.TrackDbModel.find(query, fields, pagination,
        function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                result = {status : "ok", result : docs };
            }
            console.log("found", docs.length);
            response.send(result);
        });
};

TrackDB.prototype.close = function(){
    this.db.close(function() {
        console.log("DB Closed.");
    });
};

var trackdb = new TrackDB();
module.exports = trackdb;
