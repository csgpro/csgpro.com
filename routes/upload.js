/*jslint
  node: true*/

var self = this,
	check = require('validator').check,
	blob = require('../modules/blog-storage');

var maxFileSize = 2 * 1024 * 1024;

self.saveAuthorImage = function(req, res) {
	var image = req.files.file;

	// Grab the text after the `/` and use that type
	var extension = image.type.match(/\/(\w+)/)[1];

	try {
		check(extension, 'Invalid file type. Use png, gif, or jpg.').isIn(['png','gif','jpg','jpeg']);
		check(image.size, 'File too big. Max size is 2MB').max(maxFileSize);

		blob.uploadImage(image.path, extension, function(err, url) {
			// Response with some JSON
			if (err){
				res.send({error: err});
			} else {
				res.send({url: url});
			}
		});
	} catch (e) {
		res.send({error: e.message});
	}
};

module.exports.saveAuthorImage = self.saveAuthorImage;
