function printErrorMessage(mode, contents){
  switch (mode) {
    case 1:
      message = `
Server'${contents[0]}' is Already exist!
Please choose a different name!
      `;
      break;
    default:

  }

  return message.replace(/^\n/, '');
}

module.exports.printErrorMessage = printErrorMessage;
