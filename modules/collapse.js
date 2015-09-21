/**
 * collapse.js
 *
 * Collapsible content. Use like this:
 *
 * <a href="#content" data-toggle="collapse">
 * <div id="content" class="isOpen">
 *     ...
 * </div>
 */

'use strict';

var core =  require('./core');

var collapse = {

    init: function() {
        var collapseToggleEls = core.select('[data-toggle="collapse"]'),
            currentContentEl;

        core.on(collapseToggleEls, 'click', function(e) {
            e.preventDefault();
            console.log("clicking");
            currentContentEl = core.select(this.getAttribute('href'))[0];
            console.log(currentContentEl);
            core.toggleClass(currentContentEl, 'isOpen');
        });
    }
};

module.exports = collapse;