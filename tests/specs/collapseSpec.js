'use strict';

// jQuery defined as part of jasmine-jquery framework specified in karma.conf.js
var $ =         jQuery,
    core =      require('../../modules/core'),
    collapse =  require('../../modules/collapse');


describe('Collapse.js', function() {
    beforeEach(function() {
        loadFixtures('collapseFixture.html');
    });

    it('The content should collapse when the link is clicked', function() {
        collapse.init();

        var link = core.select("#link")[0],
            content = core.select("#content")[0];

        expect(content).toHaveClass('isOpen');
        core.trigger(link, 'click');
        expect(content).not.toHaveClass('isOpen');
    })
});