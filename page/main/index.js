const Page = require(process.cwd() + '/page.js');

class Index extends Page {
  constructor(){
    super();

    // 書き加える場合はここから
    // this.template = 'ddd';
  }
}

const page = new Index();
module.exports = page;
