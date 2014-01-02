
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

md.addEventListener('keyup', renderMarkdown);

function renderMarkdown () {
  render.innerHTML = marked(md.value);
}

// Image uploading

// the `ss` variable is a convention by the upload library and it's a global
// variable
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
      var li = $(document.createElement('li'));
      var item = $(document.createElement('input'));
      var editor = $('#markdown');
      var md = '!['+ filename +'](' + response.url + ')';

      item.attr('type', 'text');
      item.attr('value', md);
      item.attr('disabled', 'true');
      item.addClass('form-control');

      list.removeClass('hidden');

      item.appendTo(li);
      li.appendTo(list);

      editor.val(md + '\n\n' + editor.val());

      renderMarkdown();

    }
  }
});

