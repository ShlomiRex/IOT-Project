// app/routes.js
const conf = require("../config/database")
const mongo = require("./mongo")

module.exports = function(app, passport) {

    // ------------------ GET ------------------

    app.get('/', function(req, res) {
        res.render('pages/index');
    });

    app.get('/upload', function(req, res) {
        res.render('pages/upload');
    });

    app.get('/statistics', function(req, res) {
        var timestampArray=[], tempArray=[], humidArray=[],lightArray=[],pirArray=[]; 

        
        mongo.MongoClient.connect(conf.url, function(err, db) {
            if (err) throw err;
            
            const limit = 10;            
            var dbo = db.db(conf.db_name);
            
            dbo.collection(conf.sensors_collection).find().limit(limit).toArray(function(err, result) {
                if (err) throw err;
                
                var from = new Date();
                var to = new Date()

                from.setMonth(7)
                to.setMonth(7)
                //to.setMonth(8)

                from.setDate(1)
                to.setDate(15)

                from.setHours(1)


                var min = from.getTime(), max = to.getTime();
                
                for(var i = 0; i < result.length; i++) {
                    var doc = result[i]

                    var mydate = new Date(doc.timestamp);

                    if ((doc != null) && (mydate.getTime()>=min) && (mydate.getTime()<=max)) {
                        timestampArray.push(doc.timestamp);
                        tempArray.push(doc.temp);
                        humidArray.push(doc.humid);
                        lightArray.push(doc.light);
                        pirArray.push(doc.pir);
                    }
                }

                var data = {
                    title_text: "Sensors value over time",
                    labels: timestampArray,
        
                    dataset1_title: "Temperature",
                    dataset1_data: tempArray,
                    dataset2_title: "Humidity",
                    dataset2_data: humidArray,
                    dataset3_title: "Light",
                    dataset3_data: lightArray,
                    dataset4_title: "PIR",
                    dataset4_data: pirArray
                };
                //Second argument is data sent to ejs template to generate dynamic page!
                res.render('pages/statistics', data); 

                db.close();
            });
        });        
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
