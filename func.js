function renderEjs(content){
  console.log(content);
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
  isExistFile : isExistFile
};
