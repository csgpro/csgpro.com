(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
var swipeshow       = require('./vendor/swipeshow.js');
var magnific        = require('./vendor/magnific.js');
var simplemodal     = require('./vendor/jquery.simplemodal.1.4.4.min.js');
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

},{"./modules/carousel":2,"./modules/lightbox":3,"./modules/mobile-nav":4,"./modules/modal":5,"./modules/nav-scrolling":6,"./modules/page-sizing":7,"./modules/section-swapping":8,"./modules/sticky-nav":9,"./vendor/jquery.simplemodal.1.4.4.min.js":10,"./vendor/magnific.js":11,"./vendor/swipeshow.js":12}],2:[function(require,module,exports){
/*jslint
  node: true*/ /*globals $*/
/**
 * This module sets up the homepage carousel. Assumes:
 * - jQuery 1.10.2
 */

'use strict';

function init(){
  $(".swipeshow").swipeshow({
    autostart: false,    /* Set to `false` to keep it steady */
    interval: 3000,     /* Time between switching slides (ms) */
    initial: 0,         /* First slide's index */
    speed: 700,         /* Animation speed (ms) */
    friction: 0.3,      /* Bounce-back behavior; use `0` to disable */
    mouse: true,        /* enable mouse dragging controls */
    keys: true,         /* enable left/right keyboard keys */
    $next: $('.swipeshow .next'),
    $previous: $('.swipeshow .previous')
  });

}

////////////////////
// MODULE EXPORTS //
////////////////////
module.exports = init;

},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
/*jslint
  node: true,
  browser: true */
  /* globals $*/

'use strict';

function init(options) {
  var toggle = $('.toggle-nav');
  var bdy = $('body');
  var brk = options.breakpoint;
  var links = $('.mobile-nav a,#mobile-csg-logo');
  var mainBody = $('.main-body');

  toggle.on('click',function(){
    var pageWidth = document.documentElement.clientWidth;

    if (pageWidth <= brk) { // on a mobile
      bdy.toggleClass('nav-open');
      window.setTimeout(function(){
        bdy.on('click', clear);
        bdy.on('touch', clear);
      }, 0);
    }
    
  });

  links.on('click', function(){
    bdy.removeClass('nav-open');
    bdy.off('click', clear);
    bdy.off('touch', clear);
  });

}

function clear() {
  var body = $('body');

  body.removeClass('nav-open');
  body.off('click', clear);
  bdy.off('touch', clear);
}

module.exports = init;

},{}],5:[function(require,module,exports){
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


},{}],6:[function(require,module,exports){
/*jslint
  node: true,
  browser: true */ /*globals $*/
/**
 * This module sets up the events necessary to allow the user to scroll around
 * the page and have the nav update appropriately. It assumes:
 * - jQuery 1.10.2
 */

'use strict';

// Grab all the nav sections, loop through them when the user scrolls, and set
// the appropriate nav item to have a class of "selected". There may be a
// better way to do this, but I couldn't think of one.
var items = $('#hero,#work,#services,#about,#updates,#contact')
  , offset = 92 // height of the nav
  , w = $(window)
  , selected
  , arr = []
  , navItems = $('li[data-nav]');

function init() {
  
  recalcTops();

  w.on('scroll', each);
  w.on('touchmove', each);

  // When the user changes screen size, we have to re calculate the tops of each
  // of the sections
  w.on('orientationchange', recalcTops);
  w.on('resize', recalcTops);

  // Check if the user has a hash in their address bar, if so, try to nav there
  // There was a bug here when the user navigated to "/#", but it's fixed now
  if (/#\w+/.test(window.location.hash)) {
    var element = $(window.location.hash);

    if (element)
      scrollTo(element);
  }

  // When a user clicks on a nav item, scroll to that section. Should probably
  // be using anchors instead of this klugy method, but it works for now
  $('nav li').on('click', function(e){
    var element = $('#' + e.currentTarget.innerHTML);

    scrollTo(element);
  });

  // Scroll to the top of the page
  $('#logo').on('click', function(e){
    $('html, body').animate({
      scrollTop: 0
    });
  });
}

function scrollTo(element, customOffset) {
  $('html, body').animate({
    scrollTop: element.offset().top - (customOffset || offset)
  });
}

// global scope creep here... DANGER DANGER
window.scrollToId = function (id, customOffset) {
  var element = $('#' + id);

  if (element)
    scrollTo(element, customOffset);
};

function recalcTops(){
  arr = [];

  w.off('scroll', each);
  w.off('touchmove', each);

  items.each(function(i, e){
    arr.push({
        element: e
      , name: e.id
      , top: $(e).offset().top
      , bottom: $(e).offset().top + e.offsetHeight
    });
  });

  w.on('scroll', each);
  w.on('touchmove', each);

}

function each(){
  var at = w.scrollTop() + (w.height() / 2);

  arr.forEach(function(item){
    if ( at >= item.top && at <= item.bottom ) {
      if (selected) {
        selected.removeClass('selected');
      }
      selected = $("li[data-nav='" + item.name +"']");
      selected.addClass('selected');
    }
  });
}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;

////////////
// Helper //
////////////
function log() {
  var toLog = '';
  Array.prototype.forEach.call(arguments, function(item) {
    toLog += item + ' - ';
  });

  console.log(toLog);
}



},{}],7:[function(require,module,exports){
/*jslint
  browser: true,
  node: true */
/*global $ */

/**
 * This module is used to resize certain parts of the page based on the user
 * screen size. It assumes:
 * - jQuery 1.10.2
 */


'use strict';

var w = $(window)
  , brk // options
  , maxHeight
  , minHeight
  , headlineHeight = 0
  , pageWidth;

function init(options) {
  pageWidth = w.width();

  // Get necessary options
  brk = options.breakpoint;
  maxHeight = options.maxHeight;
  minHeight = options.minHeight;


  headlineHeight = $('#hero > div').height();

  doResize();

  w.on('onorientationchange', doResize);
  w.on('resize', doResize);
}

function doResize(){

  // pageWidth = document.documentElement.clientWidth;
  pageWidth = w.width();

  if (pageWidth >= brk) { //desktop
    var wHeight = w.height()
      , heroHeight = wHeight - 90
      , topMargin = (heroHeight - headlineHeight) / 2
      , body = $(body);

    // Make sure the mobile nav is hidden
    body.removeClass('nav-open');

    $('#hero').css('height', heroHeight);


    // Vertically center the hero content
    $('#headline').css('margin-top', topMargin);

    if (wHeight <= maxHeight && wHeight >= minHeight) {
      // Dynamically change the height of the various sections to match the user's
      // screen height
      $('#work').css('height', heroHeight);
      $('#services').css('height', heroHeight);
      $('#about').css('height', heroHeight);
      $('#updates').css('height', heroHeight);

    } else if (wHeight >= maxHeight) { // still desktop, but above the bounds
      $('#work').css('height', maxHeight + 'px');
      $('#services').css('height', maxHeight + 'px');
      $('#about').css('height', maxHeight + 'px');
      $('#updates').css('height', maxHeight + 'px');
    } else if (wHeight <= minHeight) { // still desktop, but below the bounds
      $('#work').css('height', minHeight + 'px');
      $('#services').css('height', minHeight + 'px');
      $('#about').css('height', minHeight + 'px');
      $('#updates').css('height', minHeight + 'px');
    }

  } else { // mobile
    // undo the page sizing
    $('#hero').removeAttr('style');
    $('#work').removeAttr('style');
    $('#services').removeAttr('style');
    $('#about').removeAttr('style');
    $('#updates').removeAttr('style');
  }

}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;

},{}],8:[function(require,module,exports){
/*jslint
  browser: true,
  node: true */ /* globals $ */

/**
 * This module finds all the specially marked up sections in the html and makes
 * them swap their content based on associated navigation elements. It also
 * handles the accordion when visitors are past the mobile breakpoint.
 *
 * Assumes:
 * - jQuery 1.10.2
 */

'use strict';

var options;

function init(o){
  options = o;

  $('.swapper > li').click(function(){
    swap($(this));
  });

  $('.about-us').click(function(){
    $('#about .swappable section').addClass('hide');
    $('#swappable-about').removeClass('hide');
    $('.swapper').find('.active').removeClass();
  });

  $('.swapper.accordion > li').each(function(index, item) {
    var text = $(item).attr('id').match(/swapper-(\w+)/)[1];
    var content = $('#swappable-' + text);
    var contentTarget = $('#swapper-target-' + text );

    contentTarget.html(content.children().clone());
  });
}

function swap(element) {
  var me = element
    , text = me.attr('id').match(/swapper-(\w+)/)[1]
    , target = $('#swappable-' + text)
    , brk = options.breakpoint
    , pageWidth = document.documentElement.clientWidth
    , isAccordion = /accordion/.test(me.parent()[0].className);

  if (pageWidth < brk) { // mobile
    if (isAccordion) {
      var content = $('#swappable-' + text);
      var contentTarget = $('#swapper-target-' + text );

      if (me.hasClass('active')) {
        me.removeClass('active');
        contentTarget.removeClass('active');
      } else {
        me.addClass('active');
        contentTarget.addClass('active');
      }
    }
  } else {               // desktop
    me.addClass('active');
    me.siblings().removeClass('active');
    target.siblings().addClass('hide');
    target.removeClass('hide');
  }
}

////////////////////
// MODULE EXPORTS //
////////////////////
module.exports = init;
// DANGER global scope
window.swapElement = swap;

},{}],9:[function(require,module,exports){
/**
 * This module is used to make the navigations fixed when the user hits a
 * certain spot on their scrolling. It assumes:
 * - jQuery 1.10.2
 */
'use strict';

var isFixed = false
  , isSmall = false
  , w = $(window)
  , nav = $('nav')
  , img = $('#logo')
  , spacer = $('#nav-spacer')
  , brk //options
  , pageWidth
  , navTop
  , imgTop;
  // 70px different for the logo

function init(options) {
  brk = options.breakpoint;

  navTop = nav.offset().top;
  imgTop = img.offset().top;

  sticky();
  w.on('scroll', sticky);
  w.on('touchmove', sticky);
  w.on('resize', recalc);
}

function sticky() {
  pageWidth = document.documentElement.clientWidth;

  if (pageWidth >= brk){
    if (w.scrollTop() >= navTop && !isFixed) {
      isFixed = true;
      nav.addClass('fixed-menu');
      spacer.removeClass('hidden');
    } else if (w.scrollTop() < navTop && isFixed) {
      isFixed = false;
      nav.removeClass('fixed-menu');
      spacer.addClass('hidden');
    }

    if (w.scrollTop() >= imgTop && !isSmall) {
      isSmall = true;
      img.addClass('small-logo');
      img.removeClass('big-logo');
    } else if (w.scrollTop() < imgTop && isSmall) {
      isSmall = false;
      img.removeClass('small-logo');
      img.addClass('big-logo');
    }
  }
}

function recalc() {
  pageWidth = document.documentElement.clientWidth;

  if (pageWidth >= brk) {
    if (isFixed) {
      navTop = spacer.offset().top;
      imgTop = navTop - 50;
      sticky();
    } else {
      navTop = nav.offset().top;
      imgTop = img.offset().top;
    }
  }
}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;

},{}],10:[function(require,module,exports){
/*
 * SimpleModal 1.4.4 - jQuery Plugin
 * http://simplemodal.com/
 * Copyright (c) 2013 Eric Martin
 * Licensed under MIT and GPL
 * Date: Sun, Jan 20 2013 15:58:56 -0800
 */
(function(b){"function"===typeof define&&define.amd?define(["jquery"],b):b(jQuery)})(function(b){var j=[],n=b(document),k=navigator.userAgent.toLowerCase(),l=b(window),g=[],o=null,p=/msie/.test(k)&&!/opera/.test(k),q=/opera/.test(k),m,r;m=p&&/msie 6./.test(k)&&"object"!==typeof window.XMLHttpRequest;r=p&&/msie 7.0/.test(k);b.modal=function(a,h){return b.modal.impl.init(a,h)};b.modal.close=function(){b.modal.impl.close()};b.modal.focus=function(a){b.modal.impl.focus(a)};b.modal.setContainerDimensions=
function(){b.modal.impl.setContainerDimensions()};b.modal.setPosition=function(){b.modal.impl.setPosition()};b.modal.update=function(a,h){b.modal.impl.update(a,h)};b.fn.modal=function(a){return b.modal.impl.init(this,a)};b.modal.defaults={appendTo:"body",focus:!0,opacity:50,overlayId:"simplemodal-overlay",overlayCss:{},containerId:"simplemodal-container",containerCss:{},dataId:"simplemodal-data",dataCss:{},minHeight:null,minWidth:null,maxHeight:null,maxWidth:null,autoResize:!1,autoPosition:!0,zIndex:1E3,
close:!0,closeHTML:'<a class="modalCloseImg" title="Close"></a>',closeClass:"simplemodal-close",escClose:!0,overlayClose:!1,fixed:!0,position:null,persist:!1,modal:!0,onOpen:null,onShow:null,onClose:null};b.modal.impl={d:{},init:function(a,h){if(this.d.data)return!1;o=p&&(document.compatMode==="BackCompat");this.o=b.extend({},b.modal.defaults,h);this.zIndex=this.o.zIndex;this.occb=!1;if("object"===typeof a){if(a=a instanceof b?a:b(a),this.d.placeholder=!1,0<a.parent().parent().size()&&(a.before(b("<span></span>").attr("id",
"simplemodal-placeholder").css({display:"none"})),this.d.placeholder=!0,this.display=a.css("display"),!this.o.persist))this.d.orig=a.clone(!0)}else if("string"===typeof a||"number"===typeof a)a=b("<div></div>").html(a);else return alert("SimpleModal Error: Unsupported data type: "+typeof a),this;this.create(a);this.open();b.isFunction(this.o.onShow)&&this.o.onShow.apply(this,[this.d]);return this},create:function(a){this.getDimensions();if(this.o.modal&&m)this.d.iframe=b('<iframe src="javascript:false;"></iframe>').css(b.extend(this.o.iframeCss,
{display:"none",opacity:0,position:"fixed",height:g[0],width:g[1],zIndex:this.o.zIndex,top:0,left:0})).appendTo(this.o.appendTo);this.d.overlay=b("<div></div>").attr("id",this.o.overlayId).addClass("simplemodal-overlay").css(b.extend(this.o.overlayCss,{display:"none",opacity:this.o.opacity/100,height:this.o.modal?j[0]:0,width:this.o.modal?j[1]:0,position:"fixed",left:0,top:0,zIndex:this.o.zIndex+1})).appendTo(this.o.appendTo);this.d.container=b("<div></div>").attr("id",this.o.containerId).addClass("simplemodal-container").css(b.extend({position:this.o.fixed?
"fixed":"absolute"},this.o.containerCss,{display:"none",zIndex:this.o.zIndex+2})).append(this.o.close&&this.o.closeHTML?b(this.o.closeHTML).addClass(this.o.closeClass):"").appendTo(this.o.appendTo);this.d.wrap=b("<div></div>").attr("tabIndex",-1).addClass("simplemodal-wrap").css({height:"100%",outline:0,width:"100%"}).appendTo(this.d.container);this.d.data=a.attr("id",a.attr("id")||this.o.dataId).addClass("simplemodal-data").css(b.extend(this.o.dataCss,{display:"none"})).appendTo("body");this.setContainerDimensions();
this.d.data.appendTo(this.d.wrap);(m||o)&&this.fixIE()},bindEvents:function(){var a=this;b("."+a.o.closeClass).bind("click.simplemodal",function(b){b.preventDefault();a.close()});a.o.modal&&a.o.close&&a.o.overlayClose&&a.d.overlay.bind("click.simplemodal",function(b){b.preventDefault();a.close()});n.bind("keydown.simplemodal",function(b){a.o.modal&&9===b.keyCode?a.watchTab(b):a.o.close&&a.o.escClose&&27===b.keyCode&&(b.preventDefault(),a.close())});l.bind("resize.simplemodal orientationchange.simplemodal",
function(){a.getDimensions();a.o.autoResize?a.setContainerDimensions():a.o.autoPosition&&a.setPosition();m||o?a.fixIE():a.o.modal&&(a.d.iframe&&a.d.iframe.css({height:g[0],width:g[1]}),a.d.overlay.css({height:j[0],width:j[1]}))})},unbindEvents:function(){b("."+this.o.closeClass).unbind("click.simplemodal");n.unbind("keydown.simplemodal");l.unbind(".simplemodal");this.d.overlay.unbind("click.simplemodal")},fixIE:function(){var a=this.o.position;b.each([this.d.iframe||null,!this.o.modal?null:this.d.overlay,
"fixed"===this.d.container.css("position")?this.d.container:null],function(b,e){if(e){var f=e[0].style;f.position="absolute";if(2>b)f.removeExpression("height"),f.removeExpression("width"),f.setExpression("height",'document.body.scrollHeight > document.body.clientHeight ? document.body.scrollHeight : document.body.clientHeight + "px"'),f.setExpression("width",'document.body.scrollWidth > document.body.clientWidth ? document.body.scrollWidth : document.body.clientWidth + "px"');else{var c,d;a&&a.constructor===
Array?(c=a[0]?"number"===typeof a[0]?a[0].toString():a[0].replace(/px/,""):e.css("top").replace(/px/,""),c=-1===c.indexOf("%")?c+' + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"':parseInt(c.replace(/%/,""))+' * ((document.documentElement.clientHeight || document.body.clientHeight) / 100) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"',a[1]&&(d="number"===typeof a[1]?
a[1].toString():a[1].replace(/px/,""),d=-1===d.indexOf("%")?d+' + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"':parseInt(d.replace(/%/,""))+' * ((document.documentElement.clientWidth || document.body.clientWidth) / 100) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"')):(c='(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"',
d='(document.documentElement.clientWidth || document.body.clientWidth) / 2 - (this.offsetWidth / 2) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"');f.removeExpression("top");f.removeExpression("left");f.setExpression("top",c);f.setExpression("left",d)}}})},focus:function(a){var h=this,a=a&&-1!==b.inArray(a,["first","last"])?a:"first",e=b(":input:enabled:visible:"+a,h.d.wrap);setTimeout(function(){0<e.length?e.focus():h.d.wrap.focus()},
10)},getDimensions:function(){var a="undefined"===typeof window.innerHeight?l.height():window.innerHeight;j=[n.height(),n.width()];g=[a,l.width()]},getVal:function(a,b){return a?"number"===typeof a?a:"auto"===a?0:0<a.indexOf("%")?parseInt(a.replace(/%/,""))/100*("h"===b?g[0]:g[1]):parseInt(a.replace(/px/,"")):null},update:function(a,b){if(!this.d.data)return!1;this.d.origHeight=this.getVal(a,"h");this.d.origWidth=this.getVal(b,"w");this.d.data.hide();a&&this.d.container.css("height",a);b&&this.d.container.css("width",
b);this.setContainerDimensions();this.d.data.show();this.o.focus&&this.focus();this.unbindEvents();this.bindEvents()},setContainerDimensions:function(){var a=m||r,b=this.d.origHeight?this.d.origHeight:q?this.d.container.height():this.getVal(a?this.d.container[0].currentStyle.height:this.d.container.css("height"),"h"),a=this.d.origWidth?this.d.origWidth:q?this.d.container.width():this.getVal(a?this.d.container[0].currentStyle.width:this.d.container.css("width"),"w"),e=this.d.data.outerHeight(!0),f=
this.d.data.outerWidth(!0);this.d.origHeight=this.d.origHeight||b;this.d.origWidth=this.d.origWidth||a;var c=this.o.maxHeight?this.getVal(this.o.maxHeight,"h"):null,d=this.o.maxWidth?this.getVal(this.o.maxWidth,"w"):null,c=c&&c<g[0]?c:g[0],d=d&&d<g[1]?d:g[1],i=this.o.minHeight?this.getVal(this.o.minHeight,"h"):"auto",b=b?this.o.autoResize&&b>c?c:b<i?i:b:e?e>c?c:this.o.minHeight&&"auto"!==i&&e<i?i:e:i,c=this.o.minWidth?this.getVal(this.o.minWidth,"w"):"auto",a=a?this.o.autoResize&&a>d?d:a<c?c:a:f?
f>d?d:this.o.minWidth&&"auto"!==c&&f<c?c:f:c;this.d.container.css({height:b,width:a});this.d.wrap.css({overflow:e>b||f>a?"auto":"visible"});this.o.autoPosition&&this.setPosition()},setPosition:function(){var a,b;a=g[0]/2-this.d.container.outerHeight(!0)/2;b=g[1]/2-this.d.container.outerWidth(!0)/2;var e="fixed"!==this.d.container.css("position")?l.scrollTop():0;this.o.position&&"[object Array]"===Object.prototype.toString.call(this.o.position)?(a=e+(this.o.position[0]||a),b=this.o.position[1]||b):
a=e+a;this.d.container.css({left:b,top:a})},watchTab:function(a){if(0<b(a.target).parents(".simplemodal-container").length){if(this.inputs=b(":input:enabled:visible:first, :input:enabled:visible:last",this.d.data[0]),!a.shiftKey&&a.target===this.inputs[this.inputs.length-1]||a.shiftKey&&a.target===this.inputs[0]||0===this.inputs.length)a.preventDefault(),this.focus(a.shiftKey?"last":"first")}else a.preventDefault(),this.focus()},open:function(){this.d.iframe&&this.d.iframe.show();b.isFunction(this.o.onOpen)?
this.o.onOpen.apply(this,[this.d]):(this.d.overlay.show(),this.d.container.show(),this.d.data.show());this.o.focus&&this.focus();this.bindEvents()},close:function(){if(!this.d.data)return!1;this.unbindEvents();if(b.isFunction(this.o.onClose)&&!this.occb)this.occb=!0,this.o.onClose.apply(this,[this.d]);else{if(this.d.placeholder){var a=b("#simplemodal-placeholder");this.o.persist?a.replaceWith(this.d.data.removeClass("simplemodal-data").css("display",this.display)):(this.d.data.hide().remove(),a.replaceWith(this.d.orig))}else this.d.data.hide().remove();
this.d.container.hide().remove();this.d.overlay.hide();this.d.iframe&&this.d.iframe.hide().remove();this.d.overlay.remove();this.d={}}}}});

},{}],11:[function(require,module,exports){
// Magnific Popup v0.9.5 by Dmitry Semenov
// http://bit.ly/magnific-popup#build=image+gallery
(function(a){var b="Close",c="BeforeClose",d="AfterClose",e="BeforeAppend",f="MarkupParse",g="Open",h="Change",i="mfp",j="."+i,k="mfp-ready",l="mfp-removing",m="mfp-prevent-close",n,o=function(){},p=!!window.jQuery,q,r=a(window),s,t,u,v,w,x=function(a,b){n.ev.on(i+a+j,b)},y=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},z=function(b,c){n.ev.triggerHandler(i+b,c),n.st.callbacks&&(b=b.charAt(0).toLowerCase()+b.slice(1),n.st.callbacks[b]&&n.st.callbacks[b].apply(n,a.isArray(c)?c:[c]))},A=function(){(n.st.focus?n.content.find(n.st.focus).eq(0):n.wrap).focus()},B=function(b){if(b!==w||!n.currTemplate.closeBtn)n.currTemplate.closeBtn=a(n.st.closeMarkup.replace("%title%",n.st.tClose)),w=b;return n.currTemplate.closeBtn},C=function(){a.magnificPopup.instance||(n=new o,n.init(),a.magnificPopup.instance=n)},D=function(b){if(a(b).hasClass(m))return;var c=n.st.closeOnContentClick,d=n.st.closeOnBgClick;if(c&&d)return!0;if(!n.content||a(b).hasClass("mfp-close")||n.preloader&&b===n.preloader[0])return!0;if(b!==n.content[0]&&!a.contains(n.content[0],b)){if(d&&a.contains(document,b))return!0}else if(c)return!0;return!1},E=function(){var a=document.createElement("p").style,b=["ms","O","Moz","Webkit"];if(a.transition!==undefined)return!0;while(b.length)if(b.pop()+"Transition"in a)return!0;return!1};o.prototype={constructor:o,init:function(){var b=navigator.appVersion;n.isIE7=b.indexOf("MSIE 7.")!==-1,n.isIE8=b.indexOf("MSIE 8.")!==-1,n.isLowIE=n.isIE7||n.isIE8,n.isAndroid=/android/gi.test(b),n.isIOS=/iphone|ipad|ipod/gi.test(b),n.supportsTransition=E(),n.probablyMobile=n.isAndroid||n.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),s=a(document.body),t=a(document),n.popupsCache={}},open:function(b){var c;if(b.isObj===!1){n.items=b.items.toArray(),n.index=0;var d=b.items,e;for(c=0;c<d.length;c++){e=d[c],e.parsed&&(e=e.el[0]);if(e===b.el[0]){n.index=c;break}}}else n.items=a.isArray(b.items)?b.items:[b.items],n.index=b.index||0;if(n.isOpen){n.updateItemHTML();return}n.types=[],v="",b.mainEl&&b.mainEl.length?n.ev=b.mainEl.eq(0):n.ev=t,b.key?(n.popupsCache[b.key]||(n.popupsCache[b.key]={}),n.currTemplate=n.popupsCache[b.key]):n.currTemplate={},n.st=a.extend(!0,{},a.magnificPopup.defaults,b),n.fixedContentPos=n.st.fixedContentPos==="auto"?!n.probablyMobile:n.st.fixedContentPos,n.st.modal&&(n.st.closeOnContentClick=!1,n.st.closeOnBgClick=!1,n.st.showCloseBtn=!1,n.st.enableEscapeKey=!1),n.bgOverlay||(n.bgOverlay=y("bg").on("click"+j,function(){n.close()}),n.wrap=y("wrap").attr("tabindex",-1).on("click"+j,function(a){D(a.target)&&n.close()}),n.container=y("container",n.wrap)),n.contentContainer=y("content"),n.st.preloader&&(n.preloader=y("preloader",n.container,n.st.tLoading));var h=a.magnificPopup.modules;for(c=0;c<h.length;c++){var i=h[c];i=i.charAt(0).toUpperCase()+i.slice(1),n["init"+i].call(n)}z("BeforeOpen"),n.st.showCloseBtn&&(n.st.closeBtnInside?(x(f,function(a,b,c,d){c.close_replaceWith=B(d.type)}),v+=" mfp-close-btn-in"):n.wrap.append(B())),n.st.alignTop&&(v+=" mfp-align-top"),n.fixedContentPos?n.wrap.css({overflow:n.st.overflowY,overflowX:"hidden",overflowY:n.st.overflowY}):n.wrap.css({top:r.scrollTop(),position:"absolute"}),(n.st.fixedBgPos===!1||n.st.fixedBgPos==="auto"&&!n.fixedContentPos)&&n.bgOverlay.css({height:t.height(),position:"absolute"}),n.st.enableEscapeKey&&t.on("keyup"+j,function(a){a.keyCode===27&&n.close()}),r.on("resize"+j,function(){n.updateSize()}),n.st.closeOnContentClick||(v+=" mfp-auto-cursor"),v&&n.wrap.addClass(v);var l=n.wH=r.height(),m={};if(n.fixedContentPos&&n._hasScrollBar(l)){var o=n._getScrollbarSize();o&&(m.paddingRight=o)}n.fixedContentPos&&(n.isIE7?a("body, html").css("overflow","hidden"):m.overflow="hidden");var p=n.st.mainClass;n.isIE7&&(p+=" mfp-ie7"),p&&n._addClassToMFP(p),n.updateItemHTML(),z("BuildControls"),a("html").css(m),n.bgOverlay.add(n.wrap).prependTo(document.body),n._lastFocusedEl=document.activeElement,setTimeout(function(){n.content?(n._addClassToMFP(k),A()):n.bgOverlay.addClass(k),t.on("focusin"+j,function(b){if(b.target!==n.wrap[0]&&!a.contains(n.wrap[0],b.target))return A(),!1})},16),n.isOpen=!0,n.updateSize(l),z(g)},close:function(){if(!n.isOpen)return;z(c),n.isOpen=!1,n.st.removalDelay&&!n.isLowIE&&n.supportsTransition?(n._addClassToMFP(l),setTimeout(function(){n._close()},n.st.removalDelay)):n._close()},_close:function(){z(b);var c=l+" "+k+" ";n.bgOverlay.detach(),n.wrap.detach(),n.container.empty(),n.st.mainClass&&(c+=n.st.mainClass+" "),n._removeClassFromMFP(c);if(n.fixedContentPos){var e={paddingRight:""};n.isIE7?a("body, html").css("overflow",""):e.overflow="",a("html").css(e)}t.off("keyup"+j+" focusin"+j),n.ev.off(j),n.wrap.attr("class","mfp-wrap").removeAttr("style"),n.bgOverlay.attr("class","mfp-bg"),n.container.attr("class","mfp-container"),n.st.showCloseBtn&&(!n.st.closeBtnInside||n.currTemplate[n.currItem.type]===!0)&&n.currTemplate.closeBtn&&n.currTemplate.closeBtn.detach(),n._lastFocusedEl&&a(n._lastFocusedEl).focus(),n.currItem=null,n.content=null,n.currTemplate=null,n.prevHeight=0,z(d)},updateSize:function(a){if(n.isIOS){var b=document.documentElement.clientWidth/window.innerWidth,c=window.innerHeight*b;n.wrap.css("height",c),n.wH=c}else n.wH=a||r.height();n.fixedContentPos||n.wrap.css("height",n.wH),z("Resize")},updateItemHTML:function(){var b=n.items[n.index];n.contentContainer.detach(),n.content&&n.content.detach(),b.parsed||(b=n.parseEl(n.index));var c=b.type;z("BeforeChange",[n.currItem?n.currItem.type:"",c]),n.currItem=b;if(!n.currTemplate[c]){var d=n.st[c]?n.st[c].markup:!1;z("FirstMarkupParse",d),d?n.currTemplate[c]=a(d):n.currTemplate[c]=!0}u&&u!==b.type&&n.container.removeClass("mfp-"+u+"-holder");var e=n["get"+c.charAt(0).toUpperCase()+c.slice(1)](b,n.currTemplate[c]);n.appendContent(e,c),b.preloaded=!0,z(h,b),u=b.type,n.container.prepend(n.contentContainer),z("AfterChange")},appendContent:function(a,b){n.content=a,a?n.st.showCloseBtn&&n.st.closeBtnInside&&n.currTemplate[b]===!0?n.content.find(".mfp-close").length||n.content.append(B()):n.content=a:n.content="",z(e),n.container.addClass("mfp-"+b+"-holder"),n.contentContainer.append(n.content)},parseEl:function(b){var c=n.items[b],d=c.type;c.tagName?c={el:a(c)}:c={data:c,src:c.src};if(c.el){var e=n.types;for(var f=0;f<e.length;f++)if(c.el.hasClass("mfp-"+e[f])){d=e[f];break}c.src=c.el.attr("data-mfp-src"),c.src||(c.src=c.el.attr("href"))}return c.type=d||n.st.type||"inline",c.index=b,c.parsed=!0,n.items[b]=c,z("ElementParse",c),n.items[b]},addGroup:function(a,b){var c=function(c){c.mfpEl=this,n._openClick(c,a,b)};b||(b={});var d="click.magnificPopup";b.mainEl=a,b.items?(b.isObj=!0,a.off(d).on(d,c)):(b.isObj=!1,b.delegate?a.off(d).on(d,b.delegate,c):(b.items=a,a.off(d).on(d,c)))},_openClick:function(b,c,d){var e=d.midClick!==undefined?d.midClick:a.magnificPopup.defaults.midClick;if(!e&&(b.which===2||b.ctrlKey||b.metaKey))return;var f=d.disableOn!==undefined?d.disableOn:a.magnificPopup.defaults.disableOn;if(f)if(a.isFunction(f)){if(!f.call(n))return!0}else if(r.width()<f)return!0;b.type&&(b.preventDefault(),n.isOpen&&b.stopPropagation()),d.el=a(b.mfpEl),d.delegate&&(d.items=c.find(d.delegate)),n.open(d)},updateStatus:function(a,b){if(n.preloader){q!==a&&n.container.removeClass("mfp-s-"+q),!b&&a==="loading"&&(b=n.st.tLoading);var c={status:a,text:b};z("UpdateStatus",c),a=c.status,b=c.text,n.preloader.html(b),n.preloader.find("a").on("click",function(a){a.stopImmediatePropagation()}),n.container.addClass("mfp-s-"+a),q=a}},_addClassToMFP:function(a){n.bgOverlay.addClass(a),n.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),n.wrap.removeClass(a)},_hasScrollBar:function(a){return(n.isIE7?t.height():document.body.scrollHeight)>(a||r.height())},_parseMarkup:function(b,c,d){var e;d.data&&(c=a.extend(d.data,c)),z(f,[b,c,d]),a.each(c,function(a,c){if(c===undefined||c===!1)return!0;e=a.split("_");if(e.length>1){var d=b.find(j+"-"+e[0]);if(d.length>0){var f=e[1];f==="replaceWith"?d[0]!==c[0]&&d.replaceWith(c):f==="img"?d.is("img")?d.attr("src",c):d.replaceWith('<img src="'+c+'" class="'+d.attr("class")+'" />'):d.attr(e[1],c)}}else b.find(j+"-"+a).html(c)})},_getScrollbarSize:function(){if(n.scrollbarSize===undefined){var a=document.createElement("div");a.id="mfp-sbm",a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),n.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return n.scrollbarSize}},a.magnificPopup={instance:null,proto:o.prototype,modules:[],open:function(a,b){return C(),a||(a={}),a.isObj=!0,a.index=b||0,this.instance.open(a)},close:function(){return a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},a.fn.magnificPopup=function(b){C();var c=a(this);if(typeof b=="string")if(b==="open"){var d,e=p?c.data("magnificPopup"):c[0].magnificPopup,f=parseInt(arguments[1],10)||0;e.items?d=e.items[f]:(d=c,e.delegate&&(d=d.find(e.delegate)),d=d.eq(f)),n._openClick({mfpEl:d},c,e)}else n.isOpen&&n[b].apply(n,Array.prototype.slice.call(arguments,1));else p?c.data("magnificPopup",b):c[0].magnificPopup=b,n.addGroup(c,b);return c};var F,G=function(b){if(b.data&&b.data.title!==undefined)return b.data.title;var c=n.st.image.titleSrc;if(c){if(a.isFunction(c))return c.call(n,b);if(b.el)return b.el.attr(c)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><div class="mfp-img"></div><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var a=n.st.image,c=".image";n.types.push("image"),x(g+c,function(){n.currItem.type==="image"&&a.cursor&&s.addClass(a.cursor)}),x(b+c,function(){a.cursor&&s.removeClass(a.cursor),r.off("resize"+j)}),x("Resize"+c,n.resizeImage),n.isLowIE&&x("AfterChange",n.resizeImage)},resizeImage:function(){var a=n.currItem;if(!a||!a.img)return;if(n.st.image.verticalFit){var b=0;n.isLowIE&&(b=parseInt(a.img.css("padding-top"),10)+parseInt(a.img.css("padding-bottom"),10)),a.img.css("max-height",n.wH-b)}},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,F&&clearInterval(F),a.isCheckingImgSize=!1,z("ImageHasSize",a),a.imgHidden&&(n.content&&n.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var b=0,c=a.img[0],d=function(e){F&&clearInterval(F),F=setInterval(function(){if(c.naturalWidth>0){n._onImageHasSize(a);return}b>200&&clearInterval(F),b++,b===3?d(10):b===40?d(50):b===100&&d(500)},e)};d(1)},getImage:function(b,c){var d=0,e=function(){b&&(b.img[0].complete?(b.img.off(".mfploader"),b===n.currItem&&(n._onImageHasSize(b),n.updateStatus("ready")),b.hasSize=!0,b.loaded=!0,z("ImageLoadComplete")):(d++,d<200?setTimeout(e,100):f()))},f=function(){b&&(b.img.off(".mfploader"),b===n.currItem&&(n._onImageHasSize(b),n.updateStatus("error",g.tError.replace("%url%",b.src))),b.hasSize=!0,b.loaded=!0,b.loadError=!0)},g=n.st.image,h=c.find(".mfp-img");if(h.length){var i=document.createElement("img");i.className="mfp-img",b.img=a(i).on("load.mfploader",e).on("error.mfploader",f),i.src=b.src,h.is("img")&&(b.img=b.img.clone()),b.img[0].naturalWidth>0&&(b.hasSize=!0)}return n._parseMarkup(c,{title:G(b),img_replaceWith:b.img},b),n.resizeImage(),b.hasSize?(F&&clearInterval(F),b.loadError?(c.addClass("mfp-loading"),n.updateStatus("error",g.tError.replace("%url%",b.src))):(c.removeClass("mfp-loading"),n.updateStatus("ready")),c):(n.updateStatus("loading"),b.loading=!0,b.hasSize||(b.imgHidden=!0,c.addClass("mfp-loading"),n.findImageSize(b)),c)}}});var H,I=function(){return H===undefined&&(H=document.createElement("p").style.MozTransform!==undefined),H};a.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(a){return a.is("img")?a:a.find("img")}},proto:{initZoom:function(){var a=n.st.zoom,d=".zoom";if(!a.enabled||!n.supportsTransition)return;var e=a.duration,f=function(b){var c=b.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),d="all "+a.duration/1e3+"s "+a.easing,e={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},f="transition";return e["-webkit-"+f]=e["-moz-"+f]=e["-o-"+f]=e[f]=d,c.css(e),c},g=function(){n.content.css("visibility","visible")},h,i;x("BuildControls"+d,function(){if(n._allowZoom()){clearTimeout(h),n.content.css("visibility","hidden"),image=n._getItemToZoom();if(!image){g();return}i=f(image),i.css(n._getOffset()),n.wrap.append(i),h=setTimeout(function(){i.css(n._getOffset(!0)),h=setTimeout(function(){g(),setTimeout(function(){i.remove(),image=i=null,z("ZoomAnimationEnded")},16)},e)},16)}}),x(c+d,function(){if(n._allowZoom()){clearTimeout(h),n.st.removalDelay=e;if(!image){image=n._getItemToZoom();if(!image)return;i=f(image)}i.css(n._getOffset(!0)),n.wrap.append(i),n.content.css("visibility","hidden"),setTimeout(function(){i.css(n._getOffset())},16)}}),x(b+d,function(){n._allowZoom()&&(g(),i&&i.remove())})},_allowZoom:function(){return n.currItem.type==="image"},_getItemToZoom:function(){return n.currItem.hasSize?n.currItem.img:!1},_getOffset:function(b){var c;b?c=n.currItem.img:c=n.st.zoom.opener(n.currItem.el||n.currItem);var d=c.offset(),e=parseInt(c.css("padding-top"),10),f=parseInt(c.css("padding-bottom"),10);d.top-=a(window).scrollTop()-e;var g={width:c.width(),height:(p?c.innerHeight():c[0].offsetHeight)-f-e};return I()?g["-moz-transform"]=g.transform="translate("+d.left+"px,"+d.top+"px)":(g.left=d.left,g.top=d.top),g}}});var J=function(a){var b=n.items.length;return a>b-1?a-b:a<0?b+a:a},K=function(a,b,c){return a.replace("%curr%",b+1).replace("%total%",c)};a.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var c=n.st.gallery,d=".mfp-gallery",e=Boolean(a.fn.mfpFastClick);n.direction=!0;if(!c||!c.enabled)return!1;v+=" mfp-gallery",x(g+d,function(){c.navigateByImgClick&&n.wrap.on("click"+d,".mfp-img",function(){if(n.items.length>1)return n.next(),!1}),t.on("keydown"+d,function(a){a.keyCode===37?n.prev():a.keyCode===39&&n.next()})}),x("UpdateStatus"+d,function(a,b){b.text&&(b.text=K(b.text,n.currItem.index,n.items.length))}),x(f+d,function(a,b,d,e){var f=n.items.length;d.counter=f>1?K(c.tCounter,e.index,f):""}),x("BuildControls"+d,function(){if(n.items.length>1&&c.arrows&&!n.arrowLeft){var b=c.arrowMarkup,d=n.arrowLeft=a(b.replace("%title%",c.tPrev).replace("%dir%","left")).addClass(m),f=n.arrowRight=a(b.replace("%title%",c.tNext).replace("%dir%","right")).addClass(m),g=e?"mfpFastClick":"click";d[g](function(){n.prev()}),f[g](function(){n.next()}),n.isIE7&&(y("b",d[0],!1,!0),y("a",d[0],!1,!0),y("b",f[0],!1,!0),y("a",f[0],!1,!0)),n.container.append(d.add(f))}}),x(h+d,function(){n._preloadTimeout&&clearTimeout(n._preloadTimeout),n._preloadTimeout=setTimeout(function(){n.preloadNearbyImages(),n._preloadTimeout=null},16)}),x(b+d,function(){t.off(d),n.wrap.off("click"+d),n.arrowLeft&&e&&n.arrowLeft.add(n.arrowRight).destroyMfpFastClick(),n.arrowRight=n.arrowLeft=null})},next:function(){n.direction=!0,n.index=J(n.index+1),n.updateItemHTML()},prev:function(){n.direction=!1,n.index=J(n.index-1),n.updateItemHTML()},goTo:function(a){n.direction=a>=n.index,n.index=a,n.updateItemHTML()},preloadNearbyImages:function(){var a=n.st.gallery.preload,b=Math.min(a[0],n.items.length),c=Math.min(a[1],n.items.length),d;for(d=1;d<=(n.direction?c:b);d++)n._preloadItem(n.index+d);for(d=1;d<=(n.direction?b:c);d++)n._preloadItem(n.index-d)},_preloadItem:function(b){b=J(b);if(n.items[b].preloaded)return;var c=n.items[b];c.parsed||(c=n.parseEl(b)),z("LazyLoad",c),c.type==="image"&&(c.img=a('<img class="mfp-img" />').on("load.mfploader",function(){c.hasSize=!0}).on("error.mfploader",function(){c.hasSize=!0,c.loadError=!0,z("LazyLoadError",c)}).attr("src",c.src)),c.preloaded=!0}}})})(window.jQuery||window.Zepto);

},{}],12:[function(require,module,exports){
/*! Swipeshow (c) 2013 Rico Sta. Cruz, MIT license.
 *  http://ricostacruz.com/swipeshow
 *  https://github.com/rstacruz/swipeshow
 */

(function($) {
// Opinionated, touch-enabled simple slideshow using Cycler.js.
//
//     <div class="slideshow">
//       <ul class="slides">
//         <li class="slide"> ... </il>
//         <li class="slide"> ... </li>
//         <li class="slide"> ... </li>
//       </ul>
//     
//       <!-- optional controls: -->
//       <button class="next"></button>
//       <button class="previous"></button>
//     </div>
//
// To use:
//
//     $(".slideshow").swipeshow();
//
// Options (all of these are optional):
//
//     $(".slideshow").swipeshow({
//       autostart: true,
//       interval: 3000,     /* Time between movement (ms) */
//       initial: 0,         /* First slide's index */
//       speed: 700,         /* Animation speed (ms) */
//       friction: 0.3,      /* What happens when you swipe out of bounds? */
//       mouse: true,        /* enable mouse dragging controls? */
//       keys: true,
//
//       onactivate: function(){},
//       onpause: function(){},
//
//       $next:     $("button.next"),
//       $previous: $("button.previous"),
//       $dots:     $("div.dots")
//     });
//
//     $(".slideshow").swipeshow().next();
//     $(".slideshow").swipeshow().previous();
//     $(".slideshow").swipeshow().goTo(2);
//
//     $(".slideshow").swipeshow().pause();
//     $(".slideshow").swipeshow().start();
//
// Assumptions it makes:
//
//  - Markup is like above (`.slideshow > .slides > .slide`).
//  - Buttons (optional), by default, will be found in `.slideshow > .next` (and `.previous`)
//  - If there are images inside the slides, it will wait to load them before
//    starting the slideshow.

  $.swipeshow = {};

  $.swipeshow.version = "0.10.3";

  // Detect transition support, jQuery 1.8+ style.
  var transitions = typeof $("<div>").css({transition: 'all'}).css('transition') == 'string';

  var touchEnabled = ('ontouchstart' in document.documentElement);

  // Count instances.
  var instances = 0;

  function Swipeshow(element, options) {
    this.$slideshow = $(element);
    this.$container = this.$slideshow.find('> .slides');
    this.$slides    = this.$container.find('> .slide');
    this.options    = options;
    this.tag        = '.swipeshow.swipeshow-'+(++instances);
    this.disabled   = false;

    // Buttons
    this.$next      = getElement(this.$slideshow, options.$next, '.next', '~ .controls .next');
    this.$previous  = getElement(this.$slideshow, options.$previous, '.previous', '~ .controls .previous');
    this.$dots      = getElement(this.$slideshow, options.$dots, '.dots', '~ .controls .dots');

    this._addClasses();
    this._bindButtons();
    this._buildDots();
    if (options.keys) this._bindKeys();

    this.cycler     = this._getCycler();
    if (options.autostart !== false) this._startSlideshow();

    // Bind events.
    this._bindSwipeEvents();
    this._bindHoverPausing();
    this._bindResize();

    return this;
  }

  Swipeshow.prototype = {
    // Public API: delegate to Cycler
    goTo:     function(n) { this.cycler.goTo(n); return this; },
    previous: function()  { this.cycler.previous(); return this; },
    next:     function()  { this.cycler.next(); return this; },
    pause:    function()  { this.cycler.pause(); return this; },
    start:    function()  { this.cycler.start(); return this; },

    isStarted: function()  { return this.cycler && this.cycler.isStarted(); },
    isPaused:  function()  { return !this.isStarted(); },

    defaults: {
      speed: 400,
      friction: 0.3,
      mouse: true,
      keys: true,
      swipeThreshold: { distance: 10, time: 400 }
    },

    unbind: function() {
      var $slideshow = this.$slideshow;
      var $container = this.$container;
      var $slides    = this.$slides;
      var $dots      = this.$dots;
      var tag = this.tag;

      // Kill the timer.
      this.cycler.pause();

      // Unbind the events based on their tag (eg, `swipeshow-1`).
      $container.find('img').off(tag);
      $container.off(tag);
      $(document).off(tag);
      $(window).off(tag);

      // Remove dots
      if ($dots.length) $dots.html('');

      // Unregister so that it can be initialized again later.
      $slideshow.data('swipeshow', null);

      // Remove magic classes
      $slideshow.removeClass('running paused swipeshow-active touch no-touch');
      $container.removeClass('gliding grabbed');
      $slides.removeClass('active');
      $dots.removeClass('active');
      $('html').removeClass('swipeshow-grabbed');
    },

    // Returns the cycler.
    _getCycler: function() {
      var ss = this;
      var options = this.options;

      return new Cycler(ss.$slides, $.extend({}, options, {
        autostart: false,
        onactivate: $.proxy(this._onactivate, this),
        onpause: $.proxy(this._onpause, this),
        onstart: $.proxy(this._onstart, this)
      }));
    },

    // On slideshow activate handler for Cycler.
    _onactivate: function(current, i, prev, j) {
      if (this.options.onactivate) this.options.onactivate(current, i, prev, j);

      // Set classes
      if (prev) $(prev).removeClass('active');
      if (current) $(current).addClass('active');

      // Dots
      if (this.$dots.length) {
        this.$dots.find('.dot-item.active').removeClass('active');
        this.$dots.find('.dot-item[data-index="'+i+'"]').addClass('active');
      }

      // Move to the slide
      this._moveToSlide(i);
    },

    // Moves to slide number `i`. (Internal)
    // For external use, just use goto().
    _moveToSlide: function(i) {
      var width = this.$slideshow.width();
      setOffset(this.$container, -1 * width * i, this.options.speed);
    },

    // On slideshow pause handler.
    _onpause: function() {
      if (this.options.onpause) this.options.onpause();
      this.$slideshow
        .addClass('paused')
        .removeClass('running');
    },

    // On slideshow start handler.
    _onstart: function() {
      if (this.options.onstart) this.options.onstart();
      this.$slideshow
        .removeClass('paused')
        .addClass('running');
    },

    // Add classes to $slideshow.
    _addClasses: function() {
      this.$slideshow.addClass('paused swipeshow-active');
      this.$slideshow.addClass(touchEnabled ? 'touch' : 'no-touch');
    },

    _buildDots: function() {
      var ss    = this;
      var $dots = ss.$dots;
      var tag   = ss.tag;

      if (!$dots.length) return;

      $dots.html('').addClass('active');

      ss.$slides.each(function(i) {
        $dots.append($(
          "<button class='dot-item' data-index='"+i+"'>"+
          "<span class='dot' data-number='"+(i+1)+"'></span>"+
          "</button>"
        ));
      });

      $dots.on('click'+tag, '.dot-item', function() {
        var index = +($(this).data('index'));
        ss.goTo(index);
      });

    },

    _bindKeys: function() {
      var ss = this;
      var tag = ss.tag;
      var RIGHT = 39, LEFT = 37;

      $(document).on('keyup'+tag, function(e) {
        if (e.keyCode == RIGHT)
          ss.next();
        else if (e.keyCode == LEFT)
          ss.previous();
      });
    },

    // Binds events to buttons.
    _bindButtons: function() {
      var ss = this;

      this.$next.on('click', function(e) {
        e.preventDefault();
        if (!ss.disabled) ss.next();
      });

      this.$previous.on('click', function(e) {
        e.preventDefault();
        if (!ss.disabled) ss.previous();
      });
    },

    // Starts the slideshow initially.
    _startSlideshow: function() {
      var ss = this;
      var $images = ss.$slideshow.find('img');

      // If there are images, defer starting until images are loaded.
      if ($images.length === 0) {
        ss.start();
      } else {
        ss.disabled = true;
        ss.$slideshow.addClass('disabled');

        $images.onloadall(function() {
          ss.disabled = false;
          ss.$slideshow.removeClass('disabled');
          ss.start();
        });
      }
    },

    // Re-adjusts the slideshow after resizing the window.
    _bindResize: function() {
      var ss = this;

      $(window).on('resize'+ss.tag, function() {
        var width = ss.$slideshow.width();

        // Re-sit the current slide
        setOffset(ss.$container, -1 * width * ss.cycler.current, 0);

        // Reposition the CSS of the container and slides
        ss._reposition();
      });

      $(window).trigger('resize'+ss.tag);
    },

    // Reposition the CSS of the container and slides
    _reposition: function() {
      var width = this.$slideshow.width();
      var count = this.$slides.length;

      this.$slides.css({ width: width });
      this.$container.css({ width: width * count });
      this.$slides.css({ visibility: 'visible' });
      this.$slides.each(function(i) { $(this).css({ left: width * i }); });
    },

    // Binds pause-on-hover behavior.
    _bindHoverPausing: function() {
      // No need for this on touch-enabled browsers.
      if (touchEnabled) return;

      var ss = this;
      var tag = ss.tag;
      var hoverPaused = false;

      ss.$slideshow.on('mouseenter'+tag, function() {
        if (!ss.isStarted()) return;
        hoverPaused = true;
        ss.pause();
      });

      ss.$slideshow.on('mouseleave'+tag, function() {
        if (!hoverPaused) return;
        hoverPaused = false;
        ss.start();
      });
    },

    // Binds swiping behavior.
    _bindSwipeEvents: function() {
      var ss = this;
      var $slideshow = ss.$slideshow;
      var $container = ss.$container;
      var c = ss.cycler;
      var options = ss.options;
      var tag = ss.tag;

      // States
      var moving = false;
      var origin;
      var start;
      var delta;
      var lastTouch;
      var minDelta; // Minimum change for it to take effect.

      var width; // widtih of the slideshow
      var length = c.list.length;
      var friction = options.friction;

      // Store the tag so it can be unbound later.
      $slideshow.data('swipeshow:tag', tag);

      // Prevent dragging of the image.
      $container.find('img').on('mousedown'+tag, function(e) {
        e.preventDefault();
      });

      $container.on('touchstart'+tag + (options.mouse ? ' mousedown'+tag : ''), function(e) {
        // Only prevent mouse clicks. This allows vertical scrolling on mobile.
        // Do this before the sanity checks... you don't want the user to
        // accidentally drag the <img>.
        if (e.type === 'mousedown')
          e.preventDefault();

        if (ss.disabled) return;
        if ($container.is(':animated')) $container.stop();

        // Make some elements hard to swipe from.
        if ($(e.target).is('button, a, [data-tappable]')) {
          minDelta = 100;
        } else {
          minDelta = 45;
        }

        // Add classes.
        $container.addClass('grabbed');
        $('html').addClass('swipeshow-grabbed');

        width  = $slideshow.width();
        moving = true;
        origin = { x: null };
        start  = { x: getOffset($container), started: c.isStarted() };
        delta  = 0;
        lastTouch = null;

        // Pause the slideshow, but resume it later.
        if (start.started) c.pause();
      });

      $(document).on('touchmove'+tag + (options.mouse ? ' mousemove'+tag : ''), function(e) {
        if (ss.disabled) return;
        if ($container.is(':animated')) return;
        if (!moving) return;

        // X can sometimes be NaN because the touch event may not have any X/Y info.
        var x = getX(e);
        if (isNaN(x)) return;

        // Regord the first touch now. on a touchmove, not a touchstart. They
        // sometimes return different x/y coordinates.
        if (origin.x === null) origin.x = x;

        delta = x - origin.x;

        // When swiping was triggered on a button, it should be harder to swipe from.
        if (Math.abs(delta) <= minDelta) delta = 0;

        var target = start.x + delta;
        var max = -1 * width * (length - 1);

        // Only prevent scrolling when it's moved too far to the right/left
        if (Math.abs(delta) > 3)
          e.preventDefault();

        // Have some friction when scrolling out of bounds.
        if (target > 0) target *= friction;
        if (target < max) target = max + (target - max) * friction;

        // Record when it was last touched, so that when the finger is lifted, we
        // know how long it's been since
        lastTouch = +new Date();
        
        setOffset($container, target, 0);
      });

      $(document).on('touchend'+tag + (options.mouse ? ' mouseup'+tag : ''), function(e) {
        if (ss.disabled) return;
        if ($container.is(':animated')) return;
        if (!moving) return;

        var left  = getOffset($container);

        // Set classes
        $container.removeClass('grabbed');
        $('html').removeClass('swipeshow-grabbed');

        // Find out what slide it stopped to.
        var index = -1 * Math.round(left / width);

        // If the finger moved, but not enough to advance...
        if (lastTouch && c.current === index) {
          var timeDelta = +new Date() - lastTouch;

          var threshold = options.swipeThreshold;
          // If distance is far enough, and time is short enough.
          // I just winged these magic numbers trying to compare the experience to iOS's Photo app.
          if (Math.abs(delta) > threshold.distance && timeDelta < threshold.time) {
            var sign = delta < 0 ? -1 : 1;
            index -= sign;
          }
        }

        if (index < 0) index = 0;
        if (index > c.list.length-1) index = c.list.length-1;

        // Switch to that slide.
        c.goTo(index);

        e.preventDefault();

        // Restart the slideshow if it was already started before.
        if (start.started) c.start();

        // Reset.
        moving = false;
      });
    }
  };

  $.fn.swipeshow = function(options) {
    if (!options) options = {};

    options = $.extend({}, Swipeshow.prototype.defaults, options);

    $(this).each(function() {
      // Idempotency: don't do anything if it's already been initialized.
      if ($(this).data('swipeshow')) return;

      var ss = new Swipeshow(this, options);
      $(this).data('swipeshow', ss);
    });

    return $(this).data('swipeshow');
  };

  // Unbinds everything.
  $.fn.unswipeshow = function() {
    return this.each(function() {
      var ss = $(this).data('swipeshow');
      if (ss) ss.unbind();
    });
  };

  // Given a list of selectors, find one that matches and is based on a given `root`.
  //
  //     getElement($(".menu"), "a", "button");
  //
  function getElement(root) {
    var arg;
    for (var i=1; i < arguments.length; ++i) {
      arg = arguments[i];
      if (typeof arg === 'string') {
        var $el = $(arg, root);
        if ($el.length) return $el;
      } else if (typeof arg === 'object' && arg.constructor === $ && arg.length) {
        return arg;
      }
    }

    return $();
  }

  var offsetTimer;

  // Sets the X offset of the given element `$el` (usually `.slides`).
  // `speed` is in milliseconds. If `speed` is `0`, it happens instantly.
  function setOffset($el, left, speed) {
    $el.data('swipeshow:left', left);
    if (transitions) {
      if (speed === 0) {
        $el.css({ transform: 'translate3d('+left+'px,0,0)', transition: 'none' });
      } else {
        $el.css({ transform: 'translate3d('+left+'px,0,0)', transition: 'all '+speed+'ms ease' });
      }
    } else {
      if (speed === 0) {
        $el.css({left: left});
      } else {
        $el.animate({left: left}, speed);
      }
    }

    // Add the class to the `.slides` so it can be styled appropriately if needed.
    $el.addClass('gliding');

    if (typeof offsetTimer === 'undefined')
      clearTimeout(offsetTimer);

    offsetTimer = setTimeout(function() {
      $el.removeClass('gliding');
      offsetTimer = undefined;
    }, speed);
  }

  // Find the X offset of the container ('.slides').
  // Attempting to parse it out of the transform value ("matrix(1, 0, 0, 1,
  // -200, 0)") never seems to yield the right offset, so let's just go with
  // the stored value.
  function getOffset($el) {
    return $el.data('swipeshow:left') || 0;
  }

  // Extracts the X from given event object. Works for mouse or touch events.
  function getX(e) {
    if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0])
      return e.originalEvent.touches[0].clientX;

    if (e.clientX)
      return e.clientX;
  }
})(jQuery);

