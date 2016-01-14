var assert = require('assert');
var async = require('async');

var filePath = __dirname + '/../data/1/aapl.us.txt';
var dataDirectory = __dirname + '/../data/1';

module.exports = function(app, callbackIn){

    var tick = app.models.tick;

    async.series([
        function(callback){
            tick.processFile({file: filePath, symbol: 'aapl'}, callback);
        },
        function(callback){
            tick.processDirectory({directory: dataDirectory}, callback);
        }
    ], callbackIn);
}