// Initialise any modules here
window.$ =      require("./modules/core");

window.testing = {
    testEvent: function() {
        e.add($.select(".test"), "click", this.eventHandler.bind(this));
    },

    eventHandler: function(e) {
        console.log(e);
        console.log(e.target);
        console.log(this);
    },

    addListEvents: function() {
        e.add($.select(".list"), "click", this.eventHandler);
    }
};


