'use strict';

var $ =    jQuery,
    core = require('../../modules/core');

describe('core.js', function() {

    beforeEach(function() {
       loadFixtures("coreFixture.html");
    });


    it("_nodeListToArray()", function() {
        var nodeList = document.getElementsByTagName("div");
        var arr = core._nodeListToArray(nodeList);
        expect(arr.constructor).toBe(Array);
        expect(arr.length).toEqual(nodeList.length);
    });


    it("_addEventListener()", function() {
        var button = document.getElementById("clickMe");
        var cb = jasmine.createSpy('cb');
        core._addEventListener(button, 'click', cb);

        core.trigger(button, 'click');
        expect(cb).toHaveBeenCalled();
    });


    it("trimNewLines", function() {
        var stringWithNewLines = "Hello\n   New Lines should be\n replaced";
        var stringWithoutNewLines = core.trimNewLines(stringWithNewLines);
        expect(stringWithoutNewLines).toBe("Hello New Lines should be replaced");
    });


    it("extend()", function() {
        var a = { prop1: "Foo" },
            b = { prop2: "Bar"},
            c = { prop3: "Moo" };

        c = core.extend(a, b, c);

        expect(c.prop1).toBe("Foo");
        expect(c.prop2).toBe("Bar");
        expect(c.prop3).toBe("Moo");
    });


    it("select()", function() {
        // By tag
        var element = core.select("button");
        expect(element).not.toBeNull();

        // By ID
        element = core.select("#clickMe");
        expect(element).not.toBeNull();

        // By class
        element = core.select(".clickMe");
        expect(element).not.toBeNull();

        element = core.select("[data-test]");
        expect(element).not.toBeNull();
    });


    it("selectAll()", function() {
        var elements = core.selectAll("button");
        expect(elements.constructor).toBe(Array);
        expect(elements.length).toBe(2);
    });


    it("on()", function() {
        spyOn(core, '_addEventListener');
        var element = core.select('#clickMe'),
            cb = function() {};

        core.on(element, 'click', cb);
        core.trigger(element, 'click');
        expect(core._addEventListener).toHaveBeenCalledWith(element, 'click', cb);

        var elementsArr = core.selectAll('#clickMe');

        core.on(elementsArr, 'click', cb);
        for(var i = 0; i < elementsArr.lenght; i++) {
            core.trigger(elementsArr[i], 'click');
        }

        // Expect 3 calls. 1 from the first call, 2 from the loop. There should be 2 elements in the array.
        expect(core._addEventListener.calls.count()).toEqual(3);
    });


    it("text()", function() {
        var element = core.select(".text");
        var text = core.text(element);
        expect(text).toEqual("Johny Quest");
    });


    it("addClass()", function() {
        var element = core.select("#monkeys");
        core.addClass(element, 'moreMonkeys');

        expect($("#monkeys")).toHaveClass("moreMonkeys");
    });


    it("removeClass()", function() {
        var element = core.select("#banana");
        expect("#banana").toHaveClass("banana");

        core.removeClass(element, 'banana');
        expect($("#monkeys")).not.toHaveClass("banana");
    });


    it("hasClass()", function() {
        var element = core.select("#banana");

        expect(core.hasClass(element, 'banana')).toBeTruthy();
    });


    it("toggleClass()", function() {
        var element = core.select("#banana");
        expect(core.hasClass(element, "boo")).toBeFalsy();
        core.toggleClass(element, "boo");
        expect(core.hasClass(element, "boo")).toBeTruthy();
        core.toggleClass(element, "boo");
        expect(core.hasClass(element, "boo")).toBeFalsy();
    });


    it("validateEmail()", function() {
        expect(core.validateEmail("fakeemail")).toBeFalsy();
        expect(core.validateEmail("me@example.com")).toBeTruthy();
    });

    // Check to see if the children function returns nodes based on node name, class name or an id
    it("children()", function(){
        var parentElement = core.select('.children-test'),
            spanChildElement = 'span',
            singleTest = core['children'](parentElement, spanChildElement),
            multiTest = core['children'](parentElement, '.multi-check'),
            idTest = core['children'](parentElement, '#node-check');

        // Check to see if single node reference reutrns
        expect(singleTest).toBeDefined();

        // Check to see if multiple elements returned in array
        expect(multiTest.length).toBeGreaterThan(1);

        // Check to see if ID request functions as expected
        expect(idTest).toBeDefined();

        // Setup spy for arguments check
        spyOn(core, 'children');

        // Execute function
        core['children'](core.select('.children-test'), 'span');

        // Check to see if arguments passed in correctly
        expect(core.children).toHaveBeenCalledWith(parentElement, spanChildElement);
    });


    it("matchStrings()", function() {
        expect(core.matchStrings("hello", "hello")).toBeTruthy();
        expect(core.matchStrings("hello", "goodbye")).toBeFalsy();
    });
});