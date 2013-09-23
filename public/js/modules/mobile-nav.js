/*jslint
  node: true,
  browser: true */
  /* globals $*/

'use strict';

function init(options) {
  var toggle = $('.toggle-nav');
  var bdy = $('body');
  var brk = options.breakpoint;
  var links = $('.mobile-nav a');
  var mainBody = $('.main-body');

  toggle.on('click',function(){
    var pageWidth = document.documentElement.clientWidth;

    if (pageWidth <= brk) { // on a mobile
      bdy.toggleClass('nav-open');
      window.setTimeout(function(){
        bdy.on('click', clear);
      }, 0);
    }
    
  });

  links.on('click', function(){
    bdy.removeClass('nav-open');
    bdy.off('click', clear);
  });

}

function clear() {
  var body = $('body');

  body.removeClass('nav-open');
  body.off('click', clear);
}

module.exports = init;
