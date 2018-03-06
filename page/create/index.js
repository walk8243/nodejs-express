const Page = require(process.cwd() + '/page.js');

class Index extends Page {
  constructor(){
    super();

    // 書き加える場合はここから
    this.template = './template/create/index.ejs';
  }
}

module.exports = new Index();
