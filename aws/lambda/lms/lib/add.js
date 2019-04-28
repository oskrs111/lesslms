/*
body: "{"user":"oskrs111@gmail.com","type":"course","id":"course-1556354128845"}"
headers: {Accept: "application/json", Accept-Encoding: "gzip, deflate, br", Accept-Language: "es-ES,es;q=0.9",…}
httpMethod: "POST"
isBase64Encoded: false
multiValueHeaders: {Accept: ["application/json"], Accept-Encoding: ["gzip, deflate, br"],…}
multiValueQueryStringParameters: null
path: "/lms/add"
pathParameters: {proxy: "add"}
queryStringParameters: null
requestContext: {resourceId: "4ojys1",…}
resource: "/lms/{proxy+}"
stageVariables: null
*/
/**
 * @file lesslms, serverless LMS application.
 * @author Oscar Sanz Llopis <osanzl@uoc.edu>
 * @module lmsLambda/lib/add
 * @license MIT
 */

let AWS = require("aws-sdk");
let dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: 'eu-west-1'});

let _gen = {};
let _gene = {};
/**
 * Funtion to add new course to user table.
 * @function
 * @param {Object} args Input arguments for the function.
 * @param {string} args.params call parameters from client application.
 * @callback callback Return callback function.
 * @description This function first appends new course both to 'users' table and 'courses' table.
 */
function add(args, callback){
    _gene = _execute(args.params, (error, result) => {
         if(error) callback(error);
         else callback(null, result);
    });
    _gene.next();
}


function* _execute(params, callback){
    let _r = {};
    _gen = _user_proc(params, (error, result) => {
         if(error){
            callback(error);  
            _gene.return(false);
         } 
         else {
             _r.user = result;
             _gene.next();
         }
    });
    _gen.next();
    yield;
    
    _gen = _course_proc(params, (error, result) => {
         if(error){
            callback(error);  
            _gene.return(false);
         } 
         else {
             _r.course = result;
             callback(null, _r);
             _gene.return(true);
         }
    });
    _gen.next();
    yield;    
}

function* _user_proc(params, callback){
 let _body = JSON.parse(params);     
 console.log('add:_user_proc', _body, typeof _body);
 
 let _params = {
  ExpressionAttributeNames: {
   "#PRO": "attributes"
  }, 
  ExpressionAttributeValues: {
   ":p": {
     S:  JSON.stringify({profile: _body.profile, name: _body.name})
    }
  }, 
  Key: {
   "userId": {
     S: _body.user
    }, 
   "sourceId": {
     S: _body.id
    }
  }, 
  ReturnValues: "ALL_NEW", 
  TableName: "users", 
  UpdateExpression: "SET #PRO = :p"
 };
 
 console.log('add:', _params);
 
 dynamodb.updateItem(_params, function(err, data) {
    if (err) {
        console.log('dynamodb.updateItem:', err);
        _gen.return(false);
        callback(err);
    }
    else{
      _gen.return(true);
      callback(null, data);  
    } 
 });    
 yield;
}

function* _course_proc(params, callback){
 let _body = JSON.parse(params);     
 console.log('add:_user_proc', _body, typeof _body);
 let _d = new Date().getTime() + '';
 let _params = {
  ExpressionAttributeNames: {
   "#TYP": "type",
   "#CD": "cDate",
   "#MD": "mDate",
   "#CON": "content"
  }, 
  ExpressionAttributeValues: {
   ":t": {
     S:  'tCOURSE'
    },
   ":cd": {
     S:  _d
    },
   ":md": {
     S:  _d
    },
    ":c": {
     S: JSON.stringify({subject:"", abstract:""})
    },
  }, 
  Key: {
   "sourceId": {
     S: _body.id
    }, 
   "relatedId": {
     S: _body.id
    }
  }, 
  ReturnValues: "ALL_NEW", 
  TableName: "courses", 
  UpdateExpression: "SET #TYP = :t, #CD = :cd, #MD = :md, #CON = :c"
 };
 
 console.log('add:', _params);
 
 dynamodb.updateItem(_params, function(err, data) {
    if (err) {
        console.log('dynamodb.updateItem:', err);
        _gen.return(false);
        callback(err);
    }
    else{
      _gen.return(true);
      callback(null, data);  
    } 
 });    
 yield;
}

module.exports = add;