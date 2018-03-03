var express = require('express'),
    auth    = require('http-auth');

var app   = express(),
    admin = express();

app.use('/admin', admin);

var basic = auth.basic({
  realm: "aaa"
},function(username, password, callback){
  callback(username === "Tina" && password === "Bullock");
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});

app.route('/')
  .get(function(req, res){
    res.end('Hello World!');
  });

admin.route('/')
  .get(auth.connect(basic), function(req, res){
    res.end('Welcome to private area - ' + req.user);
  });
