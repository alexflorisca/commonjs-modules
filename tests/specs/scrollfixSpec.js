'use strict';

var $ =         jQuery,
    core =      require('../../modules/core'),
    scrollfix = require('../../modules/scrollfix');

describe('scrollfix.js', function() {

    beforeEach(function() {
        loadFixtures("scrollfixFixture.html");
    });


    it("Fix an ad to the top of the screen", function() {
        var el = core.select(".Ad"),
            elOffsetTop = el.offsetTop;

        scrollfix.init(el, 10);

        core.trigger(document, 'scroll');

        expect(el.style.position).toBe("static");

        // Simulate scrolling down 80px
        window.scrollY = 90;
        core.trigger(document, 'scroll');

        expect(el.style.position).toBe("fixed");
    });

});