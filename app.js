/*jslint
  node: true*/

'use strict';

/**********************************
 * MODULE DEPENDENCIES
 **********************************/

var express          = require('express')
  , fs               = require('fs')
  , index            = require('./routes/index')
  , landing       = require('./routes/landing')
  , register         = require('./routes/register')
  , http             = require('http')
  , path             = require('path')
  , passport         = require('passport')
  , TwitterStrategy  = require('passport-twitter').Strategy
  , LiveStrategy     = require('passport-windowslive').Strategy
  , c                = require('nconf')
  , db               = require('./modules/db.js')
  , admin            = require('./routes/admin-post')
  , adminMain        = require('./routes/admin')
  , account          = require('./routes/account')
  , contact          = require('./routes/contact')
  , adminTopic       = require('./routes/admin-topic')
  , adminReminders   = require('./routes/admin-reminders')
  , redirects        = require('./routes/redirects')
  , post             = require('./routes/post')
  , app = module.exports = express()
  , port             = 3000;

// Load the configuration file with our keys in it, first from the env variables
// then from the config.json file
c.env().file({ file: 'config.json'});

/**********************************
 * PASSPORT AUTHENTICATION
 **********************************/
var TWITTER_CONSUMER_KEY       = c.get('TWITTER_CONSUMER_KEY')
  , TWITTER_CONSUMER_SECRET    = c.get('TWITTER_CONSUMER_SECRET')
  , TWITTER_CALLBACK_URL       = c.get('TWITTER_CALLBACK_URL')
  , WINDOWS_LIVE_CLIENT_ID     = c.get('WINDOWS_LIVE_CLIENT_ID')
  , WINDOWS_LIVE_CLIENT_SECRET = c.get('WINDOWS_LIVE_CLIENT_SECRET')
  , WINDOWS_LIVE_CALLBACK_URL  = c.get('WINDOWS_LIVE_CALLBACK_URL');

// Serialize users into sessions with just their user id
passport.serializeUser(function(user, cb){
  if (user) {
    cb(null, user.id);
  } else {
    cb(new Error('Couldnt serialize user'), null);
  }
});
passport.deserializeUser(db.deserializeUser);


passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY
  , consumerSecret: TWITTER_CONSUMER_SECRET
  , callbackURL: TWITTER_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {

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
  },
  function(accessToken, refreshToken, profile, done) {
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

/**********************************
 * SETTINGS / MIDDLEWARE
 **********************************/
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger());
app.use(express.compress());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: c.get('SESSION_SECRET') }));
app.use(passport.initialize());
app.use(passport.session());
/**************
 * Robots.txt redirect
 **************/
app.use(function(req, res, next){
  var onAzure = req.host.indexOf("azurewebsites") > -1;
  if(req.url === '/robots.txt' && onAzure){
    req.url = '/robots-azure.txt';
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.use(function(err, req, res, next) {
  res.render('error', { message : err });
});


/**********************************
 * ROUTES
 **********************************/
app.get('/', index.homepage);
app.get('/sharepoint', landing.sharepoint);
app.get('/sharepoint/register', register.sharepoint);
app.get('/powerplay/register', register.powerplay);
app.get('/power-bi/register', register.powerbi);

app.get('/post', post.index);
app.get('/post/category/:category', post.category);
app.get('/post/topic/:topic', post.topic);
app.get('/post/:id', post.get);

app.post('/contact', contact.index);
app.post('/csv', register.csv);

app.get('/admin', auth, adminMain.index);

/*****************
 * ADMIN
 ****************/
app.get('/admin/login', adminMain.login);

app.get('/admin/account'             , authAdmin , account.index);
app.post('/admin/account'            , authAdmin , account.create);
app.get('/admin/account/new'         , authAdmin , account.entry);
app.get('/admin/account/:id/update'  , authAdmin , account.update);
app.post('/admin/account/:id/update' , authAdmin , account.patch);
app.get('/admin/account/:id/delete'  , authAdmin , account.del);

app.get('/admin/topic'               , authAdmin , adminTopic.index);
app.post('/admin/topic'              , authAdmin , adminTopic.create);
app.get('/admin/topic/new'           , authAdmin , adminTopic.entry);
app.get('/admin/topic/:id/update'    , authAdmin , adminTopic.update);
app.post('/admin/topic/:id/update'   , authAdmin , adminTopic.patch);
app.get('/admin/topic/:id/delete'    , authAdmin , adminTopic.del);

app.get('/admin/post'                , auth      , admin.index);
app.get('/admin/post/new'            , auth      , admin.entry);
app.get('/admin/post/:id/update'     , auth      , admin.update);
app.post('/admin/post/:id/update'    , auth      , admin.create);
app.post('/admin/post'               , auth      , admin.create);
app.get('/admin/post/:id'            , auth      , admin.get);
app.get('/admin/posts'               , auth      , admin.all);
app.get('/admin/post/:id/publish'    , authAdmin , admin.publish);
app.get('/admin/post/:id/unpublish'  , authAdmin , admin.unpublish);
app.get('/admin/post/:id/delete'     , authAdmin , admin.del);

app.post('/admin/image-upload'       , auth      , admin.imageUpload);

app.get('/admin/notadmin', function(req, res) {
  res.send('You must be an admin to do the thing you were trying to do.');
});

app.get('/admin/reminders', authAdmin, adminReminders.index);
app.post('/admin/reminders', authAdmin, adminReminders.send);

/*****************
 * TWITTER
 ****************/
var message = 'Unable to authenticate, ' +
            'or you are not authorized to use this system.';

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){/* isnt called */}
);

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/admin/login?message=' + message
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/admin/post');
});

/*****************
 * WINDOWS LIVE
 ****************/

app.get('/auth/live',
  passport.authenticate('windowslive', { scope: ['wl.signin', 'wl.basic', 'wl.emails'] }));

app.get('/auth/live/callback',
  passport.authenticate('windowslive', {
    failureRedirect: '/admin/login?message=' + message
   }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/admin/post');
  });


/*****************
 * Old Site Redirects
 ****************/

app.get('/blogs/post/*', redirects);
app.get('/analytics', function(req, res) { res.redirect('/post/120085') });

/*****************
 * 404 Redirect
 ****************/
// TODO: this the wrong way to send a 404, it should be
// `res.status(404).render('404');` but that doesn't render correctly on Azure.
app.get('/*', function(req, res) { res.render('404'); });


/**********************************
 * START THE SERVER, SCOTTY!
 **********************************/
app.listen(process.env.PORT || port);
console.log('Express server listening on port ' + port);

/**********************************
 * MIDDLEWARE
 **********************************/
function auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/admin/login');
}

function authAdmin(req, res, next) { // They are authenticated and authorized
  if (req.isAuthenticated() && req.user.IsAdmin === true) { return next(); }
  res.redirect('/admin/notadmin');
}
