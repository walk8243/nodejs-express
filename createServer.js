var fs      = require('fs'),
    yaml    = require('js-yaml');

const configFile = './config/default.yml';
try{
  routeObj = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
  console.log(routeObj);

  var server = routeObj.setting.server;
  // console.log(server);

  block_createServer: {
    newServer = {
      name: 'create',
      subdomain: ['create'],
      route: 'create.yml'
    };
    for(var host of server){
      // console.log(host);
      if(host.name == newServer.name){
        console.log(`Server'${newServer.name}' is Already exist!`);
        break block_createServer;
      }
    }
    server.push(newServer);
    // console.log(server);
    // console.log(routeObj);

    dumpYaml = yaml.safeDump(routeObj, {
      'styles': {
        '!!null': 'canonical'
      }
    });
    console.log(dumpYaml);

    fs.writeFile(configFile, dumpYaml, function(err){
      if(err){throw err;}
      console.log('The file has been saved!');
    });
  }
}catch(err){
  console.log(err);
}
