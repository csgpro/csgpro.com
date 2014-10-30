angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('home/home.html',
    "<h1>Dashboard</h1>\n"
  );


  $templateCache.put('login/login.html',
    "<button class=\"btn btn-sm btn-primary\" ng-click=\"loginViewModel.authenticate('twitter')\">Sign in with Twitter</button>\n"
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
    "        <li data-toggle=\"collapse\" data-target=\"#main-nav\" data-ng-class=\"{active:navVM.isActive(['profile'])}\" data-ng-show=\"navVM.userLogged()\"><a href=\"#/profile\"><span class=\"glyphicon glyphicon-cog\"></span></a></li>\n" +
    "        <li data-toggle=\"collapse\" data-ng-class=\"{active:navVM.isActive(['login'])}\"  data-target=\"#main-nav\" data-ng-show=\"!navVM.userLogged()\"><a href=\"#/login\">Log In</a></li>\n" +
    "        <li data-toggle=\"collapse\" data-target=\"#main-nav\" data-ng-show=\"navVM.userLogged()\"><a href=\"#/logout\">Log Out</a></li>\n" +
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


  $templateCache.put('partials/toaster.html',
    "<toaster-container></toaster-container>\n"
  );


  $templateCache.put('posts/posts.html',
    "<div ui-grid=\"postsViewModel.gridOptions\" external-scopes=\"postsViewModel\" class=\"ui-grid\"></div>\n"
  );


  $templateCache.put('profile/profile.html',
    "<div class=\"panel panel-default\">\n" +
    "\t<div class=\"panel-heading\">\n" +
    "\t\t<h3 class=\"panel-title\">Details</h3>\n" +
    "\t</div>\n" +
    "\t<div class=\"panel-body\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<div class=\"col-sm-3 form-group\">\n" +
    "\t\t\t\t<label class=\"control-label\">User Name</label>\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" data-ng-model=\"profileViewModel.user.Username\" disabled />\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"col-sm-3 form-group\">\n" +
    "\t\t\t\t<label class=\"control-label\">Full Name</label>\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" data-ng-model=\"profileViewModel.user.FullName\" />\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"col-sm-3 form-group\">\n" +
    "\t\t\t\t<label class=\"control-label\">Twitter Handle</label>\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" data-ng-model=\"profileViewModel.user.TwitterHandle\" />\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"col-sm-3 form-group\">\n" +
    "\t\t\t\t<label class=\"control-label\">Created On</label>\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" data-ng-model=\"::profileViewModel.user.CreateDateDisplay\" disabled />\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"col-sm-6 form-group\">\n" +
    "\t\t\t\t<label class=\"conrol-label\">Profile Photo</label>\n" +
    "\t\t\t\t<div ng-show=\"profileViewModel.user.ProfileUrl\">\n" +
    "\t\t\t\t\t<img ng-src=\"{{profileViewModel.user.ProfileUrl}}\" />\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div>\n" +
    "\t\t\t\t\t<label class=\"control-label\">Profile Image URL</label>\n" +
    "\t\t\t\t\t<input type=\"text\" class=\"form-control\" data-ng-model=\"profileViewModel.user.ProfileUrl\" />\n" +
    "\t\t\t\t\t<button class=\"btn btn-primary\" ng-file-select=\"profileViewModel.onFileSelect($files)\" data-multiple=\"true\" name=\"image\">Upload Image</button>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t</div>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('toolbar/toolbar.html',
    "<div ng-controller=\"ToolbarCtrl as toolbar\" class=\"toolbar\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-4\">\n" +
    "                <div class=\"pull-left\">\n" +
    "                    <button class=\"btn btn-xs btn-default\" ng-click=\"toolbar.returnToList()\" ng-show=\"toolbar.returnButtonEnabled()\">\n" +
    "                        <span class=\"glyphicon glyphicon-th-list\"></span>\n" +
    "                    </button>\n" +
    "                    &nbsp;\n" +
    "                </div>\n" +
    "                <h2 class=\"page-title\">\n" +
    "                    {{ pageTitle }}\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-8\">\n" +
    "\n" +
    "                <div class=\"pull-right\">\n" +
    "                    <button class=\"btn btn-xs btn-primary\" ng-click=\"toolbar.addItem()\" ng-show=\"toolbar.addButtonEnabled()\">\n" +
    "                        <span class=\"glyphicon glyphicon-plus\"></span>\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-xs btn-primary\" ng-click=\"toolbar.editItem()\" ng-show=\"editButtonEnabled()\">\n" +
    "                        <span class=\"glyphicon glyphicon-pencil\"></span>\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-success btn-xs\" ng-click=\"toolbar.saveRecord()\" ng-show=\"toolbar.saveButtonEnabled()\">\n" +
    "                        <span class=\"glyphicon glyphicon-save\"></span> Save\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-warning btn-xs\" ng-click=\"toolbar.cancel()\" ng-show=\"toolbar.cancelButtonEnabled()\">\n" +
    "                        <span class=\"glyphicon glyphicon-remove\"></span> Cancel\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );

}]);
