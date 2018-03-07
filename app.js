var express = require('express'),
    auth    = require('http-auth'),
    vhost   = require('vhost'),
    yaml    = require('js-yaml'),
    config  = require('config');

fs      = require('fs'),
myFunc  = require('./func.js'),
error   = require('./error.js');
// console.log(config);

var digest = auth.digest({
  realm : "admin",
  file  : "./.htpasswd"
});

const setting   = config.setting,
      hostname  = setting.hostname;
var app = express();

var route = {},
    page  = {},
    rest;
for(var server of setting.server){
  // console.log(server);
  let serverName = server.name;
  eval(`var ${serverName} = express();`);
  for(var subdomain of server.subdomain){
    if(subdomain == null){
      // console.log(hostname);
      app.use(vhost(hostname, eval(`${serverName}`)));
    }else{
      // console.log(subdomain+'.'+hostname);
      app.use(vhost(subdomain+'.'+hostname, eval(`${serverName}`)));
    }
  }
  page[serverName] = {};

  // console.log(eval(`${serverName}`));
  try{
    if(myFunc.isExistFile(`./config/${server.route}`)){
      // console.log('Yes!');
      routeObj = yaml.safeLoad(fs.readFileSync(`./config/${server.route}`, 'utf8'));
      // console.log(routeObj);

      route[serverName] = {},
      rest = {};
      moldingRoute(serverName, routeObj, '');
      // console.log(route);
      delete routeObj;

      if(server.hasOwnProperty('auth') && server.auth){
        // console.log(server.name);
        Object.keys(route[serverName]).forEach(function(path){
          // console.log(`'${path}'=> title:'${route[serverName][path].title}', page:'${route[serverName][path].page}'`);
          let sendData = createSendData(server, path);
          page[serverName][path] = myFunc.readPage(serverName, route[serverName][path].page, sendData);
          if(page[serverName][path] === false){
            return;
          }
          eval(`${serverName}`).route(path)
            .get(auth.connect(digest), function(req, res){
              onRequest(req, res, sendData);
            });
        });
      }else{
        Object.keys(route[serverName]).forEach(function(path){
          // console.log(`'${path}'=> title:'${route[serverName][path].title}', page:'${route[serverName][path].page}'`);
          let sendData = createSendData(server, path);
          page[serverName][path] = myFunc.readPage(serverName, route[serverName][path].page, sendData);
          if(page[serverName][path] === false){
            return;
          }
          eval(`${serverName}`).route(path)
            .get(function(req, res){
              onRequest(req, res, sendData);
            });
        });
      }
    }else{
      // console.log('No!');
    }
  }catch(e){
    console.log(e);
  }
}

app.listen(3000, function(){
  console.log('Server listening on port 3000!');
});

function onRequest(req, res, data){
  // console.log(data);
  // console.log(req.params);
  if(Object.keys(req.params).length > 0){
    var vars = req.params;
    Object.keys(vars).forEach(function(key){
      regexp = new RegExp(`^${data.var[key]}$`);
      if(vars[key].match(regexp) == null){
        // console.log('NO!');
        res.status(404).end();
      }
    });
  }
  // console.log(page[data.server][data.path]);
  if(page[data.server.id][data.page.path] === null){
    res.status(204).end();
  }else{
    res.status(200);
    if(req.user){
      req.params.user = req.user;
    }
    page[data.server.id][data.page.path].render(res, req.params);
  }
  // res.end(data.title);
}

function moldingRoute(inputArea, obj, basePath){
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
      route[inputArea][index] = {
        title : obj[key].title,
        page  : obj[key].page,
        var   : Object.assign({}, rest)
      }
    }

    if(obj[key].hasOwnProperty('children')){
      moldingRoute(inputArea, obj[key].children, index);
    }

    delete rest[obj[key].var];
  });
}

function createSendData(server, path){
  return {
    server  : {
      id    : server.name,
      name  : server.title
    },
    page    : {
      id    : route[server.name][path].page,
      title : route[server.name][path].title,
      path  : path
    },
    var     : route[server.name][path].var
  }
}
