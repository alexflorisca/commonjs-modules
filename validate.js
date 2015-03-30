/**
 * validate.js
 *
 * Form validation
 */

'use strict';

var core = require('./core');

var options = {
    errorClass: 'is-Error',
    validationClass: 'Form--valid',
    requiredAttribute: 'required',
    validationAttribute: 'data-validate',
    errorMessages: {
        required: 'Please provide',
        password: 'Passwords must contain a minimum of 6 characters and contain a mixture of letters and numbers',
        email: 'The email address entered has an invalid email address format',
        invalid: 'contains invalid characters',
        match: {
            password: 'Passwords do not match'
        }
    }
};

var validate = {

    _isEmpty: function(value) {
        return (value == null || value == "") ? true : false;
    },

    _isValidEmail: function(email) {
        if(!email.match) return false;

        return !!email.match(new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"));
    },

    _isValidPassword: function(passwordString) {
        if(!passwordString.match) return false;

        return !!passwordString.match(new RegExp("^(?=.*\d)(?=.*[a-z])(?=.*[0-9]).{6,50}$"));
    },

    _isInvalid: function(textString){
        if(!textString.match) return false;

        return !!textString.match(new RegExp("^[^$%@!]+$"));
    },

    _addError: function(el, errorMsg) {
        var errorEl = {},
            errorTextEl = {};

        // Check to see if error element already exists
        if (core.hasClass(el, options.errorClass)) return;

        // Add error class to in-validated field
        core.addClass(el, options.errorClass);

        // Create text element to explain error
        errorEl = document.createElement('span');

        // Attach relevant classes and id for later reference
        errorEl.setAttribute('id', 'text-error');
        errorEl.innerHTML = errorMsg;
        core.addClass(errorEl, options.errorClass);
        core.insertAfter(errorEl, el);
    },

    _removeError: function(el) {
        var errorTextEl = {};

        if (core.hasClass(el, options.errorClass)) {
            // Find the next error element to remove the error element
            errorTextEl = el.nextSibling;

            // Remove error class from the element
            core.removeClass(el, options.errorClass);

            // Remove the text from the DOM as will be re-inserted with add error class / check to see if not text or comment element
            if (errorTextEl.nodeType === 1) el.parentNode.removeChild(errorTextEl);
        }
    },

    bindEvents: function() {
        var elType = '';

        // Cache the fields to prevent duplication on submit
        this.requestedForm = core.select('.' + options.validationClass);
        this.requiredFields = core.selectAll('[' + options.requiredAttribute + ']');
        this.validationFields = core.selectAll('[' + options.validationAttribute + ']');

        // Add specific types to validationFields array e.g. email / to leverage HTML5 attributes
        Array.prototype.push.apply(this.validationFields, core.selectAll('[type="email"]'));

        // Only trigger functionality if validation elements exist
        if (!this.requiredFields[0] && !this.validationFields[0]) return;

        // Check to see if any of the form elements have invalid characters / bind individually to ignore non element_nodes
        if (this.requestedForm) {
            for (var i = (this.requestedForm.elements.length - 1), end = 0; i >= end; --i) {
                elType = this.requestedForm.elements[i].getAttribute('type');

                if (this.requestedForm.elements[i].nodeType === 1 && (elType != 'email' && elType != 'submit')) {
                    core.on(this.requestedForm.elements[i], 'blur', this.validateInvalid.bind(this));
                }
            }
        }

        // Don't continue with the code if no matching required elements exist
        if (this.requiredFields[0]) core.on(this.requiredFields, 'blur', this.validateRequiredElements.bind(this));

        // Don't continue with the code if no matching validation elements exist
        if (this.validationFields[0]) core.on(this.validationFields, 'blur', this.validateElements.bind(this));

        // Validate on submit
        if (this.requestedForm) core.on(this.requestedForm, 'submit', this.validateForm.bind(this));
    },

    validateForm: function(evt) {
        var el = evt.currentTarget,
            elType = '';

        // Loop through all fields and check for invalid chars
        for (var e = (el.elements.length - 1), f = 0; e >= f; --e) {
            elType = el.elements[e].getAttribute('type');

            if (el.elements[e].nodeType === 1 && (elType != 'submit' && elType != 'email')) this.validateInvalid({currentTarget: el.elements[e]});
        }

        // Loop through all required fields and display any errors
        for (var a = (this.requiredFields.length - 1), b = 0; a >= b; --a) {
            this.validateRequiredElements({currentTarget: this.requiredFields[a]});
        }

        // Loop through all additional validation fields before submission
        for (var c = (this.validationFields.length - 1), d = 0; c >= d; --c) {
            this.validateElements({currentTarget: this.validationFields[c]});
        }

        // prevent default form action
        if (core.selectAll('.' + options.errorClass).length) evt.preventDefault();
    },

    validateInvalid: function(evt){
        var el = evt.currentTarget,
            completeErrorMsg = '"' + core.text(core.children(el.parentNode, 'label')) + '" ' + options.errorMessages.invalid,
            elType = el.getAttribute('type');

        // Always remove the error message before running as this is a control method
        this._removeError(el);

        // Don't validate submit or email as they have different rules
        if (elType != 'email' && elType != 'submit' && !this._isEmpty(el.value) && !this._isInvalid(el.value)) this._addError(el, completeErrorMsg);
    },

    validateRequiredElements: function(evt) {
        var el = evt.currentTarget,
            completeErrorMsg = options.errorMessages.required + ' "' + core.text(core.children(el.parentNode, 'label')) + '"';

        if (!this.requestedForm) this._removeError(el);

        // Add error message
        if (this._isEmpty(el.value)) this._addError(el, completeErrorMsg);
    },

    validateElements: function(evt) {
        var el = evt.currentTarget,
            validationType = (el.attributes[options.validationAttribute]) ? el.getAttribute(options.validationAttribute) : el.getAttribute('type');

        // Split on validation type to cater for match types
        validationType = validationType.split(':');

        // Loop must iterate foward as the matching validation type needs to be bypassed
        for (var i = 0, end = (validationType.length - 1); i <= end; ++i) {
            switch (validationType[i]) {
                case 'password':
                    this.validatePassword(el);
                    break;
                case 'match':
                    i++; // Ignore the matching validation as it would be on the original element
                    this.validateMatch(el);
                    break;
                case 'email':
                    this.validateEmail(el);
                    break;
                case 'text':
                    this.validateRequiredElements({currentTarget: el})
                    break;
            }
        }
    },

    validateEmail: function(el) {
        if(!this._isEmpty(el.value) || !this.requiredFields.length) {
            // Always remove the error
            this._removeError(el);

            // Add error message
            this[(!this._isValidEmail(el.value)) ? '_addError' : '_removeError'](el, options.errorMessages.email);
        }
    },

    validatePassword: function(el) {
        if (!this._isEmpty(el.value) || !this.requiredFields.length) {

            // Add error message
            if (!this._isValidPassword(el.value)) this._addError(el, options.errorMessages.password);
        }
    },

    validateMatch: function(el){
        var validationString = {},
            matchingEl = {},
            isMatch = false;

        if (!this._isEmpty(el.value) || !this.requiredFields.length) {
            validationString = el.getAttribute(options.validationAttribute);

            // Split the matching validation type from the string
            validationString = validationString.split(':');

            for (var i = (validationString.length - 1), end = 0; i >= end; --i) {
                // Filter out initial match declaration
                if (validationString[i] != 'match') {
                    // Find matching element
                    matchingEl = core.select('[' + options.validationAttribute + '="' + validationString[i] + '"]');

                    // Add error message
                    this[(!core.matchStrings(el.value, matchingEl.value)) ? '_addError' : '_removeError'](el, options.errorMessages.match[validationString[i]]);
                }
            }
        }
    },

    init: function(userOptions) {
        // Add user override options to the global validation rules
        core.extend(options, userOptions);

        // Attach event handlers to the forms
        this.bindEvents();
    }
};

module.exports = validate;