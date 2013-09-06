(function ($) {

    $.fn.search = function(options) {

        var that = this;

        var settings = $.extend({
            input: "search-field",
            results: "search-results",
            minchars: 3,
            throttle: 1000
        }, options);

        var showTracks = function(collectionName, data) {
            var tracks = data.tracks;

            if (data["count"] && tracks && tracks.length){
                that.resultsDiv.append("<div class='heading'>"+collectionName+"</div>");
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

        var showResults = function(response) {
            that.resultsDiv.show();
            var keys = response.keys;
            that.resultsDiv.empty();
            for (var i=0,n=keys.length;i<n;i++){
                var collectionName = keys[i];
                var data = response["data"][collectionName];
                showTracks(collectionName, data);
            }

        };

        var requestQuery = function() {
            var term = that.searchInput.val().trim();
            console.log("length", term, settings.minchars);
            if (term.length<settings.minchars) {
                that.resultsDiv.empty();
                that.resultsDiv.hide();
                return;
            }
            var url = "/multi-search/"+term;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function(response,status,jqxhr) {
                    showResults(response);
                }
            });
        };

        var handleKey = function(event) {
            requestQuery();
        };

        var init = function() {
            that.searchInput = $("#"+settings.input);
            that.searchInput.keydown(handleKey)
            that.searchInput.after("<div id=\'"+settings.results+"\'></div>");
            var pos = that.searchInput.position();
            var width = that.searchInput.outerWidth(true);
            var height = that.searchInput.outerHeight(true);
            that.resultsDiv = $("#"+settings.results);
            that.resultsDiv.css({
                position: "absolute",
                top: (pos.top+height)+"px",
                left: pos.left+"px",
                width: width+"px",
                height: "500px"
            });
            that.resultsDiv.hide();
        };

        init();

        return this;
    };
}(jQuery));


