// app/routes.js
module.exports = function(app, passport) {

    // ------------------ GET ------------------

    app.get('/', function(req, res) {
        res.render('pages/index');
    });

    app.get('/upload', function(req, res) {
        res.render('pages/upload');
    });

    app.get('/statistics', function(req, res) {
        var data = {name:"test"};
        //Second argument is data sent to ejs template to generate dynamic page!
        res.render('pages/statistics', data); 
        
    });

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('pages/login', { message: req.flash('loginMessage') }); 
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/register', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('pages/register', { message: req.flash('signupMessage') });
    });

    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('pages/profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // ------------------ POST ------------------

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



    // process the signup form
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // app.post('/signup', do all our passport stuff here);







    //When user upload file, it is redirected here.
    app.post('/fileupload', function(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            //Read file
            //console.log(oldpath)
            var data = fs.readFileSync(oldpath);
            //console.log(data.toString());
            //Preprocess JSON to make sure it is valid
            var go = recipts.preprocess_recipt_json(data.toString());
            //If JSON is correct and valid
            if(go) {
                //TODO: Use upload API

                res.write('File uploaded and is correct format!');
                res.end();
            } else {
                res.write('File is not a valid JSON!');
                res.end();
            }


        });
    });  
}; // END EXPORT ROUTES 

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}