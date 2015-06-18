/**
 * analytics.js
 *
 * Abstraction for google analytics using data- attributes to bind events
 */

'use strict';

var core =  require('./core');

var analytics = {

    /**
     * Initialise the google analytics
     *
     * @param options
     * @param _gaq
     * @returns {boolean}
     */
    init: function(options, _gaq) {
        if (!_gaq || !options || !options.googleAnalyticsCode) return false;

        var sampleRate = 20;

        _gaq.push(
            ['_setAccount', options.googleAnalyticsCode],
            ['_gat._anonymizeIp'],
            ['_trackPageview'],
            ['_setAllowLinker', true],
            ['_setDomainName', 'none'],
            ['_setSiteSpeedSampleRate', sampleRate],
            ['_trackPageview']
        );


        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    },


    /**
     * Bind data- attributes in html to track events. The following are used:
     *
     * data-track-event
     * data-event-category
     * data-event-action
     * data-event-label
     * data-event-value
     */
    bindUIActions: function() {
        var _this = this;

        // Bing click events
        core.on(core.selectAll('[data-track-event="click"]'), 'click', function() {
            var data = _this._getElementDataProperties(this);
            _this.trackEvent(data.category, data.action, data.label, data.value);
        });

        // Bind submit events
        core.on(core.selectAll('[data-track-event="submit"]'), 'submit', function() {
            var data = _this._getElementDataProperties(this);
            _this.trackEvent(data.category, data.action, data.label, data.value);
        });

    },


    /**
     *
     * @param category
     * @param action
     * @param label
     * @param value
     * @returns {boolean}
     */
    trackEvent: function(category, action, label, value) {
        console.log("Event logged with category: " + category + ", action:  " + action + ", label: " + label + ", value: " + value);

        // Required params
        if(category === undefined || action === undefined) {
            return false;
        }

        // Optional params
        label = (label !== 'undefined' && label !== null) ? label : '';
        value = (value !== 'undefined' && value !== null) ? value : 0;

        _gaq.push(['_trackEvent', category, action, label, parseInt(value)]);
        return true;
    },


    _getElementDataProperties: function(el) {
        return {
            category: el.getAttribute('data-event-category'),
            action: el.getAttribute('data-event-action'),
            label: el.getAttribute('data-event-label'),
            value: el.getAttribute('data-event-value')
        }
    }

};

module.exports = analytics;

