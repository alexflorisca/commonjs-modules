'use strict';

var ajax = require('../../modules/ajax');

describe('ajax.js', function() {

    var originalXHR = XMLHttpRequest;

    beforeEach(function() {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        window.XDomainRequest = undefined;
        window.XMLHttpRequest = originalXHR;

        jasmine.Ajax.uninstall();
    });


    it('_getHostnameFromString', function() {
        var hostname = ajax._getHostnameFromString('http://example.com/page?getparam=1');
        expect(hostname).toBe('example.com');
    });


    it('_isSameOriginRequest', function() {
        expect(ajax._isSameOriginRequest('http://localhost')).toBeTruthy();
        expect(ajax._isSameOriginRequest('http://example.com')).toBeFalsy();
        expect(ajax._isSameOriginRequest('index.html')).toBeTruthy();
    });


    it('_encodeURIArray() should return an array of query parameters', function() {
        var data = [];
        data['world'] = 'Hello World;';
        data['test'] = 'my test.asp?name=ståle&car=saab';

        var encodedData = ajax._encodeURIArray(data);
        expect(encodedData[0]).toEqual("world=Hello%20World%3B");
        expect(encodedData[1]).toEqual("test=my%20test.asp%3Fname%3Dst%C3%A5le%26car%3Dsaab");
    });


    describe('_createRequest()', function() {
        it('Should return a request object with an xhr property when making same origin requests', function() {
            // Mock XHR object in every modern browser
            window.XMLHttpRequest = function() {};

            var r = ajax._createRequest();
            expect(r.xhr).toBeDefined();
        });

        it('Should return a request object with an xhr property when making same CORS requests in new browsers', function() {
            // Mock XHR object in every modern browser
            window.XMLHttpRequest = function() {
                this.withCredentials = true;
            };

            var r = ajax._createRequest('http://google.com');
            expect(r.xhr).toBeDefined();
            expect(r.xdr).not.toBeDefined();
        });

        it('Should return a request object with an xdr property - for IE8+9 when making CORS request', function() {
            // Mock XHR & XDR objects in IE8+9
            window.XMLHttpRequest = function() {};
            window.XDomainRequest = function() {};

            var r = ajax._createRequest('http://google.com');
            expect(r.xhr).not.toBeDefined();
            expect(r.xdr).toBeDefined();
        });
    });


    it('_sendRequestViaXHR() should set the correct headers for POST and execute callback on success', function() {
        var r = ajax._createRequest(),
            options = {
                url: 'http://google.com',
                method: 'POST',
                success: jasmine.createSpy("success")
            };

        spyOn(r.xhr, 'setRequestHeader');

        ajax._sendRequestViaXHR(r, options);

        expect(r.xhr.setRequestHeader).toHaveBeenCalledWith('Content-type', 'application/x-www-form-urlencoded');
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://google.com');
        expect(options.success).not.toHaveBeenCalled();

        jasmine.Ajax.requests.mostRecent().respondWith({
            "status": 200,
            "contentType": 'text/html; charset="UTF-8',
            "responseText": "Text from server"
        });

        expect(options.success).toHaveBeenCalledWith("Text from server");
    });


    it('_send() should delegate to either _sendRequestViaXHR() or _sendRequestViaXDR() methods', function() {
       var options = {
                url: 'http://google.com',
                method: 'POST',
                success: function() {}
            };

        spyOn(ajax, '_sendRequestViaXHR');
        spyOn(ajax, '_sendRequestViaXDR');

        // Mock XHR object in every modern browser
        window.XMLHttpRequest = function() {
            this.withCredentials = true;
        };
        ajax._send(options);
        expect(ajax._sendRequestViaXHR).toHaveBeenCalled();

        // Mock XHR & XDR objects in IE8+9
        window.XMLHttpRequest = function() {};
        window.XDomainRequest = function() {};
        ajax._send(options);
        expect(ajax._sendRequestViaXDR).toHaveBeenCalled();
    });


    it('get() should perform a GET request', function() {
        var options = {
            url: 'http://google.com',
            data: ['awesome', 'more awesome'],
            success: function() {}

        };

        spyOn(ajax, '_send');

        ajax.get(options);

        expect(ajax._send).toHaveBeenCalledWith(options);
    });


    it('post() should perform a POST request', function() {
        var options = {
            url: 'http://google.com',
            data: {
                prop1: 'awesome',
                prop2: 'more awesome'
            },
            success: function() {}
        };

        var expectedOptions = options;
        expectedOptions.data = JSON.stringify(options.data);

        spyOn(ajax, '_send');

        ajax.post(options);

        expect(ajax._send).toHaveBeenCalledWith(expectedOptions);
    });
});