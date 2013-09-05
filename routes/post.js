var db = require('../modules/db')
  , marked = require('marked');

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: 'lang-'
});

module.exports.index = function(req, res) {
  res.render('post');
}
