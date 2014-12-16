/*jslint
  node: true*/

'use strict';

/**********************************
 * MODULE DEPENDENCIES
 **********************************/

var express          = require('express')
  , fs               = require('fs')
  , index            = require('./routes/index')
  , landing          = require('./routes/landing')
  , register         = require('./routes/register')
  , http             = require('http')
  , path             = require('path')
  , c                = require('nconf')
  , db               = require('./modules/db.js')
  , db2               = require('./modules/db2.js')
  , contact          = require('./routes/contact')
  , redirects        = require('./routes/redirects')
  , post             = require('./routes/post')
  , api              = require('./routes/api')
  , upload           = require('./routes/upload')
  , account          = require('./routes/account')
  , admin            = require('./routes/admin-post')
  , adminMain        = require('./routes/admin')
  , adminTopic       = require('./routes/admin-topic')
  , adminReminders   = require('./routes/admin-reminders')
  , passport         = require('passport')
  , TwitterStrategy  = require('passport-twitter').Strategy
  , LiveStrategy     = require('passport-windowslive').Strategy
  , jwt              = require('jwt-simple')
  , moment           = require('moment')
  , qs               = require('querystring')
  , request          = require('request')
  , app = module.exports.app = exports.app = express()
  , port             = 3000;


// Load the configuration file with our keys in it, first from the env variables
// then from the config.json file
c.env().file({ file: 'config.json' });

/**********************************
 * AUTHENTICATION
 **********************************/
var TWITTER_CONSUMER_KEY       = c.get('TWITTER_CONSUMER_KEY')
  , TWITTER_CONSUMER_SECRET    = c.get('TWITTER_CONSUMER_SECRET')
  , TWITTER_CALLBACK_URL       = c.get('TWITTER_CALLBACK_URL')
  , WINDOWS_LIVE_CLIENT_ID     = c.get('WINDOWS_LIVE_CLIENT_ID')
  , WINDOWS_LIVE_CLIENT_SECRET = c.get('WINDOWS_LIVE_CLIENT_SECRET')
  , WINDOWS_LIVE_CALLBACK_URL  = c.get('WINDOWS_LIVE_CALLBACK_URL')
  , SESSION_SECRET             = c.get('SESSION_SECRET');

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
app.use(express.session({ secret: SESSION_SECRET }));
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

/**************
 * Login Required Middleware
 **************/
function ensureAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }

    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, SESSION_SECRET);

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }

    req.user = payload.sub;
    next();
}

/****************
* JWT TIME
***************/
function createToken(user) {
    if(user.id) {
        var payload = {
            sub: user.id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix(),
            user: user
        };
        return jwt.encode(payload, SESSION_SECRET);
    } else {
        return null;
    }
}

/**********************************
 * ROUTES
 **********************************/
app.get('/', index.homepage);
app.get('/sharepoint', landing.sharepoint);
app.get('/sharepoint/register', register.sharepoint);
app.get('/powerplay/register', register.powerplay);
app.get('/power-bi/register', register.powerbi);
app.get('/pdx-power-bi/register', register.pdxpowerbi);

app.get('/post', post.getPostsBySearch);
app.get('/post/category/:category', post.getPostsByCategory);
app.get('/post/topic/:topic', post.getPostsByTopic);
app.get('/post/:id', post.getPostByID);

app.post('/contact', contact.index);
app.post('/csv', register.csv);

/*****************
 * ADMIN (deprecated)
 ****************/
app.get('/admin-old', auth, adminMain.index);
app.get('/admin-old/login', adminMain.login);

app.get('/admin-old/account'             , authAdmin , account.index);
app.post('/admin-old/account'            , authAdmin , account.create);
app.get('/admin-old/account/new'         , authAdmin , account.entry);
app.get('/admin-old/account/:id/update'  , authAdmin , account.update);
app.post('/admin-old/account/:id/update' , authAdmin , account.patch);
app.get('/admin-old/account/:id/delete'  , authAdmin , account.del);

app.get('/admin-old/topic'               , authAdmin , adminTopic.index);
app.post('/admin-old/topic'              , authAdmin , adminTopic.create);
app.get('/admin-old/topic/new'           , authAdmin , adminTopic.entry);
app.get('/admin-old/topic/:id/update'    , authAdmin , adminTopic.update);
app.post('/admin-old/topic/:id/update'   , authAdmin , adminTopic.patch);
app.get('/admin-old/topic/:id/delete'    , authAdmin , adminTopic.del);

app.get('/admin-old/post'                , auth      , admin.index);
app.get('/admin-old/post/new'            , auth      , admin.entry);
app.get('/admin-old/post/:id/update'     , auth      , admin.update);
app.post('/admin-old/post/:id/update'    , auth      , admin.create);
app.post('/admin-old/post'               , auth      , admin.create);
app.get('/admin-old/post/:id'            , auth      , admin.get);
app.get('/admin-old/posts'               , auth      , admin.all);
app.get('/admin-old/post/:id/publish'    , authAdmin , admin.publish);
app.get('/admin-old/post/:id/unpublish'  , authAdmin , admin.unpublish);
app.get('/admin-old/post/:id/delete'     , authAdmin , admin.del);

app.post('/admin-old/image-upload'       , auth      , admin.imageUpload);

app.get('/admin-old/notadmin', function(req, res) {
  res.send('You must be an admin to do the thing you were trying to do.');
});

app.get('/admin-old/reminders', authAdmin, adminReminders.index);
app.post('/admin-old/reminders', authAdmin, adminReminders.send);

/*****************
 * API
 ****************/

