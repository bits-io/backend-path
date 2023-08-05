const currentDateTime = require('../lib/current.date.time');

/**
 * function to all API same formatted success response provider
 * @param {String} title API response title based on result_code
 * @param {String} message API response your defined message
 * @param {*} data Send any kind of data in API response
 * @param {*} maintenance API provide any kind of maintenance information
 * @returns success response return for all API's
 */
exports.successResponse = ( title, message, data, maintenance) => ({
  time: currentDateTime(),
  maintenance_info: maintenance || null,
  result: {
    title, message, data
  }
});

/**
 * function to all API same formatted error response provider
 * @param {String} title API response title based on result_code
 * @param {*} error Send any kind or error in API response
 * @param {*} maintenance API provide any kind of maintenance information
 * @returns error response return for all API's
 */
exports.errorResponse = ( title, error, maintenance) => ({
  time: currentDateTime(),
  maintenance_info: maintenance || null,
  result: {
    title, error
  }
});
