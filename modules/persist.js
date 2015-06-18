'use strict';

var core = require('./core');

var options = {},
    defaults = {
        dataAttributes: {
            collection: 'data-persist-collection',
            action: 'data-persist-event',
            object: 'data-persist-o'
        },
        defaultCollection: 'default',
        defaultAction: 'click',
        environment: 'live',
        keenIo: {
            live: {
                projectId: "556f0fc659949a0cf30d7718",
                writeKey: "ed5cd93c053c222abbcc3cb573be771a056fb161dff1931163e8efc070bf190a81f8f6513883ea786c253d4826e7aa07c5681d769816f247295ac6cfd24a709ac104d3e5650e19809a184ef4bbfb26d59004942af00303d5a754b61322e88133ef3b8f4b47e46b79a3964583af5a5d3d"
            },
            dev: {
                projectId: "557ef06759949a6d0e0e0db5",
                writeKey: "29eb3070c365319fe72bff2e85ff7b8d325dbc979c700b4fb006eb067b3865e39b449e564ef79519cf059ae1118317281068b5fab014b76afef6ad5f4833d6de9e08a72f1d5a994be5e992597e54bf18c09535f359ab7b38bf17a31018568484ab1b9f4085bc93c281a3f16897c9e2ff"
            }
        }
    };

var persist = {

    /**
     * Initialise the module: set options & bind events
     *
     * @param userOptions
     */
    init: function(userOptions) {
        options = core.extendDeep(defaults, userOptions);

        var els = core.selectAll("[" + options.dataAttributes.action + "]"),
            _that = this;

        this.bindEventHandlers(els);
    },


    /**
     * Bind the event handlers
     *
     * @param elements
     */
    bindEventHandlers: function(elements) {
        var _that = this;
        elements.forEach(function(el) {
            var eventType = _that._getPersistEventType(el);
            core.on(el, eventType, function() {
                _that._persistEventHandler.apply(_that, [this]);
            })
        });
    },


    /**
     * Send data to...KeenIO
     *
     * @param collection
     * @param dataObj
     */
    persistData: function(collection, dataObj) {
        console.log("Sending data to keen.io...");

        var Keen = require('keen.io'),
            client;

        if(options.environment === 'live') {
            // Send to Oscar project
            client = Keen.configure(options.keenIo.live);
        }
        else {
            // Send to Oscar - Dev project
            client = Keen.configure(options.keenIo.dev);
        }


        client.addEvent(collection, dataObj, function(err, res) {
            if(err) {
                console.log("Error sending data to keen.io");
                console.log(err);
            }
            else {
                console.log("Data sent to keen.io!");
            }
        })

    },


    /**
     * Persist event handler
     *
     * @param el
     */
    _persistEventHandler: function(el) {
        var collection = this._getCollection(el),
            dataObj = this._addDateToDataObj(this._buildDataObjectFromDOM(el));

        // If everything OK, send the data
        if(dataObj && collection) {
            this.persistData(collection, dataObj);
        }
    },


    /**
     * Return the event type for the trigger to persist from the element
     *
     * @param el
     * @returns {string|*}
     * @private
     */
    _getPersistEventType: function(el) {
        return (el.getAttribute(options.dataAttributes.action)) ? el.getAttribute(options.dataAttributes.action) : options.defaultAction;

    },


    /**
     * Search up the DOM tree to find an element that contains the
     * data-persist-collection attribute and return its' value.
     *
     * @param el
     * @returns {String}
     * @private
     */
    _getCollection: function(el) {
        var collection;

        while(el.parentNode) {
            collection = el.getAttribute(options.dataAttributes.collection);
            if(collection) break;
            el = el.parentNode;
        }

        return collection;
    },


    /**
     * Search up the DOM tree for any html attributes beginning
     * with data-persist-o- and build a data object out of them.
     *
     * @param el
     * @returns {{}}
     * @private
     */
    _buildDataObjectFromDOM: function(el) {
        var dataObj = {};

        while(el.parentNode) {
            core.extend(dataObj, this._getObjectPropsFromElementAttrs(el));

            if(el.getAttribute(options.dataAttributes.collection)) break;

            el = el.parentNode;
        }

        return dataObj;
    },


    /**
     * Build and object out of data-persist-o attributes set on an element.
     * Any "-" are converted to camelCase
     *
     * @param el
     * @returns {{}}
     * @private
     */
    _getObjectPropsFromElementAttrs: function(el) {
        var obj = {},
            re = new RegExp(options.dataAttributes.object);

        [].forEach.call(el.attributes, function(attr) {
            if (re.test(attr.name)) {
                var camelCaseName = attr.name.substr(options.dataAttributes.object.length+1).replace(/-(.)/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
                obj[camelCaseName] = attr.value;
            }
        });

        return obj;
    },


    /**
     * Add a timestamp property to an object
     *
     * @param dataObj
     * @returns {*}
     * @private
     */
    _addDateToDataObj: function(dataObj) {
        dataObj.timestamp = new Date().toISOString();
        return dataObj;
    },


    /**
     * Helper function for testing
     * @returns {{}}
     * @private
     */
    getOptions: function() {
        return options;
    }

};

module.exports = persist;