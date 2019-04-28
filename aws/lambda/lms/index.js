let _callback = {};
let _event = {};
exports.handler = function(event, context, callback) {
    _callback = callback;
    _event = event;
    let _args = {};
    let _exec = {};
    
    switch(event.pathParameters.proxy){
        case 'add':
        case 'update':    
            _args.params = event.body;
            _exec = require(`./lib/${event.pathParameters.proxy}`);
            _exec(_args, (error, response) => {
                console.log('_execute',error, response);
                if(error){
                    _doCallback({error: 500, detail: error}, response);    
                }
                else {
                    _doCallback(null, response);
                }
            });
            break;
            
        case 'fetch':
            _args.params = event.queryStringParameters;
            _exec = require(`./lib/${event.pathParameters.proxy}`);
            _exec(_args, (error, response) => {
                console.log('_execute',error, response);
                if(error){
                    _doCallback({error: 500, detail: error}, response);    
                }
                else {
                    _doCallback(null, response);
                }
            });
            break;     
            
        default:
            _doCallback({error: 501, detail: 'Not Implemented'});
            break;
    }
};

function _doCallback(error, response){
    if(error != undefined){
         let _response = {
        statusCode: error.error,
        isBase64Encoded: false,
        headers: {},
        body: JSON.stringify({
             error: error.detail,
             httpMethod: _event.httpMethod,
             path: _event.path,
             body: _event.body,
             queryStringParameters: _event.queryStringParameters
            })
        };
         _callback(null, _response);
    }
    else {
        let _response = {
        statusCode: 200,
        isBase64Encoded: false,
        headers: {},
        body: JSON.stringify({ 
            path: _event.path, 
            response: response})
        };
         _callback(null, _response);
    }
}

// The output from a Lambda proxy integration must be 
    // in the following JSON object. The 'headers' property 
    // is for custom response headers in addition to standard 
    // ones. The 'body' property  must be a JSON string. For 
    // base64-encoded payload, you must also set the 'isBase64Encoded'
    // property to 'true'.
 