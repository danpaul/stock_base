var assert = require('assert');
var async = require('async');
var filePath = __dirname + '/data/aapl.us.txt';

module.exports = function(app, callbackIn){

    var tick = app.models.tick;

    async.series([
        function(callback){
            tick.processFile({file: filePath, symbol: 'aapl'}, callback);
        },
    ], callbackIn);
}