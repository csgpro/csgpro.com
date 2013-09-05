marked.setOptions({
  gfm: true,
  // highlight: function (code, lang, callback) {
  //   pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
  //     if (err) return callback(err);
  //     callback(null, result.toString());
  //   });
  // },
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: 'lang-'
});

var md = document.getElementById('markdown');
var target = document.getElementById('render');

render.innerHTML = marked(md.value);

md.addEventListener('keyup', function(e){
  // working
  render.innerHTML = marked(md.value);

});