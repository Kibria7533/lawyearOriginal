const validator = ({ email, pass }) => {
  if (email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = re.test(String(email).toLowerCase());
    if (!isValid) return "Email is badly formated.";
  }
  if (pass) {
    const lnExpre = new RegExp("(?=.{8,})");
    const upperCase = new RegExp("(?=.*[A-Z])");
    const smallCase = new RegExp("(?=.*[a-z])");
    const digit = new RegExp("(?=.*[0-9])");
    const symbol = new RegExp("(?=[^A-Za-z0-9])");
    const errorType = {
      length: lnExpre.test(pass),
      number: digit.test(pass),
      special: symbol.test(pass),
      upperLetter: upperCase.test(pass),
      smallLetter: smallCase.test(pass),
    };
    let message = "";
    if (!errorType.length) message = "Minimum length is 8.";
    else if (!errorType.number)
      message = "Minimum one number need to be included.";
    else if (!errorType.special)
      message = "Minimum one spacial character need to be included.";
    else if (!errorType.upperLetter)
      message = "Minimum one uppercase need to be included.";
    else if (!errorType.smallLetter)
      message = "Minimum one lowercase need to be included.";
    return message;
  }
};

module.exports = validator;
