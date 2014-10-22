angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('home/home.html',
    "<h1>Dashboard</h1>\n"
  );


  $templateCache.put('navbar/navbar.html',
    "<nav class=\"navbar navbar-default navbar-citrus navbar-static-top\" role=\"navigation\" ng-controller=\"NavbarCtrl as navVM\">\n" +
    "  <div class=\"container\">\n" +
    "    <div class=\"navbar-header\">\n" +
    "      <button type=\"button\" class=\"navbar-toggle\" ng-click=\"navVM.isCollapsed = !navVM.isCollapsed\">\n" +
    "        <span class=\"sr-only\">Toggle navigation</span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "      </button>\n" +
    "      <a class=\"navbar-brand\" href=\"#\">CSG Pro</a>\n" +
    "    </div>\n" +
    "    <div class=\"collapse navbar-collapse\" collapse=\"navVM.isCollapsed\" id=\"main-nav\">\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "        <li ng-class=\"{active:navVM.isActive(['home'])}\" data-toggle=\"collapse\" data-target=\"#main-nav\"><a href=\"#/\" ng-click=\"navVM.isCollapsed = !navVM.isCollapsed\">Home</a></li>\n" +
    "\t\t<li ng-class=\"{active:navVM.isActive(['posts'])}\" data-toggle=\"collapse\" data-target=\"#main-nav\"><a href=\"#/posts\" ng-click=\"navVM.isCollapsed = !navVM.isCollapsed\">Posts</a></li>\n" +
    "    </ul>\n" +
    "\n" +
    "\t<ul class=\"nav navbar-nav navbar-right\">\n" +
    "\t</ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</nav>\n"
  );


  $templateCache.put('partials/clickable-row.html',
    "<div ng-click=\"getExternalScopes().gridRowSelectAction(row)\" ng-repeat=\"col in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell selectable\" ui-grid-cell>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('posts/posts.html',
    "<h2>Posts</h2>\n" +
    "\n" +
    "<div ui-grid=\"postsViewModel.gridOptions\" external-scopes=\"postsViewModel\" class=\"ui-grid\"></div>\n" +
    "<!-- <table class=\"table table-striped table-hover\">\n" +
    "    <thead>\n" +
    "        <tr>\n" +
    "\t\t\t<th width=\"70\">ID</th>\n" +
    "\t\t\t<th width=\"70\">Author</th>\n" +
    "            <th>Post Title</th>\n" +
    "            <th width=\"100\">Topics</th>\n" +
    "            <th width=\"100\">Category</th>\n" +
    "\t\t\t<th width=\"70\">Published</th>\n" +
    "\t\t\t<th width=\"70\">Updated</th>\n" +
    "\t\t\t<th width=\"70\"></th>\n" +
    "        </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "        <tr ng-repeat=\"post in postsViewModel.posts\" ng-click=\"postsViewModel.viewItem(post.id)\" class=\"selectable\">\n" +
    "\t\t\t<td ng-bind=\"post.id\"></td>\n" +
    "\t\t\t<td ng-bind=\"post.AuthorUsername\"></td>\n" +
    "            <td ng-bind=\"post.Title\"></td>\n" +
    "            <td ng-bind=\"post.Topics\"></td>\n" +
    "            <td ng-bind=\"post.Category\"></td>\n" +
    "\t\t\t<td ng-bind=\"post.PublishDate | date : 'M-dd-yyyy'\"></td>\n" +
    "\t\t\t<td ng-bind=\"post.UpdateDate | date : 'M-dd-yyyy'\"></td>\n" +
    "\t\t\t<td></td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table> -->\n"
  );

}]);
