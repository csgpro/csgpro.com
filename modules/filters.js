/**
 * This module is used for front-end formatting helpers, mostly formatting stuff
 */

/**
 * Formats a date to M/D/Y
 */
module.exports = {
  formatDate: function(dateNum) {
    var d = new Date(dateNum);
    var ret = '';

    ret += d.getMonth() + '/';
    ret += d.getDay() + '/';
    ret += d.getFullYear();

    return ret;
  }
};
