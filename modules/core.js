/**
 * core.js
 *
 * A bunch of utility methods for working with the DOM and JS objects
 */

'use strict';

var core = {

    /**
     * Combine multiple objects. Mutates the first object.
     * TODO: Combine the extend & extendDeep funcs. Looks at how underscore does it.
     *
     * @returns {Object}
     */
    extend: function() {
        for(var i=1; i<arguments.length; i++)
            for(var key in arguments[i])
                if(arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    },


    /**
     * Combine two objects and any sub-properties recursively
     *
     * @param target
     * @param src
     *
     * @returns {boolean|Array|{}}
     */
    extendDeep: function(target, src) {

        if(!src ) return target;

        var that = this;
        var array = Array.isArray(src);
        var dst = array && [] || {};

        if (array) {
            target = target || [];
            dst = dst.concat(target);
            src.forEach(function(e, i) {
                if (typeof dst[i] === 'undefined') {
                    dst[i] = e;
                } else if (typeof e === 'object') {
                    dst[i] = that.extendDeep(target[i], e);
                } else {
                    if (target.indexOf(e) === -1) {
                        dst.push(e);
                    }
                }
            });
        } else {
            if (target && typeof target === 'object') {
                Object.keys(target).forEach(function (key) {
                    dst[key] = target[key];
                })
            }
            Object.keys(src).forEach(function (key) {
                if (typeof src[key] !== 'object' || !src[key]) {
                    dst[key] = src[key];
                }
                else {
                    if (!target[key]) {
                        dst[key] = src[key];
                    } else {
                        dst[key] = that.extendDeep(target[key], src[key]);
                    }
                }
            });
        }

        return dst;
    },


    /**
     * Add an event to an element or an array of elements
     * TODO: Make this better - see evernote. Or move into an events module
     *
     * @param el        {Node|Array}       Element | Array of elements
     * @param eventType {String}           Event Type
     * @param cb        {Function}         Callback
     */
    on: function(el, eventType, cb) {

        var i, j,
            eventTypeList = eventType.split(" ");

        for(i = 0; i < eventTypeList.length; i++) {
            if(Object.prototype.toString.call( el ) === '[object Array]') {
                for(j = 0; j < el.length; j++) {
                    el[j].addEventListener(eventTypeList[i], cb);
                }
            }
            else {
                el.addEventListener(eventTypeList[i], cb);
            }
        }
    },


    /**
     * Trigger an event on an element
     *
     * @param el
     * @param e
     */
    trigger: function(el, e) {
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(e, false, true);
            el.dispatchEvent(evt);
        }
        else
            el.fireEvent("on"+e);
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
     *
     * @param el
     * @param className
     * @returns {*}
     */
    addClass: function(el, className) {
        if(!el || !className) {
            return false;
        }

        if(el.classList) {
          return el.classList.add(className);
        }

        el.className = el.className + " " + className;
    },


    /**
     * Remove a class
     *
     * @param el
     * @param className
     * @returns {*}
     */
    removeClass: function(el, className) {
        if (!el || !className) {
            return false;
        }

        if(el.classList) {
            return el.classList.remove(className);
        }

        var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
        el.className = el.className.replace(regexp, "$2");
    },


    /**
     * Check if an element has a class
     *
     * @param el
     * @param className
     * @returns {boolean}
     */
    hasClass: function(el, className) {
        if (!el || !className) {
            return false;
        }

        if(el.classList) {
            return el.classList.contains(className);
        }

        return !!el.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
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
        var dataAttr = el.getAttribute("data-" + attr);
        return dataAttr || false;
    }
};

module.exports = core;