// angular
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';

// rxjs
import 'rxjs';

/**
 * Some 3rd party libaries aren't compatible with module loaders.
 * http://stackoverflow.com/a/34320472/3732163
 */
require('!!script!jquery/dist/jquery.min.js');
require('!!script!foundation-sites/dist/foundation.min.js');
require('!!script!motion-ui/dist/motion-ui.min.js');