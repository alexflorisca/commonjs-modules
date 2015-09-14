'use strict';

var $ =         jQuery,
    core =      require('../../modules/core'),
    validate =  require('../../modules/validate');

// TODO: Find out why triggering 'blur' events here don't work.
// TODO: Can't get test for tooShort to work - related to problem above

describe('validate.js', function() {
    beforeEach(function(){
        loadFixtures("validateFixture.html");
    });


    describe('init()', function() {

        it('Should overwrite the default options', function() {
            validate.init();
            var options = validate._getOptions();
            expect(options.errorClass).toBe('is-Error');

            validate.init({errorClass: 'testing'});
            options = validate._getOptions();
            expect(options.errorClass).toBe('testing');
        });


        it('Should overwrite error messages', function() {
            validate.init();
            var options = validate._getOptions();
            expect(options.validators.email.error).toBe('Please enter a valid email address');

            validate.init({validators: {email: {error: 'test email'}}});
            options = validate._getOptions();
            expect(options.validators.email.error).toBe('test email');
        });


        it('Should overwrite the validation function for existing validators', function() {
            validate.init({
                validators: {
                    email: {
                        isValid: function() {
                            return "custom email validation";
                        }
                    }
                }
            });
            var options = validate._getOptions();
            expect(options.validators.email.isValid()).toBe('custom email validation');
        });


        it('Should bind the events for each form', function() {
            spyOn(validate, 'bindEventHandlers');
            validate.init();
            expect(validate.bindEventHandlers.calls.count()).toBe(1);
        });
    });


    describe('bindEventHandlers()', function() {
        var form = null;
        beforeEach(function() {
            form = $("[data-validate-form]").get(0);

        });

        it('Should extend only inputs, select & textarea elements', function() {
            spyOn(validate, '_extendInput');
            validate.bindEventHandlers(form);
            expect(validate._extendInput.calls.count()).toBe(5);
        });
    });


    describe('Custom validators', function() {
        it('One validator, no parameters', function() {
            var input = $('#customValidator1').get(0),
                validators = validate._getCustomValidators(input);

            expect(validators).toContain({name: 'validator1', params: null});
        });

        it('One validator, one parameter', function() {
            var input = $('#customValidator2').get(0),
                validators = validate._getCustomValidators(input);

            expect(validators).toContain({name: 'validator1', params: ['arg1']});
        });

        it('One validator, multiple parameters', function() {
            var input = $('#customValidator3').get(0),
                validators = validate._getCustomValidators(input);

            expect(validators).toContain({name: 'validator1', params: ['arg1', 'arg2']});
        });

        it('Multiple validators, multiple  parameters', function() {
            var input = $('#customValidator4').get(0),
                validators = validate._getCustomValidators(input);

            expect(validators).toContain(
                {name: 'validator1', params: ['arg1', 'arg2']},
                {name: 'validator2', params: null},
                {name: 'validator3', params: ['arg1']});
        });


        it('Should call the right validator if it exists', function() {
            var input = $('#passwordConfirm').get(0),
                options = validate._getOptions();

            spyOn(options.validators.match, 'isValid');
            spyOn(input, 'setCustomValidity');
            validate.callCustomValidators(input);
            expect(options.validators.match.isValid).toHaveBeenCalled();
            expect(input.setCustomValidity).toHaveBeenCalled();
        });
    });


    describe('validateInput()', function() {

        beforeEach(function() {
            validate.init({
                selector: '#testValidateInputForm'
            });
        });

        it('Required', function() {
            var input = $('#validateRequired').get(0),
                options = validate._getOptions();

            spyOn(input, 'setCustomValidity');
            validate.validateInput(input, null);
            expect(input.setCustomValidity).toHaveBeenCalledWith(options.validators.required.error);
        });


        it('Email', function() {
            var input = $('#validateEmail').get(0),
                options = validate._getOptions();

            spyOn(input, 'setCustomValidity');
            validate.validateInput(input, null);
            expect(input.setCustomValidity).toHaveBeenCalledWith(options.validators.email.error);
        });


        it('Password', function() {
            var input = $('#validatePassword').get(0),
                options = validate._getOptions();

            spyOn(input, 'setCustomValidity');
            validate.validateInput(input, null);
            expect(input.setCustomValidity).toHaveBeenCalledWith(options.validators.password.error);
        });


        //it('Too short', function() {
        //    var input = $('#validateMinLength').get(0),
        //        options = validate._getOptions();
        //
        //    input.value = "asdasd";
        //
        //    console.log(input.validity);
        //
        //    spyOn(input, 'setCustomValidity');
        //    validate.validateInput(input, null);
        //    expect(input.setCustomValidity).toHaveBeenCalledWith(options.validators.tooShort.error);
        //});


        it('Custom validators are executed', function() {
            var input = $("#firstName").get(0);
            spyOn(validate, 'callCustomValidators');
            validate.validateInput(input);
            expect(validate.callCustomValidators).toHaveBeenCalled();

        });

        it('The error message is updated', function() {
            var input = $("#firstName").get(0);
            spyOn(validate, '_updateInputErrorMessage');
            validate.validateInput(input);
            expect(validate._updateInputErrorMessage).toHaveBeenCalled();

        });

    });


    describe("Helper functions", function() {
        it('_extendInput()', function() {
            var $input = $("#firstName"),
                input = $input.get(0);

            validate._extendInput(input);
            expect(input.validity.tooShort).toBeDefined();
        });

        it('_getFormSubmitButton()', function() {
            var form = core.select("[data-validate-form]"),
                submitButton;

            submitButton = validate._getFormSubmitButton(form);
            expect(submitButton).toBeDefined();
            expect(submitButton.innerHTML).toBe("Register");
        });

        it('_isFormValid()', function() {
            var form = core.select("[data-validate-form]"),
                isValid;

            isValid = validate._isFormValid(form);
            expect(isValid).toEqual(false);

            $("#firstName").val("Testy");
            $("#lastName").val("Mcghee");
            $("#email").val("test@me.com");
            $("#password").val("test123");
            $("#passwordConfirm").val("test123");

            isValid = validate._isFormValid(form);
            expect(isValid).toEqual(true);
        });


        it('_parsedErrorMessages()', function() {
            // Input with a label
            var input = $("#firstName").get(0),
                errorMessage;

            validate.validateInput(input);
            errorMessage = validate._parsedInputErrorMessage(input);
            expect(errorMessage).toBe("Please enter your first name");

            // Input without a label
            input = $("#validateRequired").get(0);
            validate.validateInput(input);
            errorMessage = validate._parsedInputErrorMessage(input);
            expect(errorMessage).toBe("Please enter your validateRequired");
        });

        it('_updateInputErrorMessage()', function() {
            var options = validate._getOptions(),
                $input = $("#firstName"),
                input = $input.get(0),
                $errorEl;

            validate._updateInputErrorMessage(input);

            $errorEl = $input.next();
            expect($errorEl.attr('id')).toBe("text-error");
            expect($errorEl.attr('class')).toBe(options.errorClass);

        });
    });
});