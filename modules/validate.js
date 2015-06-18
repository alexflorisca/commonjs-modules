var core = require('./core');

/**
 * Default options
 */
var options = {},
    defaults = {
    selector: '[data-validate-form]',           // Selector for adding validation to forms
    errorClass: 'is-Error',                     // Class name added to an invalid input
    disableSubmit: false,                        // Should the submit button be disabled until the form is valid?

    /*  Validator objects contain an "error" attribute which contains the
     error message, and an "isValid()" function which returns a boolean
     value. Where possible, validators use the HTML5 validation API.

     Notes:
     - "this" in isValid() refers to the html element being validated
     - "%" refers to the input's corresponding label value, lowercased.
     */
    validators: {
        required: {
            error: 'Please enter your %',
            isValid: function() {
                return !this.validity.valueMissing;
            }
        },

        email: {
            error: 'Please enter a valid email address',
            isValid: function() {
                return !this.validity.typeMismatch;
            }
        },

        tooShort: {
            error: "% is too short",
            isValid: function() {
                return !this.validity.tooShort;
            }
        },

        tooLong: {
            error: "% is too long",
            isValid: function() {
                return !this.validity.tooLong;
            }
        },

        invalid: {
            error: '% contains invalid characters',
            isValid: function(){
                // Check for invalid characters and that all characters are in the ISO-8859-1 range
                var charCheck = !!this.value.match(new RegExp("^([^$%@!])+$"));
                var isoCheck = !!this.value.match(new RegExp("^([\x00-\x7F\xA0-\xFF])+$"));

                return (charCheck && isoCheck);
            }
        },

        password: {
            error: 'Passwords must contain a minimum of 6 characters and contain a mixture of letters and numbers',
            isValid: function() {
                // Regex checks for one letter and one number
                return !!this.value.match(new RegExp("^(?=.*[A-Za-z])(?=.*[0-9]).*$"));
            }
        },

        match: {
            error: 'Passwords do not match',
            isValid: function (elementId) {
                return core.matchStrings(this.value, document.getElementById(elementId).value);
            }
        }
    }
};


/**
 * Some html5 validation functions are not supported in all browsers.
 * Polyfills for these are defined here.
 */
var polyfills = {
    tooShort: function(input) {
        return (input.value.length < parseInt(input.getAttribute('minlength'), 10));
    }
};



/**
 * Public API
 */
