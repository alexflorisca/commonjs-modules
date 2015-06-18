'use strict';

// jQuery defined as part of jasmine-jquery framework specified in karma.conf.js
var $ =         jQuery,
    core =      require('../../modules/core'),
    loadMore =  require('../../modules/loadMore');

describe('loadMore.js', function() {

    beforeEach(function() {
       loadFixtures('loadMoreFixture.html');

        if(core.select('.LoadMore')) {
            loadMore.init({
                url: 'http://oscar-component-service-staging.dev.cf.private.springer.com/v2/journal/articles?site=beta.genomebiology.com',
                btn: core.select('[data-load-more="yes"]'),
                endMessage: core.select('[data-load-more="no"]'),
                resultsList: core.select('.ResultsList'),
                currentPage: parseInt(core.select('.LoadMore').getAttribute('data-current-page')),
                totalPages: parseInt(core.select('.LoadMore').getAttribute('data-total-pages'))
            });
        }

        var options = loadMore._getOptions();

        //jasmine.Ajax.install();
    });

    afterEach(function() {
       //jasmine.Ajax.uninstall();
    });


    it("_appendResult() should append some html to the current article list", function() {
        // Emulate data returned from the ajax call
        var responseText = jasmine.getFixtures().read('loadMoreAjaxResponseFixture.html');

        var numResults = core.selectAll('.ResultsList_item').length;
        expect(numResults).toBe(20);

        loadMore._appendResult(responseText);
        numResults = core.selectAll('.ResultsList_item').length;

        expect(numResults).toBe(40);
    });


    it('Load More button should be hidden when there are 20 results or less', function() {
        var options = loadMore._getOptions();
        expect(core.hasClass(options.btn, 'u-isHidden')).toBeFalsy();
        expect(core.hasClass(options.endMessage, 'u-isHidden')).toBeTruthy();

        loadMore.init({
            totalPages: 1
        });

        loadMore._updateButtonDisplay();

        options = loadMore._getOptions();
        expect(core.hasClass(options.btn, 'u-isHidden')).toBeTruthy();
        expect(core.hasClass(options.endMessage, 'u-isHidden')).toBeFalsy();
    });


    it('Load More button should be hidden when on the last page', function() {
        var options = loadMore._getOptions();
        expect(core.hasClass(options.btn, 'u-isHidden')).toBeFalsy();
        expect(core.hasClass(options.endMessage, 'u-isHidden')).toBeTruthy();

        loadMore.init({
            currentPage: 178
        });

        loadMore._updateButtonDisplay();

        options = loadMore._getOptions();
        expect(core.hasClass(options.btn, 'u-isHidden')).toBeTruthy();
        expect(core.hasClass(options.endMessage, 'u-isHidden')).toBeFalsy();
    });


    it('Should initialise options', function() {
        spyOn(loadMore, '_updateButtonDisplay');
        spyOn(loadMore, 'loadNext');

        loadMore.init({
            url: 'http://oscar-component-service-staging.dev.cf.private.springer.com/v2/journal/articles?site=beta.genomebiology.com',
            btn: core.select('[data-load-more="yes"]'),
            endMessage: core.select('[data-load-more="no"]'),
            resultsList: core.select('.ResultsList'),
            currentPage: parseInt(core.select('.LoadMore').getAttribute('data-current-page')),
            totalPages: parseInt(core.select('.LoadMore').getAttribute('data-total-pages'))
        });

        var options = loadMore._getOptions();

        expect(loadMore._updateButtonDisplay).toHaveBeenCalled();
        expect(options.url).toBe('http://oscar-component-service-staging.dev.cf.private.springer.com/v2/journal/articles?site=beta.genomebiology.com');
        expect(options.btn).toBeDefined();
        expect(options.endMessage).toBeDefined();
        expect(options.currentPage).toBe(1);
        expect(options.totalPages).toBe(178);

        core.trigger(options.btn, 'click');

        expect(loadMore.loadNext).toHaveBeenCalled();
    });


    it('Should increment current page & google analytics', function() {
        loadMore.loadNext();

        var options = loadMore._getOptions();

        expect(options.currentPage).toEqual(2);
        expect(parseInt(options.btn.getAttribute('data-event-label'))).toEqual(3);
    });








});