/**
 * tabs.js
 *
 * Tabbable content
 */

'use strict';

var core =  require('./core');

var tabs = {

    /**
     * Initialise the tabs
     */
    init: function() {
        var _this = this,
            tabToggleEls = core.selectAll('[data-toggle="tab"]');

        core.on(tabToggleEls, 'click', function(e) {
            e.preventDefault();
            _this.switchTabs(this);
        })
    },

    switchTabs: function(el) {
        if(core.hasClass(el.parentNode, 'isActive')) return;

        this.removeActiveClasses(el);
        this.addActiveClass(el);
    },

    removeActiveClasses: function(el) {
        var tabs = this.getTabsEl(el);
        var activeTabs = tabs.querySelectorAll('.isActive');
        for(var i = 0; i < activeTabs.length; i++) {
            core.removeClass(activeTabs[i], 'isActive');
        }
    },

    getTabsEl: function(el) {
        while(el.parentNode) {
            if(el.getAttribute('data-tabs')) break;
            el = el.parentNode;
        }
        return el;
    },

    addActiveClass: function(el) {
        var activeContentEl;

        // Add isActive class to parent of clicked element
        core.addClass(el.parentNode, 'isActive');

        // Add isActive class to corresponding href target
        activeContentEl = document.getElementById(el.getAttribute('href').substr(1));
        core.addClass(activeContentEl, 'isActive');
    }

};

module.exports = tabs;