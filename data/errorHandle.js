//Function for checking the string.

function stringCheck(str) {
  if (!str || typeof str !== "string" || str.trim().length == 0) return true;
  else return false;
}

//email validation function
// return boolean
function emailValidate(email) {
  if (!email) return false;
  const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRe.test(toString(email).toLowerCase());
}

// Age validation function,
// consumer with age of greater than 8 are allowed for purchase
function ageValid(age) {
  if (!age || typeof age !== "number" || !Number.isInteger(age) || age < 8)
    return false;
  else return true;
}

// function to convert mongo generated Object id to string id and return that object
function stringId(data) {
  data._id = data._id.toString();
  return data;
}

module.exports = { stringCheck, emailValidate, ageValid, stringId };
