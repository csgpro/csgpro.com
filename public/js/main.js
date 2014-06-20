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

function IsEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

$(document).ready(function() {
  if(getParameterByName('slideID')) {
    // scrollToId("work");
    $(".swipeshow").swipeshow().goTo(parseInt(getParameterByName('slideID')));
  }

  $('.btnRegister').on('click', function(e) {

    var file = $('#file').val(),
        title = $('#title').val(),
        email = $('#emailAddress').val(),
        details = $('#details').val(),
        icsfile = $('#icsfile').attr('href'),
        headerImg = $('#headerImg'),
        buttonImg = $('#buttonImg'),
        hpizzle = $('#hpizzle').val(),
        cryptoTime = $('#cryptoTime').val(),
        error  = false,
        errorMsg = $('.alert-error'),
        successMsg = $('.alert-success'),
        infoMsg = $('.alert-info'),
        domain = window.location.protocol + '//' + window.location.host;

    errorMsg.hide(); //reset if not hidden

    var fields = [ '#companyName', '#firstName', '#lastName', '#emailAddress' ];

    var registrationData = [];

    for(var i in fields) {
      if (!error) {
        error = !$(fields[i]).val();
        if($(fields[i]).data('title') == 'Email Address') {
          if(!IsEmail($(fields[i]).val()))   {
            error = true;
          }
        }
      }
      registrationData.push({ label: $(fields[i]).data('title'), value: $(fields[i]).val() });
    }

    var icsfile = domain + icsfile;

    var calendarLinkMsg = (buttonImg.length) ? '<img src="' + domain + '/img/' + buttonImg.val() + '">' : 'Add this event to your calendar.';
    var calendarLink = '<a href="%url%">' + calendarLinkMsg + '</a>';
        calendarLink = calendarLink.replace('%url%',  icsfile);

    var message = (headerImg.length) ? '<img src="' + domain + '/img/' + headerImg.val() + '"><br><br>' : '';
        message = message + 'This is a confirmation for your recent ' + title + '.' + '<br><br>';
        message = message + details + '<br><br>';
        message = message + calendarLink + '<br><br>';
        message = message + 'You submitted the following information:' + '<br><br>';

    var dataObj = {
      file: file,
      record: registrationData,
      subject: title,
      message: message,
      email: email,
      hpizzle: hpizzle,
      cryptoTime: cryptoTime
    };

    var jsonString = JSON.stringify(dataObj);

    if(!error) {
      $.ajax({
        type: 'post',
        data: jsonString,
        contentType: 'application/json',
        url: '/csv',
        success: function(data,status,xhr) {
          if(data == 'success') {
            successMsg.show();
            infoMsg.show().css({'marginBottom': 100});
            $('form.register .form-field').hide();
          } else {
            errorMsg.html('Something went wrong. Please try again later.').show();
          }
        },
        error: function(data,status,xhr) {
          console.log(data);
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
