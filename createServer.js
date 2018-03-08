var yaml    = require('js-yaml');
fs  = require('fs');

var error   = require('./error.js');
myFunc  = require('./func.js');

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
      title: servername,
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

    // routeの設定ファイルの作成
    var routeFilename = `./config/${servername}.yml`,
        routeObj = {},
        routeYaml;
    if(myFunc.isExistFile(routeFilename)){
      // console.log('Yes!');
      console.log(error.printErrorMessage(3, [routeFilename]));
      break block_createServer;
    }else{
      // console.log('No!');
    }
    routeObj[""] = {
      title: "index",
      page: "index"
    };
    routeYaml = yaml.safeDump(routeObj, {
      'styles': {
        '!!null': 'canonical'
      }
    });
    fs.writeFile(routeFilename, routeYaml, function(err){
      if(err){throw err;}
      console.log(`Route file('${routeFilename}') has been saved!`);
    });

    // pageディレクトリに追加
    var pageDir = `./page/${servername}`;
    if(myFunc.isExistFile(pageDir)){
      // console.log('Yes!');
      rmdir(pageDir);
    }else{
      // console.log('No!');
    }
    fs.mkdirSync(pageDir);
    fs.writeFile(pageDir+'/index.js', returnPageJsContent(), function(err){
      if(err){throw err;}
      console.log(`Page directory('${pageDir}/index.js') has been created!`);
    });

    // templateディレクトリに追加
    var templateDir = `./template/${servername}`;
    if(myFunc.isExistFile(templateDir)){
      // console.log('Yes!');
      rmdir(templateDir);
    }else{
      // console.log('No!');
    }
    fs.mkdirSync(templateDir);
    fs.writeFile(templateDir+'/index.ejs', returnTemplateContent(), function(err){
      if(err){throw err;}
      console.log(`Template directory('${templateDir}/index.ejs') has been created!`);
    });

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

function rmdir(path){
  var dirList = fs.readdirSync(path);
  // console.log(dirList);
  for(var file of dirList){
    var filepath = path+'/'+file,
        fileStat = fs.statSync(filepath);
    if(fileStat.isFile()){
      // console.log(`'${filepath}' is file`);
      fs.unlinkSync(filepath);
      // console.log(`${filepath} was deleted`);
    }else if(fileStat.isDirectory()){
      // console.log(`'${filepath}' is dir`);
      rmdir(filepath);
    }
  }
  fs.rmdirSync(path);
  // console.log(`${path} was deleted`);
}

function returnPageJsContent(){
  var pageJsContent = `
const Page = require(process.cwd() + '/page.js');

class Index extends Page {
  constructor(){
    super();
  }
}

module.exports = new Index();
`;
  pageJsContent = pageJsContent.substring(1);
  return pageJsContent;
}

function returnTemplateContent(){
  var templateContent = `
baseTempDir => <?= baseDir ?>
Page Title => <%= page.title %>
Server Name => <%= server.name %>
`;
  templateContent = templateContent.substring(1);
  return templateContent;
}
