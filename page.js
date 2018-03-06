myFunc  = require('./func.js');

class Page {
  constructor(){
    this.template = null;
  }

  setTemplate(filepath){
    if(myFunc.isExistFile(`./template/${filepath}.ejs`)){
      this.template = `./template/${filepath}.ejs`;
    }else{
      this.template = null;
    }
    // console.log('OK!');
  }

  createTemplate(){
    this.htmlData = fs.readFileSync(this.template);
    // console.log(template.toString());
  }

  render(res, data){
    myFunc.renderEjs(res, this.htmlData);
  }
}

module.exports = Page;
