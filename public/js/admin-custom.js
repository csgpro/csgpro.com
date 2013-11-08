
/*jslint
  jquery: true*/

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
  name: 'image',
  multipart: true,
  onComplete: function(filename, response) {

    response = JSON.parse(response);

    if (response.hasOwnProperty('error')) {
      alert('File upload failed. Error : '  + response.error);
    } else {
      var list = $('#uploads');
      var item = $(document.createElement('li'));
      var editor = $('#markdown');
      var md = '![text placeholder](' + response.url + ')';

      item.innerText = response.url;
      item.attr('data-markdown', md);

      list.toggleClass('hidden');

      item.appendTo(list);

      editor.val(md + '\n' + editor.val());

    }
  }
});

