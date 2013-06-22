$(window).load(function () {

    function zeroFill( number, width ) {
        width -= number.toString().length;
        if ( width > 0 ) {
            return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        }
        return number + ""; // always return a string
    }

    var images = [];
    for (var i=1;i<=28;i++) {
        var numStr = zeroFill(i,3);
        images.push("images/image-"+numStr+".jpg");
    }

    console.debug("images", images);

    $("body").fullscreen({
        refreshInterval: 15000,
        fadeOutTime: 1000,
        fadeInTime: 50,
        images: images
    });
});