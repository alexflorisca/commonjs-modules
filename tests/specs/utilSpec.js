'use strict';

var $ =    jQuery,
    core = require('../../modules/util');

describe("trimNewLines()", function() {
    it("trimNewLines", function() {
        var stringWithNewLines = "Hello\n   New Lines should be\n replaced";
        var stringWithoutNewLines = util.trimNewLines(stringWithNewLines);
        expect(stringWithoutNewLines).toBe("Hello New Lines should be replaced");
    });
});