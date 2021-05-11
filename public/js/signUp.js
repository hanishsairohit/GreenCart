$(document).ready(function () {
    let hasErrors = false;
    function validString(str) {
        if (!str) {
            hasErrors = true;
            return false
        }
        return true;
    }

    let signupForm =$('#signup-form');
    let firstNameInput = $('#firstName');
    let lastNameInput = $('#lastName');
    let phoneNumberInput = $('#phoneNumber');
    let emailInput = $('#email');
    let passwordInput = $('#password');
    let addressInput = $('#address');
    let submitInfo = $('#submitInfo');

    signupForm.submit((event) => {
        event.preventDefault();
        hasErrors = false;
        $('.error').hide();

        firstNameInput.removeClass('is-invalid is-valid');
        lastNameInput.removeClass('is-invalid is-valid');
        phoneNumberInput.removeClass('is-invalid is-valid');
        emailInput.removeClass('is-invalid is-valid');
        passwordInput.removeClass('is-invalid is-valid');
        addressInput.removeClass('is-invalid is-valid');

        submitInfo.prop('disabled', true);
        let info = {
            firstName: firstNameInput.val().trim(),
            lastName: lastNameInput.val().trim(),
            phoneNumber: PhoneNumberInput.val().trim(),
            email: emailInput.val().trim(),
            password: passwordInput.val().trim(),
            address: addressInput.val().trim()
        };

        
        
        if (!validString(info.firstName)) firstNameInput.addClass('is-invalid');
        if (!validString(info.lastName)) lastNameInput.addClass('is-invalid');
        if (!validString(info.phoneNumber)) usernameInput.addClass('is-invalid');
        if (!validString(info.email)) emailInput.addClass('is-invalid');
        if (!validString(info.password)) passwordInput.addClass('is-invalid');
        if (!validString(info.address)) addressInput.addClass('is-invalid');

        if (!hasErrors) {
            signupForm.unbind().submit();
        } else {
            submitInfo.prop('disabled', false);
        }
    });
})(jQuery);
