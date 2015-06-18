'use strict';

var $ =         jQuery,
    core =      require('../../modules/core'),
    share =     require('../../modules/share');

// PhantomJS doesn't have support for the bind() method.
//Function.prototype.bind = require("function-bind");

describe('share.js ', function() {

    var options;

    beforeEach(function() {
        loadFixtures('shareFixture.html');

        share.init({
            title: core.text(core.select('.ArticleTitle')),
            hashtag: core.text(core.select('#journalTitle')),
            source: core.select('#header-logo').getAttribute('title'),
            summary: core.text(core.select('.Abstract .Para')),
            buttons: {
                facebook: core.selectAll(".js-btnShareOnFacebook"),
                twitter: core.selectAll(".js-btnShareOnTwitter"),
                gplus: core.selectAll(".js-btnShareOnGplus"),
                linkedin: core.selectAll(".js-btnShareOnLinkedIn"),
                reddit: core.selectAll(".js-btnShareOnReddit"),
                weibo: core.selectAll(".js-btnShareOnWeibo")
            }
        });

        options = share._getOptions();
    });



    it("Should initialise the options", function() {
        expect(options.title).toBe('Test title');
        expect(options.hashtag).toBe('genomebiology');
        expect(options.source).toBe('BioMed Central');
        expect(options.summary).toBe('Summary test');
    });

    // Facebook
    it("Clicking facebook should trigger a popup", function() {
        spyOn(share, 'openFacebookPopup').and.callThrough();
        spyOn(share, '_openShareWindow');
        share.bindUIActions();
        $(options.buttons.facebook).click();
        expect(share.openFacebookPopup).toHaveBeenCalled();
        expect(share._openShareWindow).toHaveBeenCalled();
    });

    // Twitter
    it("Clicking Twitter should should trigger a popup", function() {
        spyOn(share, 'openTwitterPopup').and.callThrough();
        spyOn(share, '_openShareWindow');
        share.bindUIActions();
        $(options.buttons.twitter).click();
        expect(share.openTwitterPopup).toHaveBeenCalled();
        expect(share._openShareWindow).toHaveBeenCalled();
    });

    // Google Plus
    it("Clicking Google Plus should trigger a popup", function() {
        spyOn(share, 'openGooglePlusPopup').and.callThrough();
        spyOn(share, '_openShareWindow');
        share.bindUIActions();
        $(options.buttons.gplus).click();
        expect(share.openGooglePlusPopup).toHaveBeenCalled();
        expect(share._openShareWindow).toHaveBeenCalled();
    });

    // LinkedIn
    it("Clicking LinkedIn should trigger a popup", function() {
        spyOn(share, 'openLinkedInPopup').and.callThrough();
        spyOn(share, '_openShareWindow');
        share.bindUIActions();
        $(options.buttons.linkedin).click();
        expect(share.openLinkedInPopup).toHaveBeenCalled();
        expect(share._openShareWindow).toHaveBeenCalled();
    });

    // Weibo
    it("Clicking Weibo should trigger a popup", function() {
        spyOn(share, 'openWeiboPopup').and.callThrough();
        spyOn(share, '_openShareWindow');
        share.bindUIActions();
        $(options.buttons.weibo).click();
        expect(share.openWeiboPopup).toHaveBeenCalled();
        expect(share._openShareWindow).toHaveBeenCalled();
    });

    // Reddit
    it("Clicking Reddit should trigger a popup", function() {
        spyOn(share, 'openRedditPopup').and.callThrough();
        spyOn(share, '_openShareWindow');
        share.bindUIActions();
        $(options.buttons.reddit).click();
        expect(share.openRedditPopup).toHaveBeenCalled();
        expect(share._openShareWindow).toHaveBeenCalled();
    });

    it("Popup is actually triggered", function() {
        spyOn(window, 'open');
        var s = share._openShareWindow('http://localhost/', 200, 200, window);
        expect(window.open).toHaveBeenCalled();
    });
});