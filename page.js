ejs     = require('ejs');
myFunc  = require('./func.js');

class Page {
  constructor(){
    this.template = null;
    this.pageData = {};
    this.baseTempDir = "";
  }

  setData(data){
    this.pageData = data;
    // console.log(this.pageData);
  }

  setTemplate(filepath){
    if(myFunc.isExistFile(`./template/${filepath}.ejs`)){
      this.template = `./template/${filepath}.ejs`;
    }else if(myFunc.isExistFile(`./template/${filepath}/index.ejs`)){
      this.template = `./template/${filepath}/index.ejs`;
    }else{
      this.template = null;
    }
    // console.log('OK!');
  }

  createTemplate(){
    if(!this.baseTempDir){
      this.baseTempDir = `${__dirname}/template/${this.pageData.server.id}`;
    }
    // console.log(this.baseTempDir);

    var tempEjs = fs.readFileSync(this.template).toString();
    this.pageData['baseDir'] = this.baseTempDir;
    // console.log(tempEjs);
    this.htmlStr = ejs.render(tempEjs, this.pageData, {delimiter: '?'});
  }

  render(res, data){
    // console.log(data);
    this.pageData.param = data;
    myFunc.renderEjs(res, this.htmlStr, this.pageData);
  }
}

module.exports = Page;