// ============================================================================

/*! Onloadall (c) 2012-2013 Rico Sta. Cruz, MIT license. */

(function($) {
  $.fn.onloadall = function(callback) {
    var $images = this;

    var images = {
      loaded: 0,
      total: $images.length
    };

    // Wait till all images are loaded...
    $images.on('load.onloadall', function() {
      if (++images.loaded >= images.total) { callback.apply($images); }
    });

    $(function() {
      $images.each(function() {
        if (this.complete) $(this).trigger('load.onloadall');
      });
    });

    return this;
  };
})(jQuery);

// ============================================================================

/*! Cycler (c) 2012-2013 Rico Sta. Cruz, MIT license. */

// Cycles between a given `list` at a given `interval`.
// Simply define an `onactivate` hook.
//
// All the options are optional except `onactivate`.
//
//     c = new Cycler(list, {
//       interval: 3000,
//       initial: 0, /* first slide's index */
//       onactivate: function(current, index, prev, prevIndex) { ... }, /* Required */
//       onstart: function() { ... },
//       onpause: function() { ... }
//     });
//
// Slideshow example
// -----------------
//
// The most common usecase of Cycler is to make your own carousel/slideshow
// implementation. Here's how you might make one:
//
//     var $parent = $(".slideshow");
//     var $images = $parent.find("img");
//
//     var c = new Cycler($images, {
//       interval: 5000,
//       onactivate: function(current) {
//         $images.hide();
//         $(current).show();
//       }
//     });
//
//     // Custom controls example
//     $parent.find("button.next").on("click", function() { c.next(); });
//     $parent.find("button.prev").on("click", function() { c.previous(); });
//
//     // Pause on hover example
//     $parent.on("hover", function() { c.pause(); }, function() { c.start(); });
//
// Navigating
// ----------
//
// You can switch by slides using `next()`, `previous()` and `goTo()`. When
// these are invoked, the interval timer is reset (that is, it will take 3000ms
// again to switch to the next slide).
//
// If these are called when the slideshow is paused, it should remain paused.
//
// Doing this will trigger the `onactivate` callback.
//
//     c.next();
//     c.previous();
//     c.goTo(0);
//
// The onactivate hook
// -------------------
//
// This is where the magic happens. It's called everytime a new slide is activated.
//
// The callback takes 4 arguments: the current list item (`current`) + its
// index in the list (`index`), and the previous item (`prev`) + its index (`prevIndex`).
//
//     var list = [ 'Apple', 'Banana', 'Cherry' ];
//
//     new Cycler(list, {
//       onactivate: function(current, index, prev, prevIndex) {
//         console.log("Switching from", prev, "to", current);
//         console.log("(from", prevIndex, "to", index, ")");
//       };
//     });
//
//     // Result:
//     //
//     // Switching from null to "Apple" (from null to 0)
//     // Switching from "Apple" to "Banana" (from 0 to 1)
//     // Switching from "Banana" to "Cherry" (from 1 to 2)
//     // Switching from "Cherry" to "Apple" (from 2 to 0)
//
// Pausing
// -------
//
// You can pause and unpause the slideshow with `pause()` and `start()`. Note
// that calling `start()` will reset the interval timer.
//
// These will call the `onpause` and `onstart` callbacks respectively.
//
//     c.pause();
//     c.start();
//
// You can pass `true` as an argument (eg, `c.pause(true)`) to these to supress
// triggering the callbacks.
//
// Properties
// ----------
//
//     c.current    /* Numeric index of current item */
//     c.list       /* The list being cycled */
//
// Chainability
// ------------
//
// All the methods are chainable, too, so you can do:
//
//     c.next().pause();

