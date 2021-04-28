//Function for checking the string.

function stringCheck(str) {
  if (!str || typeof str !== "string" || str.trim().length == 0) {
    return false;
  } else {
    return true;
  }
}

//email validation functions
// return boolean
function emailValidate(email) {
  if (!email) return false;
  const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRe.test(String(email).toLowerCase());
}

// Age validation function,
// consumer with age of greater than 8 are allowed for purchase
function ageValid(age) {
  if (!age || typeof age !== "number" || !Number.isInteger(age) || age < 8)
    return false;
  else return true;
}

//Phine number Validation
// Valid formats:

// (123) 456-7890
// (123)456-7890
// 123-456-7890
// 123.456.7890
// 1234567890
// +31636363634
// 075-63546725
function phoneNumberValid(number) {
  if (!number) return false;
  const numberRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gim;
  return numberRe.test(String(number));
}

//zip code validation
function zipcCodeValid(code) {
  if (!code) return false;
  const codeRe = /^[0-9]{5}(?:-[0-9]{4})?$/gim;
  return codeRe.test(String(code));
}
//The length of password should be greater than or equal to 8 characters
function validPassword(password) {
  if (!password || typeof password !== "string" || password.trim().length < 8) {
    return false;
  } else return true;
}

// function to convert mongo generated Object id to string id and return that object
function stringId(data) {
  data._id = data._id.toString();
  return data;
}

module.exports = {
  stringCheck,
  emailValidate,
  ageValid,
  stringId,
  validPassword,
  phoneNumberValid,
  zipcCodeValid,
};
