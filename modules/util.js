var utility = {
    /**
     * Replace any new line or multiple spaces with a single space
     *
     * @param string {string}
     * @return {string}
     */
    trimNewLines: function(string) {
        //   /(\r\n|\n|\r)\s{2,}/gm
        return string.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s{2,}/g,' ');
    },


    /**
     * Check if two strings are the same
     *
     * @param string1
     * @param string2
     * @returns {boolean}
     */
    matchStrings: function(string1, string2) {
        if(string1 === string2) {
            return true;
        }
        return false;
    },


    /**
     * Validate an email address
     *
     * @param email
     * @returns {boolean}
     */
    validateEmail: function(email) {
        if(!email.match) {
            return false;
        }
        return !!email.match(new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"));
    }
  
};
module.exports = utility;