(function() {
  function Cycler(list, options) {
    this.interval   = options.interval || 3000;
    this.onactivate = options.onactivate || (function(){});
    this.onpause    = options.onpause || (function(){});
    this.onstart    = options.onstart || (function(){});
    this.initial    = (typeof options.initial === 'undefined') ? 0 : options.initial;
    this.autostart  = (typeof options.autostart === 'undefined') ? true : options.autostart;
    this.list       = list;
    this.current    = null;

    this.goTo(this.initial);
    if (this.autostart && typeof options.interval === 'number') this.start();

    return this;
  }

  Cycler.prototype = {
    start: function(silent) {
      var self = this;
      if ((!self.isStarted()) && (!silent)) self.onstart.apply(self);

      self.pause(true);
      self._timer = setTimeout(function() {
        self.next();
      }, self.interval);
      return self;
    },

    pause: function(silent) {
      if (this.isStarted()) {
        if (!silent) this.onpause.apply(this);
        clearTimeout(this._timer);
        this._timer = null;
      }
      return this;
    },

    // Delays the interval a bit
    restart: function(silent) {
      if (this.isStarted()) this.pause(true).start(silent);
      return this;
    },

    previous: function() {
      return this.next(-1);
    },

    isStarted: function() {
      return !! this._timer;
    },

    isPaused: function() {
      return ! this.isStarted();
    },

    next: function(i) {
      if (typeof i === 'undefined') i = 1;

      var len = this.list.length;
      if (len === 0) return this;

      // Get the index of the new item
      var idx = (this.current + i + len*2) % len;

      return this.goTo(idx);
    },

    goTo: function(idx) {
      if (typeof idx !== 'number') return this;

      var prev = this.current;
      this.current = idx;

      this.onactivate.call(this, this.list[idx], idx, this.list[prev], prev);
      this.restart(true);
      return this;
    }
  };

  window.Cycler = Cycler;
})();
},{}]},{},[1]);
