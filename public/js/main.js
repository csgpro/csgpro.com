/*jslint
  browser: true,
  node: true */
/*global $ */

/**
 * This is the main JavaScript file that loads the other modules and firest them
 * off. I am using Browserify and Common JS style modules to load them in.
 */

'use strict';

var pageSizing      = require('./modules/page-sizing');
var navScrolling    = require('./modules/nav-scrolling');
var stickyNav       = require('./modules/sticky-nav');
var sectionSwapping = require('./modules/section-swapping');
var carousel        = require('./modules/carousel');
var mobileNav       = require('./modules/mobile-nav');
var lightbox        = require('./modules/lightbox');
var modal           = require('./modules/modal');
var options = {    // global options for the site
  breakpoint : 915,  // px
  maxHeight : 750,  // px
  minHeight : 625    // px - approx. adjusted for nav bar height
};

// Fire the modules, order is important
if (window.location.pathname === '/') { // only do all this javascript in root
  pageSizing(options);
  navScrolling();
  stickyNav(options);
  sectionSwapping(options);
  carousel();
  mobileNav(options);
  modal();
} else if (/^\/post/i.test(window.location.pathname)){ // do on "post" pages
  mobileNav(options);
  lightbox();
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function() {
  if(getParameterByName('slideID')) {
    // scrollToId("work");
    $(".swipeshow").swipeshow().goTo(parseInt(getParameterByName('slideID')));
  }

  $('.btnRegister').on('click', function(e) {

    var registrantData = [
          $('#companyName').val(),
          $('#firstName').val(),
          $('#lastName').val(),
          $('#emailAddress').val(),
          //$('#event').val()
          'webcast'
        ],
        error  = false,
        errorMsg = $('.alert-error'),
        successMsg = $('.alert-success'),
        infoMsg = $('.alert-info');

    errorMsg.hide(); //reset if not hidden

    for(var i = 0; i < registrantData.length; i++) {
      if(!registrantData[i]) {
        error = true;
      }
    }

    var dataObj = {
      file: "sharepoint-registrants",
      record: registrantData
    };

    var jsonString = JSON.stringify(dataObj);
    //console.log(jsonString);

    if(!error) {
      $.ajax({
        type: 'post',
        data: jsonString,
        contentType: 'application/json',
        url: '/csv',
        success: function(data,status,xhr) {
          if(data == 'success') {
            successMsg.show();
            infoMsg.show();
          } else {
            errorMsg.html('Something went wrong. Please try again later.').show();
          }
        },
        error: function(data,status,xhr) {
          var response = data;
          errorMsg.html('Something went wrong! Please try again later.').show();
        }
      });
    }
    else {
      errorMsg.show();
    }

    e.preventDefault();

  });
});
