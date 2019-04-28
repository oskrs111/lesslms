/**
 * @file lesslms, serverless LMS application.
 * @author Oscar Sanz Llopis <osanzl@uoc.edu>
 * @module userLambda/liblogin
 * @license MIT
 */
let AWS = require("aws-sdk");
let lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });
let AmazonCognitoIdentity = require('amazon-cognito-identity-js');

/**
 * Funtion to authenticate user in Cognito.
 * @function
 * @param {Object} args Input arguments for the function.
 * @param {Object} args.params Login credentials for the user.
 * @param {string} args.params.user Login username.
 * @param {string} args.params.pass Login password. 
 * @callback args.callback Return callback function.
 */

let _callback = {};
let _password = '';

function _login(args) {
    _callback = args.callback;
    var params = {
        FunctionName: 'cognitoHelper', // the lambda function we are going to invoke
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: '{}'
    };

    lambda.invoke(params, function(error, data) {
        if (error) {
            console.log('<<<__________________login-error:', error);
            _callback(null, { statusCode: 500, body: JSON.stringify(error, null, 2) });
        } else {
            var authenticationData = {
                Username: args.params.user,
                Password: args.params.pass,
            };
            
            _password = args.params.pass;
            
            var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

            data = JSON.parse(data.Payload);
            var poolData = {
                UserPoolId: data.UserPoolId,
                ClientId: data.ClientId
            };

            console.log('<<<__________________login:', data);
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
            var userData = {
                Username: authenticationData.Username,
                Pool: userPool
            };
            var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
            cognitoUser.authenticateUser(authenticationDetails, {
                newPasswordRequired: function(userAttributes, requiredAttributes) {
                    console.log('<<<__________________login-newPasswordRequired:', userAttributes, requiredAttributes);
                    cognitoUser.completeNewPasswordChallenge(_password, [], this);
                },
                
                onSuccess: function(result) {
                    console.log('<<<__________________login-onSuccess:', result);
                    var accessToken = result.getAccessToken().getJwtToken();
                    _callback(null, { statusCode: 200, body: JSON.stringify({ 
                        accessToken: accessToken,
                        profile: result.idToken.payload.profile,
                        email: result.idToken.payload.email
                    })});
                    /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer
                    var idToken = result.idToken.jwtToken;
                    */
                },

                onFailure: function(error) {
                    console.log('<<<__________________login-onFailure:', error);
                    _callback(null, { statusCode: 500, body: JSON.stringify(error, null, 2) });
                },

            });
        }
    });
}

module.exports = _login;