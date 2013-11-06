

// Markdown rendering

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

var md = document.getElementById('markdown');
var target = document.getElementById('render');

render.innerHTML = marked(md.value);

md.addEventListener('keyup', function(e){
  // working
  render.innerHTML = marked(md.value);

});

// Image uploading

var uploader = new ss.SimpleUpload({
  button: 'upload',
  url: '/admin/image-upload',
  name: 'image'
});
