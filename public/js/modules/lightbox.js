/*jslint
  browser: true,
  node: true */
/*global $ */

'use strict';

function init() {
  // Fix the images so they are contained by links to the image
  $('.article img:not(.avatar,.icon-sm)').each(function(index, element) {
    var newElement = document.createElement('a');
    var parent = element.parentNode;
    var link = element.attributes['src'].value;

    newElement.setAttribute('href', link);
    newElement.setAttribute('class', 'lightboxed');
    newElement.appendChild(element.cloneNode(true));
    parent.replaceChild(newElement, element);
  });

  $('.article .lightboxed').magnificPopup({
    type:'image',
    gallery: {
      enabled: true,
      navigateByImageClick: true
    }
  });

}


module.exports = init;