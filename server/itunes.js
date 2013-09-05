"use strict";

var mongoose = require('mongoose');
var conf = require('./conf');

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
    mongoose.connect(conf.app.mongoURL, {db:{safe:true}});

    this.pagination = {skip:0,pagination:10};
    this.fields = {
        "_id": 1,
        "Name": 1,
        "Artist": 1,
        "Album": 1,
        "Genre": 1,
        "Total Time": 1
    };

    this.db = mongoose.connection;
    this.db.on('error', console.error.bind(console, 'Connection error.'));
    this.db.once('open', function callback () {console.log("Connected.")});
    this.db.once('close', this.close);
    this.TrackDbModel = this.db.model('trackdbs', TrackItem);
    this.genres = this.db.model('genres', new Schema({"_id":String, "value": Number}));
};

TrackDB.prototype.GetTrack = function(request, response) {
    var result = {status:"error"};
    if (typeof request.params.id != 'undefined') {
        var query = { _id: request.params.id };
        trackdb.TrackDbModel.find(query, {}, trackdb.pagination, function(err, docs) {
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
    trackdb.TrackDbModel.find(query, allfields, trackdb.pagination,
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

TrackDB.prototype.SearchTerm = function(request, response) {
    var result = {status:"error"};
    var term = request.params.term;
    if (term && typeof term !== 'undefined') {
        var re = new RegExp(request.params.term, 'i');
		var stream = trackdb.TrackDbModel.find({}, trackdb.fields, trackdb.pagination).or([
			{'Name': {$regex:re}},
            {'Artist': {$regex:re}},
            {'Album': {$regex:re}}])
            .sort({'Artist':1, 'Album':1})
            .stream();
        var docs = [];
        stream.on('data', function(doc){
            docs.push(doc);
        }).on('error', function(err){
            console.log("error", err);
        }).on('close', function(){
            result = {status : "ok", result : docs };
			response.send(result);
        });
    }
};

TrackDB.prototype.QueryByAttribute = function(attribute, term, sortOrder, onDataSuccess, onError) {

    if (term && attribute) {
        // case insensitive
        var re = new RegExp(term, 'i');
        var docs = [];
        var query = {};
        query[attribute] = {$regex:re};

        var stream = trackdb.TrackDbModel
            .find(query, trackdb.fields, trackdb.pagination)
            .sort(sortOrder)
            .stream();

        stream.on('data', function(doc){
            docs.push(doc);
        }).on('error', function(err){
            if (onError && typeof onError === 'function') {
                onError(attribute, err);
            }
        }).on('close', function(){
            if (onDataSuccess && typeof onDataSuccess === 'function') {
                onDataSuccess(attribute, docs);
            }
        });
    }
};

TrackDB.prototype.SearchMultiCriteria = function(request, response) {
    var result = {status:"error"};
    var term = request.params.term;
    var sortOrder = {'Artist':1, 'Album':1};
    var resultObject = {};
    var processed = 0; // implement this with timeouts.
    var attributeList = ["Name","Artist","Album"];

    var onAllQueriesComplete = function() {
        console.log("processed:", processed);
        response.send(resultObject);
    };

    var onDataSuccess = function(attribute, data) {
        resultObject[attribute] = {
            "count": data.length,
            "tracks" : data
        };
        processed++;
        if (processed === attributeList.length) {
            onAllQueriesComplete();
        }
    };

    var onError = function(attribute, error) {
        processed++;
        if (processed === attributeList.length) {
            onAllQueriesComplete();
        }
    };

    var multiQuery = function () {
        if (typeof term !== 'undefined') {
            for (var i=0,n=attributeList.length; i<n; i++) {
                trackdb.QueryByAttribute(attributeList[i], term, sortOrder, onDataSuccess, onError );
            }
        }
    };

    multiQuery();

};

TrackDB.prototype.GetGenre = function(request, response) {
    var result = {status:"error"};
    trackdb.genres.find({}, {}, trackdb.pagination, function(err, data) {
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
