let AWS = require('aws-sdk');
let cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = function (event, context, callback) {
    console.log('<<<__________________authLambda:', event);
    cognito.getUser({
        'AccessToken': event.authorizationToken,
    }, function (error, data) {
        if (error) {
            console.log('Error:',error);
            callback(null, generatePolicy('Deny', {}));
        } else {
            callback(null, generatePolicy('Allow', data.UserAttributes));
            console.log('<<<__________________authLambda-success:', data);
        }
    });
};

var generatePolicy = function(effect, attributes) {
    var authResponse = {};
    if (effect != undefined) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [
            {
                Action: "execute-api:Invoke",
                Resource: "*",
                Effect: effect
            }
        ];
        authResponse.policyDocument = policyDocument;
    }
    
    authResponse.context = {};
    if(effect == 'Allow'){
        for(let a of attributes){
            //OSLL: return with user attributes in context
            authResponse.context[a.Name] = a.Value;
        }    
    }

    return authResponse;
}