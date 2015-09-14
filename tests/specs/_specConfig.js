// PhantomJS doesn't have the 'bind' function
Function.prototype.bind = require("function-bind");

// Path to fixtures must start with base/
jasmine.getFixtures().fixturesPath = 'base/tests/fixtures/';
