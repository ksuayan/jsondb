'use strict';

var gb = gb||{};
gb.util = gb.util||{};

gb.util.TimeOutCycle = function(timeoutMS, callback) {
    this.timeoutMS = 5000;
    this.isRunning = false;
    this.timeoutHandle = null;
    this.tickHandler = function(){
        console.log("default tickHandler");
    };
    this.SetTimeoutMS(timeoutMS);
    this.SetTickHandler(callback);
};


gb.util.TimeOutCycle.prototype.SetTickHandler = function(callback) {
    if (callback && typeof callback == 'function') {
        this.tickHandler = callback;
    }
};


gb.util.TimeOutCycle.prototype.SetTimeoutMS = function(timeoutMS) {
    if (timeoutMS) {
        this.timeoutMS = timeoutMS;
    }
};


gb.util.TimeOutCycle.prototype.Start = function() {
    this.isRunning = true;
    this._tick();
};


gb.util.TimeOutCycle.prototype.Stop = function() {
    this.isRunning = false;
    if (this.timeoutHandle)
        clearTimeout(this.timeoutHandle)
};


gb.util.TimeOutCycle.prototype._tick = function() {
    if (!this.isRunning) {
        return;
    }
    this.tickHandler();
    this._SetNext();
};


gb.util.TimeOutCycle.prototype._SetNext = function() {
    var that = this;
    if (this.isRunning) {
        this.timeoutHandle = setTimeout(function(){that._tick();}, this.timeoutMS);
    }
};

