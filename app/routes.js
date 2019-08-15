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
        res.render('pages/statistics');
        
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
            var oldpath = files.filetoupload.path;
            //var newpath = recipts_datalake_path + files.filetoupload.name; //TODO: If multiple users upload files with SAME NAME then the computer will override. Need to find a good name for each file so that it will be unique. MAybe timestamp ?


            
            //Read file before uploading it
            //console.log(oldpath)
            var data = fs.readFileSync(oldpath);
            //console.log(data.toString());
            //Preprocess JSON to make sure it is valid
            var go = recipts.preprocess_recipt_json(data.toString());
            //If JSON is correct and valid
            if(go) {

                // Include created client
                var hdfs = require('webhdfs-client');

                // Initialize readable stream from local file
                // Change this to real path in your file system
                var localFileStream = fs.createReadStream(oldpath);
                console.log(oldpath);

                // Initialize writable stream to HDFS target
                var remoteFileStream = hdfs.createWriteStream('/bigdata/1.json');

                // Pipe data to HDFS
                localFileStream.pipe(remoteFileStream);

                // Handle errors
                remoteFileStream.on('error', function onError (err) {
                    // Do something with the error
                    console.log(err);
                    console.log("error");
                });

                // Handle finish event
                remoteFileStream.on('finish', function onFinish () {
                    // Upload is done
                    console.log("done");
                });

                //var res = fs.renameSync(oldpath, newpath);
                //fs.writeFileSync(newpath, data);
                //console.log("Successfuly saved recipt to disk.")

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