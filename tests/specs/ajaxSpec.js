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


    it('_encodeURIArray() should return an array of query parameters', function() {
        var data = [];
        data['world'] = 'Hello World;';
        data['test'] = 'my test.asp?name=ståle&car=saab';

        var encodedData = ajax._encodeURIArray(data);
        expect(encodedData[0]).toEqual("world=Hello%20World%3B");
        expect(encodedData[1]).toEqual("test=my%20test.asp%3Fname%3Dst%C3%A5le%26car%3Dsaab");
    });


    it('_makeRequest() should return a request object with an xhr property', function() {
        // Mock XHR object in every modern browser
        window.XMLHttpRequest = function() {
            this.withCredentials = true;
        };

        var r = ajax._makeRequest();
        expect(r.xhr).toBeDefined();
    });


    it('_makeRequest() should return a request object with an xdr property - for IE8+9', function() {
        // Mock XHR & XDR objects in IE8+9
        window.XMLHttpRequest = function() {};
        window.XDomainRequest = function() {};

        var r = ajax._makeRequest();
        expect(r.xhr).not.toBeDefined();
        expect(r.xdr).toBeDefined();
    });


    it('_sendRequestViaXHR() should set the correct headers for POST and execute callback on success', function() {
        var cb = jasmine.createSpy("success");
        var r = ajax._makeRequest();

        spyOn(r.xhr, 'setRequestHeader');

        ajax._sendRequestViaXHR(r, 'http://google.com', 'POST', cb, '', true);

        expect(r.xhr.setRequestHeader).toHaveBeenCalledWith('Content-type', 'application/x-www-form-urlencoded');
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('http://google.com');
        expect(cb).not.toHaveBeenCalled();

        jasmine.Ajax.requests.mostRecent().respondWith({
            "status": 200,
            "contentType": 'text/html; charset="UTF-8',
            "responseText": "Text from server"
        });

        expect(cb).toHaveBeenCalledWith("Text from server");
    });


    it('_send() should delegate to either _sendRequestViaXHR() or _sendRequestViaXDR() methods', function() {
        var r = ajax._makeRequest();
        var cb = function() {};
        spyOn(ajax, '_sendRequestViaXHR');
        spyOn(ajax, '_sendRequestViaXDR');

        // Mock XHR object in every modern browser
        window.XMLHttpRequest = function() {
            this.withCredentials = true;
        };
        ajax._send('http://google.com', 'POST', cb, '', true);
        expect(ajax._sendRequestViaXHR).toHaveBeenCalled();

        // Mock XHR & XDR objects in IE8+9
        window.XMLHttpRequest = function() {};
        window.XDomainRequest = function() {};
        ajax._send('http://google.com', 'POST', cb, '', true);
        expect(ajax._sendRequestViaXDR).toHaveBeenCalled();
    });


    it('get() should perform a GET request', function() {
        var data = [];
        data['param1'] ='awesome';
        data['param2'] ='more awesome';
        var cb = function() {};

        spyOn(ajax, '_send');

        ajax.get('http://google.com', data, cb, true);

        expect(ajax._send).toHaveBeenCalledWith('http://google.com?param1=awesome&param2=more%20awesome', 'GET', cb, null, true);
    });


    it('post() should perform a POST request', function() {
        var data = [];
        data['param1'] ='awesome';
        data['param2'] ='more awesome';
        var cb = function() {};

        spyOn(ajax, '_send');

        ajax.post('http://google.com', data, cb, true);

        expect(ajax._send).toHaveBeenCalledWith('http://google.com', 'POST', cb, 'param1=awesome&param2=more%20awesome', true);
    });
});