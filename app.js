var express = require('express'),
    auth    = require('http-auth'),
    vhost   = require('vhost'),
    fs      = require('fs'),
    yaml    = require('js-yaml'),
    config  = require('config');

// console.log(config);

const setting   = config.setting,
      hostname  = setting.hostname;
var app   = express();
for(var server of setting.server){
  // console.log(server);
  eval(`var ${server.name} = express();`);
  for(var subdomain of server.subdomain){
    if(subdomain == null){
      console.log(hostname);
      eval(`app.use(vhost('${hostname}', ${server.name}));`);
    }else{
      console.log(`${subdomain}.${hostname}`);
      eval(`app.use(vhost('${subdomain}.${hostname}', ${server.name}));`);
    }
  }
}
// if(typeof(main) != "undefined"){
//   console.log("Yes!");
// }

try{
  routeObj = yaml.safeLoad(fs.readFileSync('./route.yml', 'utf8'));
}catch(e){
  console.log(e);
}
// console.log(routeObj);
var route = {}, rest = {};
moldingRoute(routeObj, '');
// console.log(route);
delete routeObj;

var basic = auth.basic({
  realm: "aaa"
},function(username, password, callback){
  callback(username === "Tina" && password === "Bullock");
});

app.listen(3000, function(){
  console.log('Server listening on port 3000!');
});

// app.route('/')
//   .get(function(req, res){
//     res.end('Hello World!');
//   });
Object.keys(route).forEach(function(path){
  // console.log(`'${path}'=> title:'${route[path].title}', page:'${route[path].page}'`);
  main.route(path)
    .get(function(req, res){
      // console.log(req.params);
      if(Object.keys(req.params).length > 0){
        var vars = req.params;
        Object.keys(vars).forEach(function(key){
          regexp = new RegExp(`^${route[path]['var'][key]}$`);
          if(vars[key].match(regexp) == null){
            // console.log('NO!');
            res.status(404).end();
          }
        });
      }
      res.end(route[path].title);
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
      case '_num_':
        index = basePath + '/' + `:${obj[key].var}`;
        rest[obj[key].var] = "\\d+";
        break;
      case '_string_':
        index = basePath + '/' + `:${obj[key].var}`;
        rest[obj[key].var] = "\\S+";
        break;
      default:
        index = basePath + '/' + key;
        break;
    }

    if(obj[key].hasOwnProperty('page') && obj[key].page){
      // console.log(rest);
      route[index] = {
        title : obj[key].title,
        page  : obj[key].page,
        var   : Object.assign({}, rest)
      }
    }

    if(obj[key].hasOwnProperty('children')){
      moldingRoute(obj[key].children, index);
    }

    delete rest[obj[key].var];
  });
}