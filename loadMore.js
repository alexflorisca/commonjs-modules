/**
 * Load more articles with AJAX
 */

'use strict';

var core = require('./core'),
    ajax = require('./ajax');

var options = {
    url: undefined,                                         // URL to load more data from
    btn: core.select('[data-load-more="yes"]'),             // 'Load more' element
    endMessage: core.select('[data-load-more="no"]'),       // 'No more data to load' element
    currentPage: undefined,
    totalPages: undefined,
    resultsList: undefined
};

var loadMore = {

    _getOptions: function() {
        return options;
    },

    _appendResult: function(resultText) {
        var html = document.createElement('div');
        html.innerHTML = resultText;

        var articles = html.querySelectorAll('.ResultsList_item');
        for(var i = 0; i < articles.length; i++) {
            options.resultsList.appendChild(articles[i]);
        }
    },


    _updateButtonDisplay: function() {
        if(options.totalPages == 1 || options.currentPage == options.totalPages) {
            core.addClass(options.btn, 'u-isHidden');
            core.removeClass(options.endMessage, 'u-isHidden');
        }
    },


    /**
     * Initialise the options
     * @param userOptions
     */
    init: function(userOptions) {
        options = core.extend(options, userOptions);
        var _this  = this;
        core.on(options.btn, 'click', function(e) {
            _this.loadNext(this, e);
        });

        this._updateButtonDisplay();
    },


    /**
     * Load the next page of articles.
     * Callback when 'Load more' button is clicked
     */
    loadNext: function(el, e) {
        var _this = this,
            originalBtnText = options.btn.innerText,
            data = {
                page: options.currentPage+1
            };

        options.btn.innerText = 'Loading...';

        ajax.get(options.url, data, function(resultText) {
            _this._appendResult(resultText);
            options.btn.innerText = originalBtnText;

            _this._updateButtonDisplay();
        });

        options.currentPage++;
        options.btn.setAttribute('data-event-label', (options.currentPage+1));
    }
};

module.exports = loadMore;