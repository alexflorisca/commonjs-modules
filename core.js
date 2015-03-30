/**
 * core.js
 *
 * A bunch of utility methods for working with the DOM and JS objects
 */

'use strict';

var core = {

    /**
     * Convert a NodeList to an Array
     *
     * @param nodeList {NodeList}
     * @returns {Array}
     * @private
     */
    _nodeListToArray: function(nodeList) {
        var elArray = [];
        for(var i = nodeList.length; i--; elArray.unshift(nodeList[i]));
        return elArray;
    },


    /**
     * Cross browser version of addEventListener
     *
     * @param el            {Node}
     * @param eventType     {String}
     * @param cb            {Function}
     * @private
     */
    _addEventListener: function(el, eventType, cb) {
        if (el.addEventListener) {
            el.addEventListener(eventType, function(event) {
                cb.apply(el, [event]);
            }, false);
        } else if (el.attachEvent)  {
            el.attachEvent('on'+eventType, function(event) {
                cb.apply(el, [event]);
            });
        }
    },


    /**
     * Replace any new line or multiple spaces with a single space
     *
     * @param string {string}
     * @return {string}       
     */
    trimNewLines: function(string) {
      //   /(\r\n|\n|\r)\s{2,}/gm
      return string.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s{2,}/g,' ');
    },


    /**
     * Combine multiple objects
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
     * Add an event to an element or an array of elements
     *
     * @param el        {Node|Array}       Element | Array of elements
     * @param eventType {String}           Event Type
     * @param cb        {Function}         Callback
     */
    on: function(el, eventType, cb) {
        if(Object.prototype.toString.call( el ) === '[object Array]') {
            for(var i = 0; i < el.length; i++) {
                this._addEventListener(el[i], eventType, cb);
            }
        }
        else {
            this._addEventListener(el, eventType, cb);
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
     * Select a single DOM element
     *
     * @param selector  {string}
     * @returns {Node}
     */
    select: function(selector) {
        return document.querySelector(selector);
    },


    /**
     * Select a list of DOM elements.
     *
     * @param selector {String}
     * @returns {Array}
     */
    selectAll: function(selector) {
        return this._nodeListToArray(document.querySelectorAll(selector));
    },


    /**
     * Return the text of an element.
     *
     * @param el {Node}
     * @returns {bool | string}
     */
    text: function(el) {
        return (typeof el === 'undefined' || el === null) ? false : el.innerText || el.textContent;
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
     * Validate an email address
     *
     * @param email
     * @returns {boolean}
     */
    validateEmail: function(email) {
        if(!email.match) {
            return false;
        }
        return !!email.match(new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"));
    },
    

    /**
     * Return the selected child node by passing a class, id or node name / currently only supports one class name at a time
     *
     * @param containing element
     * @param element tag reference
     * @returns {element_node / Array}
     */
    children: function(parentNode, requestedChild) {
        var requestedChildNodes = parentNode.childNodes,
            returnData = [];

        // Remove the extra identifiers
        requestedChild = requestedChild.replace('.', '').replace('#', '');

        for (var i = (requestedChildNodes.length - 1), end = 0; i >= end; --i) {
            // Only loop through elements, not text or comment blocks
            if (requestedChildNodes[i].nodeType === 1) {
                // Add any element_nodes to the list
                if (requestedChildNodes[i].nodeName.toLowerCase() === requestedChild ||
                    this.hasClass(requestedChildNodes[i], requestedChild) ||
                    requestedChildNodes[i].getAttribute('id') === requestedChild) {
                    // Create array of matching elements
                    returnData.unshift(requestedChildNodes[i]);
                }
            }
        }

        // If only one element_node found just return, otherwise return array
        return (returnData.length === 1) ? returnData[0] : returnData;
    },


    /**
     * Check if two strings are the same
     *
     * @param string1
     * @param string2
     * @returns {boolean}
     */
    matchStrings: function(string1, string2) {
        if(string1 === string2) {
            return true;
        }
        return false;
    },

    insertAfter: function(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
};

module.exports = core;