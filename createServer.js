var fs      = require('fs'),
    yaml    = require('js-yaml');

var error   = require('./error.js');

const configFile = './config/default.yml';
try{
  // configファイルの読み込み
  config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
  // console.log(config);
  var server = config.setting.server;
  // console.log(server);

  block_createServer: {
    if(process.argv.length > 2){
      if(process.argv[2].match(/^[A-Za-z0-9]{3,10}$/)){
        servername = process.argv[2];
      }else{
        console.log(error.printErrorMessage(2, [process.argv[2]]));
        break block_createServer;
      }
    }else{
      servername = 'create';
    }
    newServer = {
      name: servername,
      subdomain: [servername],
      route: `${servername}.yml`
    };
    // 作成するホストの名前の検証
    for(var host of server){
      // console.log(host);
      if(host.name == newServer.name){
        console.log(error.printErrorMessage(1, [newServer.name]));
        break block_createServer;
      }
    }
    server.push(newServer);
    console.log(newServer);
    // console.log(server);
    // console.log(config);

    // 設定情報をyaml型に変換
    dumpYaml = yaml.safeDump(config, {
      'styles': {
        '!!null': 'canonical'
      }
    });
    // console.log(dumpYaml);

    // configファイルに書き込み
    fs.writeFile(configFile, dumpYaml, function(err){
      if(err){throw err;}
      console.log(`config file('${configFile}') has been saved!`);
    });
  }
}catch(err){
  console.log(err);
}
