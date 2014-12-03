
/*jslint
  jquery: true*/

var uploaderProfile = new ss.SimpleUpload({
  button: 'upload_profile',
  url: '/admin-old/image-upload',
  name: 'image',
  multipart: true,
  onComplete: function(filename, response) {

    response = JSON.parse(response);

    if (response.hasOwnProperty('error')) {
      alert('File upload failed. Error : '  + response.error);
    } else {
      var profileUrlInput = $('#form-profileurl');
      profileUrlInput.attr('value', response.url);
    }
  }
});
