
var player;
var done = false;
var playerDiv = 'player';
var width = '800';
var height = '520';
var defaultID = 'zDzIQCnlgdo';
var videoArray = [];
var playerVars = {
    autoHide: 1,
    autoPlay: 0,
    showInfo: 0,
    rel: 0
};

function onPlayerReady(event) {
    console.log("Player is ready.", event);
    // event.target.playVideo();
}

function stopVideo() {
    console.log("Player is stopped.");
    player.stopVideo();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player(playerDiv, {
        height: height,
        width: width,
        videoId: defaultID,
        playerVars: playerVars,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    console.log("Loaded iframe API Player.");
}

$(function(){
    for (var i= 0,n=videoArray.length; i<n; i++) {
        console.log(i, videoArray[i].title);
        var btn = $("<button>").attr("class","btn btn-info").text(i).data("index", i);
        btn.click(function(e){
           var idx = $(this).data("index");
           var param = {
               "videoId": videoArray[idx].id,
               "startSeconds": 5,
               "suggestedQuality": "large"
           };
            player.cueVideoById(param);
        });
        $("#ytnav").append(btn);
    }
});