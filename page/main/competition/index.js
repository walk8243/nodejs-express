const Page = require(process.cwd() + '/page.js');

class Index extends Page {
  constructor(){
    super();

    console.log('competition');
  }
}

module.exports = new Index();
