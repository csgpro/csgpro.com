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
}

module.exports = init;
