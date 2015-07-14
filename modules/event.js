/**
 * Module: events
 *
 * - Custom events
 * -
 *
 *
 * Advanced:
 *
 * - Look at decoupling events from the DOM so that they can be used with standard objects too.
 * -
 */
var event = {


    /**
     * Add an event to an element or an array of elements
     *
     * @param {Node|Array}      el
     * @param {String}          event
     * @param {Function}        cb
     * @param {Boolean}         userCapture
     */
    add: function(el, event, cb, context, userCapture) {
        userCapture = (typeof userCapture === 'undefined') ? false : userCapture;
        cb = (typeof context === 'undefined') ? cb : cb.bind(context);

        // We might have multiple types of events defined as a string.
        // E.g. 'click hover change'
        var eventList = event.split(" ");

        eventList.forEach(function(currentEvent) {
            // Array of elements
            if(Array.isArray(el)) {
                el.forEach(function(currentEl) {
                    currentEl.addEventListener(currentEvent, cb, userCapture);
                });
            }
            // Single element
            else {
                el.addEventListener(currentEvent, cb, userCapture);
            }
        });
    },


    /**
     * Remove an event listener from one or more elements
     *
     * @param {Node|Array}  el
     * @param {String}      e
     * @param {Function}    cb
     */
    remove: function(el, e, cb) {
        if(Array.isArray(el)) {
            el.forEach(function(current, index, arr) {
               current.removeEventListener(e, cb);
            });
        }
        else {
            el.removeEventListener(e, cb);
        }
    }
};
module.exports = event;