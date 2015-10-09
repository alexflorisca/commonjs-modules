'use strict';

// Initialise any modules here
var ajax =      require('./modules/ajax');

ajax.get({
    url: 'http://localhost/commonjs-modules/index.html'
});

ajax.get({
    url: 'http://updates.html5rocks.com'
});

console.log(window.location.hostname);


