'use strict';

var $ =    jQuery,
    core = require('../../modules/core');


describe('core.js', function() {

    beforeEach(function() {
       loadFixtures("coreFixture.html");
    });


    describe('extend() ', function() {
        it("Should merge two or more objects, including any contained objects", function() {
            var a = { prop1: "Foo", prop3: { subProp1: "subProp1"} },
                b = { prop2: "Bar", prop3: { subProp2: "subProp2"}, prop5: "Bar" },
                c = { prop5: {test: "Testing"}, prop4: { subProp1: "subProp1"} };

            c = core.extend(a, b, c);

            expect(c.prop1).toEqual("Foo");
            expect(c.prop2).toEqual("Bar");
            expect(c.prop3).toEqual({subProp1: "subProp1", subProp2: "subProp2"});
            expect(c.prop4.subProp1).toEqual("subProp1");
            expect(c.prop5).toEqual({test: "Testing"});
        });

        it("Should return false when no parameters are passed", function() {
            var result = core.extend();
            expect(result).toBeFalsy();
        });

        it("Should return the target when only 1 parameter is passed", function() {
            var obj = {testProp: "Testing"},
                result = core.extend(obj);

            expect(result).toBe(obj);
        });
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

        element = core.select("button");
        expect(element.constructor).toBe(Array);
        expect(element.length).toBe(2);
    });


    describe("on() ", function() {
        it("Should attach an event to one or more elements", function() {
            var buttons = core.select(".clickMe"),
                timesTriggered = 0,
                cb = function() { timesTriggered++; };

            core.on(buttons, 'click', cb);
            core.trigger(buttons, 'click');
            expect(timesTriggered).toBe(2);
        });

        it("Should attach multiple events", function() {
            var buttons = core.select(".clickMe"),
                timesTriggered = 0,
                cb = function() { timesTriggered++; };

            core.on(buttons, 'click hover', cb);
            core.trigger(buttons, 'click');
            expect(timesTriggered).toBe(2);

            core.trigger(buttons, 'hover');
            expect(timesTriggered).toBe(4);
        });


        it("Should set the context of the callback function", function() {
            this.timesTriggered = 0;

            var buttons = core.select(".clickMe"),
                cb = function() {
                    this.timesTriggered++;
                };

            core.on(buttons, 'click hover', cb, this);
            core.trigger(buttons, 'click');
            expect(this.timesTriggered).toBe(2);
        });
    });


    it("addClass() and removeClass()", function() {
        var elements = core.select("button");

        core.addClass(elements, 'banana');
        expect(elements).toHaveClass('banana');

        core.removeClass(elements, 'banana');
        expect(elements).not.toHaveClass("banana");
    });


    it("hasClass()", function() {
        var element = document.getElementById("banana");
        expect(core.hasClass(element, 'banana')).toBeTruthy();

        element = core.select("button");
        expect(core.hasClass(element, 'clickMe')).toBeTruthy();
    });


    it("toggleClass()", function() {
        var element = core.select("#banana")[0];
        expect(core.hasClass(element, "boo")).toBeFalsy();
        core.toggleClass(element, "boo");
        expect(core.hasClass(element, "boo")).toBeTruthy();
        core.toggleClass(element, "boo");
        expect(core.hasClass(element, "boo")).toBeFalsy();
    });


    it("getDataAttr()", function() {
        var dataAttr = core.getDataAttr(core.select("#dataAttr")[0], "elephants");
        expect(dataAttr).toEqual("Big Dawg");

        var dataAttr2 = core.getDataAttr(core.select("#dataAttr2")[0], "more-elephants");
        expect(dataAttr2).toEqual("More elephants");
    })
});