var validate = {


    /**
     * Initialise the validator module with custom user options
     *
     * @param user_options
     */
    init: function (user_options) {
        var i, forms;

        // Check if the browser supports html5 validation
        if (document.createElement('input').validity === undefined) {
            return;
        }

        // Merge default options with user specified options
        options = core.extendDeep(defaults, user_options);

        forms = core.selectAll(options.selector);

        for (i = 0; i < forms.length; i++) {
            if (options.disableSubmit) {
                this._updateSubmitDisabledProp(forms[i]);
            }

            this.bindEventHandlers(forms[i]);
        }
    },


    /**
     * Bind event handlers on input elements within a form.
     * Elements are checked first on 'blur' events. If invalid on
     * first 'blur' event, a 'keyup' event is added to check validity
     * every time a user types in the input field.
     *
     * @param form
     */
    bindEventHandlers: function (form) {
        var i,
            el,
            _that = this;

        for (i = 0; i < form.elements.length; i++) {
            el = form.elements[i];

            // Only add event listeners to elements
            if (el.nodeName !== "INPUT" && el.nodeName !== "TEXTAREA" && el.nodeName !== "SELECT") {
                continue;
            }

            this._extendInput(el);

            core.on(el, 'blur invalid', function (event) {
                _that.validateInput.apply(_that, [this, event, form]);
                if (options.disableSubmit) {
                    _that._updateSubmitDisabledProp(form);
                }

                // Attach a keyup event to update the fields as the user types
                if (this.validity.valid !== true && !this.validity.hasBeenChecked) {
                    core.on(this, 'keyup', function (event) {
                        _that.validateInput.apply(_that, [this, event, form]);
                        if (options.disableSubmit) {
                            _that._updateSubmitDisabledProp(form);
                        }
                    });
                    this.validity.hasBeenChecked = true;
                }
            });
        }
    },


    /**
     * Custom validation can be added to any input with data-validate attribute.
     * Check if the custom validators exist, and run them
     *
     * Formats:
     *
     * data-attribute="validator"
     * data-attribute="validator:arg1"
     * data-attribute="validator:arg1 arg2"
     *
     * @param input
     */
    callCustomValidators: function (input) {
        var i,
            userValidators = this._getCustomValidators(input);

        for (i = 0; i < userValidators.length; i++) {
            // Validator exists & can be called. If invalid, set its' error on the element.
            if (options.validators[userValidators[i].name] !== undefined && typeof options.validators[userValidators[i].name].isValid == 'function') {
                if (!options.validators[userValidators[i].name].isValid.apply(input, userValidators[i].params)) {
                    input.setCustomValidity(options.validators[userValidators[i].name].error);
                }
            }
        }
    },


    /**
     * Process the values of the data-validate="" attribute of an element
     * into an array of objects with the validator name and params properties
     *
     * @param input
     * @returns {Array}
     * @private
     */
    _getCustomValidators: function(input) {
        var i,
            validatorName,
            validatorParams,
            validatorsStrArr,
            validatorsArr = [],
            validatorsStr = input.getAttribute('data-validate');

        if (!validatorsStr) return validatorsArr;

        validatorsStrArr = validatorsStr.split(",");

        for (i = 0; i < validatorsStrArr.length; i++) {
            // Validator doesn't have any parameters
            if (validatorsStrArr[i].indexOf(":") === -1) {
                validatorName = validatorsStrArr[i].substr(0);
                validatorParams = null;
            }
            // Validator has parameters passed in the data-validate attribute
            else {
                validatorName = validatorsStrArr[i].substr(0, validatorsStrArr[i].indexOf(":"));
                validatorParams = validatorsStrArr[i].substr(validatorsStrArr[i].indexOf(":") + 1).split(" ");
            }

            validatorsArr.push({
                name: validatorName,
                params: validatorParams
            });
        }

        return validatorsArr;
    },


    /**
     * Validate an input
     *
     * @param input
     * @param event
     */
    validateInput: function (input, event) {
        if(event) event.preventDefault();

        // Reset the validity of the input before we run the validation
        input.setCustomValidity("");

        // Required
        if (!options.validators.required.isValid.apply(input)) {
            input.setCustomValidity(options.validators.required.error);
        }

        // Too short
        if (!options.validators.tooShort.isValid.apply(input)) {
            input.setCustomValidity(options.validators.tooShort.error);
        }

        // Too long
        if (!options.validators.tooLong.isValid.apply(input)) {
            input.setCustomValidity(options.validators.tooLong.error);
        }
        // Email
        if (!options.validators.email.isValid.apply(input) && input.type === "email") {
            input.setCustomValidity(options.validators.email.error);
        }

        // Password
        if (!options.validators.password.isValid.apply(input) && input.type === "password") {
            input.setCustomValidity(options.validators.password.error);
        }

        // Custom validators
        this.callCustomValidators(input);

        this._updateInputErrorMessage(input);
    },


    /**
     * Toggle the "disabled" attribute of the submit button based on the validation status
     * @param form
     */
    _updateSubmitDisabledProp: function (form) {
        form.submitButton = (form.submitButton) ? form.submitButton : this._getFormSubmitButton(form);

        if(form.submitButton === undefined) return;

        if (this._isFormValid(form)) {
            form.submitButton.removeAttribute("disabled");
        }
        else {
            form.submitButton.setAttribute("disabled", "disabled");
        }
    },


    /**
     * Update the DOM with the corresponding error message of an input
     * @param input
     */
    _updateInputErrorMessage: function (input) {
        var errorMessageEl = input.nextSibling;

        // Valid input, without any previous errors - do nothing
        if (input.validity.valid && !core.hasClass(input, options.errorClass)) {
            return;
        }

        // Error has already been set
        if (core.hasClass(input, options.errorClass)) {

            // Input is now valid, remove the error
            if (input.validity.valid) {
                core.removeClass(input, options.errorClass);
                if (errorMessageEl.nodeType === 1) input.parentNode.removeChild(errorMessageEl);
            }

            // Input might have a different error, update the message
            else {
                errorMessageEl.innerHTML = this._parsedInputErrorMessage(input);
            }
            return;
        }

        // Add the error for the first time
        core.addClass(input, options.errorClass);
        this._insertErrorMessageInDom(input);
    },


    /**
     * Replaces % with the input label
     *
     * @param input
     * @returns {string}
     * @private
     */
    _parsedInputErrorMessage: function (input) {
        // If we find a label, use that as the input name, otherwise use the input name
        var inputLabelEl = core.select('[for="' + input.name + '"]'),
            inputName;

        if(inputLabelEl) {
            inputName = core.text(inputLabelEl).toLowerCase();
        }
        else {
            inputName = input.name;
        }

        return input.validationMessage.replace("%", inputName);
    },


    /**
     * Create an element next to an input to show the error message
     *
     * @param input
     * @private
     */
    _insertErrorMessageInDom: function (input) {
        var errorEl = document.createElement('span');
        errorEl.setAttribute('id', 'text-error');
        errorEl.innerHTML = this._parsedInputErrorMessage(input);

        core.addClass(errorEl, options.errorClass);
        core.insertAfter(errorEl, input);

        errorEl = null;
    },


    /**
     * Add custom attributes to an input object & polyfill some validity API functionality
     *
     * @param input
     * @private
     */
    _extendInput: function (input) {
        input.type = input.getAttribute("type");

        // TODO: Make this loop through the polfills object and add all of them.
        // Some browsers haven't implemented the tooShort property in the validity object so we're adding it here.
        if (!input.validity.tooShort) {
            input.validity.tooShort = false;
            core.on(input, 'input change', function (event) {
                this.validity.tooShort = polyfills.tooShort(this);
            });
        }
    },


    /**
     * Check if a form has been validated
     *
     * @param form
     * @returns {boolean}
     * @private
     */
    _isFormValid: function (form) {
        var isValid = true,
            el;
        for (var i = 0; i < form.elements.length; i++) {
            el = form.elements[i];
            // Only add event listeners to elements
            if (el.nodeName !== "INPUT" && el.nodeName !== "TEXTAREA" && el.nodeName !== "SELECT") {
                continue;
            }

            if(!el.validity.valid) {
                isValid = false;
            }
        }
        return isValid;
    },


    /**
     * Get the submit button for a form
     *
     * @param form
     * @returns {*}
     * @private
     */
    _getFormSubmitButton: function(form) {
        var i, submitButton;

        // Assume only 1 submit button per form
        for (i = 0; i < form.elements.length; i++) {
            if (form.elements[i].getAttribute('type') === 'submit') {
                submitButton = form.elements[i];
                break;
            }
        }

        return submitButton;
    },


    /**
     * Getter for options object
     *
     * @returns {options}
     * @private
     */
    _getOptions: function() {
        return options;
    }
};

module.exports = validate;