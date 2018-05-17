// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/messages');


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
// define Schema variable
var Schema = mongoose.Schema;

// define Post Schema
var PostSchema = new mongoose.Schema({
 text: {type: String, required: true }, 
 comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true });
// define Comment Schema
var CommentSchema = new mongoose.Schema({
 _post: {type: Schema.Types.ObjectId, ref: 'Post'},
 text: {type: String, required: true }
}, {timestamps: true });
// set our models by passing them their respective Schemas
mongoose.model('Post');
mongoose.model('Comment');
// store our models in variables
var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/messages');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    name: {type: String, required: true},
    message: {type: String, required: true}, 
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
},{timestamps:true});
mongoose.model('Message', messageSchema)

var commentSchema = new Schema({
    name: {type: String, required: true},
    comment: {type: String, required: true},
    _message: {type: Schema.Types.ObjectId, ref: 'Message'},
},{timestamps:true});
mongoose.model('Comment', commentSchema)

var Message = mongoose.model('Message')
var Comment = mongoose.model('Comment')


app.post('/new_message',function(req,res){
    var new_message = new Message(req.body);
    new_message.save(function(err){
        if(err)
            res.json(err);
        else
            res.redirect('/');
    })
})

app.post('/new_comment/:id',function(req,res){
    Message.findOne({_id:req.params.id}, function(err,message){
        if(err)
            res.json(err);
        else{
            var new_comment = new Comment({
                _message: req.params.id,
                name: req.body.name,
                comment: req.body.comment
            });
            console.log(new_comment)
            new_comment.save(function(err){
                if(err)
                    res.json(err);
                else{
                    message.comments.push(new_comment._id);
                    message.save(function(err){
                        if(err)
                            res.json(err);
                        else
                            res.redirect('/');
                    });
                };
            });
        };  
    });
});


app.get('/',function(req,res){
    Message.find({}).populate('comments').exec(function(err,messages){
        if(err)
            res.json(err);
        else{
            console.log(messages)
            res.render('index',{messages:messages})
        }
    });
});
app.listen(8000, function() {
    console.log("listening on port 8000");
})