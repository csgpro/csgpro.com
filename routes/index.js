
/*
 * GET home page.
 */

exports.homepage = function(req, res){
  res.render('index', { title: 'CSG' });
};