/**
 * collapse.js
 *
 * Collapsible content
 */

'use strict';

var core =  require('./core');

var collapse = {

    init: function() {
        var collapseToggleEls = core.selectAll('[data-toggle="collapse"]'),
            currentContentEl;

        core.on(collapseToggleEls, 'click', function() {
            currentContentEl = document.getElementById(this.getAttribute('data-target'));
            core.toggleClass(currentContentEl, 'isOpen');
        });
    }
};

module.exports = collapse;