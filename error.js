function printErrorMessage(mode, contents){
  var message;
  switch (mode) {
    case 1:
      message = `
Server'${contents[0]}' is Already exist!
Please choose a different name!
      `;
      break;
    case 2:
      message = `
Hostname'${contents[0]}' is not appropriate!
3 to 10 alphanumeric characters only.
Please enter a different name!
      `;
      break;
    default:
  }

  return message.replace(/^\n/, '');
}

module.exports.printErrorMessage = printErrorMessage;
