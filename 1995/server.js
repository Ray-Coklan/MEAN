// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/api');

var UserSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength: 2},
    }, {timestamps: true });
mongoose.model('User', UserSchema);
var User = mongoose.model('User');
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// configure body-parser to read JSON
app.use(bodyParser.json());
app.get('/', function(req, res){
    User.find({}, function(err, users){
        if(err){
           console.log("Returned error", err);
            // respond with JSON
           res.json({message: "Error", error: err})
        }
        else {
            // respond with JSON
           res.json({message: "Success", users:users})
        }
     })
})   
app.get('/new/:name/', function(req, res) {
    var user = new User({name: req.params.name});
    user.save(function(err) {
        if(err){
            console.log("Returned error", err);
             // respond with JSON
            res.json({message: "Error", error: err})
        }
        else {
            res.json({users:users});
        }
    });
}); 
app.get('/remove/:name/', function(req, res){
    User.remove({name: req.params.name}, function(err){
        if(err){
           console.log("Returned error", err);
            // respond with JSON
           res.json({message: "Error", error: err})
        }
        else {
            // respond with JSON
           res.json({message: "Success"})
        }
    })
})   

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});