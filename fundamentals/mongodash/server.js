// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/animals');

var UserSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength: 2},
    }, {timestamps: true });
mongoose.model('User', UserSchema);
var User = mongoose.model('User');

app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            console.log("there's a problem");
        }
        else {
            res.render('index', {users: users});
        }
    })
})

app.get('/new', function(req, res) {
    res.render('new');
});
app.post('/', function(req,res){
    var user = new User(req.body);
    user.save(function(err){
        if (err){
            res.render('new',{title:'error'})
        } else{
            res.redirect('/')
        }
    })
})
app.get('/:id',function(req,res){
    User.find({_id:req.params.id}, req.body, function(err,user){
        if(err){
            console.log(err);
        }else{
            res.render('show', {user:user[0]});
        }
    })
})
app.get('/:id/edit/', function(req, res){
	User.find({ _id: req.params.id }, function(err, user){
		if (err){
			console.log(err);
		} else {
			res.render('edit', {user: user[0]});
		}
	});
});
app.post('/user/:id', function(req, res){
    User.update({ _id: req.params.id}, req.body, function(err,user){
        if (err){
            console.log(err)
        }else{
            res.redirect('/')
        }
    })
})
app.post('/:id/destroy', function(req, res){
	User.remove({ _id: req.params.id }, function(err, result){
		if (err){
			console.log(err);
		} else {
			res.redirect('/')
		}
	});
});


// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})