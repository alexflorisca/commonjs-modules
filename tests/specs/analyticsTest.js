'use strict';

// jQuery defined as part of jasmine-jquery framework specified in karma.conf.js
var $ =         jQuery,
    analytics = require('../../modules/analytics');

describe('analytics.js', function() {

    beforeEach(function() {
        loadFixtures('analyticsFixture.html');
    });

    it('Should create a script tag with the correct sc to google analytics', function() {
        // config & _gaq are global objects defined in the fixtures
        analytics.init(config, _gaq);

        var src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var gaScriptTag = $('script[src="' + src + '"]');

        expect(gaScriptTag).toBeInDOM();
    });


    it('Should call trackEvent() on clicking an element with a data-track-event attribute', function() {
        var button = $('[data-track-event]');

        spyOn(analytics, 'trackEvent');
        analytics.bindUIActions();

        button.click();
        expect(analytics.trackEvent).toHaveBeenCalledWith('Category', 'Action', 'Label', 'Value');
    });


    it('Given there are missing required params, tracking an event should fail', function() {
        var response = analytics.trackEvent('Event Category');
        expect(response).toBe(false);

        response = analytics.trackEvent();
        expect(response).toBe(false);
    });


    it('Given all required params, should track an event', function() {
        var response = analytics.trackEvent('Event Category', 'Event Action');
        expect(response).toBe(true);
    });

});
