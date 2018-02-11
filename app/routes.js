// app/routes.js
var mongoose = require('mongoose');
var lecturer = require("./models/lecturer.js");
var post = require("./models/post.js");
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', guestOnly, function(req, res) {
        res.render('search.ejs')
    });

    app.get('/reviewPage', function(req, res){
      res.render('reviewPage.ejs')
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', guestOnly, function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', guestOnly, passport.authenticate('local-signup', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/home', isLoggedIn, function(req, res) {
        res.render('home.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', isLoggedIn, function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/api/lecturers', function(req, res) {
        lecturer.find(function(err, results){
            res.json(results)
        });
    })

    app.get('/api/lecturers/:query', function(req, res) {
        lecturer.find({$or:[{"firstname": new RegExp(req.params.query)},{"lastname": new RegExp(req.params.query)},{"subject": new RegExp(req.params.query)}]}, function(err, results){
            res.json(results)
        });
    })
    app.post('/api/lecturer', isLoggedIn, function(req, res){
        lecturer.create({ firstname: req.body.firstname , lastname: req.body.lastname, subject: req.body.subject}, function (err, new_lecturer) {
            if (err) return handleError(err);
            new_lecturer.username = new_lecturer.firstname.toLowerCase() + '.' + new_lecturer.lastname.toLowerCase();
            new_lecturer.save();
            res.redirect('/lecturer');
        });
    })
    app.get('/lecturer', isLoggedIn, function(req, res) {
        res.render('lecturer');
    })
    app.get('/lecturer/:username', function(req, res) {
        lecturer.findOne({"username": req.params.username}, function(err, result){
            if(!result) res.redirect('/');
            post.find({"lecturer": req.params.username}, function(err, new_posts){
                res.render('profile.ejs', {
                    lecturer: result,
                    posts: new_posts,
                    url: '/lecturer/' + req.params.username
                })
            }).sort({createdAt: -1})
        }).limit(1);
    })
    app.post('/lecturer/:username',isLoggedIn, function(req, res) {
        var comment = req.body.comment;
        var rating = req.body.rating;
        lecturer.findOne({"username": req.params.username}, function(err, result){
            if(!result) res.redirect('/');
            post.create({comment: comment, rating: rating, lecturer: req.params.username}, function(err, new_post) {
                //req.user.local.posts.push(new_post);
                res.redirect('/lecturer/'+req.params.username);
            })
        })
    })
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
function guestOnly(req, res, next) {
    if (!req.isAuthenticated())
        return next();
    res.redirect('/home')
}
