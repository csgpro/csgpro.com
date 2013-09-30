var http = require('http');
var redirects = require('../routes/redirects');
var map = redirects.map;
var keys = Object.keys(map);
var opt = {
  hostname: 'localhost',
  port: 80,
  agent: false // bypasses the request pooling to permit more than 5 sockets
};

for (var i = keys.length - 1; i >= 0; i--) {
  opt.path = keys[i];
  request(opt);
}


function request (options) {
  http.get(options, function(res) {
    console.log(res.statusCode);
  });
}