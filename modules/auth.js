/*jslint node: true*/

'use strict';

var self = this,
	db = require('./db'),
	passport         = require('passport'),
	TwitterStrategy  = require('passport-twitter').Strategy,
	LiveStrategy     = require('passport-windowslive').Strategy,
	c = require('nconf');

var TWITTER_CONSUMER_KEY       = c.get('TWITTER_CONSUMER_KEY')
  , TWITTER_CONSUMER_SECRET    = c.get('TWITTER_CONSUMER_SECRET')
  , TWITTER_CALLBACK_URL       = c.get('TWITTER_CALLBACK_URL_OLD')
  , WINDOWS_LIVE_CLIENT_ID     = c.get('WINDOWS_LIVE_CLIENT_ID')
  , WINDOWS_LIVE_CLIENT_SECRET = c.get('WINDOWS_LIVE_CLIENT_SECRET')
  , WINDOWS_LIVE_CALLBACK_URL  = c.get('WINDOWS_LIVE_CALLBACK_URL');

// Serialize users into sessions with just their user id
passport.serializeUser(function(user, cb){
	if (user) {
		cb(null, user.id);
	} else {
		cb(new Error('Couldn\'t serialize user'), null);
	}
});

passport.deserializeUser(db.deserializeUser);

passport.use(new TwitterStrategy({
	consumerKey: TWITTER_CONSUMER_KEY,
	consumerSecret: TWITTER_CONSUMER_SECRET,
	callbackURL: TWITTER_CALLBACK_URL
	}, function(token, tokenSecret, profile, done) {

	db.getUserFromTwitterProfile(profile, function(err, user){
		if (user && !err) {
			return done(null, user);
		} else {
			return err ? done(err, null) : done(new Error('User not authorized'), null);
		}

	});
}
));

passport.use(new LiveStrategy({
		clientID: WINDOWS_LIVE_CLIENT_ID,
		clientSecret: WINDOWS_LIVE_CLIENT_SECRET,
		callbackURL: WINDOWS_LIVE_CALLBACK_URL
	}, function(accessToken, refreshToken, profile, done) {
		console.log('access token: ' + accessToken);

		db.getUserFromLiveProfile(profile, function(err, user) {

		if (user && !err) {
			return done(null, user);
		} else {
			done('User not authorized', null);
		}

		});
	}
));

self.auth = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/admin-old/login');
};

self.authAdmin = function (req, res, next) { // They are authenticated and authorized
  if (req.isAuthenticated() && req.user.IsAdmin === true) { return next(); }
  res.redirect('/admin-old/notadmin');
};

module.exports.auth = self.auth;
module.exports.authAdmin = self.authAdmin;
