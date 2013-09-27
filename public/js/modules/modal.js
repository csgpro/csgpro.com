/*jslint
  browser: true,
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
    //pooperz
    console.dir(this);
    var name = this.form.name.value;
    var contactInfo = this.form.contactInfo.value;
    var comments = this.form.comments.value;
    var type = this.form.type.value;


    var dataString = 'name='+ name + '&contactInfo=' + contactInfo + '&comments=' + comments + '&type=' + type;  
    //alert (dataString);return false;  
    $.ajax({  
      type: "POST",  
      url: "/contact",  
      data: dataString,  
      success: function() {  
        // do something cool!
        $('#simplemodal-container .modal-header').text('Message received. Thanks!');

        setTimeout(function(){ $.modal.close(); },2000);
      }  
    });  
    return false;     

  });
}

module.exports = init;

