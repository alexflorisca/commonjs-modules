/**
 *  share.js
 *  
 *  Share a web page to social networks
 *  
 *  To add a new network:
 *    1. Add button to options.buttons
 *    2. Add a click handler in the bindUIActions()
 *    3. Add a callback method with the name open<Network>Popup()
 **/

'use strict';

// Dependencies
var core =      require('./core');


// Default options
var options = {
    url: window.location.href,                     // Used on all
    title: '',                                     // Used on most
    hashtag: '',                                   // Used on twitter
    source: '',                                    // Used for linkedin as a the source of the post
    summary: '',                                   // Used for LinkedIn as a blurb of the page
    buttons: {                                     // Icon buttons
        facebook: false,
        twitter: false,
        gplus: false,
        linkedin: false,
        reddit: false,
        weibo: false
    },
    popup: {                                        // Default. Most networks resize the popup.
        width: 550,
        height: 550
    }
};

/**
 * Public
 */
var share = {

    _getOptions: function() {
        return options;
    },

    _getWindowFeatures: function(width, height) {
        var leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
        //Allow for title and status bars.
        var topPosition = (window.screen.height / 2) - ((height / 2) + 50);
        return 'status=no,height=' + height + ',width=' + width + ',resizable=yes,left=' + leftPosition + ',top=' + topPosition + ',screenX=' + leftPosition + ',screenY=' + topPosition + ',toolbar=no,menubar=no,scrollbars=no,location=no,directories=no';
    },

    _openShareWindow: function(url, width, height) {
        width = (typeof width === "undefined") ? options.popup.width : width;
        height = (typeof height === "undefined") ? options.popup.height : height;
        window.open(url, '_blank', this._getWindowFeatures(width, height));
    },


    // Public

    /**
     * Initialise
     * @param  {object} userOptions User options
     * @return {void}
     */
    init : function(userOptions) {
        options = core.extend(options, userOptions);
        options.title = core.trimNewLines(options.title);
        options.hashtag = options.hashtag.replace(/\s+/g, '').toLowerCase();
        this.bindUIActions();
    },


    /**
     * Bind the click events on the icons
     */
    bindUIActions: function() {
        var _this = this;

        core.on(options.buttons.facebook, 'click', function() {
            _this.openFacebookPopup();
        });

        core.on(options.buttons.twitter, 'click', function() {
            _this.openTwitterPopup();
        });

        core.on(options.buttons.gplus, 'click', function() {
            _this.openGooglePlusPopup();
        });

        core.on(options.buttons.linkedin, 'click', function() {
            _this.openLinkedInPopup();
        });

        core.on(options.buttons.reddit, 'click', function() {
            _this.openRedditPopup();
        });

        core.on(options.buttons.weibo, 'click', function() {
            _this.openWeiboPopup();
        });
    },


    /**
     * Open popups for each network with a share URL
     * @return {false}
     */
    openFacebookPopup: function() {
        this._openShareWindow('http://www.facebook.com/sharer.php?s=100&p[url]=' + encodeURIComponent(options.url));
        return false;
    },

    openTwitterPopup: function() {
        this._openShareWindow('https://twitter.com/intent/tweet?url=' + encodeURIComponent(options.url) + '&text=' + encodeURIComponent(options.title) + '&hashtags=' + encodeURIComponent(options.hashtag));
        return false;
    },

    openGooglePlusPopup: function() {
        this._openShareWindow('https://plus.google.com/share?url=' + encodeURIComponent(options.url));
        return false;
    },

    openLinkedInPopup: function() {
        this._openShareWindow('http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(options.url) + '&title=' + encodeURIComponent(options.title) + '&source=' + encodeURIComponent(options.source) + '&summary=' + encodeURIComponent(options.summary));
        return false;
    },

    openRedditPopup: function() {
        this._openShareWindow('http://www.reddit.com/submit?url=' + encodeURIComponent(options.url) + '&title=' +
        encodeURIComponent(options.title), 850);
        return false;
    },

    openWeiboPopup: function() {
        this._openShareWindow('http://service.weibo.com/share/share.php?url=' + encodeURIComponent(options.url) + '&title=' + encodeURIComponent(options.title));
        return false;
    }
};

module.exports = share;
