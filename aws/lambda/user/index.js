/**
 * @file lesslms, serverless LMS application.
 * @author Oscar Sanz Llopis <osanzl@uoc.edu>
 * @module userLambda
 * @license MIT
 */
global.fetch = require("node-fetch"); 
let _args = {};
exports.handler = function(event, context, callback) {
    console.log('<<<__________________userLambda:', event);
    switch (event.pathParameters.proxy) {
        case 'login':
            _args = {
                params: event.queryStringParameters,
                callback: callback
            };
            let _exec = require('lib/login');
            _exec(_args);
            break;

        default:
            callback(null, { statusCode: 405, body: 'Method Not Allowed' });
            break;
    }
}
   