var async = require('async');
var _ = require('underscore');
var r = require('rethinkdb');
var fs = require('fs');
var parse = require('csv-parse');


/**
    Properties
        symbol, timestamp, date, time, open, high, low, close, volume
*/

var BaseModel = require('../lib/rethink_base_model');

module.exports = function(app){

    var model = new BaseModel(this, app, __filename);

    // defines the rethink indexes
    model.indexes = ['timestamp', 'symbol', {symbol_timestamp: ['symbol', 'timestamp']}];

    model.settings = {
        fileEncoding: 'utf-8'
    }

    /**
        Required:
            options.file
            options.symbol
    */
    model.processFile = function(options, callback){
        var self = this
        fs.readFile(options.file,
                    this.settings.fileEncoding,
                    function(err, fileData){

            if( err ){ return callback(err); }
            parse(fileData, {columns: true}, function(err, parsedData){
                if( err ){ return callback(err); }
                var data = _.map(parsedData, function(item){
                    var dateString = item.Date.split('-').join('/') + ' ' + item.Time;
                    var date = new Date(dateString);
                    return {
                        symbol: options.symbol,
                        timestamp: date.getTime(),
                        date: item.Date,
                        open: item.Open,
                        high: item.High,
                        low: item.Low,
                        close: item.Close,
                        volume: item.Volume
                    };
                });
                async.eachSeries(data, function(tickRecord, asyncCallback){
                    // check if already in DB
                    r.table(self.name)
                        .getAll([tickRecord.symbol, tickRecord.timestamp],
                                {index: 'symbol_timestamp'})
                        .coerceTo('array')
                        .run(self.connection, function(err, result) {
                            if( err ){ return asyncCallback(err); }
                            if( result.length !== 0){ return asyncCallback(); }
                            // save record
                            self.create(tickRecord, asyncCallback);
                        });
                }, callback);
            });
        });
    }



    return model;
}