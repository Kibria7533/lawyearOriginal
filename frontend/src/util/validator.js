const Email = "email";
const Password = "pass";
// const UserId = 'userId';

export const formValidation = (name, value) => {
  if (name === Email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      console.log('hhh', re.test(value.toLowerCase()))
    return re.test(String(value).toLowerCase());
  } else if(name===Password){
      const lnExpre =  new RegExp('(?=.{8,})');
      const upperCase =  new RegExp('(?=.*[A-Z])');
      const smallCase = new RegExp('(?=.*[a-z])');
      const digit =  new RegExp('(?=.*[0-9])');
      const symbol = new RegExp('(?=[^A-Za-z0-9])');
      const errorType = {
        length: lnExpre.test(value),
        number: digit.test(value),
        special: symbol.test(value),
        upperLetter: upperCase.test(value),
        smallLetter: smallCase.test(value)
      }
      return errorType;
  }
};
