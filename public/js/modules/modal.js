/*jslint
  browser: true,
  laxbreak: true,
  node: true */
/*global $ */

'use strict';

var currentDataString;

function init() {
  $('.modal-toggle').on('click', function(){
    var modalName = $(this).data('modal');
    var modalElement = $('#modal-' + modalName);

    if (modalElement) {
      modalElement.modal();
    }

  });

  $('.recaptcha-submit').on('click', function(event) {
    var element;
    var message;

    event.preventDefault();

    currentDataString += '&recaptcha_challenge_field=' + this.form.recaptcha_challenge_field.value;
    currentDataString += '&recaptcha_response_field=' + this.form.recaptcha_response_field.value;

    $.ajax({  
      type: "POST",  
      url: "/contact",  
      data: currentDataString, 
      success: function(result) {  
        // do something cool!
        // $('#simplemodal-container .modal-header').text('Message received. Thanks!');
        if (result === 'success') {
          element = document.createElement('h1');
          message = document.createTextNode('Message received, thanks!');
          element.appendChild(message);

          $('#modal-recaptcha').html(element);

          setTimeout(function(){ $.modal.close(); },2000);

          window.location.reload();

        } else {
          element = document.createElement('h1');
          message = document.createTextNode('Incorrect response. Try again:');
          element.appendChild(message);

          $('#modal-recaptcha').prepend(element);

        }
      },
    });  
  });

  $('.ajaxSubmit').on('click', function(event){
    event.preventDefault();

    var name = this.form.name.value;
    var contactInfo = this.form.contactInfo.value;
    var comments = this.form.comments.value;
    var type;

    var dataString = 'name='+ name 
                   + '&contactInfo=' + contactInfo 
                   + '&comments=' + comments;
    
    if (this.form.hasOwnProperty('type')) {
      type = this.form.type.value;

      if (type)
        dataString += '&type=' + type;
    }

    currentDataString = dataString;

    $.modal.close();
    $('#modal-recaptcha').modal();
    return false;     

  });
}

module.exports = init;

