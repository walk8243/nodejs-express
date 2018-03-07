const Page = require(process.cwd() + '/page.js');

class Index extends Page {
  constructor(){
    super();
  }
}

module.exports = new Index();
