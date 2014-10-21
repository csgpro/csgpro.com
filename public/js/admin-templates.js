angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('home/home.html',
    "<h1>Dashboard</h1>\n"
  );


  $templateCache.put('navbar/navbar.html',
    "<div data-ng-controller=\"NavbarCtrl as navbarViewModel\">\n" +
    "\t<h3>Navbar</h3>\n" +
    "</div>\n"
  );


  $templateCache.put('posts/posts.html',
    "<h2>Posts</h2>\n"
  );

}]);
