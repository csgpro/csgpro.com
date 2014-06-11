/*jslint
  node: true*/

'use strict';

var csv = require('ya-csv');
// var writer = csv.createCsvFileWriter('public/exports/data.csv');
// var data = [['a','b','c','d','e','f','g'], ['h','i','j','k','l','m','n']];

exports.index = function(req, res) {
  var rec = req.body.record;
  var file = 'public/exports/' + req.body.file;
  if(req.body.file) {

    var writer = csv.createCsvFileWriter(file, {'flags': 'a'});

    writer.writeRecord(rec);
    res.send('success');
  }
  else {
    res.send('fail!');
  }
};
