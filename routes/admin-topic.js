/*jslint
  node: true*/

'use strict';

var moment = require('moment');
var db = require('../modules/db');

exports.index = function(req, res) {

  db.getTopics(function(err, topics) {
    if (err) {
      res.send(err); // TODO: LOGGING
    } else {
      res.render('admin/topic', {
        user: req.user,
        topics: topics,
        moment: moment,
        message: req.query.message,
        type: req.query.type
      });
    }

  });


};


exports.create = function(req, res) {
  var topicName = req.body.Name;
  var message = topicName + ' was successfully added.';
  var type = 'success';

  db.createTopic(topicName, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/admin/topic?message='
                    + escape(message)
                    + '&type='
                    + type);
    }
  });

};


exports.entry = function(req, res) {
  res.render('admin/topic-create', { user: req.user });
};



exports.update = function(req, res) {
  var topicId = parseInt(req.params.id, 10);
  var message;
  var type;

  db.getTopics(function(err, topics) {
    if (err) {
      message = 'Error getting topic id ' + topicId + err;
      type = 'danger';

      res.redirect('/admin/topic?message='
                    + escape(message)
                    + '&type='
                    + type);
    } else {
      console.dir(topics);
      console.dir(topicId);

      var topic = topics.filter(function(i) { return i.id === topicId; })[0];

      res.render('admin/topic-create', {
        user: req.user,
        topic: topic
      });
    }
  }); 


};


exports.patch = function(req, res) {
  var topic = req.body;
  var message = topic.Name + ' was successfully updated.';
  var type = 'success';

  topic.id = parseInt(req.params.id, 10);

  db.updateTopic(topic.id, topic.Name, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/admin/topic?message='
                    + escape(message) 
                    + '&type=' 
                    + type);
    }

  });


};


exports.del = function(req, res) {
  var topicId = req.params.id;
  var message;
  var type;

  db.deleteTopic(topicId, function(err, success) {
    if (err) {
      message = 'Error deleting topic id: ' + topicId + err;
      type = 'danger';

      res.redirect('/admin/topic?message='
                    + escape(message)
                    + '&type='
                    + type);
    } else {
      message = 'Topic deleted successfully.';
      type = 'success';

      res.redirect('/admin/topic?message='
                    + escape(message)
                    + '&type='
                    + type);
    }
  }); 

};





