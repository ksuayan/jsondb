"use strict";

var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
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

var iTunesDB = function(){
    var that = this;
    console.log("Initialized iTunesDB.");
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
    this.db.once('open', function(){
        console.log("Mongoose Connected.");
    });
    this.db.once('close', function(){
        console.log("Closing.");
        that.close();
    });

    this.TrackDbModel = this.db.model('trackdbs', TrackItem);

    MongoClient.connect(conf.app.mongoURL, {}, function(err, db){
        console.log("MongoDB Connected.", err);
        that.mongodb = db;
    });
};

iTunesDB.prototype.GetTrack = function(request, response) {
    var result = {status:"error"};
    if (typeof request.params.id != 'undefined') {
        var query = { _id: request.params.id };
        itunesDB.TrackDbModel.find(query, {}, itunesDB.pagination, function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                result = {status : "ok", result : docs[0] };
            }
            response.send(result);
        });
    }
};

iTunesDB.prototype.GetTrackList = function(request, response) {
    var result = {status:"error"};
    var query = { "Genre": "Alternative/Punk" };
    var fields = {"Name":1,"Artist":1,"Genre":1};
    var allfields = {};
    itunesDB.TrackDbModel.find(query, allfields, itunesDB.pagination,
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

iTunesDB.prototype.SearchTerm = function(request, response) {
    var result = {status:"error"};
    var term = request.params.term;
    if (term && typeof term !== 'undefined') {
        var re = new RegExp(request.params.term, 'i');
		var stream = itunesDB.TrackDbModel.find({},
            itunesDB.fields,
            itunesDB.pagination)
            .or([
			    {'Name': {$regex:re}},
                {'Artist': {$regex:re}},
                {'Album': {$regex:re}}
            ])
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

iTunesDB.prototype.QueryByAttribute = function(term, queryProfile, onDataSuccess, onError) {
    if (term && queryProfile.attribute) {
        var docs = [];
        var query = {};
        var re = new RegExp(term, 'i'); // case insensitive
        query[queryProfile.attribute] = {$regex:re};

        var stream = itunesDB.TrackDbModel
            .find(query, queryProfile.fields, itunesDB.pagination)
            .sort(queryProfile.sortOrder)
            .stream();

        stream.on('data', function(doc){
            docs.push(doc);
        }).on('error', function(err){
            if (onError && typeof onError === 'function') {
                onError(queryProfile, err);
            }
        }).on('close', function(){
            if (onDataSuccess && typeof onDataSuccess === 'function') {
                onDataSuccess(queryProfile, docs);
            }
        });
    }
};


iTunesDB.prototype.QueryCollectionById = function(term, queryProfile, onDataSuccess, onError) {
    if (term) {
        var docs = [];
        var query = {};
        var re = new RegExp(term, 'i'); // case insensitive
        query["_id"] = {$regex:re};

        var collection = itunesDB.mongodb.collection(queryProfile.collection);
        var stream = collection.find(query)
            .sort(queryProfile.sortOrder)
            .stream();

        stream.on('data', function(doc){
            docs.push(doc);
        }).on('error', function(err){
            if (onError && typeof onError === 'function') {
                onError(queryProfile, err);
            }
        }).on('close', function(){
            if (onDataSuccess && typeof onDataSuccess === 'function') {
                onDataSuccess(queryProfile, docs);
            }
        });
    }
};

iTunesDB.prototype.SearchMultiCriteria = function(request, response) {
    var result = {status:"error"};
    var term = request.params.term;
    var sortOrder = {'Artist':1, 'Album':1};
    var resultObject = {keys:[],data:{}};
    var processed = 0; // implement this with timeouts.
    var queryProfiles = [
        // Search by Track Name
        {
            heading: "Tracks",
            attribute: "Name",
            fields: { "_id": 1, "Name": 1, "Artist": 1, "Album": 1, "Genre": 1, "Total Time": 1 },
            sortOrder: { 'Name': 1, 'Genre': 1, 'Artist': 1, 'Album': 1 },
            type: "find"
        },
        // Search by Distinct Artist Name
        {
            heading: "Artist/Musician",
            attribute: "Artist",
            collection: "ByArtists",
            sortOrder: { '_id': 1 },
            type: "collectionById"
        },
        // Search by Distinct Album Name
        {
            heading: "Album Name",
            attribute: "Album",
            collection: "ByAlbums",
            sortOrder: { '_id': 1 },
            type: "collectionById"
        }
    ];

    var total = 0;

    var onAllQueriesComplete = function() {
        resultObject.total = total;
        response.send(resultObject);
    };

    var onDataSuccess = function(queryProfile, data) {
        resultObject["keys"].push(queryProfile.attribute);
        resultObject["data"][queryProfile.attribute] = {
            "heading": queryProfile.heading,
            "type" : queryProfile.type,
            "count": data.length,
            "tracks" : data
        };
        processed++;
        total = total + ((data.length)?data.length:0);
        if (processed === queryProfiles.length) {
            onAllQueriesComplete();
        }
    };

    var onError = function(attribute, error) {
        processed++;
        if (processed === queryProfiles.length) {
            onAllQueriesComplete();
        }
    };

    var multiQuery = function () {
        if (typeof term !== 'undefined') {
            for (var i=0,n=queryProfiles.length; i<n; i++) {

                switch(queryProfiles[i]["type"]) {
                    case "find":
                        itunesDB.QueryByAttribute(term, queryProfiles[i], onDataSuccess, onError);
                        break;
                    case "collectionById":
                        itunesDB.QueryCollectionById(term, queryProfiles[i], onDataSuccess, onError);
                        break;
                    default:
                        console.log("unknown query type:", queryProfiles[i]["type"]);
                }
            }
        }
    };

    multiQuery();
};

iTunesDB.prototype.close = function(){
    this.db.close(function() {
        console.log("DB Closed.");
    });
};

var itunesDB = new iTunesDB();
module.exports = itunesDB;
