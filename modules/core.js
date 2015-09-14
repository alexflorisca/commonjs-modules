/**
 * core.js
 *
 * A bunch of utility methods for working with the DOM and JS objects
 */

'use strict';

var core = {

    /**
     * Extend a target object with the properties of one or more other objects
     *
     * @param {Object}      target
     * @param {Object}      [sources]
     * @returns {Object}
     */
    extend: function(target, sources) {
        var _mergeTwoObjects = function(target, src) {
                for(var key in src) {
                    if (src.hasOwnProperty(key)) {
                        if(target[key] && typeof target[key] === 'object' && typeof src[key] === 'object') {
                            target[key] = _mergeTwoObjects(target[key], src[key]);
                        }
                        else {
                            target[key] = src[key];
                        }
                    }
                }
                return target;
            };

        if(arguments.length === 0) return false;
        if(arguments.length === 1) return arguments[0];

        for(var i = 1; i < arguments.length; i++) {
            target = _mergeTwoObjects(target, arguments[i]);
        }

        return target;
    },


    /**
     * Add an event to an element or an array of elements
     *
     * @param {Node|Array}      el
     * @param {String}          event
     * @param {Function}        cb
     * @param {Function}        context
     * @param {Boolean}         userCapture
     */
    on: function(el, event, cb, context, userCapture) {
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
    off: function(el, e, cb) {
        if(Array.isArray(el)) {
            el.forEach(function(current) {
                current.removeEventListener(e, cb);
            });
        }
        else {
            el.removeEventListener(e, cb);
        }
    },


    /**
     * Trigger an event on an element
     *
     * @param {Node|Array}      els
     * @param {String}          e - multiple events can be separated by a space e.g. "click change"
     */
    trigger: function(els, e) {
        var dispatchEvent = function(el) {
            if ("createEvent" in document) {
                var evt = document.createEvent("HTMLEvents"),
                    eventList = e.split(" ");

                eventList.forEach(function(e) {
                    evt.initEvent(e, false, true);
                    el.dispatchEvent(evt);
                });
            }
        };

        if(Array.isArray(els)) {
            els.forEach(function(el) {
                dispatchEvent(el);
            })
        }
        else {
            dispatchEvent(els);
        }
    },


    /**
     * Optimized version of querySelectorAll
     *
     * @param selector  {string}
     * @param context   {string}
     * @returns         {Array}
     */
    select: function(selector, context) {
        var simpleRe = /^(#?[\w-]+|\.[\w-.]+)$/,
            periodRe = /\./g,
            slice = [].slice,
            classes;

            context = context || window.document;

            // Redirect simple selectors to the more performant function
            if(simpleRe.test(selector)) {
                switch(selector.charAt(0)) {
                    //Handle ID based selectors
                    case '#':
                        return [context.getElementById(selector.substr(1))];
                    
                    // Handle class based selectors
                    // Query by multiple classes by converting the selector
                    // string int single spaced class names
                    case '.':
                        classes = selector.substr(1).replace(periodRe, ' ');
                        return slice.call(context.getElementsByClassName(classes));
                    default: 
                        return slice.call(context.getElementsByTagName(selector));
                }
            }

            // Default to 'querySelectorAll'
            return slice.call(context.querySelectorAll(selector));
    },


    /**
     * Add a class to an element - browser compatible with old IE
     * TODO: make this support arrays of elements
     *
     * @param {Node|Array}      els
     * @param {String}          className
     * @returns {*}
     */
    addClass: function(els, className) {
        if(!els || !className) return;

        var addClassToEl = function(el) {
            if(el.classList) {
                el.classList.add(className);
            }
            else {
                el.className = el.className + " " + className;
            }
        };

        if(Array.isArray(els)) {
            els.forEach(function(el) {
                addClassToEl(el);
            });
        }
        else {
            addClassToEl(els);
        }
    },


    /**
     * Remove a class
     *
     * @param {Node|Array}      els
     * @param {String}          className
     * @returns {*}
     */
    removeClass: function(els, className) {
        if (!els || !className) return;

        var removeClassFromEl = function(el) {
            if(el.classList) {
                el.classList.remove(className);
            }

            var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
            el.className = el.className.replace(regexp, "$2");
        };

        if(Array.isArray(els)) {
            els.forEach(function(el) {
                removeClassFromEl(el);
            });
        }
        else {
            removeClassFromEl(els);
        }
    },


    /**
     * Check if an element has a class
     *
     * @param {Node|Array}      els
     * @param {String}          className
     * @returns {boolean}
     */
    hasClass: function(els, className) {
        if (!els || !className) return false;

        var elHasClass = function(el) {
            if(el.classList) {
                return el.classList.contains(className);
            }

            return !!el.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
        };

        if(Array.isArray(els)) {
            els.forEach(function(el) {
                if(elHasClass(el) === false) return false;
            });

            return true;
        }
        else {
            return elHasClass(els);
        }
    },


    /**
     * Toggle class name
     *
     * @param el
     * @param className
     */
    toggleClass: function(el, className) {
        if(this.hasClass(el, className)) {
            this.removeClass(el, className);
        }
        else {
            this.addClass(el, className);
        }
    },


    /**
     * Get a data attribute for an element
     * TODO: Needs testing
     *
     * @param el
     * @param attr
     * @returns {string|boolean}
     */
    getDataAttr: function(el, attr) {
        return (typeof attr === 'string') ? el.getAttribute("data-" + attr) : false;
    }
};

module.exports = core;