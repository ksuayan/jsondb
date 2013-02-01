var mongoose = require('mongoose');
    
var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;

var TrackItem = new Schema({
    "Track ID" : {type: Number},
    "Name" : {type: String},
    "Artist" : {type: String},
    "Album" : {type: String},
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
    mongoose.connect('mongodb://localhost/itunes');
    mongoose.set('debug', true);
    this.db = mongoose.connection;
    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', function callback () {console.log("Connected.")});

    
    this.TrackDbModel = this.db.model('trackdbs', TrackItem);
    this.genreCollection = mongoose.model('genres', new Schema({"_id":String, "value": Number}));        
    
    // console.log(this.genreCollection);
};

TrackDB.prototype.GetTrack = function(request, response) {
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

TrackDB.prototype.GetTrackList = function(request, response) {
    var result = {status:"error"};
    var query = { "Genre": "Alternative/Punk" };
    var fields = {"Name":1,"Artist":1,"Genre":1};
    var allfields = {};
    var pagination = {skip:0, limit:20};
    
    console.log("getTrackList");
    
    trackdb.TrackDbModel.find(query, allfields, pagination,
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

TrackDB.prototype.GetGenre = function(request, response) {
    var result = {status:"error"};
    
    trackdb.genreCollection.find({}, {}, {skip:0, limit:20}, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            result = {status : "ok", result : data };
        }
        console.log("found", data.length);
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
