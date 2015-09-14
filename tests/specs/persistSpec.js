'use strict';

var $ =         jQuery,
    core =      require('../../modules/core'),
    persist =   require('../../modules/persist');


describe('persist.js', function() {

    beforeEach(function() {
        loadFixtures("persistFixture.html");
        persist.init();
    });


    it("init()", function() {
        var options,
            userOptions = {
                environment: 'test',
                defaultAction: 'submit'
            };

        spyOn(persist, 'bindEventHandlers');

        persist.init(userOptions);

        options = persist.getOptions();

        expect(options.environment).toEqual('test');
        expect(options.defaultAction).toEqual('submit');
        expect(persist.bindEventHandlers).toHaveBeenCalled();

    });


    it("bindEventHandlers()", function() {
        var elements = core.selectAll('.testEvents');

        spyOn(core, 'on');
        persist.bindEventHandlers(elements);
        expect(core.on.calls.count()).toBe(3);
    });


    it("_persistEventHandler()", function() {
        var el = document.querySelector("#result1");
        spyOn(persist, 'persistData');
        persist._persistEventHandler(el);
        expect(persist.persistData).toHaveBeenCalled();
    });


    it('_getPersistEventType()', function() {
        var eventType = persist._getPersistEventType(document.querySelector("#result1"));
        expect(eventType).toEqual('click');

        eventType = persist._getPersistEventType(document.querySelector("#result2"));
        expect(eventType).toEqual('submit');

        eventType = persist._getPersistEventType(document.querySelector("#result3"));
        expect(eventType).toEqual('click');

    });


    it('_getCollection()', function() {
        var collection = persist._getCollection(document.querySelector("#result1"));
        expect(collection).toEqual('search');

        collection = persist._getCollection(document.querySelector("#ncresult"));
        expect(collection).toBeNull();
    });


    it('_buildDataObjectFromDOM()', function() {
        var object = persist._buildDataObjectFromDOM(document.querySelector('#data-result1'));
        expect(object).toEqual({
            resultPage: '5',
            searchTerm: 'search query',
            resultNumber: '1'
        });
    });


    it('_getObjectPropsFromElementAttrs', function() {
        var object = persist._getObjectPropsFromElementAttrs(document.querySelector('#data-result1'));
        expect(object).toEqual({
            resultNumber: '1'
        });
    });


    it('_addDateToObject', function() {
        var object = { sampleProp: 'test' };

        object = persist._addDateToDataObj(object);

        expect(object).toHaveProp('timestamp');
    });
});