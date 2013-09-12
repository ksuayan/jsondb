db.trackdbs.mapReduce(
    function(){
        emit({"Album": this["Album"], "Artist": this["Artist"]}, this["Total Time"]);
    },
    function(key,values) {
        return (Array.sum(values));
    },
    {out: "ByTotalTime"}
);