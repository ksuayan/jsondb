var Keys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
};

var Pointer = {
    DOWN: 'mousedown',
    UP: 'mouseup',
    MOVE: 'mousemove'
};


function Game(canvas,game, gridSizeW, gridSizeH) {
    this.started = true;
    this.gameContainer = game;
    this.canvas = canvas;
    this.c = canvas.getContext('2d');
    this.grid = { width: gridSizeW, height: gridSizeH };
    this.tileMap = [];
    this.scrollPosition = {x:0,y:0};
}

Game.prototype.handleKeyDown = function(e) {
    switch(e.keyCode) {
        case Keys.UP:
            console.debug("up");
            break;
        case Keys.DOWN:
            console.debug("down");
            break;
        case Keys.LEFT:
            console.debug("left");
            break;
        case Keys.RIGHT:
            console.debug("right");
            break;
    }

    this.draw();
}

Game.prototype.draw = function() {
    console.debug("draw..");
};


window.onload = function() {
    var canvas = document.getElementById('world');
    var c = canvas.getContext('2d');
    var game = document.getElementById('game');
    var g = new Game(canvas, game, 500, 500);


    canvas.addEventListener('mousemove', move, false);
    console.debug("Initialized.");
    document.body.addEventListener('keydown', function(e){g.handleKeyDown(e);})


    var move = function(e) {

        var img = c.getImageData(e.clientX, e.clientY,1,1);
        var idata = img.data;
        var red = idata[0];
        var green = idata[1];
        var blue = idata[2];
        var alpha = idata[3];

        console.debug("pixeldata", red,green,blue,alpha);
    }


}