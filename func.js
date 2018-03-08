function renderEjs(res, content, data){
  // console.log(content);
  // console.log(data);
  res.end(ejs.render(content, data));
}

function readPage(server, page, data){
  // console.log(server + ' => ' + page);
  var pageJs;
  if(isExistFile(`./page/${server}/${page}.js`)){
    pageJs = require(`./page/${server}/${page}.js`);
  }else if(isExistFile(`./page/${server}/${page}/index.js`)){
    pageJs = require(`./page/${server}/${page}/index.js`);
  }else{
    console.log(error.printErrorMessage(0, [`./page/${server}/${page}.js`]));
    return false;
  }
  // console.log(pageJs);

  if(!pageJs.hasOwnProperty('template') || !pageJs.template){
    pageJs.setTemplate(`${server}/${page}`);
  }
  if(pageJs.template){
    if(isExistFile(pageJs.template)){
      // console.log('template Yes!');
      pageJs.setData(data);
      pageJs.createTemplate();
      return pageJs;
    }else{
      console.log(error.printErrorMessage(0, [pageJs.template]));
      return null;
    }
  }else{
    console.log(error.printErrorMessage(0, [`./template/${server}/${page}.ejs`]));
    return null;
  }
}

function isExistFile(filepath){
  try{
    fs.statSync(filepath);
    return true;
  }catch(err){
    if(err.code === 'ENOENT'){
      return false;
    }
  }
}

module.exports = {
  renderEjs   : renderEjs,
  readPage    : readPage,
  isExistFile : isExistFile
};
