$(function(){

    $.getJSON(
        "http://localhost/search/hello",
        {},
        function(data, status, xhr) {
            console.log("status", status);
            console.log("data", data);
        });
    
});
