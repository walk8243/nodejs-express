const Page = require(process.cwd() + '/page.js');
var yaml  = require('js-yaml');

class Index extends Page {
  constructor(){
    super();

    // 書き加える場合はここから
    // this.template = 'ddd';
  }

  render(res, data){
    this.pageData.param = data;

    var sendData = yaml.safeLoad(fs.readFileSync(process.cwd() + '/data/sample.yml', 'utf8'));
    // console.log(sendData);
    this.pageData = Object.assign(this.pageData, sendData);

    myFunc.renderEjs(res, this.htmlStr, this.pageData);
  }
}

module.exports = new Index();
