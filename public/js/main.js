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

  $('.btnRegister,.sendReminders').on('click', function(e) {

    var $el = $(this);

    var reminder = $el.hasClass('sendReminders');
    var postPath = (reminder) ? '/admin/reminders' : '/csv';

    var file = ($el.data('file') && $el.data('file') != 'undefined') ? $el.data('file') : $('#file').val(),
        title = ($el.data('title') && $el.data('title') != 'undefined') ? $el.data('title') : $('#title').val(),
        details = ($el.data('details') && $el.data('details') != 'undefined') ? $el.data('details') : $('#details').val(),
        headerImg = ($el.data('headerimg') && $el.data('headerimg') != 'undefined') ? $el.data('headerimg') : $('#headerImg').val(),
        buttonImg = ($el.data('buttonimg') && $el.data('buttonimg') != 'undefined') ? $el.data('buttonimg') : $('#buttonImg').val(),
        icsfile = ($el.data('icsfile') && $el.data('icsfile') != 'undefined') ? $el.data('icsfile') : $('#icsfile').attr('href'),
        error  = false,
        errorMsg = $('.alert-error'),
        successMsg = $('.alert-success'),
        infoMsg = $('.alert-info'),
        domain = window.location.protocol + '//' + window.location.host;

    if(!reminder) {
      var email = $('#emailAddress').val(),
          hpizzle = $('#hpizzle').val(),
          cryptoTime = $('#cryptoTime').val();

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
    }
    var icsfile = domain + icsfile;

    var calendarLinkMsg = (buttonImg) ? '<img src="' + domain + '/img/' + buttonImg + '">' : 'Add this event to your calendar.';
    var calendarLink = '<a href="%url%">' + calendarLinkMsg + '</a>';
        calendarLink = calendarLink.replace('%url%',  icsfile);

    var message = (headerImg) ? '<img src="' + domain + '/img/' + headerImg + '"><br><br>' : '';
        message = message + 'This is a confirmation for your recent ' + title + '.' + '<br><br>';
        message = message + details + '<br><br>';
        message = message + calendarLink + '<br><br>';
        message = message + 'You submitted the following information:' + '<br><br>';

    var dataObj = {
      file: file,
      subject: title,
      message: message
    };

    if(!reminder) {
      var registrationDetails = {
        email: email,
        hpizzle: hpizzle,
        cryptoTime: cryptoTime,
        record: registrationData
      }
      $.extend( dataObj, registrationDetails );
    }

    var jsonString = JSON.stringify(dataObj);

    if(!error) {
      $.ajax({
        type: 'post',
        data: jsonString,
        contentType: 'application/json',
        url: postPath,
        success: function(data,status,xhr) {
          if(data == 'success') {
            successMsg.show();
            if(!reminder) {
              infoMsg.show().css({'marginBottom': 100});
              $('form.register .form-field').hide();
              $el.attr('disabled','disabled');
            }
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
