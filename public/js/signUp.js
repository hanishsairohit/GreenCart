(function ($) {
  let hasErrors = false;
  function validString(str) {
    if (!str) {
      hasErrors = true;
      return false;
    }
    return true;
  }

  let signupForm = $("#signup-form");
  let firstNameInput = $("#firstName");
  let lastNameInput = $("#lastName");
  let phoneNumberInput = $("#phoneNumber");
  let emailInput = $("#emailId");
  let passwordInput = $("#password");
  let line1Input = $("#Line1");
  let line2Input = $("#Line2");
  let cityInput = $("#City");
  let stateInput = $("#State");
  let zipCodeInput = $("#ZipCode");

  let submitInfo = $("#submitInfo");

  signupForm.submit((event) => {
    event.preventDefault();
    hasErrors = false;
    $(".error").hide();

    firstNameInput.removeClass("is-invalid is-valid");
    lastNameInput.removeClass("is-invalid is-valid");
    phoneNumberInput.removeClass("is-invalid is-valid");
    emailInput.removeClass("is-invalid is-valid");
    passwordInput.removeClass("is-invalid is-valid");
    line1Input.removeClass("is-invalid is-valid");
    line2Input.removeClass("is-invalid is-valid");
    cityInput.removeClass("is-invalid is-valid");
    stateInput.removeClass("is-invalid is-valid");
    zipCodeInput.removeClass("is-invalid is-valid");

    submitInfo.prop("disabled", true);
    let info = {
      firstName: firstNameInput.val().trim(),
      lastName: lastNameInput.val().trim(),
      phoneNumber: phoneNumberInput.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      line1: line1Input.val().trim(),
      line2: line2Input.val().trim(),
      city: cityInput.val().trim(),
      state: stateInput.val().trim(),
      zipCode: zipCodeInput.val().trim(),
    };

    if (!validString(info.firstName)) firstNameInput.addClass("is-invalid");
    if (!validString(info.lastName)) lastNameInput.addClass("is-invalid");
    if (!validString(info.phoneNumber)) usernameInput.addClass("is-invalid");
    if (!validString(info.email)) emailInput.addClass("is-invalid");
    if (!validString(info.password)) passwordInput.addClass("is-invalid");
    if (!validString(info.line1)) line1Input.addClass("is-invalid");
    if (!validString(info.line2)) line2Input.addClass("is-invalid");
    if (!validString(info.city)) cityInput.addClass("is-invalid");
    if (!validString(info.state)) stateInput.addClass("is-invalid");
    if (!validString(info.zipCode)) zipCodeInput.addClass("is-invalid");

    if (!hasErrors) {
      alert("in !if");
      signupForm.unbind().submit();
    } else {
      submitInfo.prop("disabled", false);
    }
  });
})(window.jQuery);
