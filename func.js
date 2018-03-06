function renderEjs(res, content){
  // console.log(content);
  res.end(content);
}

function readPage(server, page, data){
  if(isExistFile(`./page/${server}/${page}.js`)){
    // console.log(server + ' => ' + page);
    var pageJs = require(`./page/${server}/${page}.js`);
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
  }else{
    console.log(error.printErrorMessage(0, [`./page/${server}/${page}.js`]));
    return false;
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
