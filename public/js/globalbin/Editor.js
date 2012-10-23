goog.provide('gb.ui.MapEditor');

goog.require('gb.config.Default');
goog.require('gb.util.Math');
goog.require('gb.model.Point');
goog.require('gb.ui.ControlPoint');
goog.require('gb.ui.Path');

gb.ui.MapEditor = function(container, width,height) {
	this.container = container;
	this.width = width;
	this.height = height;
	this.mapObj = Raphael(this.container, this.width, this.height);
};

gb.ui.MapEditor.prototype.grid = function(horizontal,vertical) {
	// draw horizontal rules
	for (var i=1; i < this.height; i+=vertical) {
		var path = "M0 "+i+ " H"+this.width;
		this.mapObj.path(path).attr(gb.config.Default.gridLine);
	}	
	// draw vertical rules
	for (var i=1; i < this.width; i+=horizontal) {
		var path = "M"+i+ " 0 V"+this.height;
		this.mapObj.path(path).attr(gb.config.Default.gridLine);
	}
};


gb.ui.MapEditor.prototype.initDrawArea = function(xOffset,yOffset, width, height) {
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.drawArea = this.mapObj.rect(xOffset,yOffset, width, height)
		.attr(gb.config.Default.drawArea);
};

gb.ui.MapEditor.prototype.drawLine = function() {

	var thisObj = this;
	this.pathElements = new gb.ui.Path(this.mapObj);

	this.drawArea.mousedown(function(e){
	    
		var point = new gb.ui.ControlPoint(e.offsetX, e.offsetY);
		point.setOnDragComplete(function(){thisObj.pathElements.draw();});
		
		var len = thisObj.pathElements.index()+1;
		if (len > 0) {
			var previousPoint = thisObj.pathElements.get(len-1);
			var cp1 = thisObj.getControlPointAt(previousPoint,point, 20);
			thisObj.pathElements.add(cp1);
			var cp2 = thisObj.getControlPointAt(previousPoint,point, 80);
			thisObj.pathElements.add(cp2);
		}
		
		thisObj.pathElements.add(point);
		thisObj.pathElements.draw();
		
	});
};

gb.ui.MapEditor.prototype.getControlPointAt = function(p1,p2,percent) {
	var thisObj = this;
	var rad = p1.theta(p2);
	var distance = p1.distance(p2);
	var xLoc = p1.x + (distance * Math.cos(rad) * percent * .01);
	var yLoc = p1.y + (distance * Math.sin(rad) * percent * .01);
	var controlPoint = new gb.ui.ControlPoint(xLoc,yLoc);
	controlPoint.setOnDragComplete(function(){thisObj.pathElements.draw();});
	controlPoint.setStyle(gb.config.Default.controlPoint);
	return controlPoint;
};

gb.ui.MapEditor.prototype.save = function() {
    var str = this.mapObj.toJSON();
    var dt = new Date();
    console.debug(str);
    $.ajax({
        url : '/doc',
        type : 'POST',
        data : {
            title : dt.valueOf(),
            body : str
        },
        success : function(data) {
            console.debug("response", data);
        },
        error : function() {
            console.debug("error");
        }
    });

};

gb.ui.MapEditor.prototype.load = function(id) {
    var thisObj = this;
    $.ajax({
        url : '/doc/'+id,
        type : 'GET',
        success : function(data) {
            thisObj.mapObj = data.fromJSON();
            console.debug("thisObj", thisObj);
        },
        error : function() {
            console.debug("error");
        }
    });

};

gb.ui.MapEditor.prototype.setMapObject = function(data) {
    this.mapObj = this.mapObj.fromJSON(data);
};


$(function() {
    
    $("#btn-reset").click(function(){ map.pathElements.reset(); });
    $("#btn-close").click(function(){ map.pathElements.toggleClosedPath(); });
    $("#btn-fill").click(function(){ map.pathElements.toggleFilledPath(); });
    $("#btn-ctrl-points").click(function(){ map.pathElements.toggleControlPoints(); });
    $("#btn-save").click(function(){ 
        map.save(); 
    });
    
    if (data) {
        
        map = new gb.ui.MapEditor("svg-content",1002,642);
        map.setMapObject(data);
        
    } else {
        
        map = new gb.ui.MapEditor("svg-content",1002,642);
        map.grid(20,20);
        map.initDrawArea(1,1,1000,640);
        map.drawLine();
    }
});

var map = null;