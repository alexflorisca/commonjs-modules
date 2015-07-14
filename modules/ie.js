var ie = {
    /**
     * Cross browser version of addEventListener
     *
     * @param el            {Node}
     * @param eventType     {String}
     * @param cb            {Function}
     * @private
     */
    addEventListener: function(el, eventType, cb) {
        if(!el || !eventType || typeof cb !== 'function') return;
        if (el.addEventListener) {
            el.addEventListener(eventType, function(event) {
                cb.apply(el, [event]);
            }, false);
        } else if (el.attachEvent)  {
            el.attachEvent('on'+eventType, function(event) {
                cb.apply(el, [event]);
            });
        }
    }
};

modules.export = ie;