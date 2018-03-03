var express = require('express');

var app = express();

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});

app.route('/')
  .get(function(req, res){
    res.end('Hello World!');
  });
