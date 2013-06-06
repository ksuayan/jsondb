
(function ($) {
    $.fn.fullscreen = function(options) {

        var settings = $.extend({
            front: "#bg-front",
            back: "#bg-back",
            bgHeightClass: 'bgheight',
            bgWidthClass: 'bgwidth',
            images: ["image-001.png","image-002.png", "image-003.png"]
        }, options);

        var theWindow = $(window),
            $bg = $(settings.front),
            aspectRatio = $bg.width() / $bg.height();

        function resizeBackgound() {
            if ((theWindow.width() / theWindow.height()) < aspectRatio) {
                $bg.removeClass().addClass(settings.bgHeightClass);
            } else {
                $bg.removeClass().addClass(settings.bgWidthClass);
            }
        }
        theWindow.resize(resizeBackgound).trigger("resize");
        return this;
    };

}(jQuery));