/* POSTS */
app.get('/api/posts', api.posts.getPosts);
app.get('/api/posts/category/:category', api.posts.getPosts);
app.get('/api/posts/topic/:topic', api.posts.getPosts);
app.get('/api/posts/:id', api.posts.getPostByID);
app.post('/api/posts', api.posts.createPost);
app.patch('/api/posts/:id', api.posts.updatePost);
app.delete('/api/posts/:id', api.posts.deletePost);

/* USERS */
app.get('/api/users', ensureAuthenticated, api.users.getUsers);
app.get('/api/users/:id', ensureAuthenticated, api.users.getUserByID);
app.get('/api/users/other/:search', api.users.getUserByOther);
app.post('/api/users', ensureAuthenticated, api.users.createUser);
app.patch('/api/users/:id', ensureAuthenticated, api.users.updateUser);
app.delete('/api/users/:id', ensureAuthenticated, api.users.deleteUser);

/* TOPICS */
app.get('/api/topics', api.topics.getTopics);
app.get('/api/topics/:id', api.topics.getTopicByID);
app.post('/api/topics', api.topics.createTopic);
app.patch('/api/topics/:id', api.topics.updateTopic);
app.delete('/api/topics/:id', api.topics.deleteTopic);

/*****************
 * TWITTER
 ****************/
app.get('/auth/twitter', function(req, res) {
    var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    var authenticateUrl = 'https://api.twitter.com/oauth/authenticate';

    if (!req.query.oauth_token || !req.query.oauth_verifier) {
        var requestTokenOauth = {
            consumer_key: TWITTER_CONSUMER_KEY,
            consumer_secret: TWITTER_CONSUMER_SECRET,
            callback: TWITTER_CALLBACK_URL
        };

        // Step 1. Obtain request token for the authorization popup.
        request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
            var oauthToken = qs.parse(body);
            var params = qs.stringify({ oauth_token: oauthToken.oauth_token });

            // Step 2. Redirect to the authorization screen.
            res.redirect(authenticateUrl + '?' + params);
        });
    } else {
    var accessTokenOauth = {
        consumer_key: TWITTER_CONSUMER_KEY,
        consumer_secret: TWITTER_CONSUMER_SECRET,
        token: req.query.oauth_token,
        verifier: req.query.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, profile) {
        profile = qs.parse(profile);

        var searchStr = '$filter=TwitterHandle eq \'@' + profile.screen_name + '\'';
        db2.getItem('users', searchStr, function(err, data) {
            if (err) {
                var msg = {
                    status: 'fail',
                    message: 'Error Retrieving User',
                    error: err
                };
                return res.send(JSON.stringify(msg));
            } else {
                if(req.headers.authorization && req.headers.authorization.indexOf('undefined') == -1) {
                    var token = req.headers.authorization.split(' ')[1];
                    var payload = jwt.decode(token, SESSION_SECRET);

                    if (payload.sub !== data[0].id) {
                        res.status(400).send({ message: 'User not found' });
                    } else {
                        res.send({ token: createToken(data[0]) });
                    }
                } else {
                    res.send({ token: createToken(data[0]) });
                }
            }
        });
    });
    }
});

/*****************
 * WINDOWS LIVE
 ****************/

/*****************
 * FILE UPLOADS
 ****************/
app.post('/upload/img/author', upload.saveAuthorImage);
app.post('/upload/img/post', upload.savePostImage);

/*****************
 * PASSPORT (Deprecated)
 ****************/
var TWITTER_CONSUMER_KEY_OLD       = c.get('TWITTER_CONSUMER_KEY_OLD')
  , TWITTER_CONSUMER_SECRET_OLD    = c.get('TWITTER_CONSUMER_SECRET_OLD')
  , TWITTER_CALLBACK_URL_OLD       = c.get('TWITTER_CALLBACK_URL_OLD')
  , WINDOWS_LIVE_CLIENT_ID_OLD     = c.get('WINDOWS_LIVE_CLIENT_ID')
  , WINDOWS_LIVE_CLIENT_SECRET_OLD = c.get('WINDOWS_LIVE_CLIENT_SECRET')
  , WINDOWS_LIVE_CALLBACK_URL_OLD  = c.get('WINDOWS_LIVE_CALLBACK_URL');

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
    consumerKey: TWITTER_CONSUMER_KEY_OLD,
    consumerSecret: TWITTER_CONSUMER_SECRET_OLD,
    callbackURL: TWITTER_CALLBACK_URL_OLD
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
        clientID: WINDOWS_LIVE_CLIENT_ID_OLD,
        clientSecret: WINDOWS_LIVE_CLIENT_SECRET_OLD,
        callbackURL: WINDOWS_LIVE_CALLBACK_URL_OLD
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

function auth (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/admin-old/login');
};

function authAdmin (req, res, next) { // They are authenticated and authorized
  if (req.isAuthenticated() && req.user.IsAdmin === true) { return next(); }
  res.redirect('/admin-old/notadmin');
};

/*****************
 * TWITTER (Deprecated)
 ****************/
var message = 'Unable to authenticate, ' +
            'or you are not authorized to use this system.';

app.get('/auth-old/twitter',
  passport.authenticate('twitter'),
  function(req, res){/* isnt called */}
);

app.get('/auth-old/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/admin-old/login?message=' + message
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/admin-old/post');
});

/*****************
 * WINDOWS LIVE (Deprecated)
 ****************/

app.get('/auth-old/live',
  passport.authenticate('windowslive', { scope: ['wl.signin', 'wl.basic', 'wl.emails'] }));

app.get('/auth-old/live/callback',
  passport.authenticate('windowslive', {
    failureRedirect: '/admin-old/login?message=' + message
   }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/admin-old/post');
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
