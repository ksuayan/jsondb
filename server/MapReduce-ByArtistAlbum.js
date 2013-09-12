db.trackdbs.mapReduce(
    function(){
        emit({"Artist": this["Artist"], "Album": this["Album"]}, 1);
    },
    function(key,values) {
        return (Array.sum(values));
    },
    {out: "ByArtistAlbums"}
);

db.trackdbs.mapReduce(
    function(){
        emit(this["Artist"], 1);
    },
    function(key,values) {
        return (Array.sum(values));
    },
    {out: "ByArtists"}
);

db.trackdbs.mapReduce(
    function(){
        emit(this["Album"], 1);
    },
    function(key,values) {
        return (Array.sum(values));
    },
    {out: "ByAlbums"}
);
