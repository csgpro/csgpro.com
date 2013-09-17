/*jslint
  browser: true,
  node: true */
/*global $ */

'use strict';

function init() {
  $('.article a').magnificPopup({
    type:'image',
    gallery: {
      enabled: true,
      navigateByImageClick: true
    }
  });

}


module.exports = init;