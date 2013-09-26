/*jslint
  browser: true,
  node: true */
/*global $ */

'use strict';

function init() {
  $('.modal-toggle').on('click', function(){
    var modalName = $(this).data('modal');
    var modalElement = $('#modal-' + modalName);

    if (modalElement)
      modalElement.modal();

  });

  $('.ajaxSubmit').on('click', function(event){
    event.preventDefault();
    //pooperz

  });
}

module.exports = init;

