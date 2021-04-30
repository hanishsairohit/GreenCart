module.exports = {
  checkString(parameter, name) {
    if (parameter === undefined) {
      throw `Please pass ${name} parameter to the function`;
    }
    if (typeof parameter != "string")
      throw `parameter ${name} must be of type string.`;
    if (parameter.trim().length === 0)
      throw `parameter cannot be an empty string.`;
  },
  checkEmail(parameter, name) {
    this.checkString(parameter, name);
    //Dhruveel will update
  },
  checkStringObjectId(parameter, name) {
    this.checkString(parameter, name);

    // ref: https://stackoverflow.com/a/11989159
    if (!ObjectId.isValid(id))
      throw `Passed parameter ${name} is not a valid object ID.`;
  },
};
