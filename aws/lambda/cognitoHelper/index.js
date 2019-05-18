exports.handler = function(event, context) {
console.log('<<<__________________cognitoHelper:',JSON.stringify(event, null, 2));
let data = {
ClientId: '2enjcov6vvknr4835g69ssnu85',
UserPoolId : 'eu-west-1_FLTiXGlPH'
}
console.log('<<<__________________cognitoHelper:',JSON.stringify(data, null, 2));
context.succeed(data);
};
