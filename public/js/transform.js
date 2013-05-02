$(function() {
    
    var paper = Raphael(20, 60, 800, 800);
    var attr = {"fill":"#ff0000", "stroke": "#333"}; 
    var rect = paper.rect(0,0,800,800);
    rect.attr({"fill":"#efefef", "stroke": "#333"});
    var set = paper.set();
    var rect1 = paper.rect(0,0, 100, 100).attr(attr);
    var rect2 = paper.rect(700,0, 100, 100).attr(attr);
    var rect3 = paper.rect(0,700, 100, 100).attr(attr);
    var rect4 = paper.rect(700,700, 100, 100).attr(attr);        

    var rad = Raphael.rad(30);
    var mat = Raphael.matrix(2, 0, 0, 2, -50, -50).toTransformString();
    var mat2 = Raphael.matrix(Math.cos(rad), Math.sin(rad), Math.sin(rad) * -1 , Math.cos(rad), 50, 50).toTransformString();
    
    console.debug("rect1", rect1.matrix.toTransformString());
        
    set.push(rect1);
    set.push(rect2);
    set.push(rect3);
    set.push(rect4);
    
    var func = function() {
        var str = paper.toJSON();
        var dt = new Date();
        
        console.debug(str);
        
        $.ajax({
            url: '/doc',
            type: 'POST',
            data: {
                title: dt.valueOf(),
                body: str
            },
            success: function(data) {
                console.debug("response", data);
            },
            error: function() {
                console.debug("error");
            }
        });
        
    };
    
    set.animate({"transform":"S1,0.5, 400,400  R45,400,400"}, 1000, "bounce", func);
    
    console.debug(set);
});