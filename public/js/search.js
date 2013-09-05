(function ($) {

    $.fn.search = function(options) {

        var that = this;

        var settings = $.extend({
            input: "search-field",
            results: "search-results",
            throttle: 1000
        }, options);

        var showResults = function() {
            that.resultsDiv.show();
        };

        var handleKey = function(event) {
            if (event.which == 13) {
                event.preventDefault();
            }
            showResults();
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


