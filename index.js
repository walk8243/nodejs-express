var express = require('express'),
    auth    = require('http-auth'),
    fs      = require('fs'),
    yaml    = require('js-yaml');

var app   = express(),
    admin = express();

app.use('/admin', admin);

var routeObj, route = {};
try{
  routeObj = yaml.safeLoad(fs.readFileSync('./route.yml', 'utf8'));
}catch(e){
  console.log(e);
}
// console.log(routeObj);
moldingRoute(routeObj, '/');
console.log(route);

var basic = auth.basic({
  realm: "aaa"
},function(username, password, callback){
  callback(username === "Tina" && password === "Bullock");
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});

// app.route('/')
//   .get(function(req, res){
//     res.end('Hello World!');
//   });
Object.keys(route).forEach(function(path){
  // console.log(path + ': ' + route[path]);
  app.route(path)
    .get(function(req, res){
      res.end(route[path].title);
      console.log(req.params);
    });
});

admin.route('/')
  .get(auth.connect(basic), function(req, res){
    res.end('Welcome to private area - ' + req.user);
  });

function moldingRoute(obj, basePath){
  Object.keys(obj).forEach(function(key){
    // console.log(key);
    // console.log(obj[key]);
    var index;
    switch(key){
      case '_num_': case '_string_':
        index = basePath + `:${obj[key].var}`;
        break;
      default:
        index = basePath + key;
    }
    if(obj[key].hasOwnProperty('page') && obj[key].page){
      route[index] = {
        title : obj[key].title,
        page  : obj[key].page
      }
    }
    if(obj[key].hasOwnProperty('children')){
      moldingRoute(obj[key].children, `${index}/`);
    }
  });
}
