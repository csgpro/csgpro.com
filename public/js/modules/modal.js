/*jslint
  browser: true,
  laxbreak: true,
  node: true */
/*global $ */

'use strict';

function init() {
  $('.modal-toggle').on('click', function(){
    var modalName = $(this).data('modal');
    var modalElement = $('#modal-' + modalName);

    if (modalElement) {
      modalElement.modal();
    }

  });


  $('.ajaxSubmit').on('click', function(event){
    event.preventDefault();

    var that = this;
    var name = this.form.name.value;
    var contactInfo = this.form.contactInfo.value;
    var comments = this.form.comments.value;
    var cryptoTime = this.form.cryptoTime.value;
    var hpizzle = this.form.hpizzle.value;
    var type;

    var dataString = 'name='+ name 
                   + '&contactInfo=' + contactInfo 
                   + '&cryptoTime=' + cryptoTime 
                   + '&hpizzle=' + hpizzle 
                   + '&comments=' + comments;
    
    if (this.form.hasOwnProperty('type')) {
      type = this.form.type.value;

      if (type)
        dataString += '&type=' + type;
    }


    $.ajax({  
      type: "POST",  
      url: "/contact",  
      data: dataString, 
      success: function(result) {  
        console.log(result);
        // $('#simplemodal-container .form-header').text('Message received. Thanks!');
        var header = $(that.form.querySelector('.status-header'));
        var toClear = $(that.form.querySelectorAll('.clearable'));

        if (result === 'success') {

          header.text('Message received!');
          header.css('color', '#468847'); // green
          header.fadeTo(90, 0.3);
          header.fadeTo(90, 1);
          header.fadeTo(90, 0.3);
          header.fadeTo(90, 1);

          toClear.val('');

          setTimeout(function(){ $.modal.close(); },2000);

        } else {
          header.text('Something went wrong, try again.');
          header.css('color', '#b94a48'); // red
          header.fadeTo(90, 0.3);
          header.fadeTo(90, 1);
          header.fadeTo(90, 0.3);
          header.fadeTo(90, 1);
        }
      },
    });  

    return false;     

  });
}

module.exports = init;

