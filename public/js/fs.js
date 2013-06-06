(function ($) {
    $.fn.fullscreen = function(options) {

        var settings = $.extend({
            front: "#bg-front",
            back: "#bg-back",
            bgHeightClass: 'bgheight',
            bgWidthClass: 'bgwidth',
            refreshInterval: 3000,
            images: ["images/image-001.png","images/image-002.png","images/image-003.png"]
        }, options);

        var theWindow = $(window),
            $bg = $(settings.front),
            windowAspect = theWindow.width()/theWindow.height(),
            imageAspect = $bg.width() / $bg.height(),
            intervalHandler = null,
            index = 0;

        var refreshImage = function() {
            if (index < settings.images.length - 1) {
                index++;
            } else {
                index = 0;
            }
            $bg.attr("src", settings.images[index]);
        };

        var setRefreshInterval = function() {
            if (!intervalHandler) {
                intervalHandler = setInterval(refreshImage, settings.refreshInterval);
            }
        };

        function resizeBackgound() {
            windowAspect = theWindow.width()/theWindow.height();
            if (windowAspect < imageAspect) {
                $bg.removeClass().addClass(settings.bgHeightClass);
            } else {
                $bg.removeClass().addClass(settings.bgWidthClass);
            }
        }
        theWindow.resize(resizeBackgound).trigger("resize");
        setRefreshInterval();
        return this;
    };
}(jQuery));


