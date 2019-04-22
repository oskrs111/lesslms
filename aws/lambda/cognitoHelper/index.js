exports.handler = function(event, context) {
console.log('<<<__________________cognitoHelper:',JSON.stringify(event, null, 2));
let data = {
ClientId: '3huov61cmoaeeu49n7ss6oa4dh',
UserPoolId : 'eu-west-1_ZXnhbFB3b'
}
console.log('<<<__________________cognitoHelper:',JSON.stringify(data, null, 2));
context.succeed(data);
};
