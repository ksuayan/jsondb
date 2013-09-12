db.trackdbs.mapReduce(
    function(){
        emit(this["Year"], 1);
    },
    function(key,values) {
        return (Array.sum(values));
    },
    {out: "ByYear"}
);