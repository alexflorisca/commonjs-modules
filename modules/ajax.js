/**
 * ajax.js
 *
 * Simple AJAX API similar to jQuery but more lightweight.
 * Supports cross domain requests.
 * IE8+
 *
 *
 * TODO: Add custom headers
 * TODO: Add JSON as a response data type
 * TODO: Sort out get function data processing
 */

'use strict';

var ajax = {
    /**
     * Make a GET request
     *
     * @param {Object} options
     */
    get: function (options) {
        options.method = 'GET';

        if(options.data) {
            var query = this._encodeURIArray(options.data);
            if(options.url.indexOf('?') < 0) {
                options.url = options.url + '?';
            }
            else {
                options.url = options.url + '&';
            }
            options.url = options.url + query.join('&');
        }
        this._send(options);
    },


    /**
     * Make a POST request
     *
     * @param {Object} options
     */
    post: function (options) {
        options.method = 'POST';
        options.data = JSON.stringify(options.data);

        this._send(options);
    },


    /**
     * Get the hostname part only of a string
     *
     * @param str
     * @returns {*|string}
     * @private
     */
    _getHostnameFromString: function(str) {
        var l = document.createElement("a");
        l.href = str;
        return l.hostname;
    },


    /**
     * Set custom headers
     *
     * @param r
     * @param headers
     * @private
     */
    _setCustomHeaders: function(r, headers) {
        for(var headerKey in headers){
            r.setRequestHeader(headerKey, headers[headerKey]);
        }
    },


    /**
     * is the URL on the same host or different?
     *
     * @param url
     * @returns {boolean}
     * @private
     */
    _isSameOriginRequest: function(url) {
        return (this._getHostnameFromString(url) === window.location.hostname);
    },


    /**
     * URI Encode every key => value pair in an array as a query parameter
     *
     * @param {Array} data
     * @returns {Array}
     * @private
     */
    _encodeURIArray: function (data) {
        var eArr = [];
        for (var key in data) {
            eArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        return eArr;
    },


    /**
     * Create a request object based on the browser support and
     * wether we're making a same origina or CORS request
     * @param url
     * @returns {{}}
     * @private
     */
    _createRequest: function(url) {
        var r = {};
        if(this._isSameOriginRequest(url)) {
            r.xhr = new XMLHttpRequest();
        }
        else {
            if(typeof XMLHttpRequest !== 'undefined') {
                var xhr = new XMLHttpRequest();
                // Modern Browsers
                if('withCredentials' in xhr) {
                    r.xhr = xhr;
                }

                // IE8 && 9
                else if(typeof XDomainRequest !== "undefined") {
                    r.xdr = new XDomainRequest();
                }
                // No support for CORS
                else {
                    throw "This browser does not support CORS";
                }
            }
            else {
                throw "XMLHttpRequest undefined";
            }
        }
        return r;
    },


    /**
     * Send a request via XHR object
     *
     * @param {Object} r
     * @param {Object} options
     * @private
     */
    _sendRequestViaXHR: function(r, options) {
        r.xhr.open(options.method, options.url, options.async);

        r.xhr.onreadystatechange = function () {
            if (r.xhr.readyState === 4) {
                if (r.xhr.status === 200) {
                    typeof options.success === 'function' && options.success(r.xhr.responseText);
                }
                else {
                    typeof options.error === 'function' && options.error(r.xhr.statusText);
                }
            }
        };

        if (options.method.toUpperCase() === 'POST') {
            r.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        r.xhr.send();
    },


    /**
     * Send a request via XDR object
     *
     * @param {Object} r
     * @param {Object} options
     * @private
     */
    _sendRequestViaXDR: function(r, options) {
        r.xdr.open(options.method, options.url);

        r.xdr.onload = function() {
            typeof options.success === 'function' && options.success(r.xdr.responseText);
        };

        r.xdr.onerror = function() {
            typeof options.error === 'function' && options.error();
        };

        r.xdr.timeout = function() {
            throw "XDR request timed out";
        };

        setTimeout(function() {
            r.xdr.send(options.data);
        }, 0);
    },


    /**
     * Send a request to the server
     *
     * @param {Object} options
     * @private
     */
    _send: function (options) {
        options.async = (typeof async !== 'undefined') ? options.async : true;

        var r = this._createRequest(options.url);

        // XML HTTP Requests - normal way
        if(typeof r.xhr !== 'undefined') {
            this._sendRequestViaXHR(r, options);
        }

        // IE8 & 9 use XDomainRequest
        else if(typeof r.xdr !== 'undefined') {
            this._sendRequestViaXDR(r, options);
        }
    }
};

module.exports = ajax;