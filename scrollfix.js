var core =          require("./core");

var scrollfix = {
    /**
     * Fix an element on the screen once the user scrolls past it.
     */
    init: function(el, pos) {
        pos = (typeof pos === 'number') ?  pos : 10,
            elTop = el.offsetTop,
            fixPoint = elTop - pos;

        core.on(document, 'scroll', function() {
            if(window.scrollY >= fixPoint) {
                el.style.position = "fixed";
                el.style.top = pos + "px";
            }
            else {
                el.style.position = "static";
                el.style.top = "auto";
            }
        });
    }
};

module.exports = scrollfix;