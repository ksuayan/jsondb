(function ($) {

    $.fn.search = function(options) {

        var that = this;

        var intervalHandler = null;
        var previousTerm = null;

        var settings = $.extend({
            input: "search-field",
            results: "search-results",
            minchars: 4,
            requestInterval: 2000
        }, options);

        var showTracks = function(collectionName, data) {
            var tracks = data.tracks;

            if (data["count"] && tracks && tracks.length){
                var heading = "<div class='heading'>"
                    + collectionName + ": " + data["count"]
                    + "</div>";
                that.resultsDiv.append(heading);
                for(var i= 0,n=tracks.length; i<n; i++) {
                    var track = "<div class='track'>"
                        + "<div class='title'>"+tracks[i]["Name"]+"</div>"
                        + "<div class='artist'>"+tracks[i]["Artist"]+"</div>"
                        + "<div class='album'>"+tracks[i]["Album"]+"</div>"
                        + "</div>";
                    that.resultsDiv.append(track);
                }
            }
        };

        var hideResults = function() {
            that.resultsDiv.empty();
            that.resultsDiv.hide();
        };

        var showResults = function(response) {
            that.resultsDiv.show();
            var keys = response.keys;
            that.resultsDiv.empty();

            if (response.total) {
                var found = "<div class='found'>Found: "
                    + response.total + "</div>";
                that.resultsDiv.append(found);
                for (var i=0,n=keys.length;i<n;i++){
                    var collectionName = keys[i];
                    var data = response["data"][collectionName];
                    showTracks(collectionName, data);
                }
            } else {
                that.resultsDiv.append("<div class='none-found'>No results found.</div>");
            }
        };

        var requestQuery = function() {
            var term = that.searchInput.val().trim();
            if (term.length<settings.minchars) {
                console.log("too short");
                hideResults();
                return;
            }
            if (term === previousTerm) {
                console.log("unchanged:", term);
                return;
            }
            console.log("new query:", term);
            previousTerm = term;

            var url = "/multi-search/"+term;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function(response,status,jqxhr) {
                    console.log("success:", status);
                    showResults(response);
                }
            });
        };

        /*
        var handleKey = function(event) {
            requestQuery();
        };
        */

        var init = function() {
            that.searchInput = $("#"+settings.input);

            // that.searchInput.keydown(handleKey);

            if (!intervalHandler) {
                intervalHandler = setInterval(requestQuery, settings.requestInterval);
            }
            that.searchInput.after("<div id=\'"+settings.results+"\'></div>");
            var pos = that.searchInput.position();
            var width = that.searchInput.outerWidth(true);
            var height = that.searchInput.outerHeight(true);
            that.resultsDiv = $("#"+settings.results);
            that.resultsDiv.css({
                position: "absolute",
                top: (pos.top+height+10)+"px",
                left: pos.left+"px",
                width: width+"px",
                height: "600px"
            });
            that.resultsDiv.hide();
        };
        init();
        return this;
    };
}(jQuery));


