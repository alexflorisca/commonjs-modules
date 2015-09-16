var performance = {

    logDomLoadTime: function() {
        var t = window.performance.timing,
            interactive = t.domInteractive - t.domLoading,
            dcl = t.domContentLoadedEventStart - t.domLoading,
            complete = t.domComplete - t.domLoading;

        console.log('domInteractive: ' + interactive + 'ms, ');
        console.log('domContentLoaded: ' + dcl + 'ms');
        console.log('domComplete: ' + complete + 'ms');
    }
};

module.exports = performance;