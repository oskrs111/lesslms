let AWS = require('aws-sdk');
let cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = function (event, context, callback) {
    console.log('<<<__________________authLambda:', event);
    cognito.getUser({
        'AccessToken': event.authorizationToken,
    }, function (error, data) {
        if (error) {
            console.log('Error:',error);
            callback(null, generatePolicy(principalId, 'Deny', event.methodArn));
        } else {
            var principalId = getUserId(data.UserAttributes);
            callback(null, generatePolicy(principalId, 'Allow', event.methodArn));
            console.log('<<<__________________authLambda-success:', data);
        }
    });
};

 function getUserId(attributes) {
    for (var i in attributes) {
       var string = JSON.stringify(attributes[i]);
       var objectValue = JSON.parse(string);
       if (objectValue.Name == 'sub') {
        return objectValue.Value;
       }
    }
}

var generatePolicy = function(principalId, effect) {
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
    
    authResponse.context = {
        "stringKey": '',
        "numberKey": principalId,
        "booleanKey": true
    };
    
    return authResponse;
}