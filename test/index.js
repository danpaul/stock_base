var async = require('async');

module.exports = function(app, callbackIn){
    async.series([
        function(callback){ require('./model')(app, callback); },
        function(callback){ require('./tick')(app, callback); }
    ], callbackIn);
}